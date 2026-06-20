import {
  CalendarDays,
  Contact,
  FileText,
  Heart,
  Home,
  Inbox,
  LayoutGrid,
  ListOrdered,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Table,
  Users,
} from "lucide-react";

export const dashboardItems = [
  { icon: Home, label: "Dashboard", to: "/" },
  { icon: ShoppingCart, label: "Products", to: "/analytics" },
  { icon: Heart, label: "Favorites", to: "/reports" },
  { icon: Inbox, label: "Inbox", to: "/about" },
  { icon: ListOrdered, label: "Order Lists", to: "/users" },
  { icon: Package, label: "Product Stock", to: "/settings" },
] as const;

export const pageItems = [
  { icon: LayoutGrid, label: "Pricing" },
  { icon: CalendarDays, label: "Calender" },
  { icon: FileText, label: "To-Do" },
  { icon: Contact, label: "Contact" },
  { icon: FileText, label: "Invoice" },
  { icon: LayoutGrid, label: "UI Elements" },
  { icon: Users, label: "Team" },
  { icon: Table, label: "Table" },
] as const;

export const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: LogOut, label: "Logout" },
] as const;
