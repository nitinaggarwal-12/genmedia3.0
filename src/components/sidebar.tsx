import { NavLink } from "react-router-dom";
import { 
  LayoutGrid, 
  Rocket, 
  ShieldCheck, 
  BrainCircuit, 
  Library, 
  AreaChart, 
  Users, 
  Settings,
  Gem,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navLinks = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { section: "Growth & Operations" },
  { to: "/campaigns", icon: Rocket, label: "Campaigns" },
  { to: "/campaign-studio", icon: Sparkles, label: "Campaign Studio" },
  { to: "/regulatory-hub", icon: ShieldCheck, label: "Regulatory Hub" },
  { to: "/audience-intelligence", icon: BrainCircuit, label: "Audience Intelligence" },
  { to: "/content-library", icon: Library, label: "Content Library" },
  { to: "/analytics", icon: AreaChart, label: "Analytics" },
  { section: "System" },
  { to: "/team", icon: Users, label: "Team" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-slate-50 z-50 flex flex-col border-r transition-all duration-300 ${
      collapsed ? "w-20" : "w-64"
    }`}>
      {/* Sidebar Header Logo */}
      <div className={`h-16 flex items-center justify-between px-4 mb-4 shrink-0 border-b border-slate-200/50 ${
        collapsed ? "justify-center" : ""
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Gem className="h-6 w-6 text-blue-600 shrink-0" />
          {!collapsed && (
            <span className="font-display text-base tracking-tight text-slate-900 font-bold truncate">
              Maestro
            </span>
          )}
        </div>
        {!collapsed && (
          <button 
            onClick={onToggle}
            className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Collapsed Toggle Trigger (When Collapsed) */}
      {collapsed && (
        <div className="flex justify-center mb-4 shrink-0">
          <button 
            onClick={onToggle}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-450 hover:text-slate-700 shadow-sm cursor-pointer transition-all"
            title="Expand Sidebar"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto min-h-0 pb-4">
        {navLinks.map((item, index) => 
          item.section ? (
            !collapsed ? (
              <div key={index} className="pt-4 pb-2 px-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block truncate">
                  {item.section}
                </span>
              </div>
            ) : (
              <div key={index} className="h-px bg-slate-200/60 my-3 mx-2" />
            )
          ) : (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-slate-605 hover:bg-slate-200/60 transition-all group relative ${
                  collapsed ? "justify-center p-2.5" : "px-3 py-2.5 gap-3"
                } ${
                  isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/15 hover:bg-blue-600" : ""
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="font-body text-xs font-bold truncate">
                  {item.label}
                </span>
              )}
              {/* Collapsed Tooltip Hover */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {item.label}
                </div>
              )}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
