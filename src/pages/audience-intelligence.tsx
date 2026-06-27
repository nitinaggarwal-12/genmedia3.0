import React, { useState } from 'react';
import { 
  Globe, 
  BarChart, 
  Plus, 
  Share, 
  Settings, 
  Trash2, 
  X, 
  Database, 
  Check, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useCampaign } from '@/context/CampaignContext';

export function AudienceIntelligence() {
  const { audienceCohorts, addCohort, deleteCohort } = useCampaign();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [region, setRegion] = useState("North America");
  const [size, setSize] = useState(10000);
  const [engagement, setEngagement] = useState(75);

  // Calculate Geo-Density dynamically based on actual cohort sizes
  const totalPatients = audienceCohorts.reduce((sum, c) => sum + c.size, 0);
  
  const getRegionPercentage = (regName: string) => {
    if (totalPatients === 0) return 0;
    const regPatients = audienceCohorts
      .filter(c => c.region.toLowerCase() === regName.toLowerCase() || (regName === "Global" && c.region === "Global"))
      .reduce((sum, c) => sum + c.size, 0);
    return Math.round((regPatients / totalPatients) * 100);
  };

  const naPercent = getRegionPercentage("North America") || 50; // Fallbacks if empty
  const euPercent = getRegionPercentage("Europe") || 30;
  const globalPercent = getRegionPercentage("Global") || 20;

  const handleCreateCohort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addCohort({
      name,
      region,
      size: Number(size),
      engagement: Number(engagement),
      status: "Active"
    });

    // Reset Form
    setName("");
    setRegion("North America");
    setSize(10000);
    setEngagement(75);
    setShowCreateModal(false);
  };

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
            <span className="font-body text-[10px] font-bold text-slate-600">Syncing with CRM</span>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Cohort</span>
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
            <span className="font-body text-[9px] text-white/60 uppercase tracking-widest block font-bold">Geographic Distribution</span>
            <h3 className="font-display text-lg font-bold mt-2">Geo-Density Mapping</h3>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Real-world telemetry density calculated dynamically from your active clinical cohorts.
            </p>
          </div>

          {/* Geo Stats Card */}
          <div className="relative z-10 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-2xl shrink-0 mt-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-body text-[10px] text-white/65 uppercase tracking-wider font-bold">Active Regions</span>
              <BarChart size={14} className="text-blue-450" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-white/80">North America</span>
                  <span className="font-mono font-bold">{naPercent}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${naPercent}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-white/80">Europe</span>
                  <span className="font-mono font-bold">{euPercent}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 transition-all duration-500" style={{ width: `${euPercent}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-white/80">Global / Other</span>
                  <span className="font-mono font-bold">{globalPercent}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${globalPercent}%` }}></div>
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
              <button className="px-4 py-1.5 bg-white rounded-lg font-body text-[10px] font-bold shadow-sm cursor-pointer">Active Cohorts</button>
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
                    <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {audienceCohorts.map((cohort) => {
                    const id = cohort.name.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase();
                    // Mock affinity based on name
                    const affinity = cohort.name.includes("Specialist") ? "Symposia" : cohort.name.includes("Payer") ? "Formulary Briefs" : "Digital Channels";
                    // Dynamic potential impact based on size
                    const impact = `$${((cohort.size * 145) / 1000000).toFixed(1)}M`;
                    
                    return (
                      <tr key={cohort.id} className="hover:bg-slate-50/50 transition-colors group text-xs text-slate-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-mono font-bold shrink-0">
                              {id}
                            </div>
                            <div className="min-w-0">
                              <p className="font-body font-bold text-slate-800 truncate">{cohort.name}</p>
                              <p className="font-sans text-[10px] text-slate-450 mt-0.5">{cohort.region}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-medium">{cohort.size.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-blue-600 font-bold">{cohort.engagement}%</span>
                            <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: `${cohort.engagement}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-650 font-body font-bold text-[9px] uppercase border border-orange-500/10 whitespace-nowrap">
                            {affinity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-display font-bold text-slate-850 text-xs">{impact}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => deleteCohort(cohort.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Cohort"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-45 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 select-none">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-full font-body text-xs font-bold cursor-pointer hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Cohort
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
          <Share size={16} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
          <Settings size={16} />
        </button>
      </div>

      {/* ==========================================
         CREATE COHORT MODAL
         ========================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/65 max-w-sm w-full p-6 flex flex-col gap-5 animate-slide-in-top">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={18} />
                <h3 className="font-display font-bold text-sm text-slate-900">Create Audience Cohort</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCohort} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Cohort Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. GU Oncology Experts (West)"
                  className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Region</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-805 outline-none focus:border-blue-600 bg-white"
                >
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Global">Global / Multiregional</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Cohort Size (Patients)</label>
                <input 
                  type="number"
                  required
                  min={500}
                  max={500000}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Engagement Potential</label>
                  <span className="font-mono text-xs font-bold text-blue-600">{engagement}%</span>
                </div>
                <input 
                  type="range"
                  min={20}
                  max={99}
                  value={engagement}
                  onChange={(e) => setEngagement(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none mt-1"
                />
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-body text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-xs font-bold shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Create Segment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
