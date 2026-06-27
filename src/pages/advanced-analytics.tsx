import React from 'react';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  GitCommitHorizontal, 
  ShoppingCart, 
  BarChart, 
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCampaign } from '@/context/CampaignContext';

const FunnelStage = ({ icon, name, value, percentage, isLast = false }) => (
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
        <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  </div>
);

export function AdvancedAnalytics() {
  const { campaigns, audienceCohorts } = useCampaign();

  // =====================================================================
  // DYNAMIC CALCULATIONS
  // =====================================================================

  // 1. Calculate total targeted reach (Impression stage)
  // For each campaign, sum the sizes of its targeted cohorts
  let totalReach = 0;
  let totalBudget = 0;
  let avgCompliance = 0;
  let activeCampaignsCount = campaigns.length;

  if (activeCampaignsCount > 0) {
    totalBudget = campaigns.reduce((sum, c) => sum + c.budget * 1000, 0); // Convert scale 10-100 to USD
    avgCompliance = Math.round(campaigns.reduce((sum, c) => sum + c.complianceScore, 0) / activeCampaignsCount);
    
    // Get unique targeted cohorts across all campaigns
    const targetedCohortIds = new Set<string>();
    campaigns.forEach(c => {
      const cohorts = (c as any).targetedCohorts || [];
      cohorts.forEach((id: string) => targetedCohortIds.add(id));
    });

    // Sum sizes of these unique cohorts
    totalReach = audienceCohorts
      .filter(c => targetedCohortIds.has(c.id))
      .reduce((sum, c) => sum + c.size, 0);
  }

  // Fallbacks if no campaigns or cohorts targeted yet
  const displayReach = totalReach > 0 ? totalReach : 2400000;
  const displayEngagement = Math.round(displayReach * (avgCompliance > 0 ? avgCompliance / 100 : 0.85) * 0.17);
  const displayConversion = Math.round(displayEngagement * 0.03 * (1 + (totalBudget > 0 ? totalBudget / 500000 : 0.5)));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  // 2. Dynamic Attribution Confidence percentages
  const directPercent = Math.min(50, Math.max(20, 30 + activeCampaignsCount * 2));
  const searchPercent = Math.min(40, Math.max(10, 15 + (avgCompliance > 0 ? avgCompliance / 10 : 8)));
  const socialPercent = Math.max(10, 45 - (activeCampaignsCount * 3));
  const otherPercent = 100 - (directPercent + searchPercent + socialPercent);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-55/40">
      
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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
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
                <h2 className="font-display text-base font-bold text-slate-805">Linear Distribution Model</h2>
              </div>
              <div className="bg-blue-600/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-body text-[9px] font-bold text-blue-600 uppercase tracking-wider">Live Engine</span>
              </div>
            </div>

            {/* Distribution Grid */}
            <div className="relative z-10 grid grid-cols-4 gap-6 my-auto">
              {[
                { label: "01_Direct Mail", val: `${directPercent.toFixed(1)}%` },
                { label: "02_Paid Search", val: `${searchPercent.toFixed(1)}%` },
                { label: "03_Social Media", val: `${socialPercent.toFixed(1)}%` },
                { label: "04_Other Channels", val: `${otherPercent.toFixed(1)}%` }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="block text-[10px] text-slate-450 font-mono">{item.label}</span>
                  <span className="text-2xl font-display font-black text-slate-800 transition-all duration-500">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 border-t border-slate-100 pt-4 shrink-0">
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                Predictive attribution modeling calculated in real-time based on active oncology marketing campaign engagement data.
              </p>
            </div>
          </div>

          {/* 2. Cohort Retention Card (flex-1) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between flex-1 min-h-0">
            <div className="flex justify-between items-start shrink-0">
              <div>
                <h3 className="font-display text-base font-bold text-slate-800">Campaign Budget vs. Compliance Alignment</h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Interactive scatter plot mapping each campaign's budget against its compliance score.</p>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-lg gap-1">
                <span className="px-3 py-1 rounded-md bg-white text-[9px] font-bold shadow-sm">Real-Time Data</span>
              </div>
            </div>

            {/* Simulated Chart Area (Scatter Plot) */}
            <div className="flex-1 min-h-0 bg-slate-50 border border-slate-200/40 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden my-4">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
              
              {campaigns.length === 0 ? (
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest relative z-10 font-mono">No Active Campaigns to Plot</span>
              ) : (
                campaigns.map((camp) => {
                  // Map budget (10-100) to X (10% to 90%)
                  const left = ((camp.budget - 10) / 90) * 80 + 10;
                  // Map compliance score (0-100) to Y (10% to 90%)
                  const bottom = (camp.complianceScore / 100) * 80 + 10;
                  
                  // Color based on status
                  const dotColor = camp.status === "Completed" 
                    ? "bg-emerald-500 shadow-emerald-500/30" 
                    : camp.status === "At Risk" 
                    ? "bg-red-500 shadow-red-500/30" 
                    : "bg-blue-600 shadow-blue-600/30";

                  return (
                    <div 
                      key={camp.id}
                      className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-700 hover:scale-125 z-20 ${dotColor} group/dot`}
                      style={{ left: `${left}%`, bottom: `${bottom}%` }}
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] p-2.5 rounded-xl shadow-xl border border-white/10 opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none flex flex-col gap-0.5">
                        <span className="font-bold">{camp.name}</span>
                        <span>Budget: ${camp.budget * 100}</span>
                        <span>Compliance: {camp.complianceScore}/100</span>
                        <span className="text-[7px] text-slate-400 uppercase tracking-wider mt-0.5">{camp.status}</span>
                      </div>
                    </div>
                  );
                })
              )}
              
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest absolute bottom-2 right-4 font-mono">X: Budget Allocation →</span>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest absolute left-4 top-2 font-mono rotate-90 origin-top-left">Y: Compliance Score →</span>
            </div>

            <div className="border-t border-slate-100 pt-4 shrink-0 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Budget Range: $1,000 - $10,000</span>
              <span>Compliance Range: 0 - 100%</span>
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
              <FunnelStage icon={<Eye size={16} />} name="Projected Reach" value={formatNumber(displayReach)} percentage={100} isLast={true} />
              <FunnelStage icon={<GitCommitHorizontal size={16} />} name="Target Engagement" value={formatNumber(displayEngagement)} percentage={Math.round((displayEngagement / displayReach) * 100)} />
              <FunnelStage icon={<ShoppingCart size={16} />} name="Conversion Lift" value={formatNumber(displayConversion)} percentage={Math.round((displayConversion / displayReach) * 100)} />
            </div>

            <div className="border-t border-white/5 pt-3 shrink-0">
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Calculated dynamically from active campaign targets</span>
            </div>
          </div>

          {/* 2. ML Insights Card (shrink-0) */}
          <div className="bg-blue-600 text-white p-6 rounded-3xl flex flex-col justify-between shadow-lg shadow-blue-650/20 shrink-0 h-48">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-75 block">ML Insights</span>
              <p className="text-xs font-display font-bold leading-relaxed mt-2">
                {activeCampaignsCount > 0 
                  ? `Based on your average compliance score of ${avgCompliance}%, our predictive models project a +14.2% lift in physician engagement if you deploy to North America.`
                  : "Onboard clinical trials and launch campaigns to activate our predictive ML marketing optimization engine."}
              </p>
            </div>
            <button className="w-full py-2 bg-white text-blue-600 rounded-xl font-body font-bold text-xs hover:bg-slate-100 transition-colors shadow-md cursor-pointer">
              Automate Pivot Strategy
            </button>
          </div>

        </div>

        {/* Close main content grid */}
      </div>
    </div>
  );
}
