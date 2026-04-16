import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { Mail, UserPlus } from "lucide-react";

const members = [
  {
    name: "Chris Wood",
    status: "Online",
    statusColor: "bg-green-500",
    initials: "CW",
    action: "Invite" as const,
  },
  {
    name: "Jose Leos",
    status: "In a meeting",
    statusColor: "bg-amber-500",
    initials: "JL",
    action: "Message" as const,
  },
  {
    name: "Bonnie Green",
    status: "Offline",
    statusColor: "bg-red-500",
    initials: "BG",
    action: "Message" as const,
  },
  {
    name: "Neil Sims",
    status: "Offline",
    statusColor: "bg-red-500",
    initials: "NS",
    action: "Message" as const,
  },
];

export function TeamMembers() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Team members</CardTitle>
        <button
          type="button"
          className="text-xs font-medium px-3 py-1.5 rounded-md border hover:bg-accent transition-colors"
        >
          See all
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm bg-slate-100">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${member.statusColor}`}
                    />
                    {member.status}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {member.action === "Invite" ? (
                  <UserPlus className="h-3 w-3" />
                ) : (
                  <Mail className="h-3 w-3" />
                )}
                {member.action}
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
