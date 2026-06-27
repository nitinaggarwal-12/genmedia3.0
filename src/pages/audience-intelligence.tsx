import { Globe, BarChart, Zap, Shield, Filter, Plus, Share, Settings } from 'lucide-react';

const cohortData = [
  {
    id: 'ON',
    name: 'Precision Oncology - North',
    tier: 'Tier 1 Institutions',
    reach: '4,821',
    engagement: 72.4,
    affinity: 'Digital Symposia',
    impact: '$2.4M',
  },
  {
    id: 'CD',
    name: 'Cardiology Interventionalists',
    tier: 'Regional Medical Centers',
    reach: '2,104',
    engagement: 45.8,
    affinity: 'Email Refresh',
    impact: '$1.1M',
  },
  {
    id: 'RE',
    name: 'Rare Disease Specialists',
    tier: 'Academic Researchers',
    reach: '892',
    engagement: 89.1,
    affinity: 'Whitepapers',
    impact: '$4.8M',
  },
];

const CohortRow = ({ cohort }) => (
  <tr className="hover:bg-slate-55/40 transition-colors group text-xs text-slate-700">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-mono font-bold shrink-0">
          {cohort.id}
        </div>
        <div className="min-w-0">
          <p className="font-body font-bold text-slate-800 truncate">{cohort.name}</p>
          <p className="font-sans text-[10px] text-slate-450 mt-0.5">{cohort.tier}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-center font-mono">{cohort.reach}</td>
    <td className="px-6 py-4">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-blue-600 font-bold">{cohort.engagement}%</span>
        <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: `${cohort.engagement}%` }}></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-650 font-body font-bold text-[9px] uppercase border border-orange-500/10">
        {cohort.affinity}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <span className="font-display font-bold text-slate-850 text-sm">{cohort.impact}</span>
    </td>
  </tr>
);

export function AudienceIntelligence() {
  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50">
      
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            Intelligence Core
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            Audience Architecture
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200/30 rounded-xl flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="font-body text-[10px] font-bold text-slate-600">Live Syncing</span>
          </div>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
            Export Cohort
          </button>
        </div>
      </header>

      {/* Main Content Grid (Cockpit View) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 w-full overflow-hidden">
        
        {/* Left Column (4 Columns) - Geo-Density Globe Map */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl h-full min-h-0 text-white">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <Globe className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 text-white/5 pointer-events-none" />
          
          <div className="relative z-10 shrink-0">
            <span className="font-body text-[9px] text-white/60 uppercase tracking-widest block">Geographic Distribution</span>
            <h3 className="font-display text-lg font-bold mt-2">Geo-Density Mapping</h3>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Real-world telemetry density across active oncology trials and regional clinics.
            </p>
          </div>

          {/* Geo Stats Card */}
          <div className="relative z-10 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-2xl shrink-0 mt-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-body text-[10px] text-white/65 uppercase tracking-wider">Active Regions</span>
              <BarChart size={14} className="text-blue-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-white/80">North America</span>
                  <span className="font-mono font-bold">84%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[84%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-white/80">European Union</span>
                  <span className="font-mono font-bold">62%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 w-[62%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 Columns) - Segment Granularity Table */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          {/* Table Header Controls (shrink-0) */}
          <div className="flex items-end justify-between shrink-0 px-2">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">Segment Granularity</h2>
              <p className="font-sans text-[11px] text-slate-500 mt-0.5">Deep dive into behavioral metrics for active targeting.</p>
            </div>
            <div className="flex bg-slate-200/60 p-0.5 rounded-xl gap-1">
              <button className="px-4 py-1.5 bg-white rounded-lg font-body text-[10px] font-bold shadow-sm cursor-pointer">Current Month</button>
              <button className="px-4 py-1.5 font-body text-[10px] font-bold text-slate-500 cursor-pointer">Historical</button>
            </div>
          </div>

          {/* Table Card (flex-1) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 sticky top-0 bg-white border-b border-slate-100 z-10">
                    <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider">Cohort Identifier</th>
                    <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider text-center">Reach</th>
                    <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider text-center">Engagement</th>
                    <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider">Top Affinity</th>
                    <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider text-right">Potential Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {cohortData.map(cohort => <CohortRow key={cohort.id} cohort={cohort} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Bar (absolute cockpit footer) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-45 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 select-none">
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-full font-body text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Create Segment
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
          <Share size={16} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
