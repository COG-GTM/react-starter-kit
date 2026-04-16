import { ChartBar, Cog, FileText, Home, Users } from "lucide-react";

export const sidebarItems = [
  { icon: Home, label: "Dashboard", to: "/" },
  { icon: ChartBar, label: "Analytics", to: "/analytics" },
  { icon: Users, label: "Users", to: "/users" },
  { icon: FileText, label: "Reports", to: "/reports" },
  { icon: Cog, label: "Settings", to: "/settings" },
] as const;
