# 11 — User Stories and Scenarios

This document is the canonical input contract for Relayhouse's Phase 2 implementation (the dashboard + edge runtime behind the landing's promises). It enumerates personas, primary user stories, end-to-end scenarios, and ties each flow to frontend touch-points + backend services. Every API endpoint in doc 12 must trace back to a story here.

Relayhouse's product is a **productized chatbot agency** — one bill, one knowledge base, three messenger channels (Telegram / WhatsApp / Discord), 5-day SLA from spec to live bot.

---

## 1. Personas summary

### P1 — Anya, salon owner / clinic operator (primary; deep dive in `05-audience-profile.md` §1)

32-44, runs a 3-12 person beauty studio / dental clinic / fitness studio in a Russian-speaking city (or LATAM mirror). 60-200 inbound DMs/day across Telegram + WhatsApp. Tried ManyChat, abandoned it. Voice cue: "respond in my tone of voice, in my language." Trigger: lost a booking last weekend.

### P2 — Diego, LATAM web studio principal (secondary; deep dive in `05-audience-profile.md` §2)

35-52, 4-9 person studio in Mexico City / Buenos Aires. Wants $2-4k/mo margin via partner-channel reselling. Voice cue: "give me a clean white-label invoice." Trigger: a current client just asked for a WhatsApp bot.

### P3 — Operator at a 25-person language school (new in this doc)

42, runs an after-school language program with 8 instructors. 80 inbound DMs/day re: schedules, prices, lesson availability. Wants the bot to handle scheduling lookup and route price questions to the owner. Voice cue: "the bot must know my actual schedule, not invent one."

### Anti-personas (out of scope — see doc 05)

Junior researcher shopping for $50 bot, enterprise procurement-led buyers (SOC2 + MSA), compliance-sensitive verticals (healthcare diagnosis, legal advice, financial advice), customers asking for outbound cold WhatsApp messaging, customers expecting 24/7 human chat coverage.

---

## 2. Primary user stories

12 stories covering the 5-day delivery + recurring tuning loop end-to-end.

1. **As Anya, I want to see a day-by-day delivery schedule on the landing (Mon kickoff → Fri live), so that I know exactly what I'm buying within 60 seconds.** *(US-01)*
2. **As Anya, I want to upload my knowledge base (Notion page URL, Google Doc, PDF, or website URL) on day 1 of kickoff, so that the dispatcher can ingest without me writing flows.** *(US-02)*
3. **As Anya, I want my bot to reply in Russian, English, and Ukrainian based on the inbound message language, so that I don't have to choose a single language.** *(US-03)*
4. **As Anya, I want the bot to ping me on Telegram when its confidence is low, so that I don't unknowingly let the bot give a wrong answer.** *(US-04)*
5. **As Anya, I want a weekly tuning hour scheduled on my calendar, so that the bot stays current with my pricing and hours without me chasing the dispatcher.** *(US-05)*
6. **As Anya, I want to pay $599 setup + $199/mo via USDT/USDC on a NOWPayments hosted invoice, so that I don't have to set up a card-merchant account.** *(US-06)*
7. **As Anya, I want a refund of the setup fee if the bot doesn't reduce unanswered messages by 30% in month 1, so that I'm not locked into a tool that fails.** *(US-07)*
8. **As Diego, I want a partner code that gives my agency 40% margin on every Pro tier seat I refer, so that I can resell with a clean invoice.** *(US-08)*
9. **As Diego, I want to white-label the dashboard URL (`<my-agency>.relayhouse.app`) and remove Relayhouse branding from customer-facing receipts, so that my client never asks "who is Relayhouse?".** *(US-09)*
10. **As any customer, I want to see the bot's accuracy report each week (resolution rate, escalation rate, avg response time), so that I can defend the spend internally.** *(US-10)*
11. **As any customer, I want to add a new channel (TG → WA → Discord) without re-onboarding the knowledge base, so that I can scale gradually.** *(US-11)*
12. **As any customer, I want to pause the bot during a custom event (e.g., my Black Friday sale) without cancelling the subscription, so that human operators can take over for a defined window.** *(US-12)*

---

## 3. Main scenarios (happy paths)

### Scenario 1 — Anya buys Growth tier, gets bot live in 5 days

**Trigger.** Anya clicks a Telegram DM from a fellow salon owner linking to `https://chatbot-agency.prin7r.com`.

**Steps.**
1. Anya lands on the masthead. Reads "Spec on Monday. Bot live by Friday. One knowledge base, three channels, one bill." *Frontend: `Masthead`, `DayByDayTimeline` on `apps/landing/app/page.tsx`.*
2. Scrolls to the day-by-day timeline. Sees Mon (kickoff call) → Tue (KB ingest) → Wed (channel wiring) → Thu (test bot live for review) → Fri (production go-live + handover).
3. Scrolls to Pricing. Selects Growth ($599 setup, $199/mo).
4. Clicks `Take Growth →`. Browser POSTs to `/api/checkout/nowpayments` with `{ tier: 'growth' }`. *Backend: `POST /api/checkout/nowpayments` (doc 12 §3.2) builds NOWPayments hosted invoice for $599 setup; returns `{ invoice_url, invoice_id, contractId }`.*
5. Pays $599 in USDT-Polygon on NOWPayments page.
6. NOWPayments POSTs IPN to `/api/webhooks/nowpayments`. Server verifies HMAC-SHA512. *Backend: `POST /api/webhooks/nowpayments` → contract activated.*
7. Dispatcher (human, Wave 2; agent-driven Wave 4) receives Telegram alert with new contract. Replies to Anya within 1 business hour to schedule Monday kickoff.
8. **Day 1 (Mon).** 60-min kickoff call. Dispatcher captures KB sources, channel preferences, language mix, owner-handoff threshold, tone-of-voice samples.
9. **Day 2 (Tue).** Dispatcher uploads KB sources via dashboard. KB ingester chunks + embeds (pgvector). Notion page + Tilda website URL ingested.
10. **Day 3 (Wed).** Dispatcher wires Telegram + WhatsApp Cloud API (Anya's existing tokens). Sandbox bot runs in `staging` mode; Anya tests with 5 real questions.
11. **Day 4 (Thu).** Test bot in production with 100% owner-handoff threshold (every reply pings Anya for review). Anya reviews 30 mock-replies; she approves 27/30. Dispatcher tunes the failing 3.
12. **Day 5 (Fri).** Production go-live. Threshold lowered to 0.7 confidence. Bot live on TG + WA. Anya gets a handover doc + first weekly accuracy report scheduled for Monday.

**Success criteria.** Bot live on customer's two channels by Friday 18:00 local. Handover doc shipped. First week accuracy >80% (based on owner-confirmed correct replies during the Thursday review).

**Frontend touch-points.** `Masthead`, `DayByDayTimeline`, `PricingTier`, post-payment redirect page, dashboard onboarding (Wave 3).
**Backend touch-points.** `POST /api/checkout/nowpayments`, `POST /api/webhooks/nowpayments`, `ContractService`, `KBIngester`, `ChannelConnector`, `LLMRouter`, `OwnerHandoff`.

### Scenario 2 — Weekly tuning hour (Anya, week 4)

**Trigger.** Anya has been live for 3 weeks. The week-4 tuning hour is on her calendar.

**Steps.**
1. Dispatcher pulls Anya's last week conversation log. Filters by `confidence < 0.7` or `owner_handoff = true`. ~12 conversations flagged.
2. 60-min Tue 10:00 call. Dispatcher walks Anya through 12 cases. She corrects 8 (price update, holiday hours, new product). The other 4 are correct; threshold tweaked.
3. Dispatcher adds 8 new KB chunks + adjusts threshold to 0.65.
4. Wednesday Anya gets the weekly accuracy report: `89% correct, 3% escalated, 8% confident-but-wrong (corrected this week)`.

**Success criteria.** Tuning hour completes in <60min. Accuracy improves week-over-week. Anya can defend the spend.

### Scenario 3 — Diego adds his second client, white-label receipts (partner)

**Trigger.** Diego's first reseller client (Studio 14, Buenos Aires) has been live for 2 weeks. He wants to add Studio 22, San Pablo.

**Steps.**
1. Diego logs into `dashboard.relayhouse.app` with magic-link.
2. Goes to Partner → New client. Enters Studio 22's contact info, picks Pro tier, applies his partner code `AGENCY-MX-014`.
3. Dashboard generates a checkout link for Studio 22 with the partner code embedded.
4. Diego forwards the link to Studio 22. Studio 22 pays $1,200 setup via NOWPayments.
5. IPN arrives with `referralCode: 'AGENCY-MX-014'`. `RevShareService` accrues 40% ($480) to Diego.
6. Studio 22's receipt PDF carries Diego's agency logo + footer; Studio 22 has no idea Relayhouse is involved.

**Success criteria.** Partner code persists. Receipt PDF white-labels correctly. 40% accrual visible in Diego's partner dashboard within 5min of IPN.

### Scenario 4 — Channel expansion (Anya adds Discord, week 6)

**Trigger.** Anya's salon launched a community Discord. She wants the bot there too.

**Steps.**
1. Anya goes to Dashboard → Channels → Add Discord.
2. Pastes Discord bot token + server ID. Heartbeat call validates.
3. Existing KB is reused (no re-onboarding). Bot lands in Discord within 10 min, threshold defaulted to her current setting.
4. Tier upgraded from Growth to Pro automatically (since Pro is required for 3 channels). Pro setup fee waived ($1,200 → $0); monthly increased $199 → $449.

**Success criteria.** Channel added in <10min. KB reuse confirmed (no re-ingest). Tier upgrade billing transparent.

### Scenario 5 — Low-confidence handoff (Anya, real DM)

**Trigger.** A customer DMs in WhatsApp at 22:47: "Do you offer Botox follow-up?"

**Steps.**
1. LLM router pulls top-3 KB chunks. Best-match score 0.41 (below threshold 0.65).
2. Bot silences itself for that thread; sends Anya a Telegram ping: "Customer @+1XXX in WhatsApp asked: 'Do you offer Botox follow-up?' I wasn't confident enough to reply. Take it from here."
3. Anya replies on her phone via her existing WhatsApp Business app. Conversation logged for next tuning hour as `confidence_too_low_handoff`.

**Success criteria.** Anya gets the ping within 5s. Bot does NOT post a low-confidence reply. Handoff captured for tuning.

### Scenario 6 — Refund within month 1 (escalated)

**Trigger.** Day 28: a customer believes the bot did not deliver the promised 30% reduction.

**Steps.**
1. Customer emails `desk@chatbot-agency.prin7r.com` requesting refund per the clause.
2. Dispatcher pulls month-1 metrics: unanswered messages = 22% reduction (target was 30%). Refund qualifies.
3. Dispatcher refunds setup fee via NOWPayments dashboard, then `POST /api/admin/orders/:contractId/refund` records it.
4. Subscription paused (not cancelled — customer can resume by re-paying setup if they want).

**Success criteria.** Refund processed in <72h. Subscription pause is reversible. Tuning data archived for retrospective.

---

## 4. Edge case scenarios

### EC-1 — IPN replay

`ContractService.activate()` is idempotent on `(contractId, status)`. Same IPN twice = no-op.

### EC-2 — Customer drops off after checkout but before payment

Contract `status='pending'`. Sweeper expires after 7 days; if buyer returns within 7 days, same invoice shown.

### EC-3 — WhatsApp Cloud API suspends customer's number

Bot auto-fallbacks to Telegram-only mode. Slack alert to dispatcher. Customer emailed to reissue WA number.

### EC-4 — KB diff drift (customer's website pricing changed mid-week)

Monthly auto-recrawl picks up changes. If a major diff (>10% chunks changed), customer is emailed for confirmation before re-publishing.

### EC-5 — Discord rate-limit during community spike

Discord caps 50 msg/sec per bot. Router queues during spikes; user-visible delay ≤2s p95 even at peak. Spike pings dispatcher.

### EC-6 — Customer skips 3 consecutive tuning hours

Bot enters `reduced-confidence-mode` (threshold raised to 0.75). Replies prefixed with "Based on info as of YYYY-MM-DD." Customer emailed to reschedule.

### EC-7 — Compliance-sensitive question slips in (e.g., "Is this medication safe?")

Router has a hardcoded refusal list (medical diagnosis, legal advice, financial advice) per ToS. Bot replies "I can't help with that — please call the clinic at +XX-XXX-XXXX." Logged for tuning.

---

## 5. Anti-scenarios

### AS-1 — No flow-builder UI

Customer never builds flows. They submit a knowledge base; we tune. Implementation must NOT add a flow-builder route, even hidden.

### AS-2 — No outbound cold messaging

WhatsApp does not allow cold outbound under Cloud API ToS. Bot is INBOUND ONLY. Implementation must NOT add an outbound campaign feature.

### AS-3 — No payment collection inside bot

Relayhouse never holds customer funds. Bot can paste a payment link but never processes payment directly.

### AS-4 — No fine-tune per customer

Everything is prompt + RAG. Customer never has a fine-tuned model. Implementation must NOT add a fine-tuning endpoint.

### AS-5 — No 24/7 human SLA

Relayhouse is a software service with a weekly tuning hour. Not a BPO. Implementation must NOT add a chat-handoff queue with SLA.

### AS-6 — No SOC 2 / HIPAA / financial-advice attestation

Compliance-sensitive verticals are explicitly anti-persona.

---

## 6. Cross-references

- §2 stories US-01..US-12 → doc 12 §3 endpoints.
- §3 scenarios → doc 12 §1 architecture services + doc 13 phase Definitions of Done.
- §4 edge cases → doc 12 §7 security/resilience + doc 13 phase 5 (production hardening).
- §5 anti-scenarios → doc 12 §10 non-goals.
