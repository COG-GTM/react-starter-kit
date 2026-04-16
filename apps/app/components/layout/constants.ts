import { ChartBar, Cog, CreditCard, Home, Table } from "lucide-react";

export const sidebarItems = [
  { icon: Home, label: "Dashboard", to: "/" },
  { icon: CreditCard, label: "Transactions", to: "/transactions" },
  { icon: Cog, label: "Settings", to: "/settings" },
  { icon: Table, label: "Tables", to: "/tables" },
  { icon: ChartBar, label: "Analytics", to: "/analytics" },
] as const;
