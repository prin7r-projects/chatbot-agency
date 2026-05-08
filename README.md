# Relayhouse — chatbot agency · `chatbot-agency.prin7r.com`

> A productized chatbot agency. Spec on Monday, bot live by Friday. Telegram, Discord, WhatsApp from one knowledge base. One bill.

- Landing — <https://chatbot-agency.prin7r.com>
- Notion opportunity — <https://www.notion.so/Chatbot-agency-Telegram-Discord-WhatsApp-3543ceec26198173b275e1e7cf29d191>
- Repo — <https://github.com/prin7r-projects/chatbot-agency>
- Spec — [docs/12-technical-specification.md](./docs/12-technical-specification.md)
- Plan — [docs/13-implementation-plan.md](./docs/13-implementation-plan.md)

## Repo structure

```
.
├── DESIGN.md                 # 15-section design + style guide (Chief of Design)
├── apps/
│   ├── landing/              # Next.js 15 + ShadCN — hero / days / pricing / FAQ
│   └── app/                  # open-saas (Wasp) dashboard — magic-link auth
├── workers/                  # Bun workers (Phase 1+)
│   ├── kb-ingester/          # KB ingestion + embedding pipeline
│   ├── llm-router/           # GLM 5.1 Flash router with RAG
│   ├── owner-handoff/        # Low-confidence escalation pings
│   └── tuning/               # Weekly tuning agenda + accuracy reports
├── docs/                     # 13 strategy + spec docs + pitch deck
│   └── screenshots/          # Desktop + mobile production captures
├── Dockerfile.landing        # Next.js standalone build, multi-stage
├── docker-compose.yml        # landing + Postgres 16/pgvector + Redis 7
├── pnpm-workspace.yaml       # pnpm monorepo workspace
└── .env.example              # All environment variables (Wave 2 + 3)
```

## What this Wave 2 build ships

- A 15-section [`DESIGN.md`](./DESIGN.md) at root.
- The 10 strategy / design docs under [`docs/`](./docs/) — brand identity, architecture, journeys, pain points, audience, channels, sales, marketing, GTM, pitch deck (with companion `pitch-deck.html`).
- A hand-coded Next.js 15 landing at [`apps/landing/`](./apps/landing/) with ShadCN-vendored Button + Card primitives re-themed to the Relayhouse tokens.
- NOWPayments hosted-invoice route at [`/api/checkout/nowpayments`](./apps/landing/app/api/checkout/nowpayments/route.ts) and HMAC-SHA512 IPN webhook at [`/api/webhooks/nowpayments`](./apps/landing/app/api/webhooks/nowpayments/route.ts).
- A Dockerfile + docker-compose for deployment to `storage-contabo` behind Traefik with Let's Encrypt.
- Desktop + mobile production screenshots under [`docs/screenshots/`](./docs/screenshots/).

## Screenshots

| | |
|---|---|
| Desktop 1440×900 | ![desktop](docs/screenshots/landing-desktop.png) |
| Mobile 390×844 | ![mobile](docs/screenshots/landing-mobile.png) |

## Dev quickstart

```bash
# From repo root — install all workspaces (landing + app + workers)
pnpm install

# Populate env vars (see .env.example for all variables)
cp .env.example .env

# Start the landing (Next.js 15)
pnpm -F relayhouse-landing dev          # http://localhost:3100

# Start the dashboard (requires wasp CLI: https://wasp.sh/docs)
pnpm -F app dev                          # http://localhost:3000

# Start worker stubs (requires bun: https://bun.sh)
pnpm -F kb-ingester dev
pnpm -F llm-router dev
pnpm -F owner-handoff dev
pnpm -F tuning dev

# Start infrastructure
docker compose up -d                     # Postgres 16/pgvector + Redis 7
```

The landing page renders without env credentials, but the **Take Starter / Growth / Pro** buttons return HTTP 503 with a clear error until `NOWPAYMENTS_API_KEY` is set.

### Required environment variables

All variables are listed in [`.env.example`](./.env.example). Key groups:

| Group | Variables | Used by |
|---|---|---|
| Payments | `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET` | landing (Wave 2+) |
| Database | `DATABASE_URL` | app, workers (Wave 3) |
| Redis | `REDIS_URL` | workers (Wave 3) |
| Encryption | `INTEGRATION_KEY` | app (Wave 3) |
| LLM | `GLM_API_KEY`, `ANTHROPIC_API_KEY` | llm-router (Wave 3) |
| Voice | `WHISPER_ENDPOINT` | llm-router (Wave 3) |
| Email | `POSTMARK_SERVER_TOKEN` | app (Wave 3) |
| Admin | `ADMIN_API_KEY` | app (Wave 3) |
| Dispatcher | `DISPATCHER_TG_CHANNEL_ID` | owner-handoff (Wave 3) |

## Deploy quickstart

```bash
ssh storage-contabo
mkdir -p /opt/prin7r-deploys/chatbot-agency && cd /opt/prin7r-deploys/chatbot-agency
git clone https://github.com/prin7r-projects/chatbot-agency.git .
cp .env.example .env && nano .env   # paste all required creds
docker compose build
docker compose up -d
```

Traefik on `storage-contabo` runs in host-network mode with a Docker provider mounted on `/var/run/docker.sock`; the labels in `docker-compose.yml` are sufficient — no per-subdomain DNS or Traefik dynamic config needed (wildcard `*.prin7r.com → 161.97.99.120` is already in place).

Verify:

```bash
curl -sI https://chatbot-agency.prin7r.com | head -3
# HTTP/2 200 …
docker compose ps
# relayhouse-landing  Up (healthy)
# relayhouse-postgres Up (healthy)
# relayhouse-redis    Up (healthy)
```

## Provenance

The NOWPayments checkout pattern (`apps/landing/lib/nowpayments.ts`) is copied verbatim from the canonical reference at `/Users/keer/projects/prin7r/payments-prototypes/src/lib/signatures.ts`. The landing structure mirrors Wave 2's first delivery (`market-research-on-demand`) for consistency across the studio's twenty Wave 2 projects, with the visual identity (palette, typography, voice) entirely ours.

## License

MIT. See [LICENSE](./LICENSE).
