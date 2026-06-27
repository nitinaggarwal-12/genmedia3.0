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
  <tr className="hover:bg-slate-100/50 transition-colors group">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-mono font-bold">{cohort.id}</div>
        <div>
          <p className="font-body font-bold text-sm text-slate-800">{cohort.name}</p>
          <p className="font-sans text-xs text-slate-500">{cohort.tier}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-6 text-center font-mono text-sm">{cohort.reach}</td>
    <td className="px-8 py-6">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-sm text-blue-600">{cohort.engagement}%</span>
        <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: `${cohort.engagement}%` }}></div>
        </div>
      </div>
    </td>
    <td className="px-8 py-6">
      <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 font-body font-bold text-[10px] uppercase">{cohort.affinity}</span>
    </td>
    <td className="px-8 py-6 text-right">
      <span className="font-display text-lg text-slate-900">{cohort.impact}</span>
    </td>
  </tr>
);

export function AudienceIntelligence() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100/50">
      <section className="relative px-8 pt-12 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex items-end justify-between relative z-10">
          <div className="max-w-3xl">
            <span className="font-body text-xs text-blue-600 uppercase tracking-[0.2em] font-bold mb-4 block">Intelligence Core</span>
            <h1 className="font-display text-8xl leading-[0.9] tracking-tighter text-slate-900 mb-6">
              Audience <span className="text-slate-300 italic">M01</span><br/>Architecture
            </h1>
            <p className="font-sans text-base text-slate-600 max-w-xl">
              Dynamic HCP segmentation across 42 therapeutic areas. Leveraging real-world evidence and behavioral signals to decode physician engagement patterns.
            </p>
          </div>
          <div className="flex gap-4 pb-4">
            <div className="px-6 py-3 bg-white rounded-full flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="font-body text-xs font-bold">Live Synching</span>
            </div>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-body text-xs font-bold shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-transform">
              Export Cohort
            </button>
          </div>
        </div>
      </section>
      <section className="px-8 -mt-12 mb-12">
        <div className="bg-white rounded-3xl p-1 shadow-md overflow-hidden">
          <div className="relative w-full h-[540px] rounded-[22px] overflow-hidden group bg-slate-900">
            <Globe className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 text-white/5" />
            <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-md p-6 rounded-2xl w-80 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <span className="font-body text-xs text-white/60 uppercase tracking-widest">Geo-Density</span>
                <BarChart className="text-blue-400" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-sm text-white/80">North America</span>
                    <span className="font-mono text-sm text-white">84%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[84%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-sans text-sm text-white/80">European Union</span>
                    <span className="font-mono text-sm text-white">62%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-[62%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-8 pb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-2xl text-slate-900 mb-2">Segment Granularity</h2>
            <p className="font-sans text-sm text-slate-500">Deep dive into behavioral metrics for active targeting.</p>
          </div>
          <div className="flex bg-slate-200 rounded-full p-1">
            <button className="px-6 py-2 bg-white rounded-full font-body text-xs font-bold shadow-sm">Current Month</button>
            <button className="px-6 py-2 font-body text-xs font-bold text-slate-500">Historical</button>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 font-body font-bold text-xs text-slate-500 uppercase tracking-wider">Cohort Identifier</th>
                <th className="px-8 py-6 font-body font-bold text-xs text-slate-500 uppercase tracking-wider text-center">Reach</th>
                <th className="px-8 py-6 font-body font-bold text-xs text-slate-500 uppercase tracking-wider text-center">Engagement</th>
                <th className="px-8 py-6 font-body font-bold text-xs text-slate-500 uppercase tracking-wider">Top Affinity</th>
                <th className="px-8 py-6 font-body font-bold text-xs text-slate-500 uppercase tracking-wider text-right">Potential Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {cohortData.map(cohort => <CohortRow key={cohort.id} cohort={cohort} />)}
            </tbody>
          </table>
        </div>
      </section>
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-slate-900/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-body text-xs font-bold">
          <Plus className="h-5 w-5" />
          Create Segment
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <Share />
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <Settings />
        </button>
      </div>
    </div>
  );
}
