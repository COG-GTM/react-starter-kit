import { Card, CardContent } from "@repo/ui";
import { ExternalLink, Flag, Globe, Monitor } from "lucide-react";

const rankings = [
  {
    title: "Global Rank",
    rank: "#755",
    icon: Globe,
    subtitle: null,
  },
  {
    title: "Country Rank",
    rank: "#32",
    icon: Flag,
    subtitle: "United States",
  },
  {
    title: "Category Rank",
    rank: "#11",
    icon: Monitor,
    subtitle: "Computers Electronics > Technology",
  },
];

export function RankingsCard() {
  return (
    <Card>
      <CardContent className="p-0 divide-y">
        {rankings.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {item.rank}
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
