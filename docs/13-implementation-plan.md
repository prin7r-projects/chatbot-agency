# 13 — Implementation Plan

> **Hand-off ready.** This plan is for the Phase 2 implementation agent picking up Relayhouse after Wave 2's marketing landing has shipped. You will find: (a) deployed landing at `https://chatbot-agency.prin7r.com` with NOWPayments hosted-invoice checkout wired and verified; (b) brand identity / audience / architecture in `/docs/01..10-*.md`; (c) the user-story contract in `/docs/11-user-stories-and-scenarios.md`; (d) the technical spec in `/docs/12-technical-specification.md`; (e) the open-saas fork stub in `apps/app/`. The product is a **service** — humans (the dispatcher) deliver onboarding, tuning, refund decisions during Wave 3. The runtime takes over the bot operations only. Don't accidentally over-automate the dispatcher role. Read docs 11 + 12 before starting any phase.

---

## 1. Phase breakdown

7 phases.

| Phase | Goal | Effort |
|---|---|---|
| **0 — Scaffolding** | Apps stubs build; landing untouched | S — 2-4h |
| **1 — Core domain (KB + LLM router)** | RAG pipeline live for one tenant; basic Telegram round-trip | XL — 5-8d |
| **2 — UX surfaces (dashboard)** | KB editor, channel wiring, conversation view | L — 3-5d |
| **3 — Payments + Notion + onboarding** | Paid contract → dispatcher Telegram ping → dashboard access | M — 2-3d |
| **4 — Production hardening** | Idempotency, rate limits, alerts, runbooks | M — 1-2d |
| **5 — Launch ops (multi-channel + tuning + accuracy)** | WA + Discord live; weekly tuning workflow; accuracy report | L — 3-4d |
| **6 — Post-launch (partner white-label + multi-language)** | Partner dashboards; language switcher; reduced-confidence mode | M — 1-2d |

---

### Phase 0 — Scaffolding

**Goal.** Repo cloneable; `apps/app/` open-saas fork applied; KB ingester / LLM router / channel connector skeletons exist.

**Tasks.**
1. Verify Wave 2 state: confirm landing returns 200 from production.
2. Fork `wasp-lang/open-saas` into `apps/app/`. Magic-link auth.
3. Add Postgres 16 + pgvector + Redis 7 to `docker-compose.yml`.
4. Skeleton workers: `workers/kb-ingester`, `workers/llm-router`, `workers/owner-handoff`, `workers/tuning`. Each is a Bun project.
5. `.env.example` lists all variables: `NOWPAYMENTS_*`, `INTEGRATION_KEY`, `DATABASE_URL`, `REDIS_URL`, `GLM_API_KEY`, `ANTHROPIC_API_KEY`, `WHISPER_ENDPOINT`.

**Effort.** S — 30-50 tool-uses, 2-4h.

**DoD.**
- [ ] `pnpm install` clean.
- [ ] `pnpm -F app dev` starts open-saas Wasp.
- [ ] Each worker `pnpm dev` runs (no-op stub).
- [ ] Postgres + Redis healthy in `docker compose ps`.
- [ ] Production landing still 200.

**Hand-off context.** Don't touch the live landing. Workers must NOT expose ports.

---

### Phase 1 — Core domain (KB + LLM router)

**Goal.** A single tenant can ingest a KB and the LLM router replies on Telegram with citation back to KB chunks.

**Tasks.**
1. Drizzle schema per doc 12 §2.
2. KB ingester: input `{ kind, value }` → fetch (Notion API / web crawl / PDF parse) → chunk (RecursiveCharacterTextSplitter ~500 tokens) → embed via `text-embedding-3-small` → store in `kb_chunks`. Idempotent on `(kbId, hash)`.
3. LLM router: input message → embed query → top-k=5 from pgvector → inject into prompt → call GLM 5.1 Flash → parse output → compute confidence (cosine of best chunk + LLM self-rating) → return reply or no-op for handoff.
4. Telegram connector: bot token → `setWebhook` → on message, call router → respond via `sendMessage`.
5. End-to-end manual test: ingest a 50KB Notion page, send 10 questions on Telegram, verify replies cite KB.

**Effort.** XL — 400-700 tool-uses, 5-8 days.

**DoD.**
- [ ] KB ingester chunks a 50KB page and produces ~100 chunks with embeddings.
- [ ] Router replies with confidence < 1 on edge questions and triggers `ownerHandoff`.
- [ ] Telegram connector receives + responds within 2s p95.
- [ ] All KB cite via `ragSourceIds` on the message.

**Hand-off context.** Don't fine-tune. Prompt + RAG only. Confidence is the union of (chunk score, LLM self-eval). Keep it explainable.

---

### Phase 2 — UX surfaces (dashboard)

**Goal.** Dispatcher can manage all customers from a dashboard. Customers can view conversations + accuracy.

**Tasks.**
1. Dashboard `/app/contracts` (dispatcher view): list customers, contract status, recent conversations, low-confidence flags.
2. KB editor `/app/contracts/:id/kb`: list chunks, edit, add new (manual), trigger re-ingest.
3. Channel wiring `/app/contracts/:id/channels`: paste-token UI for TG / WA / Discord. Heartbeat validates.
4. Conversation view: thread of messages with confidence badge per outbound message.
5. Customer-facing dashboard `/app/contracts/:id/customer`: read-only; shows weekly accuracy + recent owner-handoffs.

**Effort.** L — 200-400 tool-uses, 3-5 days.

**DoD.**
- [ ] Dispatcher can ingest a KB via dashboard form.
- [ ] Channel paste-token validates via heartbeat (TG `getMe`, WA `phone_numbers`, Discord `/users/@me`).
- [ ] Conversation view renders 100+ messages with virtualized list.
- [ ] Customer-facing dashboard shows accuracy without dispatcher controls visible.

**Hand-off context.** Brand voice in dashboard: "dispatcher, kickoff, escalation." Don't slip into SaaS-platform speak.

---

### Phase 3 — Payments + Notion + onboarding

**Goal.** Paid Starter / Growth / Pro contracts → dispatcher Telegram ping → customer onboarding email.

**Tasks.**
1. Persist contracts on `POST /api/checkout/nowpayments`.
2. Webhook handler idempotent. On `finished`: mark active, send dispatcher Telegram ping with contract details.
3. `POST /api/admin/contracts` for Enterprise.
4. Magic-link onboarding email post-payment with kickoff Calendly link.
5. Notion sync: paid contracts → `Relayhouse Contracts` data source.
6. Refund flow: `POST /api/admin/orders/:contractId/refund` records refund + pauses contract.

**Effort.** M — 100-180 tool-uses, 2-3 days.

**DoD.**
- [ ] Growth $599 purchase end-to-end: invoice → simulated paid IPN → contract active → dispatcher Telegram → onboarding email.
- [ ] Notion `Relayhouse Contracts` row appears for every paid contract.
- [ ] Enterprise via admin endpoint returns hosted invoice in <1.5s p95.
- [ ] Refund flow pauses contract, records refund.

**Hand-off context.** Telegram dispatcher channel is `@relayhouse_dispatcher` (set in `DISPATCHER_TG_CHANNEL_ID`). Keep ping content terse.

---

### Phase 4 — Production hardening

**Goal.** System survives traffic spikes, forged IPN, channel outages, KB ingestion failures.

**Tasks.**
1. Idempotency on checkout keyed by `(customerEmail, tier, hour)`.
2. Traefik rate limits.
3. Forged-IPN tests.
4. Admin-key + integration-key rotation runbooks.
5. Slack alerts: webhook sig, channel health, accuracy drop, daily contract anomalies.
6. PII scrub in stdout.
7. CSP headers on landing + dashboard.
8. Heartbeat job for every active channel: `getMe` / `phone_numbers` / `/users/@me` every 5 min; pause channel on 3 consecutive failures.
9. Forbidden-topic refusal list hardcoded; tested.

**Effort.** M — 80-120 tool-uses, 1-2 days.

**DoD.**
- [ ] Idempotency: same body 5x = ONE invoice.
- [ ] Forged IPN bad sig = 401.
- [ ] Slack alerts fire on each path.
- [ ] CSP header present.
- [ ] Heartbeat pauses channel within 15min.
- [ ] Forbidden-topic test: medical-diagnosis question gets the canned refusal.

**Hand-off context.** Channel tokens encrypted with `INTEGRATION_KEY`. Rotation runbook should cover all per-tenant tokens in one transaction.

---

### Phase 5 — Launch ops (multi-channel + tuning + accuracy)

**Goal.** All three channels supported in production. Weekly tuning workflow live. Accuracy report shipped.

**Tasks.**
1. WhatsApp Cloud API connector: webhook verification + signed body verification.
2. Discord Gateway WSS: persistent connection per tenant; reconnect + buffer on disconnect.
3. Web widget iframe: embeddable script `<script src="...">` that opens a chat panel.
4. BullMQ `tuning-runner` weekly: builds the tuning agenda from `confidence < 0.7` conversations, schedules call.
5. Weekly accuracy report (Postmark template): `resolutionRate`, `escalationRate`, `avgResponseMs`, `confidentButWrongRate`.
6. KB recrawl monthly: sweeper detects diff > 10% → email customer for confirmation.
7. Reduced-confidence mode: contract enters mode if 3 missed tuning hours; threshold raised to 0.75; replies prefixed.

**Effort.** L — 200-300 tool-uses, 3-4 days.

**DoD.**
- [ ] Customer can add WA + Discord without re-ingesting KB.
- [ ] Tuning agenda email lands Mon 09:00 GMT with this week's flagged conversations.
- [ ] Weekly accuracy report delivered with all 4 metrics.
- [ ] KB diff sweeper triggers email when test page changes >10%.
- [ ] Reduced-confidence mode kicks in after 3 skipped tuning hours.

**Hand-off context.** WhatsApp Cloud API has stricter verification: every inbound webhook payload is signed; reject mismatched. Discord Gateway disconnects often; must reconnect cleanly with buffered events.

---

### Phase 6 — Post-launch (partner white-label + multi-language)

**Goal.** Diego's partner channel is wholly self-serve. Multi-language landing + dashboard.

**Tasks.**
1. Partner dashboard at `/app/partner`: gated by `agencyPartnerCode IS NOT NULL`. Shows portfolio + accrued revShare + new-client onboarding form.
2. White-label receipts: partners upload logo + footer + contact email; receipt PDFs render with partner brand.
3. Multi-language landing: RU + ES + EN + UK. Language detection from `Accept-Language` header; switcher persists in cookie.
4. Dashboard i18n: same languages.
5. Public `/changelog` page.

**Effort.** M — 80-120 tool-uses, 1-2 days.

**DoD.**
- [ ] Partner can onboard a new client end-to-end via dashboard.
- [ ] White-label receipt PDF renders with partner brand for a seeded partner.
- [ ] Language switcher persists across pages.
- [ ] `/changelog` publicly accessible.

**Hand-off context.** Translation memory in `apps/landing/i18n/{ru,es,en,uk}.json`. RU + UK are the highest-priority languages for Anya's wedge.

---

## 2. Cross-cutting concerns

| Concern | First addressed | Notes |
|---|---|---|
| Accessibility | Phase 2 | Lighthouse a11y >= 95 |
| i18n | Phase 6 | RU + ES + EN + UK |
| Mobile | Phase 2 | Responsive dashboard |
| Telemetry | Phase 4 | Stdout JSON; Loki Wave 4+ |
| GDPR / DSAR | Phase 4 | EU + RU customer data; runbook in `/docs/runbooks/gdpr-dsar.md` |
| SOC 2 / HIPAA | Out of scope (anti-persona) |

---

## 3. Risk register

| # | Risk | Owner | Mitigation |
|---|---|---|---|
| R1 | NOWPayments outage | Phase 4 | Plisio + Reown wired Wave 4 |
| R2 | Forged IPN | Phase 4 | HMAC-SHA512 |
| R3 | Bot hallucinates pricing or hours | Phase 1 | Strict RAG; below-threshold = handoff |
| R4 | WhatsApp Cloud API ban | Phase 4 | No outbound cold; auto-pause on warning; fall to TG |
| R5 | Customer skips tuning + bot drifts | Phase 5 | Reduced-confidence mode after 3 skips; email customer |
| R6 | Channel token leak via logs | Phase 4 | Encrypted at rest; never logged |

---

## 4. References

- Doc 11 — `/docs/11-user-stories-and-scenarios.md`.
- Doc 12 — `/docs/12-technical-specification.md`.
- DESIGN.md — `/DESIGN.md` — editorial dispatch visual contract.
- Wave 2 reports — `/Users/keer/projects/prin7r/wave2-reports/chatbot-agency.md` and `chatbot-agency-redesign.md` — production state + brand history.
- Payments prototypes — `/Users/keer/projects/prin7r/payments-prototypes/`.
