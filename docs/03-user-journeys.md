# 03 — User journeys

Three core journeys. Each one names the surface, the artifact, and the decision point.

---

## J1 — Discovery to first invoice (Anya, the salon owner)

**Stage 1 · Trigger.** Friday 11:42pm. A customer DMs the salon's WhatsApp Business asking if a Saturday slot is open. Anya is asleep. The customer books elsewhere. Sunday morning Anya tallies four bookings she lost overnight.

**Stage 2 · Discovery.** Tuesday morning. Another salon owner mentions a bot in the operators' Telegram chat. She opens `chatbot-agency.prin7r.com`.

**Stage 3 · First read (≤ 60s).** The hero reads *Spec on Monday. Bot live by Friday. One knowledge base, three channels, one bill.* The day-by-day timeline shows Day 1 / Day 2 / Day 3 / Day 4 / Day 5 with a one-line milestone each. She gets that this is a service, not a builder.

**Stage 4 · Pricing.** She scrolls to pricing. Three tiers: Starter $299 setup + $79/mo (one channel, FAQ), Growth $599 + $199/mo (two channels + one module), Pro $1,200 + $449/mo (three channels + web widget + all modules). She reads "If you don't see a 30% drop in unanswered messages in month one, we refund the setup fee." Decision: Growth, two channels (TG + WA), $599 + $199/mo.

**Stage 5 · Take Growth.** She clicks **Take Growth**. The button calls `POST /api/checkout/nowpayments`. She gets the NOWPayments hosted invoice page. Her bookkeeper has USDT on Tron — she sends $599 (the setup fee). The IPN fires, marked verified, logged.

**Stage 6 · First contact.** Within 90 minutes, the dispatcher (founder + agent fleet) replies on Telegram with three questions: which messengers, brand tone of voice (formal/casual/your-words-please), and a single link to her existing FAQ doc / website / Notion. She forwards a Notion page and a screenshot of her price list.

**Stage 7 · Day 1-5 build.** Day 1 — KB ingest + draft taxonomy. Day 2 — model + tone tuning, customer reviews 20 sample answers. Day 3 — TG and WA connectors live in staging tenant. Day 4 — owner-handoff escalation tested, weekly tuning queue seeded. Day 5 — Friday handoff: bot live on her real numbers, escalation tested with a real DM, dispatcher on call for the weekend.

**Outcome.** Saturday night, the bot answers 47 of 51 inbound DMs in <10s; 4 escalated to Anya; 0 lost to overnight silence. She pays the first $199/mo on Monday morning.

---

## J2 — Recurring use (month 2-6)

**Cadence.** Weekly tuning call (15 min on Tuesdays). Monthly accuracy report (PDF, sent Friday of week 4).

**Touchpoints.**
- Tuesday tuning call — review the unanswered list (typically 8-15 DMs that the bot punted), decide which become new KB entries, which trigger a wording adjustment, which stay in escalation queue.
- Monthly report — deflection rate, top intents, languages used, escalation counts, KB freshness, recommended new templates.
- Ad-hoc — owner edits prices in Notion; auto-recrawl picks up the diff; customer gets a one-line confirmation in TG.

**Subscription mechanics.** The monthly invoice arrives via NOWPayments at the start of each calendar month. Customer pays in USDT/USDC (or invokes the manual Wise/Payoneer route — out-of-band, sales-led). The tuning hour count rolls over up to one month; unused hours past 60 days expire.

**Friction modes.** Customer skips two tuning calls → the dispatcher emails plus pings on TG. Customer's KB goes >30 days un-edited → bot prefixes replies with "last updated …" and the dispatcher schedules a content review. Customer opens a fourth channel (Discord on top of TG/WA) → upsell prompt to Pro tier.

---

## J3 — White-label / agency partner (Diego, the LATAM web studio)

**Stage 1 · First touch.** Diego sees a Spanish-language case study link from a peer's Slack. He scans the landing, scrolls past the consumer pricing to "Resellers and white-label partners" in the footer.

**Stage 2 · Apply.** A short form (handled out-of-band this wave; the landing CTA mailtos `partners@chatbot-agency.prin7r.com` with the studio's name + city + portfolio link).

**Stage 3 · Onboarding (5 days).** Day 1 — partner contract + 40% margin schedule + white-label brand kit. Day 2 — first joint client kickoff call. Day 3-4 — joint build with the dispatcher leading. Day 5 — first invoice issued under the studio's brand, dispatcher invoiced as wholesale.

**Stage 4 · Recurring.** Studio's clients renew monthly under the studio's brand. Studio receives a monthly statement showing margin earned. Studio's weekly tuning calls happen with the dispatcher on Wednesdays (separate slot from direct customers).

**Outcome (target).** A studio with 30 clients converts 5-10 to chatbot retainers in the first quarter, earning $2-4k/mo at 40% margin without operating a bot platform.

---

## Decision points across all journeys

| Moment | Choice | Path A | Path B |
|---|---|---|---|
| First read | Service vs tool | Stay (this is a service) | Bounce (looking for a builder) |
| Pricing | Setup commitment | Take a tier | Email the dispatcher with a question |
| Day 5 | Handoff | Go live on real numbers | Reschedule one week |
| Month 2 | Tuning cadence | Hold the Tuesday call | Cancel and skip — flagged risk |
| Month 6 | Renewal | Annual prepay (2 months free) | Stay monthly (default) |
