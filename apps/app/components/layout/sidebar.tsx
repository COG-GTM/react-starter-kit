import { UserMenu } from "@/components/user-menu";
import type { FileRoutesByTo } from "@/lib/routeTree.gen";
import { Link } from "@tanstack/react-router";
import {
  ChartBar,
  ChevronDown,
  CreditCard,
  FileText,
  Globe,
  Home,
  Lock,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  to?: keyof FileRoutesByTo;
  hasDropdown?: boolean;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Overview", to: "/" },
  { icon: FileText, label: "Pages", hasDropdown: true },
  { icon: CreditCard, label: "Sales", hasDropdown: true },
  { icon: MessageSquare, label: "Messages", badge: 1 },
  { icon: Lock, label: "Authentication", hasDropdown: true },
];

const secondaryNavItems: NavItem[] = [
  { icon: FileText, label: "Docs" },
  { icon: ChartBar, label: "Components" },
  { icon: Globe, label: "Help" },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0"
      } transition-all duration-300 ease-in-out bg-white border-r overflow-hidden flex-shrink-0`}
    >
      <div className="h-full flex flex-col w-64">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {mainNavItems.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                inactiveProps={{
                  className: "text-gray-600",
                }}
                activeProps={{
                  className: "text-blue-600 bg-blue-50",
                }}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full"
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
                {item.hasDropdown ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : null}
              </button>
            ),
          )}

          <div className="border-t my-3" />

          {secondaryNavItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full"
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>
        <UserMenu />
      </div>
    </aside>
  );
}
