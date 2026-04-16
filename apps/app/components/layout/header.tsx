import { Bell, ChevronDown, Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 text-gray-500 hover:text-gray-700"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
            6
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <span className="text-lg">🇬🇧</span>
          <span className="font-medium">English</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </div>

        <div className="flex items-center gap-2.5 pl-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            MR
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              Moni Roy
            </p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
