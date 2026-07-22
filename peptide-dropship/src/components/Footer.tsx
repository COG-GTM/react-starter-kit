import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
              Px
            </span>
            <span className="font-bold text-ink-900">PeptixLabs</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Dropship storefront for research & cosmetic peptides. Demo project.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink-900">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/products" className="hover:text-brand-600">
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=research"
                className="hover:text-brand-600"
              >
                Research Peptides
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=cosmetic"
                className="hover:text-brand-600"
              >
                Cosmetic Peptides
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink-900">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/track" className="hover:text-brand-600">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brand-600">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink-900">Compliance</h4>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            All products are sold strictly for laboratory research or cosmetic
            formulation use. Not for human consumption. Not evaluated by the
            FDA.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PeptixLabs — demonstration storefront. No
        real products are sold.
      </div>
    </footer>
  );
}
