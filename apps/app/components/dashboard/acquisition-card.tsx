import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { BarChart3, MousePointerClick } from "lucide-react";

export function AcquisitionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Acquisition</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tells you where your visitors originated from, such as search engines,
          social networks or website referrals.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-100">
              <MousePointerClick className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bounce Rate</p>
              <p className="text-xl font-bold">33.50%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sessions</p>
              <p className="text-xl font-bold">9,567</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
