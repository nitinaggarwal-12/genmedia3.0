import { Plus, MoreVertical, Database, Info, Activity, ShieldCheck, Cpu, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

const SettingsSection = ({ title, description, children, className = "" }) => (
  <div className={`bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm flex flex-col ${className}`}>
    <div className="mb-5 shrink-0">
      <h3 className="font-display text-base font-bold text-slate-800">{title}</h3>
      <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
    </div>
    {children}
  </div>
);

export function Settings() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [strictMlr, setStrictMlr] = useState(true);
  const [autoVeeva, setAutoVeeva] = useState(false);

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
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Cpu size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Gateway Status</span>
              <span className="text-xs font-bold text-slate-850 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Operational
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid (Cockpit Split View - Viewport-locked!) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 w-full overflow-hidden">
        
        {/* Left Column (8 Columns) - Network Gateway & Integrations */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          
          {/* 1. Network Gateway Status Card (flex-1) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between flex-1 min-h-0 relative overflow-hidden group">
            <div className="absolute -left-10 -top-10 w-28 h-28 bg-blue-500/5 rounded-full filter blur-2xl"></div>
            
            <div className="relative z-10 flex justify-between items-start shrink-0">
              <div>
                <h2 className="font-display text-base font-bold text-slate-850">Network Gateway Status</h2>
                <p className="text-[10px] text-slate-450 mt-0.5">Real-time throughput monitoring across global edge nodes.</p>
              </div>
              <div className="bg-blue-600/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-body text-[9px] font-bold text-blue-600 uppercase tracking-wider">Live Gateway</span>
              </div>
            </div>

            {/* Simulated throughput graph */}
            <div className="flex-1 min-h-0 bg-slate-55/40 border border-slate-200/30 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden my-4">
              <div className="absolute inset-0 bg-grid-slate-100/80"></div>
              <svg width="100%" height="80" className="relative z-10 opacity-70">
                <path 
                  d="M0 40 Q 40 10, 80 50 T 160 30 T 240 60 T 320 20 T 400 40 T 480 10 T 560 50" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute bottom-2 right-3 text-[8px] font-mono text-slate-400">Throughput: 1.4 GB/s</span>
            </div>

            <div className="relative z-10 border-t border-slate-100 pt-4 shrink-0 flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Latency: 12ms</span>
              <span>Uptime: 99.99%</span>
            </div>
          </div>

          {/* 2. External Integrations Card (flex-1) */}
          <SettingsSection 
            title="External Integrations" 
            description="Connect third-party endpoints and manage secret keys."
            className="flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
              {[
                { name: "Veeva PromoMats Vault", type: "Asset Sync API", key: "pk_live_************928a", status: "Connected" },
                { name: "Data Warehouse Sink", type: "Analytics Pipeline", key: "pk_live_************441b", status: "Connected" },
                { name: "DeepL Translation Gateway", type: "Localization Service", key: "pk_live_************118c", status: "Active" }
              ].map((integration, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/75 rounded-2xl border border-slate-200/30">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-body font-bold text-xs text-slate-800 truncate">{integration.name}</p>
                    <p className="font-sans text-[10px] text-slate-450 mt-0.5">{integration.type}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <code className="bg-slate-200/75 px-2.5 py-0.5 rounded text-[10px] font-mono text-slate-600">{integration.key}</code>
                    <span className="text-[10px] font-bold text-emerald-600">{integration.status}</span>
                    <MoreVertical className="text-slate-400 cursor-pointer hover:text-slate-800" size={16} />
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>

        </div>

        {/* Right Column (4 Columns) - Storage & System Configuration Toggles */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          
          {/* 1. Storage Cluster Card (flex-1) */}
          <div className="flex-1 bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-0">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="border-b border-white/10 pb-3 shrink-0">
              <div className="flex items-center gap-2 text-white/80">
                <Database size={16} />
                <span className="font-body text-[9px] uppercase tracking-widest block">System Storage</span>
              </div>
              <h3 className="font-display text-base font-bold text-white mt-1.5">Storage Cluster</h3>
            </div>

            <div className="my-auto py-4 shrink-0">
              <div className="flex justify-between items-end mb-2">
                <span className="font-display text-4xl font-bold text-white tracking-tight">84.2<span className="text-xl opacity-50">%</span></span>
                <span className="font-body text-[10px] font-bold text-white/80 pb-1">12.4 TB / 15 TB</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-white/80 rounded-full" style={{ width: '84.2%' }}></div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/60 border-t border-white/5 pt-3 shrink-0">
              <Info className="h-3.5 w-3.5 text-blue-450 shrink-0" />
              <span className="font-body text-[8px] uppercase tracking-wider">Projected limit reached in 14 days</span>
            </div>
          </div>

          {/* 2. System Configuration Toggles (shrink-0) */}
          <div className="p-6 bg-white border border-slate-200/50 rounded-3xl shrink-0 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="font-body font-bold text-xs text-slate-800">System Controls</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Enable AI Copilot", desc: "Real-time compliance checks as you type", state: aiEnabled, toggle: () => setAiEnabled(!aiEnabled) },
                { label: "Strict MLR Gatekeeping", desc: "Block Veeva sync if score is < 90", state: strictMlr, toggle: () => setStrictMlr(!strictMlr) },
                { label: "Auto-Sync to Veeva Vault", desc: "Instant upload on final approval", state: autoVeeva, toggle: () => setAutoVeeva(!autoVeeva) }
              ].map((toggle, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="font-body font-bold text-xs text-slate-800 block">{toggle.label}</span>
                    <span className="text-[9px] text-slate-450 leading-normal mt-0.5 block">{toggle.desc}</span>
                  </div>
                  <button 
                    onClick={toggle.toggle}
                    className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
                  >
                    {toggle.state ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
