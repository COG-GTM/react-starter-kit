import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { CheckCircle } from "lucide-react";

const tasks = [
  { name: "Rocket - SaaS Template", progress: 75, color: "bg-green-500" },
  { name: "Themesberg - Design System", progress: 60, color: "bg-cyan-500" },
  { name: "Homepage Design in Figma", progress: 45, color: "bg-amber-500" },
  { name: "Backend for Themesberg v2", progress: 34, color: "bg-red-500" },
];

export function ProgressTrack() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Progress track</CardTitle>
        <button
          type="button"
          className="text-xs font-medium px-3 py-1.5 rounded-md border hover:bg-accent transition-colors"
        >
          See tasks
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{task.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {task.progress} %
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${task.color}`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
