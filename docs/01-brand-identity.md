# 01 — Brand identity

> Project: `chatbot-agency` · Brand: **Relayhouse**
> Service: productized chatbot agency · 5-day SLA · Telegram / Discord / WhatsApp
> One bill, one knowledge base, three channels.

> **2026-05-08 rebrand.** Original name was **Dispatch**; the wave-2 name-research audit at `/Users/keer/projects/prin7r/wave2-name-research.md` flagged FAIL because Anthropic Claude Dispatch (March 2026) now dominates SERP for "Dispatch + chatbot + Telegram/WhatsApp." Brand swapped to **Relayhouse**. Voice essence (editorial dispatch, schedule-as-promise, the "dispatcher" role) is preserved. Visual tokens follow the OpenAI round-2 redesign documented in `/DESIGN.md` — the *Dispatch Forest* palette section below describes the round-1 forest/cream system that was overwritten before launch; the live tokens are in `apps/landing/tailwind.config.ts` and `globals.css`.

## Pyramid

| Layer | Value |
|---|---|
| **Essence** (one word) | Turnaround |
| **Personality** (3 traits) | Operative · plainspoken · craft-led |
| **Values** (3) | Honest scope · same-week shipping · ongoing care |
| **Attributes** (5) | Disciplined · multilingual · channel-agnostic · service-not-tool · refundable |

## Positioning statement

For owner-operators at clinics, salons, brokerages, schools, and small e-commerce shops who lose late-night DMs to slow human triage, **Relayhouse** is a productized chatbot agency that ships a working bot to Telegram, Discord, and WhatsApp from one knowledge base in **five working days** — unlike ManyChat-class flow builders that hand you a blank canvas, or Botpress / Voiceflow agencies that quote a six-week engagement and a five-figure invoice, because we treat onboarding as the product, the LLM as a tool, and your weekly tuning hour as the subscription.

## Audience persona — primary

**Anya, the salon owner / clinic operator.** 32-44, runs a 3-12 person beauty studio, dental practice, or fitness studio in a Russian-speaking city; secondary buyer profile is the LATAM equivalent (Mexico City salon, Bogotá clinic). She gets 60-200 inbound DMs per day across Telegram and WhatsApp Business — bookings, prices, hours, "is it still available." She replies on her phone between clients, often after midnight. She has tried ManyChat, set up two flows, abandoned them. She does not want a builder. She wants a bot that **answers in her tone of voice, in her language, on whichever messenger her customer wrote to** — and she wants someone she can call when it gets confused.

- **Goals** — Capture the 30% of inbound DMs that churn before she replies; get her evenings back; reply in under 10 seconds, in her tone, in three languages.
- **Frustrations** — DIY builders that need a flow chart; English-first SaaS priced for SF startups; agencies that quote $5k and disappear for six weeks.
- **Channels she lives in** — Telegram (private chats and a community), WhatsApp Business, Instagram DM, and word-of-mouth from other salon owners.
- **Trigger to buy** — Lost a booking last weekend because she missed a 11pm DM; a friend told her about a bot that "just works."

## Audience persona — secondary

**Diego, the LATAM web studio principal.** 35-52, runs a 4-9 person web studio in Mexico City or Buenos Aires building Shopify and Tilda sites for SMBs. Sells retainers. Wants a partner-channel bot offering he can resell to his existing 30-50 client base under a 40% margin. Cares about delivery reliability and a clean white-label invoice — does not want to manage a bot platform himself.

- **Goals** — Add $2-4k of monthly margin without hiring; protect the client relationship; never explain LLM economics to his clients.
- **Frustrations** — White-label "platforms" that are just self-serve dashboards; no human SLA; opaque margins.
- **Channels** — Slack with peer studios; LATAM agency conferences; email; LinkedIn.
- **Trigger to buy** — A current client asked for a WhatsApp bot; he doesn't want to refer them out.

## Voice and tone

**Stance.** Operative, schedule-driven, decisive. We ship on a calendar, not a roadmap. We say *Friday*, not *soon*. We say *one bill*, not *transparent pricing*. We say *kickoff Monday, live by Friday*, not *fast turnaround*.

| Do | Don't |
|---|---|
| Lead with the day-by-day plan, not features. | Open with "AI-powered" or "intelligent." |
| Quote a number — fee, day, % deflection — every paragraph. | Use "seamless," "delight," "boost." |
| Speak in service-business terms (kickoff, escalation, weekly call). | Speak in SaaS-platform terms (workspace, dashboard, integrations). |

**Sample sentence (hero).** *Spec on Monday. Bot live by Friday. One knowledge base, three channels, one bill.*

**Sample sentence (pricing).** *Starter is $299 setup and $79/mo for one channel and a single FAQ tree — that's the bare minimum we can ship and stand behind.*

**Anti-patterns** — Lorem ipsum; chat-bubble illustrations; three-platform-logo-collage hero; emoji in product copy; the words "revolutionary," "reimagined," or "AI-first."

## Visual system

### Palette — *Dispatch Forest* (round-1 archive — superseded)

> The forest/cream/carmine system below is the round-1 palette and is preserved here for the archive only. Live tokens are the OpenAI achromatic palette in `apps/landing/tailwind.config.ts` (`canvas` / `milk` / `chalk` / `fog` / `ash` / `graphite` / `void` + `carmine` accent). See `/DESIGN.md` §4.

| Role | Token | Hex | Used for |
|---|---|---|---|
| Surface (page) | `cream` | `#F4EDE0` | Page background — letterpress paper |
| Surface (band) | `cream-2` | `#EAE0CD` | Section bands, the day-by-day timeline |
| Ink (text) | `forest` | `#0F2A26` | All body text, masthead, primary buttons |
| Ink (subdued) | `graphite` | `#1F2422` | Hairline rules, dossier frame |
| Muted (caption) | `linen` | `#857C71` | Captions, monoglyphs, metadata |
| Accent | `carmine` | `#C24656` | The day numerals, the "by Friday" rule, hover states |
| Highlight | `cedar` | `#A07A2C` | Sparing — the pulse dot, the kickoff stamp |

Five-color editorial palette deliberately not in the SaaS-purple, AI-mint, or chat-bubble-blue family.

### Typography — *Fraunces × Inter × JetBrains Mono*

| Role | Family | Weights | Why |
|---|---|---|---|
| Display | **Fraunces** | 400, 600, 900 + italics | Optical-sized serif with old-style craft. Reads as a working studio's nameplate, not a startup. |
| Body | **Inter** | 400, 500, 600 | Neutral high-legibility sans for long copy. |
| Mono | **JetBrains Mono** | 400, 500 | Monoglyphs for day numerals, day-of-week labels, channel stripe. |

Source — Google Fonts only (`display=swap`). No web-font tax, no third-party tracker.

### Logo concept

A square stamp the size of a postage cancellation: black fill, white stencilled letterforms `Rh` (the Relayhouse monogram — *r* for relay, *h* for house) plus a 1.5px carmine underbar. The wordmark `relayhouse.` runs underneath in Geist with a trailing carmine period (the dispatcher's signature). Inline SVG; no external asset.

```svg
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="0" y="0" width="64" height="64" rx="6" fill="#000000"/>
  <text x="32" y="42" text-anchor="middle"
        font-family="Fraunces, serif" font-weight="700" font-size="32"
        fill="#FFFFFF">Rh</text>
  <rect x="14" y="51" width="36" height="1.5" fill="#C24656"/>
</svg>
```

### Spacing, radius, motion

- Base 4. Spacing scale: 4 / 8 / 12 / 20 / 32 / 56 / 96.
- Radius `0` for cards / hero / buttons (square-edged like a packing slip). `2px` only for inputs.
- Shadows: exactly one allowed — `0 1px 0 0 rgba(15,42,38,.06)` on the masthead. No glass, no neon, no gradients beyond a 2% paper grain.
- Motion: at most one element animates at any time — the cedar pulse dot on the kickoff stamp, 1.6s ease-in-out opacity. No hero animation, no scroll-jacking.

## Forbidden

- Reusing palettes from other Wave 2 projects (Cited's scarlet/ochre is theirs; Relayhouse's achromatic-with-carmine is ours).
- Mimicking Anthropic / OpenAI / Vercel / Linear / ManyChat visual identities.
- Three-platform-logo-collage hero.
- Chat-bubble blue. Generic AI-purple. Pastel mint.
- Any drop shadow beyond the single 1px masthead shadow.
