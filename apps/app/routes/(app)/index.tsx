import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  Clock,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/(app)/")({
  component: Dashboard,
});

// ── Stat Cards Data ──────────────────────────────────────────────────
const statCards = [
  {
    title: "Total User",
    value: "40,689",
    change: "8.5% Up from yesterday",
    trend: "up" as const,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    Icon: Users,
  },
  {
    title: "Total Order",
    value: "10293",
    change: "1.3% Up from past week",
    trend: "up" as const,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
    Icon: ShoppingBag,
  },
  {
    title: "Total Sales",
    value: "$89,000",
    change: "4.3% Down from yesterday",
    trend: "down" as const,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    Icon: TrendingUp,
  },
  {
    title: "Total Pending",
    value: "2040",
    change: "1.8% Up from yesterday",
    trend: "up" as const,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-400",
    Icon: Clock,
  },
];

// ── Sales Chart Data ─────────────────────────────────────────────────
const salesData = [
  20, 35, 45, 42, 48, 46, 30, 25, 40, 42, 48, 90, 55, 45, 50, 48, 45, 50, 48,
  55, 60, 58, 30, 25, 35, 60, 58, 55, 70, 65, 60, 55, 62, 65, 60, 55, 58, 62,
  55, 50, 52, 55, 48, 52, 55, 50, 48, 45,
];
const salesLabels = [
  "5k",
  "10k",
  "15k",
  "20k",
  "25k",
  "30k",
  "35k",
  "40k",
  "45k",
  "50k",
  "55k",
  "60k",
];

// ── Deals Table Data ─────────────────────────────────────────────────
const dealsData = [
  {
    name: "Apple Watch",
    location: "6096 Marjolaine Landing",
    dateTime: "12.09.2026 - 12.53 PM",
    piece: "423",
    amount: "$34,295",
    status: "Delivered",
  },
  {
    name: "MacBook Pro",
    location: "3517 W. Gray St.",
    dateTime: "12.09.2026 - 12.53 PM",
    piece: "213",
    amount: "$24,500",
    status: "Pending",
  },
  {
    name: "iPhone 15 Pro",
    location: "2715 Ash Dr. San Jose",
    dateTime: "12.09.2026 - 12.53 PM",
    piece: "850",
    amount: "$89,000",
    status: "Delivered",
  },
  {
    name: "AirPods Pro",
    location: "1901 Thornridge Cir.",
    dateTime: "12.09.2026 - 12.53 PM",
    piece: "1,200",
    amount: "$12,400",
    status: "Rejected",
  },
];

// ── Sparkline SVG ────────────────────────────────────────────────────
function SalesChart() {
  const width = 900;
  const height = 280;
  const paddingX = 50;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const max = Math.max(...salesData);

  const points = salesData.map((v, i) => ({
    x: paddingX + (i / (salesData.length - 1)) * chartW,
    y: paddingY + chartH - (v / max) * chartH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`;

  const yLabels = ["20%", "40%", "60%", "80%", "100%"];

  // peak index
  const peakIdx = salesData.indexOf(max);
  const peak = points[peakIdx];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Y gridlines & labels */}
      {yLabels.map((label, i) => {
        const y = paddingY + chartH - ((i + 1) / 5) * chartH;
        return (
          <g key={label}>
            <line
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="#E5E7EB"
              strokeDasharray="4 4"
            />
            <text
              x={paddingX - 10}
              y={y + 4}
              textAnchor="end"
              className="text-[11px] fill-gray-400"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {salesLabels.map((label, i) => {
        const x = paddingX + (i / (salesLabels.length - 1)) * chartW;
        return (
          <text
            key={label}
            x={x}
            y={height - 5}
            textAnchor="middle"
            className="text-[11px] fill-gray-400"
          >
            {label}
          </text>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#salesGradient)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#4880FF"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p) => (
        <circle
          key={`${p.x}-${p.y}`}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="white"
          stroke="#4880FF"
          strokeWidth="1.5"
        />
      ))}

      {/* Peak tooltip */}
      <g>
        <rect
          x={peak.x - 40}
          y={peak.y - 30}
          width="80"
          height="22"
          rx="4"
          fill="#4880FF"
        />
        <text
          x={peak.x}
          y={peak.y - 15}
          textAnchor="middle"
          className="text-[11px] fill-white font-medium"
        >
          64,3664.77
        </text>
      </g>

      <defs>
        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4880FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4880FF" stopOpacity="0.02" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Delivered: "bg-green-500",
    Pending: "bg-yellow-400",
    Rejected: "bg-red-500",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${colorMap[status] ?? "bg-gray-400"}`}
    >
      {status}
    </span>
  );
}

// ── Dashboard Page ───────────────────────────────────────────────────
function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl p-5 flex items-start justify-between shadow-sm border border-gray-100"
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <div className="flex items-center gap-1 text-xs">
                {card.trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={
                    card.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {card.change}
                </span>
              </div>
            </div>
            <div
              className={`h-11 w-11 rounded-full ${card.iconBg} flex items-center justify-center`}
            >
              <card.Icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Sales Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Sales Details</h3>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500"
          >
            October
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <SalesChart />
      </div>

      {/* Deals Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Deals Details</h3>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500"
          >
            October
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 font-medium">
                <th className="px-4 py-3 rounded-l-lg">Product Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date - Time</th>
                <th className="px-4 py-3">Piece</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {dealsData.map((deal) => (
                <tr
                  key={deal.name}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-700">
                        {deal.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{deal.location}</td>
                  <td className="px-4 py-3.5 text-gray-500">{deal.dateTime}</td>
                  <td className="px-4 py-3.5 text-gray-500">{deal.piece}</td>
                  <td className="px-4 py-3.5 font-medium text-gray-700">
                    {deal.amount}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={deal.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
