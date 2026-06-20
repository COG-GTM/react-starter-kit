import { bottomItems, dashboardItems, pageItems } from "./constants";
import { SidebarNav } from "./sidebar-nav";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "w-[220px]" : "w-0"
      } transition-all duration-300 ease-in-out bg-white border-r border-gray-100 overflow-hidden shrink-0`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center px-6">
          <span className="text-[#4880FF] font-bold text-xl italic">Dash</span>
          <span className="font-bold text-xl text-gray-800">Stack</span>
        </div>
        <SidebarNav
          items={dashboardItems}
          pageItems={pageItems}
          bottomItems={bottomItems}
        />
      </div>
    </aside>
  );
}
