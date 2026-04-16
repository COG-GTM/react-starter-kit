import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { ArrowDown, ArrowUp } from "lucide-react";

const pageVisits = [
  {
    page: "/demo/admin/index.html",
    views: "3,225",
    value: "$20",
    bounceRate: "42.55%",
    direction: "up" as const,
  },
  {
    page: "/demo/admin/forms.html",
    views: "2,987",
    value: "$0",
    bounceRate: "43.24%",
    direction: "down" as const,
  },
  {
    page: "/demo/admin/util.html",
    views: "2,844",
    value: "$294",
    bounceRate: "32.35%",
    direction: "down" as const,
  },
  {
    page: "/demo/admin/validation.html",
    views: "2,050",
    value: "$147",
    bounceRate: "50.87%",
    direction: "up" as const,
  },
  {
    page: "/demo/admin/modals.html",
    views: "1,483",
    value: "$19",
    bounceRate: "26.12%",
    direction: "down" as const,
  },
];

export function PageVisitsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Page visits</CardTitle>
        <button
          type="button"
          className="text-xs font-medium px-3 py-1.5 rounded-md border hover:bg-accent transition-colors"
        >
          See all
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs uppercase text-muted-foreground">
              <th className="text-left px-6 py-3 font-medium">Page name</th>
              <th className="text-left px-6 py-3 font-medium">Page Views</th>
              <th className="text-left px-6 py-3 font-medium">Page Value</th>
              <th className="text-left px-6 py-3 font-medium">Bounce rate</th>
            </tr>
          </thead>
          <tbody>
            {pageVisits.map((row) => (
              <tr key={row.page} className="border-b last:border-0">
                <td className="px-6 py-3 text-sm font-medium">{row.page}</td>
                <td className="px-6 py-3 text-sm">{row.views}</td>
                <td className="px-6 py-3 text-sm">{row.value}</td>
                <td className="px-6 py-3 text-sm">
                  <span className="flex items-center gap-1">
                    {row.direction === "up" ? (
                      <ArrowUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    {row.bounceRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
