import { Download, Plus, TrendingUp, TrendingDown, Eye, GitCommitHorizontal, ShoppingCart, BarChart, MoreHorizontal } from 'lucide-react';

const FunnelStage = ({ icon, name, value, percentage, color, isLast = false }) => (
  <div className={`flex items-center gap-4 ${!isLast ? 'pl-4 border-l border-white/10' : ''}`}>
    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/${color}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-end mb-2">
        <span className={`text-sm font-bold text-white/${color}`}>{name}</span>
        <span className="font-mono text-white">{value}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full">
        <div className={`h-full bg-${color} w-[${percentage}%] rounded-full`}></div>
      </div>
    </div>
  </div>
);

export function AdvancedAnalytics() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100/50">
      <section className="px-8 pt-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs text-blue-600 uppercase tracking-[0.2em]">Intelligence Suite</span>
          </div>
          <h1 className="font-display text-6xl leading-[0.9] tracking-tighter text-slate-900">
            Performance<br/>
            <span className="text-slate-300 italic">Deep-Dive</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 self-start md:self-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 transition-all rounded-xl shadow-sm">
            <Download className="h-5 w-5 text-slate-500" />
            <span className="font-body text-xs font-bold text-slate-800">Export</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-transform">
            <BarChart className="h-5 w-5" />
            <span className="font-body text-xs font-bold">Add Widget</span>
          </button>
        </div>
      </section>
      <section className="px-8 grid grid-cols-12 gap-6 pb-8">
        <div className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm flex flex-col justify-between min-h-[420px] relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Attribution Confidence</p>
                <h2 className="font-display text-2xl text-slate-900">Linear Distribution Model</h2>
              </div>
              <div className="bg-blue-600/10 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-body text-xs font-bold text-blue-600">Live Engine</span>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-4 gap-8">
              <div>
                <span className="block text-xs text-slate-400 mb-2 font-mono">01_Direct</span>
                <span className="text-3xl font-display text-slate-900">32.4%</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-2 font-mono">02_Paid Search</span>
                <span className="text-3xl font-display text-slate-900">18.1%</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-2 font-mono">03_Social</span>
                <span className="text-3xl font-display text-slate-900">41.0%</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-2 font-mono">04_Other</span>
                <span className="text-3xl font-display text-slate-900">8.5%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Funnel Leakage Analysis</p>
              <div className="space-y-6">
                <FunnelStage icon={<Eye />} name="Impression" value="2.4M" percentage={100} color="blue-400" isLast={true} />
                <FunnelStage icon={<GitCommitHorizontal />} name="Engagement" value="412K" percentage={17} color="blue-300" />
                <FunnelStage icon={<ShoppingCart />} name="Conversion" value="12.8K" percentage={3} color="orange-300" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 bg-slate-100 p-10 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h3 className="font-display text-2xl text-slate-900">Cohort Retention vs. Acquisition Cost</h3>
              <p className="text-sm text-slate-500 max-w-lg">Advanced scatter plot mapping user value lifetime (LTV) against the initial marketing spend by region.</p>
            </div>
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button className="px-4 py-2 rounded-lg bg-white text-xs font-bold shadow-sm">Daily</button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-white/50">Weekly</button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-white/50">Monthly</button>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-4 bg-blue-600 text-white p-8 rounded-3xl flex flex-col justify-between shadow-2xl shadow-blue-600/30">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">ML Insights</p>
            <p className="text-xl font-display leading-tight mb-6">Our predictive model suggests an 18% increase in ROAS if Social Spend is pivoted to Video-first strategies by Oct 12.</p>
          </div>
          <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-body font-bold text-xs hover:bg-slate-100 transition-colors">
            Automate Pivot Strategy
          </button>
        </div>
      </section>
    </div>
  );
}
