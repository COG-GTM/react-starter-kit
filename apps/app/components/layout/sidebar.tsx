import { Zap } from "lucide-react";
import { sidebarItems } from "./constants";
import { SidebarNav } from "./sidebar-nav";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0"
      } transition-all duration-300 ease-in-out bg-slate-800 overflow-hidden flex-shrink-0`}
    >
      <div className="h-full flex flex-col">
        <div className="h-14 flex items-center px-4 gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          <h2 className="font-semibold text-lg text-white">Volt Dashboard</h2>
        </div>
        <SidebarNav items={sidebarItems} />
      </div>
    </aside>
  );
}
