# 08 — Marketing strategy

## Positioning (one paragraph)

**Relayhouse is a chatbot agency that ships a working bot to Telegram, Discord, and WhatsApp from one knowledge base in five working days.** We are a service productized as a subscription. We are not a builder. We are not an AI platform. We are a small studio that meets you on Monday, ships your bot by Friday, and runs the weekly tuning call on Tuesdays. One bill, three channels, one knowledge base.

## Positioning canvas

| | |
|---|---|
| **For** | Owner-operators of clinics, salons, brokerages, schools, and small e-commerce shops with ≥30 inbound DMs/day. |
| **Who** | Lose 20-40% of late-night DMs to slow human triage. |
| **Relayhouse is** | A productized chatbot agency. |
| **That** | Ships a multilingual bot to Telegram, Discord, and WhatsApp in 5 working days, then keeps it tuned weekly. |
| **Unlike** | ManyChat-class flow builders (you build it), or Decagon / Sierra (six-week enterprise sales cycles). |
| **Because** | We treat onboarding as the product, the LLM as a tool, and the weekly tuning hour as the subscription. |

## Messaging hierarchy

### Headline (hero)

> **Spec on Monday. Bot live by Friday.**
> One knowledge base, three channels, one bill.

### Sub-hero (90 chars)

> A productized chatbot agency for clinics, salons, brokerages, and small shops.

### Supporting promises (the day-by-day strip)

- **Day 1.** Kickoff call · KB ingest from your Notion / website / FAQ.
- **Day 2.** Tone of voice tuned · 20 sample answers reviewed with you.
- **Day 3.** Channels wired (Telegram, WhatsApp Cloud API, Discord) in staging.
- **Day 4.** Owner handoff tested · weekly tuning queue seeded.
- **Day 5.** Friday handoff · bot live on your real numbers · dispatcher on call all weekend.

### Three-way proof strip (the channel monoglyph)

`tg.` `wa.` `dc.` Monoglyphs in JetBrains Mono, separated by a 1px carmine rule. **No platform-logo collage.** The brand stance is "we run on yours; you don't have to think about which."

### What you get (service-design block)

- A kickoff doc with the day-by-day plan and your single point of contact.
- A weekly 15-minute tuning call (Tuesdays).
- A monthly one-page accuracy report (PDF).
- An escalation path: bot stays silent and pings you on Telegram when its confidence drops.
- Telegram fallback in every contract — your bot never goes dark when one channel suspends.

### Pricing message

Three tiers — Starter $299 setup + $79/mo, Growth $599 + $199/mo, Pro $1,200 + $449/mo. Setup fees are non-negotiable. *If you don't see a 30% drop in unanswered messages in month one, we refund the setup fee.*

### Closing line

> Plain dispatch. No theme park demos. No flow charts. No 6-week SOW.

## Voice and tone

(Mirrored from `docs/01-brand-identity.md`.)

**Voice traits.** Operative · plainspoken · craft-led.
**Tone register.** Trade-press editorial — closer to the Financial Times' Lex column or to a printer's day-book than to a SaaS landing page.

| Do | Don't |
|---|---|
| Quote a number every paragraph (a day, a fee, a percent). | Open with "AI-powered." |
| Speak in service-business terms (kickoff, escalation, weekly call). | Speak in platform-product terms (workspace, dashboard, integrations). |
| Lead with the schedule, not the feature list. | Lead with the model name. |

## Content pillars

1. **Day-by-day teardowns.** Anonymized walkthroughs of a real 5-day build — KB shape, channel wiring, escalation rules. Builds the *we ship* trust signal.
2. **Vertical playbooks.** *Bot dlya stomatologii v 2026 godu*, *Bot para salones de belleza en CDMX* — vertical-specific posts that compound the SEO long-tail without competing in English.
3. **Honest-economics posts.** Why GLM 5.1 Flash beats GPT-4 routing in cheap-currency markets; what the COGS actually look like at $199/mo.
4. **Refund-and-failure stories.** When a build slips a day; when a refund was issued. Builds trust by absence of theatre.
5. **Partner case notes.** A studio in Bogotá converts 5 retainers in a quarter — short, numbered, signed by the partner.

## Distribution & cadence

- **Weekly.** One vertical post (1,500-2,500 words) and one outbound DM block (Tuesday morning).
- **Monthly.** Last-Friday accuracy reports out. Public retro on Indie Hackers (one paragraph + numbers).
- **Quarterly.** One paid speaking slot at a regional SMB conference.

## Anti-marketing

- No paid Google / Meta ads (CAC math doesn't work).
- No founder selfie videos.
- No countdown timers, no "spots remaining" theatre.
- No fake testimonial slots; better an empty section than a generic one.

## Asset inventory (this wave)

| Asset | Surface | Status |
|---|---|---|
| Landing page | `chatbot-agency.prin7r.com` | shipped |
| 10 strategy docs | `docs/01..10-*.md` | shipped |
| DESIGN.md | `/DESIGN.md` | shipped |
| NOWPayments hosted invoice | `/api/checkout/nowpayments` | shipped |
| IPN webhook | `/api/webhooks/nowpayments` | shipped |
| Pitch deck (HTML) | `docs/pitch-deck.html` | shipped |
| Sample accuracy report PDF | `docs/sample-accuracy-report.pdf` | deferred |
| Partner agreement | `docs/partner-agreement.docx` | deferred |
| RU / ES landing copy | `apps/landing/messages/{ru,es}.json` | deferred polish pass |
