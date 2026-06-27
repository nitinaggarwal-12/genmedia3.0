import { Bell, Search, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-xl z-40 px-8 flex items-center justify-between border-b">
      <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full w-96 gap-3 group focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
        <Search className="text-slate-400 h-5 w-5" />
        <input 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
          placeholder="Search campaigns, assets, or MLR logs..." 
          type="text" 
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="text-slate-500 hover:text-blue-600 transition-colors">
          <HelpCircle className="h-6 w-6" />
        </button>
        <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Alex Sterling</p>
            <p className="text-[11px] text-slate-500">Admin</p>
          </div>
          <img 
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 shadow-sm"
            src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=250&auto=format&fit=crop"
          />
        </div>
      </div>
    </header>
  );
}
