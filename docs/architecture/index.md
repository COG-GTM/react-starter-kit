# Architecture Overview

React Starter Kit runs on three Cloudflare Workers connected by [service bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/). A single domain receives all traffic – the **web** worker routes each request to the right destination without any cross-worker public URLs.

## System Diagram

![React Starter Kit system architecture](./diagrams/architecture.svg)

The diagram is generated from an editable Graphviz source, [`diagrams/architecture.dot`](https://github.com/COG-GTM/react-starter-kit/blob/main/docs/architecture/diagrams/architecture.dot). After editing it, run `docs/architecture/diagrams/render.sh` (requires [Graphviz](https://graphviz.org/download/)) to regenerate `architecture.png` and `architecture.svg`. Solid arrows are runtime requests; dashed arrows are build-time workspace imports.

## Request Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Web as Web Worker
    participant App as App Worker
    participant API as API Worker
    participant DB as Neon PostgreSQL

    Browser->>Web: GET /
    alt auth-hint cookie present
        Web->>App: service binding
        App-->>Web: SPA (dashboard)
    else no cookie
        Web-->>Browser: marketing page
    end

    Browser->>Web: GET /settings
    Web->>App: service binding
    App-->>Web: SPA assets

    Browser->>Web: POST /api/trpc/user.me
    Web->>API: service binding
    API->>DB: Hyperdrive
    DB-->>API: query result
    API-->>Web: JSON response
    Web-->>Browser: JSON response
```

## Workers

| Worker  | Workspace  | Purpose                                               | Has `nodejs_compat` |
| ------- | ---------- | ----------------------------------------------------- | :-----------------: |
| **web** | `apps/web` | Edge router – receives all traffic, routes to app/api |         No          |
| **app** | `apps/app` | SPA static assets (React, TanStack Router)            |         No          |
| **api** | `apps/api` | Hono server – tRPC, Better Auth, webhooks             |         Yes         |

### Web Worker

The web worker is the only worker with a public route (`example.com/*`). It decides where each request goes:

- `/api/*` – forwarded to the API worker
- `/login`, `/signup`, `/settings`, `/analytics`, `/reports`, `/_app/*` – forwarded to the app worker
- `/` – routed by [auth hint cookie](#auth-hint-cookie) (app if signed in, marketing site if not)
- Everything else – served from the web worker's own static assets (marketing pages)

::: warning
The forwarded list is explicit. The SPA also defines `/dashboard`, `/users` and `/about` (`apps/app/routes/(app)/`), which the web worker does not forward, so a full page load of those paths in a deployed environment falls through to the marketing assets. Client-side navigation inside the SPA is unaffected. Add a matching `app.all()` line in `apps/web/worker.ts` when you add a top-level SPA route.
:::

```ts
// apps/web/worker.ts (simplified)
app.all("/api/*", (c) => c.env.API_SERVICE.fetch(c.req.raw));
app.all("/login*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));

app.on(["GET", "HEAD"], "/", async (c) => {
  const hasAuthHint =
    getCookie(c, "__Host-auth") === "1" || getCookie(c, "auth") === "1";
  const upstream = await (hasAuthHint ? c.env.APP_SERVICE : c.env.ASSETS).fetch(
    c.req.raw,
  );
  // ...
});
```

### App Worker

A static asset worker with `not_found_handling: "single-page-application"` – any path that doesn't match a file returns `index.html`, enabling client-side routing via TanStack Router.

The app worker has no custom worker script. It is accessed only through service bindings from the web worker.

### API Worker

Runs the Hono HTTP server with the following middleware chain:

```ts
// apps/api/worker.ts (simplified)
worker.onError(errorHandler);
worker.notFound(notFoundHandler);
worker.use(secureHeaders());
worker.use(requestId({ generator: requestIdGenerator }));
worker.use(logger());

// Initialize shared context
worker.use(async (c, next) => {
  const db = createDb(c.env.HYPERDRIVE_CACHED);
  c.set("db", db);
  c.set("dbDirect", createDb(c.env.HYPERDRIVE_DIRECT));
  c.set("auth", createAuth(db, c.env));
  await next();
});

worker.route("/", app); // Mounts tRPC + auth + health routes
```

Primary endpoints:

| Path          | Handler                                                |
| ------------- | ------------------------------------------------------ |
| `/api/auth/*` | Better Auth (login, signup, sessions, OAuth callbacks) |
| `/api/trpc/*` | tRPC procedures (batching enabled)                     |
| `/api`        | API info (name, version, endpoint list)                |
| `/health`     | Health check                                           |

## Service Bindings

Service bindings let workers call each other directly over Cloudflare's internal network – no HTTP round-trip through the public internet.

```jsonc
// apps/web/wrangler.jsonc
"services": [
  { "binding": "APP_SERVICE", "service": "example-app" },
  { "binding": "API_SERVICE", "service": "example-api" }
]
```

::: warning
Service bindings are **non-inheritable** in Wrangler – they must be declared in every environment block. Forgetting this causes staging/preview workers to bind to production services.
:::

Naming convention: `<project>-<worker>-<env>` (e.g. `example-api-staging`). See [Edge > Service Bindings](./edge#service-bindings) for the full per-environment config.

## Database Connection

The API worker connects to [Neon PostgreSQL](https://neon.tech) via [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) – a connection pool that sits between Workers and your database.

Two bindings are available:

| Binding             | Caching  | Use case                              |
| ------------------- | -------- | ------------------------------------- |
| `HYPERDRIVE_CACHED` | Enabled  | Default reads – most queries go here  |
| `HYPERDRIVE_DIRECT` | Disabled | Writes and reads that need fresh data |

Both bindings are initialized in the API worker middleware and available on every request context as `db` and `dbDirect`. See [Database](/database/) for schema and query patterns.

## Auth Hint Cookie

The `/` route serves two different experiences – a marketing page for visitors and the app dashboard for signed-in users. The web worker needs a fast signal to choose without owning auth logic.

**How it works:** Better Auth sets a lightweight `__Host-auth=1` cookie on sign-in and clears it on sign-out. The web worker checks only for cookie _presence_ – it never validates sessions. If the cookie exists, the request goes to the app worker; otherwise it serves the marketing page.

This cookie is a **routing hint only**, not a security boundary. A false positive (stale cookie) results in one extra redirect to `/login` – the app worker validates the real session.

::: info
In local development the cookie is named `auth` (HTTP), since browsers reject the `__Host-` prefix without HTTPS.
:::

See [ADR-001](/adr/001-auth-hint-cookie) for the full decision record and [Sessions & Protected Routes](/auth/sessions) for the auth flow.

## Environments

| Environment | Workers                                                                      | Domain                | Database       | Deploy command                  |
| ----------- | ---------------------------------------------------------------------------- | --------------------- | -------------- | ------------------------------- |
| Development | Local dev servers (see [Edge > Local Development](./edge#local-development)) | `localhost:5173`      | Dev branch     | `bun dev`                       |
| Preview     | `*-preview`                                                                  | `preview.example.com` | Preview branch | `wrangler deploy --env preview` |
| Staging     | `*-staging`                                                                  | `staging.example.com` | Staging branch | `wrangler deploy --env staging` |
| Production  | `*` (no suffix)                                                              | `example.com`         | Main branch    | `wrangler deploy`               |

Each environment has its own Hyperdrive bindings, service binding targets, and `APP_ORIGIN` / `ALLOWED_ORIGINS` variables. See [Edge > Service Bindings](./edge#service-bindings) for the full wrangler config.

## Workspaces and Shared Packages

The workers are built from Bun workspaces. Shared packages are imported at build time; they are not deployed on their own.

| Workspace                    | Package                   | Used by         | Purpose                                                                                   |
| ---------------------------- | ------------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `apps/email`                 | `@repo/email`             | api             | React Email templates (OTP, invitations), compiled before the API                         |
| `db`                         | `@repo/db`                | api             | Drizzle ORM schema, migrations and seeds for Neon PostgreSQL                              |
| `packages/core`              | `@repo/core`              | api             | Shared utilities                                                                          |
| `packages/ui`                | `@repo/ui`                | app, web        | shadcn/ui components (new-york style)                                                     |
| `packages/ws-protocol`       | `@repo/ws-protocol`       | – (template)    | Type-safe WebSocket message protocol, not yet imported by any app                         |
| `packages/pricing-engine`    | `@repo/pricing-engine`    | – (no consumer) | Checkout pricing: product catalog, regional tax, Pro volume discounts, receipt formatting |
| `packages/typescript-config` | `@repo/typescript-config` | all             | Shared `tsconfig` presets                                                                 |

### Pricing Engine

`packages/pricing-engine` was added in the COG-GTM fork as a shared checkout pricing and receipt package. It is plain TypeScript with no runtime dependencies and exports from `index.ts`:

- `CATALOG` / `CATALOG_BY_SKU` – the product catalog (SKU, name, category, unit price)
- `TAX_REGIONS` – tax rate and currency for `US`, `CA` and `MX`
- `getApplicableDiscount(subtotal)` – volume-discount tier: 5% from 500, 10% from 2,000
- `computeOrderTotal(subtotal, region)` – subtotal, tax, discount and total; throws `INVALID_REGION` for an unknown region
- `formatLineItems(items)` / `buildCheckoutReceipt(order)` – receipt rows and totals for a cart

The package is registered in the root `tsconfig.json` project references and in the `@repo/pricing-engine` path alias, so `bun typecheck` covers it. No app, worker or tRPC procedure imports it yet, and it has no tests in the Vitest projects (`apps/api`, `apps/app`). See [`packages/pricing-engine/README.md`](https://github.com/COG-GTM/react-starter-kit/blob/main/packages/pricing-engine/README.md) for usage.

## Build Order

`bun run build` builds the four deployable workspaces with `bun --filter`, which orders them by workspace dependencies:

```
email → api        (the API imports the compiled templates)
web, app           (independent; no build-time dependency on email or api)
```

CI (`.github/workflows/ci.yml`) runs `bun email:build` before `bun tsc --build`, because type checking the API also needs the compiled templates.

## Key Invariants

- The **API worker is the sole authority** for authentication and data access – the web worker never validates sessions or queries the database.
- Only the **web worker** has public routes. App and API workers are accessed exclusively through service bindings.
- **Service bindings are non-inheritable** – every Wrangler environment must declare its own bindings.
- The auth hint cookie is a **routing optimization**, not a security mechanism.
- The API worker is the only worker with `nodejs_compat` enabled.
