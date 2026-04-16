import { signOut, useSessionQuery } from "@/lib/queries/session";
import { Avatar, AvatarFallback, Button, Skeleton } from "@repo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LogOut, RefreshCw, User } from "lucide-react";

export function UserMenu() {
  const queryClient = useQueryClient();
  const { data: session, isLoading, isError, refetch } = useSessionQuery();

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

  if (isError) {
    return (
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-sm text-red-500">
          Failed to load session
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-4 border-t">
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign in
        </Link>
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
            {user.name || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <button
          type="button"
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Sign out"
          onClick={() => signOut(queryClient)}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
