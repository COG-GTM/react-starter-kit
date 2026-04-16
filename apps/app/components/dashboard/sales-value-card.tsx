import { Card, CardContent, CardHeader } from "@repo/ui";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { name: "Mon", value: 200 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 250 },
  { name: "Thu", value: 280 },
  { name: "Fri", value: 500 },
  { name: "Sat", value: 450 },
  { name: "Sun", value: 680 },
];

export function SalesValueCard() {
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Sales Value
            </p>
            <h2 className="text-3xl font-bold">$10,567</h2>
            <p className="text-sm text-muted-foreground">
              Yesterday{" "}
              <span className="text-green-600 font-medium">10.57%</span>
            </p>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="px-3 py-1 text-xs font-medium rounded-md bg-slate-800 text-white"
            >
              Month
            </button>
            <button
              type="button"
              className="px-3 py-1 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100"
            >
              Week
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
