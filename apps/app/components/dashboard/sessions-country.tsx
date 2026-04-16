import { Card, CardContent } from "@repo/ui";
import { Minus, Plus } from "lucide-react";

const countries = [
  { name: "United States", flag: "🇺🇸", percentage: 70 },
  { name: "Canada", flag: "🇨🇦", percentage: 55 },
  { name: "France", flag: "🇫🇷", percentage: 48 },
  { name: "Italy", flag: "🇮🇹", percentage: 40 },
  { name: "Australia", flag: "🇦🇺", percentage: 25 },
  { name: "India", flag: "🇮🇳", percentage: 20 },
];

export function SessionsCountry() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-1">United States</h3>
        <p className="text-sm text-gray-500 mb-6">Sessions by country</p>

        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <svg viewBox="0 0 800 400" className="w-full h-auto">
              <g fill="#d1d5db" stroke="#fff" strokeWidth="0.5">
                <ellipse cx="160" cy="180" rx="120" ry="100" />
                <ellipse cx="160" cy="320" rx="50" ry="50" />
                <ellipse cx="400" cy="140" rx="100" ry="80" />
                <ellipse cx="400" cy="260" rx="80" ry="100" />
                <ellipse cx="550" cy="160" rx="60" ry="80" />
                <ellipse cx="620" cy="280" rx="40" ry="40" />
                <ellipse cx="700" cy="320" rx="50" ry="30" />
              </g>
              <g fill="#3b82f6" stroke="#fff" strokeWidth="0.5">
                <ellipse cx="160" cy="180" rx="120" ry="100" opacity="0.6" />
              </g>
              <g className="text-xs">
                <rect
                  x="200"
                  y="160"
                  width="130"
                  height="55"
                  rx="4"
                  fill="white"
                  stroke="#e5e7eb"
                />
                <text x="220" y="178" fontSize="11" fill="#111">
                  🇺🇸 United States
                </text>
                <text x="220" y="195" fontSize="10" fill="#6b7280">
                  Visitors: 35.1k
                </text>
                <text x="220" y="208" fontSize="10" fill="#6b7280">
                  Change: 24%
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button type="button" className="p-1 rounded border hover:bg-gray-50">
            <Minus className="h-3.5 w-3.5 text-gray-500" />
          </button>
          <button type="button" className="p-1 rounded border hover:bg-gray-50">
            <Plus className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {countries.map((country) => (
            <div key={country.name} className="flex items-center gap-3">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm w-28 shrink-0">{country.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${country.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
