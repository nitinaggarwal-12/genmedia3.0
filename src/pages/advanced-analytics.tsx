import { Download, Plus, TrendingUp, TrendingDown, Eye, GitCommitHorizontal, ShoppingCart, BarChart, MoreHorizontal } from 'lucide-react';

const FunnelStage = ({ icon, name, value, percentage, color, isLast = false }) => (
  <div className={`flex items-center gap-4 ${!isLast ? 'pl-4 border-l border-white/10' : ''} flex-1 min-w-0`}>
    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/80 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-end mb-1 text-xs">
        <span className="font-bold text-white/90 truncate">{name}</span>
        <span className="font-mono text-white font-bold">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-blue-400 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  </div>
);

export function AdvancedAnalytics() {
  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50">
      
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            Intelligence Suite
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            Performance Deep-Dive
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer">
            <Download className="h-4 w-4 text-slate-500" />
            <span className="font-body text-xs font-bold text-slate-800">Export Report</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
            <BarChart className="h-4 w-4" />
            <span className="font-body text-xs font-bold">Add Widget</span>
          </button>
        </div>
      </header>

      {/* Main Content Grid (Cockpit Split Column View - Viewport-locked!) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 w-full overflow-hidden">
        
        {/* Left Column (8 Columns) - Charts & Graphs */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          
          {/* 1. Attribution Confidence Card (flex-1) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between flex-1 min-h-0 relative overflow-hidden group">
            <div className="absolute -left-10 -top-10 w-28 h-28 bg-blue-500/5 rounded-full filter blur-2xl"></div>
            
            <div className="relative z-10 flex justify-between items-start shrink-0">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attribution Confidence</p>
                <h2 className="font-display text-base font-bold text-slate-800">Linear Distribution Model</h2>
              </div>
              <div className="bg-blue-600/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-body text-[9px] font-bold text-blue-600 uppercase tracking-wider">Live Engine</span>
              </div>
            </div>

            {/* Distribution Grid */}
            <div className="relative z-10 grid grid-cols-4 gap-6 my-auto">
              {[
                { label: "01_Direct", val: "32.4%" },
                { label: "02_Paid Search", val: "18.1%" },
                { label: "03_Social", val: "41.0%" },
                { label: "04_Other", val: "8.5%" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="block text-[10px] text-slate-400 font-mono">{item.label}</span>
                  <span className="text-2xl font-display font-black text-slate-800">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 border-t border-slate-100 pt-4 shrink-0">
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                Predictive attribution modeling based on oncology marketing campaign engagement data.
              </p>
            </div>
          </div>

          {/* 2. Cohort Retention Card (flex-1) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between flex-1 min-h-0">
            <div className="flex justify-between items-start shrink-0">
              <div>
                <h3 className="font-display text-base font-bold text-slate-800">Cohort Retention vs. Acquisition Cost</h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Advanced scatter plot mapping user value lifetime (LTV) againstspend.</p>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-lg gap-1">
                <button className="px-3 py-1 rounded-md bg-white text-[9px] font-bold shadow-sm cursor-pointer">Daily</button>
                <button className="px-3 py-1 text-[9px] font-bold text-slate-500 cursor-pointer">Weekly</button>
              </div>
            </div>

            {/* Simulated Chart Area */}
            <div className="flex-1 min-h-0 bg-slate-55/40 border border-slate-200/40 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden my-4">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
              {/* Plot dots */}
              <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full shadow-md animate-pulse"></div>
              <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full shadow-md"></div>
              <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-purple-500 border-2 border-white rounded-full shadow-md"></div>
              <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-orange-500 border-2 border-white rounded-full shadow-md"></div>
              
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest relative z-10 font-mono">Retention Scatter Analytics</span>
            </div>

            <div className="border-t border-slate-100 pt-4 shrink-0 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>LTV Range: $10k - $250k</span>
              <span>Spent Range: $500 - $15,000</span>
            </div>
          </div>

        </div>

        {/* Right Column (4 Columns) - Funnel & AI Insights */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          
          {/* 1. Funnel Leakage Card (flex-1) */}
          <div className="flex-1 bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-0 text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="border-b border-white/10 pb-3 shrink-0">
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Funnel Leakage Analysis</p>
              <h3 className="font-display text-base font-bold text-white mt-1">Conversion Funnel</h3>
            </div>

            {/* Funnel Stages (flex-1) */}
            <div className="flex-1 flex flex-col justify-around my-6 pr-1 overflow-y-auto min-h-0 gap-4">
              <FunnelStage icon={<Eye size={16} />} name="Impression" value="2.4M" percentage={100} color="blue-450" isLast={true} />
              <FunnelStage icon={<GitCommitHorizontal size={16} />} name="Engagement" value="412K" percentage={17} color="blue-300" />
              <FunnelStage icon={<ShoppingCart size={16} />} name="Conversion" value="12.8K" percentage={3} color="orange-300" />
            </div>

            <div className="border-t border-white/5 pt-3 shrink-0">
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Updated 1h ago · Real-Time stream</span>
            </div>
          </div>

          {/* 2. ML Insights Card (shrink-0) */}
          <div className="bg-blue-600 text-white p-6 rounded-3xl flex flex-col justify-between shadow-lg shadow-blue-650/20 shrink-0 h-48">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-75 block">ML Insights</span>
              <p className="text-xs font-display font-bold leading-relaxed mt-2">
                Our predictive model suggests an 18% increase in ROAS if Social Spend is pivoted to Video-first strategies by Oct 12.
              </p>
            </div>
            <button className="w-full py-2 bg-white text-blue-600 rounded-xl font-body font-bold text-xs hover:bg-slate-150 transition-colors shadow-md cursor-pointer">
              Automate Pivot Strategy
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
