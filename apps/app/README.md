# apps/app — Dispatch dashboard (deferred)

Placeholder for the customer-facing dashboard. Will be forked from
[`wasp-lang/open-saas`](https://github.com/wasp-lang/open-saas) in a later wave.

## Scope (when built)

- Magic-link auth (open-saas default).
- Customer dashboard:
  - Knowledge-base editor (Notion-style, with a preview pane).
  - Tuning queue (Tuesday call agenda).
  - Monthly accuracy report viewer.
  - Channel connectors page (TG / WA / Discord token wiring per tenant).
- Subscription management surface — read-only against NOWPayments invoices for v1; full self-serve cancel / upgrade in v2.
- Webhook bridge into the LLM router (`apps/edge/router`) on the dedicated Hetzner CX.
- Partner studio statement view (40% margin per referred seat).

## Deferred deliberately

Wave 2 batch 1 ships only the landing surface so we can validate the messaging
hierarchy, the day-by-day delivery promise, and the pricing tiers with real
first-paid pilots **before** committing to the dashboard build. Once the
messaging is proven (target: 8-12 paid pilots in 30 days), this folder gets the
open-saas fork applied.

## Bootstrap (when ready)

```bash
# From repo root
cd apps
git clone --depth 1 https://github.com/wasp-lang/open-saas.git app-bootstrap
mv app-bootstrap/template/app/* app/
rm -rf app-bootstrap
cd app
# Follow open-saas README from here:
#   https://docs.opensaas.sh/start/getting-started/
```

After bootstrap, the first integration tasks are:

1. Magic-link login (open-saas default — keep).
2. Replace the open-saas Stripe wiring with our existing NOWPayments hosted-invoice
   route (mirroring `apps/landing/lib/nowpayments.ts`).
3. Add the KB editor (Tiptap or BlockNote) over the existing open-saas user model.
4. Add the channel-connectors page reading per-tenant secrets from the open-saas
   `User` and a new `Connector` table.

For the engine handshake spec, see [`/docs/02-architecture.md`](../../docs/02-architecture.md).

## Why the open-saas fork (not Next.js / shadcn from scratch)

Open-SaaS gets us magic-link auth, a Postgres-backed user model, transactional
emails, billing scaffolding, and the deployable Wasp runtime out of the box.
Wave 2's velocity goal is to spend our hours on the bot delivery, not on auth.
