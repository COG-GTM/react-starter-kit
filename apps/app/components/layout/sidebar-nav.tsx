import type { FileRoutesByTo } from "@/lib/routeTree.gen";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItem {
  icon: LucideIcon;
  label: string;
  to: keyof FileRoutesByTo;
}

interface SidebarNavProps {
  items: readonly SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          activeProps={{
            className: "bg-slate-700 text-white",
          }}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
