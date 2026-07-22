# PeptixLabs — Peptide Dropshipping Storefront (demo)

A self-contained **Next.js 16 (App Router) + Tailwind CSS v4** demo storefront for
research & cosmetic peptides, including a mock dropshipping supplier/fulfillment
flow and an admin dashboard.

> Demo only. All products are framed as **research / cosmetic-formulation use
> only — not for human consumption**. No real products are sold and no real
> payments are processed.

This app is intentionally isolated from the surrounding monorepo (it has its own
`package.json`, ESLint and Prettier config, and is excluded from Bun workspaces).
Use `npm` inside this folder.

## Features

- **Storefront** — landing page, catalog with category filtering, product detail
  pages, and a persistent cart (`useSyncExternalStore` + `localStorage`).
- **Checkout** — collects shipping details and creates an order (payment is
  mocked).
- **Dropshipping model** — each order is split into per-supplier _fulfillments_.
  Every product is sourced from one of four vetted suppliers.
- **Fulfillment lifecycle** — `PENDING → ROUTED_TO_SUPPLIER → DISPATCHED →
IN_TRANSIT → DELIVERED` (or `CANCELLED`), with tracking numbers generated on
  dispatch.
- **Order confirmation & public tracking** — per-shipment status timelines at
  `/order/[orderNumber]` and `/track`.
- **Admin dashboard** (`/admin`) — revenue / margin / open-shipment metrics,
  per-shipment status controls (advance / cancel), and an inventory & margin
  table.

## Getting started

```bash
cd peptide-dropship
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run lint     # ESLint (eslint-config-next)
npm run build    # production build
npm start        # run the production build
```

## Data & persistence

Orders are persisted to a local JSON file at `.data/orders.json` (git-ignored),
so they survive dev-server restarts without any external database. Products and
suppliers are static seed data in `src/lib/`.

## API

| Method | Route                                    | Purpose                                   |
| ------ | ---------------------------------------- | ----------------------------------------- |
| `GET`  | `/api/orders`                            | List all orders (admin)                   |
| `POST` | `/api/orders`                            | Create an order from cart + customer info |
| `GET`  | `/api/orders/[orderNumber]`              | Fetch a single order                      |
| `POST` | `/api/orders/[orderNumber]/fulfillments` | Advance / set a shipment's status         |

`POST /api/orders/[orderNumber]/fulfillments` body:

```jsonc
{ "supplierId": "sup_aminova", "action": "advance" }
// or: { "supplierId": "sup_aminova", "status": "DISPATCHED" }
```

## Project layout

```
src/
  app/            # routes: home, products, cart, checkout, order, track, admin, api
  components/     # Header, Footer, ProductCard, timelines, admin actions, ...
  lib/            # products, suppliers, order-store (JSON persistence), types
```

## Tech

Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript.
