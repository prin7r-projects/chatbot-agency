# DESIGN.md — Dispatch

> Canonical design + style guide for `chatbot-agency` (brand: **Dispatch**).
> Owned by Chief of Design. Kept in sync with `apps/landing/` — any landing-page change updates this file in the same commit.

The visual identity is sourced from [`docs/01-brand-identity.md`](docs/01-brand-identity.md). This document is the implementation-facing translation of that identity into tokens, components, layout rules, and verification artifacts.

---

## 1. Product and audience

**Product** — Dispatch is a productized chatbot agency that delivers a working multilingual bot to Telegram, Discord, and WhatsApp from one knowledge base in five working days. The product is the *delivery cadence*, not the platform: kickoff Monday, channels wired by Wednesday, owner handoff Thursday, live Friday. The subscription pays for the weekly tuning hour and the monthly accuracy report — the part that keeps the bot true to a salon's actual prices, hours, and calendar.

**Wave 2 round-2 redesign 2026-05-08 — OpenAI reference applied.** The visual identity is now a pure-white editorial canvas (`#FFFFFF`) per the OpenAI design reference at [`/Users/keer/projects/prin7r/design-references/openai.md`](file:///Users/keer/projects/prin7r/design-references/openai.md). The page reads like a blank dispatch sheet waiting to be filled — typography does the work, whitespace does the rest. Color is achromatic (1% colorfulness): `#000000` for primary text, `#666666` for secondary, `#E5E7EB` for every divider, `#F1F1F1` for hover surfaces, `#FAFAF8` for the one milky section band that breaks rhythm. Carmine `#C24656` is the brand essence retained — but now reserved for **four decisive moments only**: (1) the kickoff-stamp pulse dot, (2) the leading numeral of each day-cell, (3) the 2px top rule on the featured pricing tier, and (4) the italic refund clause's left border. The 28px eyebrow rule under each section header is the fifth and final carmine touch. Inter is BANNED — Geist carries body/UI; Fraunces stays for editorial display moments. Two radii rule the system: 9999px for pills (every interactive button + the kickoff stamp + soft chips) and 6.08px for cards. The brand essence (editorial dispatch, schedule-as-promise) and all copy stayed identical; the canvas, palette, button shapes, and section rhythm rotated.

**Audience** —
- **Anya, the salon owner / clinic operator**: 32-44, runs a 3-12 person beauty studio, dental practice, or fitness studio in a Russian-speaking city or LATAM mirror. 60-200 inbound DMs/day. Tried ManyChat, abandoned it. Wants a bot, not a builder.
- **Diego, the LATAM web studio principal**: 35-52, 4-9 person Shopify / Tilda shop with 30-50 active SMB clients. Wants a productized chatbot offering he can resell at 40% margin without operating a platform.
- **Anti-personas** — junior researchers shopping cheap on Upwork; enterprise procurement teams asking for SOC2 letters before the kickoff call; customers in compliance-sensitive verticals (healthcare diagnosis, legal advice).

The landing is written for these two. Voice mirrors a working studio's day-book — schedule-driven, plainspoken, decisive. Stratechery / Lex column register, not SaaS-dashboard register.

## 2. Visual positioning

A working chatbot studio dressed as an editorial dispatch room.

- **Anchor reference points** — the masthead rule of a regional broadsheet, a printer's day-book, a postage cancellation stamp, the Lex column's typographic discipline.
- **Avoided reference points** — Vercel / Linear / Anthropic flat-sans monochrome; Stripe-green or AI-mint pastels; chat-bubble blue; venture-deck purple gradients; ManyChat's bright cyan.
- **Felt sense** — cream paper laid on a wooden desk, forest-green ink, a single carmine rule, cedar used the way a print editor highlights an editorial callout. No drop shadows, no glassmorphism, no gradients beyond a 2% paper grain.
- **Anti-features** — gradients, neon, glassmorphism, drop shadows beyond `0 1px 0 0 rgba(15,42,38,.06)`, three-platform-logo-collage hero, chat-bubble illustrations, emoji in product copy.

## 3. ShadCN baseline and local component policy

**Baseline.** This repo follows the Prin7r Component Library Baseline (ShadCN-first). Default base for any future SaaS surface in `apps/app/` is shadcn/ui — install via `pnpm dlx shadcn@latest add <component>`, vendor the source into the project so we own and review every primitive.

**Current state — Wave 2 batch landing.** `apps/landing/` uses **two ShadCN primitives** vendored under `app/components/ui/` (`Button`, `Card`) and re-themed against the Dispatch tokens in section 4. The remainder of the landing is hand-coded — the editorial-dispatch aesthetic is carried by typography, hairlines, and a five-color print palette. Every additional ShadCN variant we'd import would need to be re-skinned to remove its rounded-corner and gradient defaults; we'll add primitives as the dashboard surface lands in `apps/app/`.

**Documented exceptions.** The `Button` and `Card` primitives are vendored from ShadCN but reset to `radius: 0`, ink-fill ink-text, and the hairline border tokens — the source of truth for those resets is `apps/landing/app/globals.css`. The day-numerals, the channel monoglyph stripe, the kickoff stamp, and the dossier-style frame are hand-coded in `apps/landing/app/page.tsx`.

**Forbidden.** Paid / pro libraries without CEO approval. Component libraries that conflict with ShadCN conventions. Marketing-page kits that drag in animation libraries beyond the single 1.6s pulse on the kickoff stamp.

## 4. Color tokens

Single source of truth: `apps/landing/tailwind.config.ts` and `apps/landing/app/globals.css`. Round-2 palette is achromatic (1% colorfulness) per the OpenAI reference — color is reserved for editorial accents, never UI surfaces.

| Role | Token | Hex | CSS var | Used for |
|------|-------|-----|---------|----------|
| Surface (page) | `canvas` | `#FFFFFF` | `--canvas` | Page background — pure white, wall-to-wall |
| Surface (band) | `milk` | `#FAFAF8` | `--milk` | The single section band that breaks rhythm (`#service`, `#sched`) |
| Hover surface | `chalk` | `#F1F1F1` | `--chalk` | Hover-state button background, soft chips |
| Border | `fog` | `#E5E7EB` | `--fog` | Every divider, card outline, input border, nav underline |
| Tertiary | `ash` | `#8F8F8F` | `--ash` | Disabled states, fine-grain icon strokes |
| Secondary text | `graphite` | `#666666` | `--graphite` | All secondary body copy, captions, kickers |
| Primary text | `void` | `#000000` | `--void` | Primary text, headlines, filled CTA background |
| Brand accent | `carmine` | `#C24656` | `--carmine` | Reserved for four decisive moments: pulse dot, day-numeral leading digit, featured-tier 2px top rule, refund clause left border. Plus the 28px eyebrow rule under each section header. |
| Brand essence | `forest` | `#0F2A26` | `--forest` | Discrete inline emphasis only — never as a surface or background. Held in reserve for future editorial callouts. |

**Contrast.** All foreground/background combinations meet WCAG AA: void-on-canvas 21:1; graphite-on-canvas 5.7:1; ash-on-canvas 3.5:1 (use only at 18px+); carmine-on-canvas 4.6:1; canvas-on-void 21:1.

**Forbidden combinations.** Color blocks on backgrounds (the page is `#FFFFFF` wall-to-wall); carmine on chalk; ash text below 18px; cedar text on canvas below 16px; any color on a gradient.

## 5. Typography

Three families. **Inter is BANNED** — Geist replaces it as the body/UI grotesk per the round-2 redesign. The pairing is deliberately *not* the all-sans tech aesthetic — Dispatch reads as a working studio dressed for an editorial dispatch room.

| Role | Family | Weights | Used at | Reason |
|------|--------|---------|---------|--------|
| Display | **Fraunces** | 400, 500, 600 (+ italic 400) | Hero 88-112px, sections 40-64px, long-form 22-28px | Optical-sized serif tuned for both display and body; the carved-headline feel matches OpenAI's tightly-tracked compressed display register, but in serif form. |
| Body / UI | **Geist** | 400, 500, 600 | Body 14-17px, UI 13-14px, kickers 13px | Premium grotesk by Vercel — wider counters than Inter and a calmer rhythm at body sizes. Replaces Inter per the round-2 ban. |
| Mono | **JetBrains Mono** | 400, 500 | Channel monoglyph stripe `tg. · wa. · dc. · web.`, kickoff-stamp caption, mono kickers, FAQ "+/−" affordance | Wide character body; reads as machine output rather than copy. |

Loaded from Google Fonts in `globals.css` with `display=swap`. The pairing rationale is documented in [`docs/01-brand-identity.md`](docs/01-brand-identity.md) — a serif display + premium grotesk body + monoglyph for machine moments is the editorial-dispatch pairing.

**Type scale (display).** Per OpenAI: 13 / 22 / 28 / 48 px as the canonical scale, extended for Dispatch's editorial hero to 56 / 72 / 88 / 96 / 112 px so the headline still feels carved. **Body scale.** 11 / 12 / 13 / 14 / 15 / 16 / 17 / 18 / 22 px. **Letter-spacing.** Display tightens by `-0.03em` at 96-112px (carved); `-0.012em` at 22-64px; flat at body 16-18px; positive `+0.143px` (`+0.011em`) only on 13px caps labels and kickers. Display weight is **600** for headlines, never 700 or 900 — a deliberate softening from round 1's Fraunces Black to feel more expensive and less dramatic.

**Whitespace ratios.** Section gaps `py-32 md:py-40` (128-160px) per OpenAI's 64-80px section-gap minimum, doubled for Dispatch's editorial register. The hero runs `pt-40 md:pb-48` (160-192px) — the headline is allowed to breathe before any other element appears. Day-cells run `min-height: 360px` and `padding: 56px 32px 48px` to give each numeral cinematic stage time.

## 6. Spacing, radius, shadows, and borders

- **Base unit** — 4px.
- **Spacing scale** — 4 / 8 / 12 / 20 / 32 / 56 / 96 (Fibonacci-ish; tighter than Tailwind defaults so the page feels print-like, not SaaS-padded).
- **Radius** — `0` for cards, hero blocks, dossier frame, buttons, the kickoff stamp. `2px` only for inputs (the partner-mailto opener) and the channel monoglyph dots. `999px` reserved for pill badges (used once on "Most popular" tier label).
- **Shadows** — exactly one allowed: `0 1px 0 0 rgba(15,42,38,.06)` on the masthead band. Glassmorphism, neumorphism, and drop shadows beyond this are forbidden.
- **Borders** — 1px hairlines at `rgba(15,42,38,.12)` (light), `rgba(15,42,38,.18)` (dossier frame), `rgba(15,42,38,.06)` (inner dossier double-rule). 1.5-2px carmine rules at `var(--carmine)` for masthead breaks and section accents.

## 7. Layout system and responsive rules

- **Container.** `max-w-prose = 1140px`, 80px gutters at desktop, 24-40px at mobile. The landing uses `mx-auto max-w-prose px-6 md:px-10` consistently.
- **Grid.** 12-column conceptually, but most sections are 1-2-4 column flex/grid combinations. The Day-by-Day timeline is `md:grid-cols-5` (one column per day). The Pricing section is `md:grid-cols-3`.
- **Breakpoints.** Mobile-first; `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Tested at 320 / 390 / 768 / 1024 / 1440.
- **Vertical rhythm.** Sections separated by `border-b border-forest/12`. Section padding `py-20` (80px) at desktop, narrower hero/CTA at `py-16-24`.
- **Reading width.** Long-form prose capped at `max-w-2xl` (672px) so the FAQ reads like a printed page.

## 8. Component catalog

All components are local (in `apps/landing/app/page.tsx` or `apps/landing/app/components/ui/`) until shadcn primitives land in `apps/app/`. Each has an explicit hover/focus state.

| Component | Where defined | Notes |
|-----------|---------------|-------|
| `Logo` | `page.tsx` Masthead | Forest-fill stamp 32×32, cream Fraunces Black `Dt` monogram, 1.5px carmine underbar. JetBrains Mono `dispatch.` wordmark with trailing period. |
| `Button` | `components/ui/button.tsx` (vendored from ShadCN; re-themed) | Square-edged, ink fill, 14×22px padding. Hover swaps to carmine fill. Focus inherits `:focus-visible` ring (kept visible). |
| `Card` | `components/ui/card.tsx` (vendored from ShadCN; re-themed) | Square-edged cream surface, 1px graphite/12 hairline. No shadow. |
| `DayCell` | `page.tsx` Day-by-Day | Fraunces Black `01-05` numeral in carmine 64px, mono kicker, ink body 17px. The five cells are the visual anchor of the page. |
| `MonoglyphStripe` | `page.tsx` proof strip | `tg. · wa. · dc.` in JetBrains Mono caps with 2px letter-spacing, 1px carmine rule above and below. |
| `KickoffStamp` | `page.tsx` Hero corner | A square stamp drawn in CSS — cream-2 fill, 1px graphite/18 border, cedar pulse dot, mono caption "kickoff Monday". The only animated element in steady state. |
| `Tier` | `page.tsx` Pricing | Square-edged card with name (Fraunces 600 24px), price (Fraunces 900 34px), feature list (Inter 14px). Growth tier swaps surface to cream-2 and border to carmine. |
| `FAQ` | `page.tsx` FAQ | `details/summary` with hairline separators; no JS. |

## 9. Landing page structure

Sections render in this exact order. Anchored at semantic `<section id>` so we can deep-link from outbound DMs.

1. `#masthead` — Logo + nav anchors (day-by-day, pricing, faq) + a single carmine rule.
2. `#hero` — Display headline ("Spec on Monday. Bot live by Friday."), sub-hero (90 chars), kickoff stamp in the corner. Two CTAs: `Take Growth →` (primary, → NOWPayments invoice) and `Talk to the dispatcher →` (mailto, secondary).
3. `#proof` — `MonoglyphStripe` "tg. · wa. · dc." with carmine rules above and below.
4. `#days` — Day-by-Day delivery timeline with five `DayCell` columns.
5. `#service` — "What you get" service-design block — kickoff doc, weekly call, escalation path, monthly accuracy report, Telegram fallback.
6. `#pricing` — Three tiers (Starter / Growth / Pro). Each card has a NOWPayments CTA. Refund clause printed below the grid in italic Fraunces.
7. `#sched` — A single 5-day schedule strip ("Mon · Tue · Wed · Thu · Fri") repeating the day-by-day promise inside a footer-band style.
8. `#faq` — Six questions matching the objection-handling table in `docs/07-sales-strategy.md`.
9. `#footer` — Logo, dispatch handle, copyright, partners CTA (mailto), link to repo, link to opportunity Notion.

## 10. Imagery and generated asset rules

This wave ships **no raster imagery**. Hero accent is purely typographic. The only graphic assets:

- The favicon SVG at `apps/landing/app/icon.svg` (cream `Dt` monogram on forest, 1.5px carmine underbar).
- An optional CSS-drawn `KickoffStamp` (no image asset).
- A single 2% paper grain via a tiny inline SVG noise filter on the hero (subtle; toggleable via a `.grain` class).

If `prin7r-generate-image` (GPT Image 2) becomes useful for a vertical case study photograph in the polish pass, the prompt rules:

- Composition — desk-flat, top-down, single object on cream paper.
- Color — must read as the Dispatch palette (forest, cream, carmine accent only).
- Aspect — 3:2 for hero; 1:1 for footer; nothing else.
- No people, no faces, no chat-bubble icons. Hands holding a phone are allowed if shot top-down on cream.

If the tool returns billing/entitlement errors, do **not** block the wave — record the blocker here and ship without generated images. (Wave 2 is shipping without them deliberately.)

Generated assets, if any, save to `apps/landing/public/generated/` with a sibling `<filename>.prompt.txt` containing prompt + model + date for reproducibility.

## 11. Motion and interaction rules

At most one element animates at any time.

- **Kickoff stamp pulse dot** — 8px cedar dot, 1.6s ease-in-out opacity loop. Steady-state.
- **Button hover** — instant fill swap from forest to carmine. No transition longer than 80ms.
- **Tier-card hover** — 1px border darkens from graphite/18 to graphite/30. No translate, no scale, no shadow change.
- **No** scroll-jacking. **No** parallax. **No** hero animation. **No** typewriter effects. **No** number counters.

`prefers-reduced-motion` — the pulse dot stops at full opacity.

## 12. Accessibility and quality gates

- **Color contrast.** Body text 11.7:1 (forest on cream). All interactive elements meet 4.5:1 in default and hover states. Carmine on cream is 4.6:1 — used only for ≥14px text and short copy.
- **Focus.** All interactive elements ship with a visible `:focus-visible` ring (1.5px carmine outline, 2px offset). Tab order: skip-to-content → hero CTAs → masthead nav → day-by-day cells (decorative) → tier CTAs → FAQ summaries → footer links.
- **Semantics.** `<header>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`. FAQ uses `<details>`/`<summary>`.
- **Alt text.** No `alt=""` on meaningful icons. The `Logo` SVG has `role="img"` and `aria-label="Dispatch"`. The `KickoffStamp` is decorative; marked `aria-hidden="true"`.
- **Forms.** No native form on the landing. The partner CTA is a `mailto:` link, the dispatcher CTA is a `mailto:` link, both with `aria-label` describing destination.
- **No-JS.** Page is fully readable with JS disabled. Only the NOWPayments CTAs require JS (a fetch + redirect); they degrade to a `mailto:` fallback when JS is off.

## 13. Screenshots and verification artifacts

| Artifact | Path | Captured from |
|---|---|---|
| Desktop screenshot 1440×900 | `docs/screenshots/landing-desktop.png` | `https://chatbot-agency.prin7r.com` (production) |
| Mobile screenshot 390×844 | `docs/screenshots/landing-mobile.png` | `https://chatbot-agency.prin7r.com` (production) |
| Pitch deck render | `docs/pitch-deck.html` | direct browser open |
| `curl -sI` proof | recorded in `wave2-reports/chatbot-agency.md` | production |

Captured via Playwright headless Chromium on the deployed URL (not localhost). Re-capture protocol: `playwright` skill, viewports `{1440,900}` and `{390,844}`, `waitUntil:'networkidle'`, `fullPage: true`.

## 14. External references and library sources

- **ShadCN UI** — base primitives. Source: <https://ui.shadcn.com/>. Used for `Button` and `Card`. Re-themed in this repo.
- **Google Fonts** — Fraunces, Inter, JetBrains Mono. Loaded via `<link>` in `app/globals.css`.
- **Tailwind CSS 3.4** — utility-first; tokens locked in `tailwind.config.ts`.
- **Refero Styles** (reference gallery) — <https://styles.refero.design/>. Browsed for reference; nothing copied.
- **Cited (sister Wave 2 build)** — `/Users/keer/projects/prin7r/wave2-builds/market-research-on-demand/`. Used as a structural reference (DESIGN.md shape, the nowpayments wiring) but **not** as a visual reference. Cited's scarlet/ochre palette is theirs; Dispatch's forest/carmine palette is ours.
- **NOWPayments** — hosted invoice + IPN docs. Implementation copied from `payments-prototypes/src/lib/signatures.ts` (HMAC-SHA512 verifier).

## 15. Changelog

| Date | Change | Surface |
|---|---|---|
| 2026-05-08 | Initial wave-2 build. Hero, day-by-day, proof strip, service block, pricing, sched strip, FAQ, footer. NOWPayments hosted-invoice CTA + IPN webhook wired. Vendored ShadCN `Button` + `Card`. | `apps/landing/` |
| 2026-05-08 | DESIGN.md authored at root. 10 strategy docs published under `docs/`. Pitch deck HTML + Markdown shipped. Desktop + mobile screenshots captured against production. | repo root + `docs/` |
| 2026-05-08 | Round-1 redesign attempt — pivoted to dark-forest canvas with bone ink. Stalled mid-flight; committed as a checkpoint and overwritten by round 2. | `apps/landing/` (reverted) |
| 2026-05-08 | **Round-2 redesign — OpenAI reference applied.** Canvas pivots to pure white `#FFFFFF`. Achromatic palette (void/graphite/ash/fog/chalk/milk). Carmine reserved for four decisive moments only (kickoff pulse, day-numeral leading digit, featured-tier top rule, refund-clause border) plus the section eyebrow rule. Inter banned, Geist becomes the grotesk. Two-radii system: 9999px pill buttons + 6.08px cards. Whitespace doubled per OpenAI section-gap doctrine. `Button`, `Card`, `PricingCta` re-themed to pill + 6.08px. Day-cells given cinematic stage time (`min-height: 360px`). DESIGN.md §1 / §4 / §5 / §15 updated. | `apps/landing/` + DESIGN.md |
