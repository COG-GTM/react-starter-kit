import { useSessionQuery } from "@/lib/queries/session";
import { Avatar, AvatarFallback, Button, Input } from "@repo/ui";
import { Bell, Menu, Search, User } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSessionQuery();
  const user = session?.user;
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 border-b bg-white flex items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <svg
          className="h-7 w-7 text-blue-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex items-center gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-9 h-9 w-64 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-blue-100 text-blue-600 font-medium">
            {initials || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
