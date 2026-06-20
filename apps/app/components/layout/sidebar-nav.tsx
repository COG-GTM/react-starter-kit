import type { FileRoutesByTo } from "@/lib/routeTree.gen";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItem {
  icon: LucideIcon;
  label: string;
  to: keyof FileRoutesByTo;
}

interface SidebarPageItem {
  icon: LucideIcon;
  label: string;
}

interface SidebarNavProps {
  items: readonly SidebarNavItem[];
  pageItems?: readonly SidebarPageItem[];
  bottomItems?: readonly SidebarPageItem[];
}

export function SidebarNav({ items, pageItems, bottomItems }: SidebarNavProps) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="px-4 pt-2 space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-[#4880FF] hover:text-white transition-colors"
            activeProps={{
              className: "!bg-[#4880FF] !text-white rounded-lg shadow-sm",
            }}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {pageItems && pageItems.length > 0 && (
        <div className="px-4 mt-6">
          <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Pages
          </p>
          <nav className="space-y-0.5">
            {pageItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full text-left"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {bottomItems && bottomItems.length > 0 && (
        <div className="mt-auto px-4 pb-6 pt-4 border-t border-gray-100">
          <nav className="space-y-0.5">
            {bottomItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full text-left"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
