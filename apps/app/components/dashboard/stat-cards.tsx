import { Card, CardContent } from "@repo/ui";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  MousePointerClick,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Customers",
    value: "345k",
    period: "Feb 1 - Apr 1",
    change: 22,
    direction: "up" as const,
    icon: Users,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Revenue",
    value: "$43,594",
    period: "Feb 1 - Apr 1",
    change: 2,
    direction: "down" as const,
    icon: BarChart3,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Bounce Rate",
    value: "50.88%",
    period: "Feb 1 - Apr 1",
    change: 4,
    direction: "down" as const,
    icon: MousePointerClick,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.period}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              {stat.direction === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stat.direction === "up" ? "text-green-600" : "text-red-500"
                }
              >
                {stat.change}%
              </span>
              <span className="text-muted-foreground">Since last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
