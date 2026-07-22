import Link from "next/link";
import { categories, products } from "@/lib/products";
import { suppliers } from "@/lib/suppliers";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  const featured = products
    .filter((p) => p.tags.includes("popular"))
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(600px circle at 20% 20%, #10b981, transparent), radial-gradient(500px circle at 80% 60%, #6366f1, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-brand-400/40">
              Global dropship network · 4 vetted labs
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              High-purity peptides,{" "}
              <span className="text-brand-400">shipped direct</span> from the
              lab.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Research & cosmetic peptides sourced from vetted suppliers and
              dropshipped to your door. Third-party tested, ≥98% purity, tracked
              end-to-end.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Shop the catalog
              </Link>
              <Link
                href="/track"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Track an order
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6">
              {[
                { k: "≥98%", v: "Verified purity" },
                { k: "2–6 day", v: "Lab dispatch" },
                { k: "12+", v: "Peptides in stock" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-bold text-white">{s.k}</dt>
                  <dd className="text-sm text-slate-400">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-ink-900">Shop by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-ink-900 group-hover:text-brand-600">
                {c.label}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink-900">Best sellers</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* How dropship works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-ink-900">
          How our dropship model works
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "You order",
              d: "Place an order from our curated catalog. Items are grouped by their source lab.",
            },
            {
              n: "2",
              t: "Lab dispatches",
              d: "The order routes straight to the vetted supplier, who lyophilizes, QCs and ships it.",
            },
            {
              n: "3",
              t: "Tracked delivery",
              d: "You get a tracking number per shipment and can follow each parcel to your door.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                {step.n}
              </span>
              <h3 className="mt-4 font-semibold text-ink-900">{step.t}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Suppliers */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-ink-900">
            Our supplier network
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Every product is fulfilled by an independently vetted laboratory.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {suppliers.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <h3 className="font-semibold text-ink-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.country}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-amber-500">
                    ★ {s.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    {s.leadTimeDays}d dispatch
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
