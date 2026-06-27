import React from 'react';
import { 
  Database, 
  Info, 
  Cpu, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Trash2,
  Terminal,
  MoreVertical
} from 'lucide-react';
import { useCampaign } from '@/context/CampaignContext';

const SettingsSection = ({ title, description, children, className = "" }) => (
  <div className={`bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm flex flex-col ${className}`}>
    <div className="mb-4 shrink-0">
      <h3 className="font-display text-base font-bold text-slate-800">{title}</h3>
      <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
    </div>
    {children}
  </div>
);

export function Settings() {
  const { settings, updateSettings, clearAuditLogs } = useCampaign();

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toTimeString().split(' ')[0];
  };

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50">
      
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            System Architecture
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            Core Infrastructure
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-55/40 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Cpu size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Gateway Status</span>
              <span className="text-xs font-bold text-slate-850 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                {settings.gatewayMode === "simulation" ? "Simulated (Bypass)" : "Operational (Live)"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid (Cockpit Split View - Viewport-locked!) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 w-full overflow-hidden">
        
        {/* Left Column (8 Columns) - Network Gateway, Integrations & Live Event Log */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          
          {/* Top row: Gateway & Integrations (flex-row or grid) */}
          <div className="grid grid-cols-2 gap-6 shrink-0 h-48">
            {/* 1. Network Gateway Status Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -left-10 -top-10 w-28 h-28 bg-blue-500/5 rounded-full filter blur-2xl"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-800">Network Gateway Status</h2>
                  <p className="text-[9px] text-slate-450 mt-0.5">Real-time throughput monitoring.</p>
                </div>
                <div className="bg-blue-600/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="font-body text-[8px] font-bold text-blue-600 uppercase tracking-wider">Live Gateway</span>
                </div>
              </div>

              {/* Simulated throughput graph */}
              <div className="bg-slate-50 border border-slate-200/20 rounded-xl p-2 flex items-center justify-center relative overflow-hidden my-2 h-14">
                <svg width="100%" height="40" className="relative z-10 opacity-70">
                  <path 
                    d="M0 20 Q 20 5, 40 25 T 80 15 T 120 30 T 160 10 T 200 20 T 240 5 T 280 25" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400">1.4 GB/s</span>
              </div>

              <div className="relative z-10 flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Latency: 12ms</span>
                <span>Uptime: 99.99%</span>
              </div>
            </div>

            {/* 2. External Integrations Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-805">External Integrations</h2>
                  <p className="text-[9px] text-slate-450 mt-0.5">Third-party service endpoints.</p>
                </div>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[85px] pr-1">
                {[
                  { name: "Veeva PromoMats Vault", key: "pk_live_...928a", status: "Connected" },
                  { name: "Data Warehouse Sink", key: "pk_live_...441b", status: "Connected" },
                  { name: "DeepL Translation", key: "pk_live_...118c", status: "Active" }
                ].map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50/75 rounded-xl border border-slate-200/30 text-[10px]">
                    <div className="min-w-0 flex-1">
                      <p className="font-body font-bold text-slate-800 truncate">{integration.name}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <code className="bg-slate-200/75 px-1.5 py-0.5 rounded font-mono text-slate-600">{integration.key}</code>
                      <span className="font-bold text-emerald-600">{integration.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. System Event Log (Console-style Terminal - flex-1!) */}
          <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-900 shadow-xl p-5 flex flex-col min-h-0 text-slate-300">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 shrink-0">
              <div className="flex items-center gap-2 text-teal-400">
                <Terminal size={14} />
                <span className="font-body text-xs font-bold uppercase tracking-wider">System Event Log Stream</span>
              </div>
              <button 
                onClick={clearAuditLogs}
                className="p-1 text-slate-500 hover:text-red-450 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Clear Logs"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {/* Terminal Console */}
            <div className="flex-1 overflow-y-auto min-h-0 font-mono text-[10px] space-y-1.5 pt-4 pr-1 selection:bg-teal-500/30 selection:text-teal-250">
              {!settings.auditLogging ? (
                <div className="h-full flex items-center justify-center text-slate-600">
                  <span>[SYSTEM]: Logging disabled. Toggle 'Deep Audit Logging' to activate.</span>
                </div>
              ) : settings.auditLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600">
                  <span>[SYSTEM]: No events recorded in session buffer.</span>
                </div>
              ) : (
                settings.auditLogs.map((log, idx) => {
                  const levelColor = log.level === "SUCCESS" 
                    ? "text-emerald-400" 
                    : log.level === "WARN" 
                    ? "text-amber-400 font-bold" 
                    : "text-blue-400";
                  
                  return (
                    <div key={idx} className="flex items-start gap-2.5 hover:bg-white/[0.02] py-0.5 px-1 rounded transition-colors leading-relaxed">
                      <span className="text-slate-600 shrink-0 select-none">[{formatTimestamp(log.timestamp)}]</span>
                      <span className={`${levelColor} shrink-0 select-none`}>[{log.level}]</span>
                      <span className="text-slate-350">{log.message}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column (4 Columns) - Storage & System Configuration Toggles */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          
          {/* 1. Storage Cluster Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between h-48 shrink-0">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="border-b border-white/10 pb-3 shrink-0">
              <div className="flex items-center gap-2 text-white/80">
                <Database size={16} />
                <span className="font-body text-[9px] uppercase tracking-widest block font-bold">System Storage</span>
              </div>
              <h3 className="font-display text-base font-bold text-white mt-1.5">Storage Cluster</h3>
            </div>

            <div className="my-auto py-2 shrink-0">
              <div className="flex justify-between items-end mb-1">
                <span className="font-display text-3xl font-bold text-white tracking-tight">84.2<span className="text-xl opacity-50">%</span></span>
                <span className="font-body text-[10px] font-bold text-white/80 pb-0.5">12.4 TB / 15 TB</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-white/80 rounded-full" style={{ width: '84.2%' }}></div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/60 border-t border-white/5 pt-2 shrink-0">
              <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="font-body text-[8px] uppercase tracking-wider">Projected limit reached in 14 days</span>
            </div>
          </div>

          {/* 2. System Configuration Toggles (flex-1!) */}
          <div className="p-6 bg-white border border-slate-200/50 rounded-3xl flex-1 min-h-0 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 shrink-0">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="font-body font-bold text-xs text-slate-800">System Controls</span>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0 space-y-5 my-4 pr-1">
              {/* Toggle 1: API Gateway Bypass (Simulation Mode) */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="font-body font-bold text-xs text-slate-850 block">API Gateway Bypass</span>
                  <span className="text-[9px] text-slate-450 leading-normal mt-0.5 block">
                    Route image and video generation to high-fidelity mocks.
                  </span>
                </div>
                <button 
                  id="toggle-api-gateway"
                  onClick={() => updateSettings({ 
                    gatewayMode: settings.gatewayMode === "simulation" ? "live" : "simulation" 
                  })}
                  className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
                >
                  {settings.gatewayMode === "simulation" ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
              </div>

              {/* Toggle 2: Strict MLR Gatekeeping */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="font-body font-bold text-xs text-slate-850 block">Strict MLR Gatekeeping</span>
                  <span className="text-[9px] text-slate-450 leading-normal mt-0.5 block">
                    Prevent submission if compliance score is below 90.
                  </span>
                </div>
                <button 
                  id="toggle-strict-mlr"
                  onClick={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })}
                  className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
                >
                  {settings.maintenanceMode ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
              </div>

              {/* Toggle 3: Deep Audit Logging */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="font-body font-bold text-xs text-slate-850 block">Deep Audit Logging</span>
                  <span className="text-[9px] text-slate-450 leading-normal mt-0.5 block">
                    Generate real-time system event logs for auditing.
                  </span>
                </div>
                <button 
                  id="toggle-deep-audit"
                  onClick={() => updateSettings({ auditLogging: !settings.auditLogging })}
                  className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
                >
                  {settings.auditLogging ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 shrink-0">
              <span className="text-[9px] text-slate-400 font-medium">Configurations sync instantly across all edge modules.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
