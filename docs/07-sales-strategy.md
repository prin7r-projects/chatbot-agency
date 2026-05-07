# 07 — Sales strategy

## Motion: hybrid (productized self-serve + sales-led for partners)

Self-serve from the landing for the SMB owner-operator (Anya). Sales-led for agency partners (Diego). One pricing page, two front doors.

## Pricing tiers (Wave 2 v1)

The landing page surfaces three tiers. **Setup fee is non-negotiable.** Annual prepay (2 months free) is the only discount.

### Starter — *the bare minimum we can stand behind*

- **Setup** $299 one-time
- **Monthly** $79
- **Channels** 1 (Telegram or WhatsApp Business)
- **Modules** Core only (KB ingest + LLM router + handoff)
- **Included messages** 2,000/mo · overage $0.012/msg
- **Tuning hours** 1/mo
- **CTA** *Take Starter →* (NOWPayments hosted invoice, $299 setup)

### Growth — *most owners pick this*

- **Setup** $599 one-time
- **Monthly** $199
- **Channels** 2 (any combination of TG / WA / Discord)
- **Modules** Core + 1 module (sales / support / knowledge worker)
- **Included messages** 10,000/mo · overage $0.012/msg
- **Tuning hours** 3/mo
- **CTA** *Take Growth →* (NOWPayments hosted invoice, $599 setup) · *Most popular*

### Pro — *three channels, web widget, all modules*

- **Setup** $1,200 one-time
- **Monthly** $449
- **Channels** 3 (TG + WA + Discord) + a website widget
- **Modules** Core + all 3 modules (sales, support, knowledge worker)
- **Included messages** 40,000/mo · overage $0.012/msg
- **Tuning hours** 8/mo
- **CTA** *Take Pro →* (NOWPayments hosted invoice, $1,200 setup)

### Enterprise / partner tier (sales-led)

- Custom integrations (proprietary CRM, ERP, ticketing).
- Volume discounts on overage.
- White-label / agency reseller plan: 40% margin to partner, contract minimum 5 seats over 12 months.
- Quarterly business review.
- **CTA** *Talk to the dispatcher →* (mailto `desk@chatbot-agency.prin7r.com`)

## Refund clause

> *If you don't see a 30% drop in unanswered messages in month one, we refund the setup fee.*

Posted prominently on the pricing card. Not contingent on a 14-day trial; we are confident enough in the 5-day delivery to underwrite the setup fee.

## Pricing rationale

Setup fee covers ~1 month of CAC + the team's labor on day 1-5. Monthly fee covers COGS (~$66-70 per Growth customer) plus a contribution to fixed and to founder draw. Setup fees are the qualifying signal; without them, payback is 4+ months at 5% churn.

## Objection handling

| Objection | Response |
|---|---|
| *"$299 to start is more than ManyChat charges in a year."* | "ManyChat is a builder; you build the bot. We deliver one in 5 days, including the LLM, the channel wiring, and the first month of tuning. The $299 covers the build, not the platform." |
| *"Why no free trial?"* | "Because the build is real work — we're not selling access to a workspace. The setup fee is also our refund clause: 30% drop in unanswered DMs in month one or you get the setup back." |
| *"Why crypto checkout?"* | "It's the cleanest cross-border rail and avoids 3-5% card-processing fees. We invoice in USDT/USDC by default; we'll hand-wire a Wise / Payoneer route if you ask the dispatcher." |
| *"I only need WhatsApp."* | "Take Starter on WhatsApp. We bake Telegram fallback into every contract anyway — it costs us nothing and keeps you running through Meta policy changes." |
| *"What about my Russian / Spanish customers?"* | "Multilingual is the default. The LLM router answers in the customer's input language. We test RU + ES + EN every Friday before go-live." |
| *"Is this just a GPT wrapper?"* | "We route to GLM 5.1 Flash for >80% of replies and to Claude 4.5 Haiku for the harder 20%. Whisper handles voice notes. We don't fine-tune; we tune the knowledge base. That keeps Starter gross-margin positive in cheap currencies." |
| *"What happens after 5 days?"* | "Tuesday tuning calls (15 min each). Monthly accuracy report (PDF). KB freshness is tracked; after 30 days un-edited the bot tells your customer it's stale. The subscription pays for the maintenance loop." |

## Sales artifacts (canonical)

- **Landing page** — `https://chatbot-agency.prin7r.com` (this wave).
- **Day-by-day delivery doc** — surfaced on the landing as a timeline; mirrored in `docs/03-user-journeys.md` for the team.
- **Sample monthly accuracy report** — single-page PDF (deferred polish-pass artifact).
- **Partner agreement** — one-page DOCX (deferred polish-pass artifact).
- **Refund letter template** — boilerplate (deferred polish-pass artifact).

## Sales rituals

- **Tuesdays 9-11am local** — outbound DM block. Sends + one follow-up; never more.
- **Tuesdays 2-4pm local** — partner-channel calls and partner statement reviews.
- **Wednesdays** — partner-tenant tuning calls.
- **Fridays** — go-live + dispatcher on call for the weekend after a Day-5 handoff.
- **Last Friday of the month** — accuracy reports out.
