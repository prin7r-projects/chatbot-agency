# 04 — Pain points

Root-cause analysis of why the alternatives fail the SMB owner-operator.

## P1 — Builders punt the work back to you

**Symptom.** ManyChat, Chatfuel, BotStar, BotHelp, SaleBot — the buyer signs up, opens the dashboard, sees a flow canvas, and bounces. Or worse, builds two flows, ships them, watches them break the first time a customer types something the flow didn't anticipate.

**Root cause.** These are dev tools dressed as products. The implicit contract is *you'll build it.* The buyer wanted a bot, not a builder.

**Why competitors don't fix it.** Their unit economics depend on self-serve at $15-99/mo. Adding done-for-you services breaks the SaaS gross margin and turns them into agencies they don't want to be. ManyChat's "Partners" directory is the official admission: ManyChat itself won't deliver the bot.

**Dispatch's response.** The product *is* the delivery. The customer never sees a builder; they see a knowledge base and a weekly call.

---

## P2 — LLM-bot wrappers are priced for English SaaS

**Symptom.** ChatBase, CustomGPT.ai, SiteGPT, Voiceglow charge $19-499/mo for an OpenAI Assistants wrapper. At $199/mo a bot processing 10k Russian or Spanish messages burns most of the gross margin on GPT-4 tokens.

**Root cause.** They priced for the English market where customer LTV is $1k+ and GPT-4 routing is the only viable model. Cheap-currency markets cannot pay those subscriptions.

**Why competitors don't fix it.** Routing intelligence is a real engineering investment, and they all benchmark against GPT-4. They didn't build the LLM router because their target buyer can afford GPT-4.

**Dispatch's response.** GLM 5.1 Flash for >80% of replies, Claude 4.5 Haiku for the long tail, Whisper for voice notes. COGS per customer ≈ $66-70/mo at Growth tier. Starter tier stays gross-margin positive in cheap currencies.

---

## P3 — Single-channel bots die with one Meta changelog

**Symptom.** A 2017-2019 Messenger flow agency ships a bot that lives only on Facebook Messenger. March 2020 — Meta restricts the 24-hour messaging window. The agency's entire book disappears in a quarter.

**Root cause.** Single-channel infrastructure is a platform-policy bet. The bet usually loses.

**Why competitors don't fix it.** Multi-channel is harder to build and harder to sell — "but I only need WhatsApp." So the cheaper agencies stay single-channel and die in waves.

**Dispatch's response.** Every contract includes Telegram fallback. Pro tier is three channels + web widget. The pitch deliberately leads with three channels, one knowledge base, one bill — channel count is the headline.

---

## P4 — Enterprise bot vendors won't return an SMB owner's call

**Symptom.** Decagon, Sierra, Ada, Forethought publish $40k+ engagement floors. Anya the salon owner books a demo, hears about a six-week implementation, and bounces.

**Root cause.** These are enterprise sales motions with white-glove SLAs. Their hourly rates won't fit a $79-449/mo SMB plan.

**Why competitors don't fix it.** A Decagon-grade engineer hour costs $200+. They can't cross-subsidize SMB without diluting the brand and the team.

**Dispatch's response.** Productize the white-glove. The same kickoff doc, weekly call, and monthly accuracy report Decagon delivers — but in 5 days, at $299-1,200 setup, with the LLM router instead of a senior engineer per tenant.

---

## P5 — Knowledge bases rot

**Symptom.** A 2021 ManyChat or Botpress flow that "worked" 18 months ago now answers wrong because the salon raised prices, changed hours, and moved locations. The owner's bot is technically up but functionally lying.

**Root cause.** Static flow content has no maintenance loop. The bot tool's incentive is to keep the customer paying $19/mo; it has no obligation to keep the content fresh.

**Why competitors don't fix it.** Maintenance is service work. SaaS doesn't book service work as recurring revenue cleanly.

**Dispatch's response.** The subscription explicitly includes 1/3/8 tuning hours per month with a calendar invite. KB freshness is a tracked metric; the monthly accuracy report shows it. After 30 days un-edited, the bot prefixes its answers with "last updated …" — making staleness visible to the *customer's* customer.

---

## P6 — Setup-fee aversion kills payback

**Symptom.** SMB SaaS shops drop their setup fee to $0 to win the marketing race. Their CAC is unchanged, churn at 5-7%/mo is brutal, payback period stretches to 4-6 months, they go out of business.

**Root cause.** No setup fee = no qualifying signal = customer never feels the commitment. Combined with monthly-only pricing, churn is uncapped.

**Why competitors don't fix it.** Marketing teams optimize for sign-ups, not for paid LTV.

**Dispatch's response.** Setup fee is non-negotiable: $299 / $599 / $1,200. Annual prepay (2 months free) is the only discount. Setup fee covers the first month's CAC and acts as the qualifying filter.

---

## P7 — "AI bot" copy is exhausted

**Symptom.** Every chatbot site looks the same: gradient-purple hero, three platform logos, a chat-bubble illustration, the words "intelligent" or "AI-powered." The buyer can't tell the products apart.

**Root cause.** Designers borrowed the same Linear / Anthropic visual lexicon. AI-mint and chat-bubble blue became the AI sector's beige.

**Why competitors don't fix it.** It works against a designer's compensation scheme to ship a non-default-tasteful site.

**Dispatch's response.** Editorial dispatch aesthetic — forest green + cream + carmine, serif display, square-edged everything, day-numerals as the visual anchor. The brand reads as a *studio*, not as a SaaS. See [`docs/01-brand-identity.md`](01-brand-identity.md).
