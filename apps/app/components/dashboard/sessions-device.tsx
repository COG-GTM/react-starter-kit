import { Card, CardContent } from "@repo/ui";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const deviceData = [
  { name: "Desktop", value: 55, color: "#1e3a5f" },
  { name: "Phone", value: 30, color: "#3b82f6" },
  { name: "Tablet", value: 15, color: "#5eead4" },
];

export function SessionsDevice() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sessions by device</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {deviceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          {deviceData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-500">
                {item.name} {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
