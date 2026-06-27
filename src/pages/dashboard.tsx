import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Verified, Check, History, Lock, Rocket, Bolt, Wifi, FileText, AlertTriangle, Sparkles, Search } from "lucide-react";
import { useCampaign } from "@/context/CampaignContext";

const TimelineItem = ({ icon: Icon, label, status }) => {
  const statusClasses = {
    done: "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
    current: "w-10 h-10 bg-white ring-4 ring-blue-600 text-blue-600 shadow-xl",
    todo: "bg-slate-200 text-slate-400",
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${statusClasses[status]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className={`font-body text-[10px] font-bold ${status === 'todo' ? 'text-slate-400' : 'text-slate-700'}`}>{label}</span>
    </div>
  )
};

export function Dashboard() {
  const navigate = useNavigate();
  const { campaigns, selectCampaign } = useCampaign();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Filter campaigns in real-time!
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 1. Calculate Dynamic Metrics
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  
  // System Reach: scale based on budget ($1k = 33,600 patients, fallback to 4.2M)
  const reachNum = totalBudget * 33600 || 4200000;
  const formatReach = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };
  const systemReach = formatReach(reachNum);

  // MLR Compliance: average compliance score of all campaigns
  const avgCompliance = campaigns.length > 0
    ? Math.round(campaigns.reduce((sum, c) => sum + c.complianceScore, 0) / campaigns.length)
    : 98;
  const mlrCompliance = `${avgCompliance}%`;

  // ROI Analysis: scale based on compliance score
  const roiVal = (avgCompliance / 8).toFixed(1);
  const roi = `${roiVal}x`;

  // Real-time Audience: scale based on active campaign budgets
  const activeBudget = campaigns.filter(c => c.status !== "Completed").reduce((sum, c) => sum + c.budget, 0);
  const audienceNum = activeBudget * 1870 || 84200;
  const formatAudience = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };
  const realTimeAudience = formatAudience(audienceNum);

  // 2. Determine Latest Active Campaign for Launch Readiness Timeline
  const activeCampaigns = campaigns.filter(c => c.status !== "Completed");
  const latestActive = activeCampaigns.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;

  const getStepStatus = (stepName: string) => {
    if (!latestActive) return "done";
    const status = latestActive.status;
    
    if (stepName === "Creative") {
      if (status === "Creative") return "current";
      return "done";
    }
    if (stepName === "Medical") {
      if (status === "Creative") return "todo";
      if (status === "Medical") return "current";
      return "done";
    }
    if (stepName === "Legal Review") {
      if (status === "Creative" || status === "Medical") return "todo";
      if (status === "Legal Review") return "current";
      return "done";
    }
    if (stepName === "Final Signoff") {
      if (status === "Final Signoff") return "current";
      if (status === "Deployment" || status === "Completed") return "done";
      return "todo";
    }
    if (stepName === "Deployment") {
      if (status === "Deployment") return "current";
      if (status === "Completed") return "done";
      return "todo";
    }
    return "todo";
  };

  const handleAccelerate = () => {
    if (latestActive) {
      selectCampaign(latestActive.id);
      navigate("/campaign-studio");
    } else {
      selectCampaign(null);
      navigate("/campaign-studio");
    }
  };

  // 3. Generate Dynamic Regulatory Tasks
  const getRegulatoryTasks = () => {
    const tasks: any[] = [];
    
    campaigns.forEach(c => {
      if (c.complianceScore < 90 && c.status !== "Completed") {
        tasks.push({
          id: `task-compliance-${c.id}`,
          campaignId: c.id,
          priority: "High Priority",
          priorityClass: "text-red-500 bg-red-500/10 border-red-500/20",
          code: `#MLR-ERR-${c.id.substring(5, 9)}`,
          title: `Resolve violations in ${c.name}`,
          detail: "Due in 4h"
        });
      }
      if (c.status === "Legal Review") {
        tasks.push({
          id: `task-review-${c.id}`,
          campaignId: c.id,
          priority: "In Review",
          priorityClass: "text-blue-600 bg-blue-500/10 border-blue-500/20",
          code: `#MLR-REV-${c.id.substring(5, 9)}`,
          title: `Legal Audit: ${c.name}`,
          detail: "Pending Signature"
        });
      }
    });
    
    return tasks;
  };

  const regulatoryTasks = getRegulatoryTasks();

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50">
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            Global Campaign Cockpit
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            Marketing Operations Hub
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <TrendingUp size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Reach</span>
                <span className="text-sm font-bold text-slate-800">{systemReach}</span>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Verified size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">MLR Compliance</span>
                <span className="text-sm font-bold text-slate-800">{mlrCompliance}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleAccelerate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-body text-xs font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{latestActive ? "Resume Campaign" : "New Campaign"}</span>
            <Bolt size={14} />
          </button>
        </div>
      </header>

      {/* Main Cockpit Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6">
        {/* Left Column (8 Columns) - Viewport-fit card stack */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          {/* Launch Readiness Timeline Card (shrink-0) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/50 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">
                  {latestActive ? `Launch Readiness: ${latestActive.name}` : "All Campaigns Deployed"}
                </h2>
                <p className="font-sans text-[11px] text-slate-500">
                  {latestActive ? `Projected go-live in 4 business days` : "Your marketing pipeline is fully synchronized with Veeva Vault."}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {latestActive ? `Active Step: 0${latestActive.step}` : "Ready"}
              </span>
            </div>
            <div className="relative py-4 px-2">
              <div className="absolute top-[35px] left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2"></div>
              <div className="absolute top-[35px] left-0 w-[65%] h-[2px] bg-blue-600 -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
              <div className="relative flex justify-between">
                <TimelineItem icon={Check} label="Creative" status={getStepStatus("Creative")} />
                <TimelineItem icon={Check} label="Medical" status={getStepStatus("Medical")} />
                <TimelineItem icon={History} label="Legal Review" status={getStepStatus("Legal Review")} />
                <TimelineItem icon={Lock} label="Final Signoff" status={getStepStatus("Final Signoff")} />
                <TimelineItem icon={Rocket} label="Deployment" status={getStepStatus("Deployment")} />
              </div>
            </div>
          </div>

          {/* Active Campaigns Table Card (flex-1 min-h-0 flex flex-col) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/50 flex flex-col flex-1 min-h-0">
            <div className="mb-4 shrink-0 flex justify-between items-center">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">Active Campaigns</h2>
                <p className="font-sans text-[10px] text-slate-400">Monitor and resume your marketing pipeline</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Compact Local Search */}
                <div className="flex items-center bg-slate-55/40 px-3 py-1 rounded-xl gap-1.5 border border-slate-200/40">
                  <Search className="h-3 w-3 text-slate-400" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none font-sans text-[10px] text-slate-800 placeholder:text-slate-400 w-24"
                  />
                </div>
                {/* Compact Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-55/40 border border-slate-200/40 px-2.5 py-1 rounded-xl font-sans text-[10px] text-slate-700 cursor-pointer outline-none"
                >
                  <option>All Statuses</option>
                  <option>Creative</option>
                  <option>Medical</option>
                  <option>Legal Review</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 bg-white pb-2">
                    <th className="pb-3">Campaign Name</th>
                    <th className="pb-3">Brand</th>
                    <th className="pb-3 text-center">Compliance</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCampaigns.map((c) => (
                    <tr key={c.id} className="text-xs text-slate-700 group hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800">{c.name}</td>
                      <td className="py-3.5 capitalize">{c.brand.replace("_", " ")}</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          c.complianceScore >= 90
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}>
                          {c.complianceScore}%
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`font-body text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          c.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : c.status === "Legal Review"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            selectCampaign(c.id);
                            navigate("/campaign-studio");
                          }}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg font-body text-[10px] font-bold transition-all cursor-pointer"
                        >
                          {c.status === "Completed" ? "View" : "Resume"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 Columns) - Viewport-fit card stack */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          {/* Regulatory Pulse Card (flex-1 min-h-0 flex flex-col) */}
          <div className="bg-slate-100/70 p-6 rounded-3xl border border-slate-200/50 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="font-display text-base font-bold text-slate-900">Regulatory Pulse</h2>
              <span className={`w-2 h-2 rounded-full ${regulatoryTasks.length > 0 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}></span>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
              {regulatoryTasks.length === 0 ? (
                <div className="p-6 bg-white/40 border border-slate-200/40 rounded-2xl text-center space-y-2 h-full flex flex-col justify-center items-center">
                  <span className="text-xs font-bold text-emerald-600">All Systems Clear</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">
                    No pending compliance violations or legal audits. Your pipeline is fully synchronized.
                  </p>
                </div>
              ) : (
                regulatoryTasks.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => {
                      selectCampaign(t.campaignId);
                      navigate("/campaign-studio");
                    }}
                    className="bg-white p-4 rounded-2xl group hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer border border-slate-200/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${t.priorityClass}`}>
                        {t.priority}
                      </span>
                      <span className="text-slate-400 font-mono text-[9px]">{t.code}</span>
                    </div>
                    <p className="font-display text-xs font-bold text-slate-850 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                      {t.title}
                    </p>
                    <span className="text-slate-500 font-body text-[9px]">{t.detail}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ROI and Audience Stats (shrink-0) */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/50">
              <span className="font-body text-[9px] text-slate-400 uppercase tracking-wider block">ROI Analysis</span>
              <span className="font-display text-3xl font-bold text-slate-900 mt-2 block">{roi}</span>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl text-white flex flex-col justify-between">
              <div className="flex justify-between items-start w-full">
                <span className="font-body text-[9px] text-white/50 uppercase tracking-wider block">Audience</span>
                <Wifi className="text-blue-400 shrink-0" size={14} />
              </div>
              <span className="font-display text-2xl font-bold mt-3 block">{realTimeAudience}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sleek AI Insights Ticker Footer (shrink-0) */}
      <footer className="shrink-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-2xl p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
            <Sparkles size={16} />
          </div>
          <div className="min-w-0 flex-1 flex items-center gap-4">
            <p className="text-xs text-slate-600 truncate flex-1">
              <strong className="text-slate-800 font-bold">Maestro AI:</strong> Shift budget to <strong className="text-slate-800 font-bold">Interactive Digital Sales Aids</strong> for a projected <strong className="text-blue-600 font-bold">22% engagement lift</strong>.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 bg-white/80 border border-slate-200/50 rounded-md text-[9px] font-bold text-slate-500">Sentiment: Positive</span>
              <span className="px-2 py-0.5 bg-white/80 border border-slate-200/50 rounded-md text-[9px] font-bold text-slate-500">Precision: 94.8%</span>
              <span className="px-2 py-0.5 bg-white/80 border border-slate-200/50 rounded-md text-[9px] font-bold text-slate-500">Risk: Low</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate("/analytics")}
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-body text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
        >
          Review Analysis
        </button>
      </footer>
    </div>
  );
}


