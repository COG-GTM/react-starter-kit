import { useSessionQuery } from "@/lib/queries/session";
import { Avatar, AvatarFallback, Skeleton } from "@repo/ui";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
  const { data: session, isLoading, isError } = useSessionQuery();

  if (isLoading) {
    return (
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-20 mb-1.5" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !session?.user) {
    return (
      <div className="p-4 border-t">
        <a
          href="/login"
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign in
        </a>
      </div>
    );
  }

  const user = session.user;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs font-medium bg-blue-100 text-blue-600">
            {initials || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <button
          type="button"
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
