# 06 — Sales channels

A blended motion: cold outbound on the channels where the buyer already lives, an agency-partner program, and content / SEO long tail that compounds.

## Channel mix (year-1 target)

| Channel | Share of new MRR | CAC band | Fits the buyer because |
|---|---|---|---|
| Cold outbound on Telegram + Instagram DM | 60% | $80-120 | Buyer lives there. Reply rate 2-5%, close to paid pilot 0.5-1%. |
| Agency partnerships | 25% | $200-280 amortized | Web studios / marketing shops want a productized chatbot offering they can resell. |
| Inbound / SEO long-tail | 15% | $30-60 at scale | Vertical-specific Russian + Spanish content ranks fast where competitors are English-only. |
| Marketplace listings (catalogues, IndieHackers, Product Hunt LATAM) | rounding | n/a | Free; signals existence to peers. |
| Local meetups, paid speaking | rounding | founder time only | Trust signal in tight communities. |
| Referral program | layered | 1 free month per referral | Rewards existing customers; compounds slowly. |

## Channel deep-dives

### 1. Cold outbound on Telegram + Instagram DM

**Why it fits.** Anya the salon owner reads her Telegram before her email. She is more likely to reply to a DM that names her actual business than to a cold email.

**Mechanics.**
- Scrape Yandex Maps / Google Maps / 2GIS / local hashtags for vertical + city pairs.
- Enrich with messenger handle (TG username, IG handle, sometimes a WA Business number from the listing).
- Send a 90-word personalized opener: name the salon, name a peak-time pain (overnight DMs / Saturday rush), end with one question (would a 5-day pilot make sense?).
- Reply rate target 2-5%. Close-to-paid-pilot 0.5-1%. Gross outbound CAC ~$100 including compute + supervision.

**Compliance.** Always opt-in spirit; always identify the dispatcher; one follow-up max; never script a hard sell. WhatsApp outbound is **off** under the Relayhouse brand because Meta's policy makes it reputationally risky.

### 2. Agency partnerships

**Why it fits.** Web studios already own the SMB relationship and are looking for retainer-shaped expansions. A 40% margin on a $79-449/mo plan adds up across 5-10 referrals.

**Mechanics.**
- One-page partner agreement: 40% margin, white-label option, contract minimum 5 referred seats over 12 months.
- Joint kickoff call on the first three referrals so the studio sees the delivery cadence.
- Monthly statement.
- Founder-to-founder DM on LinkedIn or peer Slack as the primary outreach.

**Targets.** Web studios with 30-100 active SMB clients in RU / LATAM / SEA. ~10 partner studios in year one.

### 3. Inbound / SEO long-tail

**Why it fits.** The market is starved for vertical-specific Russian and Spanish content. ManyChat, Chatfuel, ChatBase have exhausted the English long tail; the cheap-currency long tail is wide open.

**Mechanics.**
- One vertical-specific post per week, 1,500-2,500 words: *Chatbot dlya stomatologii v 2026 godu*, *Bot para salones de belleza en CDMX*, *Chatbot para escuelas de idiomas en Bogotá*.
- LLM-assisted drafting, human editor pass, single-purpose pages with one CTA.
- Each post lives at `chatbot-agency.prin7r.com/play/<slug>` (Wave 2 polish pass — not in this batch).
- Cross-link to the Day-by-Day, the FAQ, and the relevant tier.

### 4. Marketplace listings

**Why it fits.** Free distribution to a small but high-intent audience. Signals "we exist" to peers who are scanning for alternatives.

**Listings to claim.**
- ManyChat alternatives directories.
- Russian "katalogi botov" and Telegram catalog channels.
- Product Hunt — LATAM upcoming launch.
- IndieHackers — quarterly progress threads, no launch theatre.
- Shopify App Store — phase-3, after the e-commerce module hardens.

### 5. Local meetups + paid speaking

**Why it fits.** Founder time is the bottleneck on 1:1 sales calls; a 30-minute talk converts 3-5 leads at once.

**Mechanics.**
- 1-2 events per quarter; Tier-1 — SMB conferences in target cities (Tashkent, Almaty, Mexico City, Bogotá).
- 20-min talk titled along the lines of *"How we ship a multilingual bot in 5 days for $599"*; slides are the day-by-day timeline + a real customer screenshot.
- Founder books only; no booth, no swag.

### 6. Referral program

**Why it fits.** Customers in tight communities (salon owners, clinic operators) talk every week. One free month per paid referral is cheap and sticky.

**Mechanics.**
- After month 2, dispatcher sends a one-line note offering a referral link.
- Referrer gets 1 free month at their current tier; referee gets 50% off the setup fee.
- Tracked in the simple `Referrals` tab inside the dispatcher's Notion until `apps/app/` ships.

## What we deliberately do not do

- **Paid Google / Meta ads.** CAC for our buyer band on these networks is $400-700 — payback math doesn't work on a $79-449/mo plan.
- **YouTube tutorials / influencer marketing.** Not the right channel for our buyer, who is on Telegram, not YouTube.
- **Conferences with a booth.** Booth ROI is low for a service business at our price band.
- **Outbound on WhatsApp.** Meta policy risk + brand risk.
- **A sales team.** Founder + agent fleet for year one. Hiring waits until $30k MRR.

## Channel kill-criteria

A channel is killed if any of:

- CAC > 4 months of gross profit for two consecutive months.
- Reply rate falls below 1% on outbound for one month after creative rotation.
- Partner program churn > 30% on the first 12 months for three studios in a row.
