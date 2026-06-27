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
  Sparkles
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

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-50 z-50 flex flex-col border-r">
      <div className="h-16 flex items-center px-6 gap-3 mb-4">
        <Gem className="h-7 w-auto text-blue-600" />
        <span className="font-display text-lg tracking-tight text-slate-900 font-bold">Maestro</span>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navLinks.map((item, index) => 
          item.section ? (
            <div key={index} className="pt-4 pb-2 px-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{item.section}</span>
            </div>
          ) : (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-all group ${
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : ""
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-body text-xs font-bold">{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
