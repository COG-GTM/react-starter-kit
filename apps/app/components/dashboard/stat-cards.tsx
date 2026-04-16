import { Card, CardContent } from "@repo/ui";
import { ArrowUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const todaySalesData = [
  { time: "12", sales: 800, profit: 600 },
  { time: "13", sales: 1200, profit: 900 },
  { time: "14", sales: 900, profit: 700 },
  { time: "15", sales: 1400, profit: 1000 },
  { time: "16", sales: 1100, profit: 800 },
  { time: "17", sales: 1900, profit: 1470 },
  { time: "18", sales: 1600, profit: 1200 },
];

const visitorsData = [
  { time: "9", visitors: 200 },
  { time: "10", visitors: 350 },
  { time: "11", visitors: 300 },
  { time: "12", visitors: 450 },
  { time: "13", visitors: 500 },
  { time: "14", visitors: 400 },
  { time: "15", visitors: 350 },
  { time: "16", visitors: 300 },
];

const weekVisitorsData = [
  { day: "M", users: 50000 },
  { day: "T", users: 60000 },
  { day: "W", users: 45000 },
  { day: "T", users: 90000 },
  { day: "F", users: 70000 },
  { day: "S", users: 55000 },
  { day: "S", users: 40000 },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">$45,897</p>
              <p className="text-sm text-gray-500">Today Sales</p>
            </div>
            <span className="flex items-center gap-0.5 text-sm font-medium text-green-500">
              4.3% <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={todaySalesData} barGap={2}>
                <Tooltip
                  formatter={(value, name) => [
                    `$${value}`,
                    name === "sales" ? "Sales" : "Profit",
                  ]}
                />
                <Bar
                  dataKey="sales"
                  fill="#3b82f6"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="profit"
                  fill="#93c5fd"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">6,438</p>
              <p className="text-sm text-gray-500">Today visitors</p>
            </div>
            <span className="flex items-center gap-0.5 text-sm font-medium text-green-500">
              4.3% <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorsData}>
                <defs>
                  <linearGradient
                    id="visitorsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip formatter={(value) => [`${value}`, "Visitors"]} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#visitorsGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">566,768</p>
              <p className="text-sm text-gray-500">This week visitors</p>
            </div>
            <span className="flex items-center gap-0.5 text-sm font-medium text-green-500">
              10% <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekVisitorsData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${(Number(value) / 1000).toFixed(0)}k`,
                    "Users",
                  ]}
                />
                <Bar
                  dataKey="users"
                  fill="#cbd5e1"
                  radius={[2, 2, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
