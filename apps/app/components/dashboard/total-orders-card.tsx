import { Card, CardContent, CardHeader } from "@repo/ui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ordersData = [
  { name: "Mon", july: 40, august: 30 },
  { name: "Tue", july: 55, august: 45 },
  { name: "Wed", july: 35, august: 50 },
  { name: "Thu", july: 65, august: 40 },
  { name: "Fri", july: 45, august: 60 },
  { name: "Sat", july: 70, august: 55 },
];

export function TotalOrdersCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total orders
        </p>
        <h2 className="text-3xl font-bold">452</h2>
        <p className="text-sm text-green-600 font-medium">18.2%</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-800" />
            July
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            August
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData} barGap={2}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <Tooltip />
              <Bar
                dataKey="july"
                fill="#1e293b"
                radius={[3, 3, 0, 0]}
                barSize={14}
              />
              <Bar
                dataKey="august"
                fill="#f59e0b"
                radius={[3, 3, 0, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
