import { useState, useRef, useEffect } from "react";
import { Bell, Search, HelpCircle, X, Check, AlertTriangle, Info, Sparkles } from "lucide-react";
import { useCampaign } from "@/context/CampaignContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const navigate = useNavigate();
  const { notifications, clearNotifications, markNotificationsAsRead } = useCampaign();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    if (!dropdownOpen) {
      markNotificationsAsRead(); // Mark all as read when opening
    }
    setDropdownOpen(!dropdownOpen);
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-xl z-40 px-8 flex items-center justify-between border-b transition-all duration-300 ${
      sidebarCollapsed ? "left-20" : "left-64"
    }`}>
      {/* Search Input */}
      <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full w-96 gap-3 group focus-within:ring-2 focus-within:ring-blue-600/10 transition-all">
        <Search className="text-slate-400 h-4 w-4" />
        <input 
          className="bg-transparent border-none outline-none text-xs w-full placeholder:text-slate-400/80 text-slate-800"
          placeholder="Search campaigns, assets, or MLR logs..." 
          type="text" 
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5 relative">
        <button className="text-slate-450 hover:text-blue-600 transition-colors cursor-pointer">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications Trigger */}
        <button 
          onClick={handleToggleDropdown}
          className={`relative p-1.5 rounded-xl hover:bg-slate-100 text-slate-450 hover:text-blue-600 transition-all cursor-pointer ${
            dropdownOpen ? "bg-slate-100 text-blue-650" : ""
          }`}
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-550 text-white font-mono text-[8px] font-bold rounded-full flex items-center justify-center border border-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {dropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute top-12 right-12 w-80 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/60 p-4 z-50 flex flex-col gap-3 animate-slide-in-top select-none"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 shrink-0">
              <span className="font-display font-bold text-xs text-slate-800">Notifications</span>
              {notifications.length > 0 && (
                <button 
                  onClick={clearNotifications}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Scrollable Notifications List */}
            <div className="flex-1 overflow-y-auto max-h-[280px] min-h-0 space-y-2.5 pr-1">
              {notifications.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Check size={18} />
                  </div>
                  <div>
                    <p className="font-body font-bold text-xs text-slate-800">All caught up!</p>
                    <p className="font-sans text-[10px] text-slate-400 mt-0.5">No new system alerts.</p>
                  </div>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.type === "success" ? CheckCircle2 : n.type === "warning" ? AlertTriangle : Info;
                  const iconColor = n.type === "success" ? "text-emerald-500" : n.type === "warning" ? "text-amber-500" : "text-blue-500";
                  const bgColor = n.type === "success" ? "bg-emerald-50/50" : n.type === "warning" ? "bg-amber-50/50" : "bg-blue-50/50";
                  
                  return (
                    <div 
                      key={n.id}
                      className={`p-3 rounded-2xl border border-slate-200/30 flex items-start gap-3 transition-all ${bgColor}`}
                    >
                      <div className={`p-1.5 rounded-lg bg-white shadow-sm shrink-0 ${iconColor}`}>
                        {n.type === "success" ? <Check size={12} /> : n.type === "warning" ? <AlertTriangle size={12} /> : <Info size={12} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-body font-bold text-xs text-slate-800 truncate block">{n.title}</span>
                          <span className="font-mono text-[8px] text-slate-400 shrink-0">{formatTimestamp(n.timestamp)}</span>
                        </div>
                        <p className="font-sans text-[10px] text-slate-500 leading-normal mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Alex Sterling</p>
            <p className="text-[10px] text-slate-500">MLR Lead</p>
          </div>
          <img 
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 shadow-sm cursor-pointer"
            src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=250&auto=format&fit=crop"
          />
        </div>
      </div>
    </header>
  );
}
