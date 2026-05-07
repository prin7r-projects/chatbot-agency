# Dispatch — chatbot agency · `chatbot-agency.prin7r.com`

> A productized chatbot agency. Spec on Monday, bot live by Friday. Telegram, Discord, WhatsApp from one knowledge base. One bill.

- Landing — <https://chatbot-agency.prin7r.com>
- Notion opportunity — <https://www.notion.so/Chatbot-agency-Telegram-Discord-WhatsApp-3543ceec26198173b275e1e7cf29d191>
- Repo — <https://github.com/prin7r-projects/chatbot-agency>

## Repo structure

```
.
├── DESIGN.md                 # 15-section design + style guide (Chief of Design)
├── apps/
│   ├── landing/              # Next.js 15 + ShadCN — hero / days / pricing / FAQ
│   └── app/                  # Stub for the open-saas dashboard (deferred)
├── docs/                     # 10 strategy docs + pitch deck (MD + HTML)
│   └── screenshots/          # Desktop + mobile production captures
├── Dockerfile.landing        # Next.js standalone build, multi-stage
├── docker-compose.yml        # Single-service Traefik label set
└── .env.example              # NOWPayments + Plisio + Reown env names
```

## What this Wave 2 build ships

- A 15-section [`DESIGN.md`](./DESIGN.md) at root.
- The 10 strategy / design docs under [`docs/`](./docs/) — brand identity, architecture, journeys, pain points, audience, channels, sales, marketing, GTM, pitch deck (with companion `pitch-deck.html`).
- A hand-coded Next.js 15 landing at [`apps/landing/`](./apps/landing/) with ShadCN-vendored Button + Card primitives re-themed to the Dispatch tokens.
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
# From repo root
cd apps/landing
pnpm install
cp ../../.env.example ../../.env   # populate NOWPayments creds locally
pnpm dev                           # http://localhost:3000
```

The page renders without env credentials, but the **Take Starter / Growth / Pro** buttons return HTTP 503 with a clear error until `NOWPAYMENTS_API_KEY` is set.

## Deploy quickstart

```bash
ssh storage-contabo
mkdir -p /opt/prin7r-deploys/chatbot-agency && cd /opt/prin7r-deploys/chatbot-agency
git clone https://github.com/prin7r-projects/chatbot-agency.git .
cp .env.example .env && nano .env   # paste NOWPayments creds
docker compose build
docker compose up -d
```

Traefik on `storage-contabo` runs in host-network mode with a Docker provider mounted on `/var/run/docker.sock`; the labels in `docker-compose.yml` are sufficient — no per-subdomain DNS or Traefik dynamic config needed (wildcard `*.prin7r.com → 161.97.99.120` is already in place).

Verify within 5 min:

```bash
curl -sI https://chatbot-agency.prin7r.com | head -3
# HTTP/2 200 …
```

## Provenance

The NOWPayments checkout pattern (`apps/landing/lib/nowpayments.ts`) is copied verbatim from the canonical reference at `/Users/keer/projects/prin7r/payments-prototypes/src/lib/signatures.ts`. The landing structure mirrors Wave 2's first delivery (`market-research-on-demand`) for consistency across the studio's twenty Wave 2 projects, with the visual identity (palette, typography, voice) entirely ours.

## License

MIT. See [LICENSE](./LICENSE).
