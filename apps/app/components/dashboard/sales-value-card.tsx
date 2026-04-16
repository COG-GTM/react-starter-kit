import { Card, CardContent } from "@repo/ui";
import { CircleHelp } from "lucide-react";
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
  { date: "01 Apr", templates: 30000, hosting: 20000 },
  { date: "02 Apr", templates: 80000, hosting: 30000 },
  { date: "03 Apr", templates: 60000, hosting: 40000 },
  { date: "04 Apr", templates: 70000, hosting: 50000 },
  { date: "05 Apr", templates: 90000, hosting: 60000 },
  { date: "06 Apr", templates: 110000, hosting: 55000 },
  { date: "07 Apr", templates: 170000, hosting: 70000 },
];

function formatYAxis(value: number) {
  if (value >= 1000) return `${value / 1000}K`;
  return String(value);
}

export function SalesChart() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Sales</h3>
            <CircleHelp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              type="button"
              className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Year
            </button>
            <button
              type="button"
              className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border-l"
            >
              Month
            </button>
            <button
              type="button"
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600"
            >
              Day
            </button>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient
                  id="templatesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="hostingGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={formatYAxis}
                domain={[0, 200000]}
                ticks={[0, 40000, 80000, 120000, 160000, 200000]}
              />
              <Tooltip
                formatter={(value, name) => [
                  `$${(Number(value) / 1000).toFixed(0)}k`,
                  name === "templates" ? "Templates" : "Hosting",
                ]}
              />
              <Area
                type="monotone"
                dataKey="templates"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#templatesGradient)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="hosting"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#hostingGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
