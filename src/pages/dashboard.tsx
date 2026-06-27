import { useNavigate } from "react-router-dom";
import { TrendingUp, Verified, Check, History, Lock, Rocket, Bolt, Wifi, FileText, AlertTriangle } from "lucide-react";
import { useCampaign } from "@/context/CampaignContext";

const StatCard = ({ title, value, detail, icon: Icon }) => (
  <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-xl shadow-blue-600/5 flex flex-col min-w-[200px]">
    <span className="font-body text-xs text-slate-500 uppercase tracking-wider mb-8">{title}</span>
    <span className="font-display text-5xl text-slate-900 leading-none mb-2">{value}</span>
    <div className="flex items-center gap-2 text-blue-600">
      <Icon className="h-4 w-4" />
      <span className="font-body text-xs font-bold">{detail}</span>
    </div>
  </div>
);

const TimelineItem = ({ icon: Icon, label, status }) => {
  const statusClasses = {
    done: "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
    current: "w-12 h-12 bg-white ring-4 ring-blue-600 text-blue-600 shadow-xl",
    todo: "bg-slate-200 text-slate-400",
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusClasses[status]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className={`font-body text-xs font-bold ${status === 'todo' ? 'text-slate-400' : 'text-slate-800'}`}>{label}</span>
    </div>
  )
};

export function Dashboard() {
  const navigate = useNavigate();
  const { campaigns, selectCampaign } = useCampaign();

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
  // Sort by updatedAt descending to get the most recently edited active draft
  const latestActive = activeCampaigns.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;

  const getStepStatus = (stepName: string) => {
    if (!latestActive) return "done"; // If all completed, show all as done
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
      // Clear draft to start fresh
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
    <div className="w-full pb-12">
      {/* Hero Section */}
      <section className="relative w-full h-[480px] flex items-end overflow-hidden -mt-16">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-100 via-slate-100/40 to-transparent"></div>
        <div className="relative z-20 w-full px-10 pb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-600/10 backdrop-blur-md rounded-full text-blue-600 font-body text-[10px] uppercase tracking-widest font-bold">Global Operations</span>
              <span className="text-slate-600/40 font-mono text-[11px]">ID: MS-7702-X</span>
            </div>
            <h1 className="font-display text-[64px] leading-[1.1] tracking-tighter text-slate-900 mb-6">
              Campaign <br/>Velocity <span className="text-blue-600">+12.4%</span>
            </h1>
            <p className="font-sans text-base text-slate-600 max-w-md">
              Orchestrating high-scale pharmaceutical marketing with automated MLR compliance and predictive audience intelligence.
            </p>
          </div>
          <div className="flex gap-4 mb-2">
            <StatCard title="System Reach" value={systemReach} detail="Top 5% Tier" icon={TrendingUp} />
            <StatCard title="MLR Compliance" value={mlrCompliance} detail="Audit Ready" icon={Verified} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8 px-10 -mt-10 relative z-30">
        {/* Left Area (8 Columns) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Launch Readiness Card */}
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[32px] shadow-sm border border-white/20">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="font-display text-2xl text-slate-900 mb-1">
                  {latestActive ? `Launch Readiness: ${latestActive.name}` : "All Campaigns Deployed"}
                </h2>
                <p className="font-sans text-sm text-slate-500">
                  {latestActive ? `Projected go-live in 4 business days` : "Your marketing pipeline is fully synchronized with Veeva Vault."}
                </p>
              </div>
              <button 
                onClick={handleAccelerate}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-body text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>{latestActive ? "Accelerate" : "New Campaign"}</span> <Bolt className="h-4 w-4" />
              </button>
            </div>
            <div className="relative py-8">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200/70 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-[65%] h-[2px] bg-blue-600 -translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
              <div className="relative flex justify-between">
                <TimelineItem icon={Check} label="Creative" status={getStepStatus("Creative")} />
                <TimelineItem icon={Check} label="Medical" status={getStepStatus("Medical")} />
                <TimelineItem icon={History} label="Legal Review" status={getStepStatus("Legal Review")} />
                <TimelineItem icon={Lock} label="Final Signoff" status={getStepStatus("Final Signoff")} />
                <TimelineItem icon={Rocket} label="Deployment" status={getStepStatus("Deployment")} />
              </div>
            </div>
          </div>

          {/* Active Campaigns Table Card */}
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[32px] shadow-sm border border-white/20 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-xl text-slate-900 mb-1">Active Campaigns</h2>
                <p className="font-sans text-xs text-slate-500">Monitor and resume your marketing pipeline</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Campaign Name</th>
                    <th className="pb-3">Brand</th>
                    <th className="pb-3 text-center">Compliance</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="text-xs text-slate-700 group hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 font-bold text-slate-800">{c.name}</td>
                      <td className="py-4 capitalize">{c.brand.replace("_", " ")}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          c.complianceScore >= 90
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}>
                          {c.complianceScore}%
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="font-body text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => {
                            selectCampaign(c.id);
                            navigate("/campaign-studio");
                          }}
                          className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl font-body text-[10px] font-bold transition-all"
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

          {/* ROI and Audience Stats */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-[32px]">
              <span className="font-body text-xs text-slate-500 uppercase tracking-widest">ROI Analysis</span>
              <div className="mt-4">
                <span className="font-display text-6xl text-slate-900">{roi}</span>
              </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-[32px] text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-body text-xs text-white/50 uppercase tracking-widest">Real-time Audience</span>
                  <h3 className="font-display text-2xl mt-4">{realTimeAudience}</h3>
                </div>
                <Wifi className="text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 Columns) - Regulatory Pulse */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-200/40 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-lg text-slate-900">Regulatory Pulse</h2>
              <span className={`w-2 h-2 rounded-full ${regulatoryTasks.length > 0 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}></span>
            </div>
            <div className="space-y-4">
              {regulatoryTasks.length === 0 ? (
                <div className="p-6 bg-white/40 border border-slate-200/40 rounded-2xl text-center space-y-2">
                  <span className="text-xs font-bold text-emerald-600">All Systems Clear</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
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
                    className="bg-white/50 p-4 rounded-2xl group hover:bg-white transition-all cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${t.priorityClass}`}>
                        {t.priority}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{t.code}</span>
                    </div>
                    <p className="font-display text-sm font-bold text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                      {t.title}
                    </p>
                    <span className="text-slate-500 font-body text-[10px]">{t.detail}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Maestro Intelligence Banner */}
      <section className="mt-12 px-10">
        <div className="bg-gradient-to-r from-blue-200 to-green-200 rounded-[40px] p-1">
          <div className="bg-slate-50/90 backdrop-blur-xl rounded-[39px] p-12 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
              <h2 className="font-display text-2xl text-slate-900">Maestro Intelligence</h2>
              <p className="text-base text-slate-600 mt-4">
                Predictive modeling suggests shifting budget to <strong className="text-slate-800">Interactive Digital Sales Aids</strong> for a projected 22% lift in physician engagement.
              </p>
              <button 
                onClick={() => navigate("/analytics")}
                className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-full font-body text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Review Analysis
              </button>
            </div>
            <div className="lg:w-2/3 grid grid-cols-3 gap-6 w-full">
              <div className="bg-white p-6 rounded-3xl">
                <span className="font-body text-xs text-slate-500 block mb-4">Sentiment</span>
                <span className="font-display text-2xl text-slate-900">Positive</span>
              </div>
              <div className="bg-white p-6 rounded-3xl">
                <span className="font-body text-xs text-slate-500 block mb-4">Precision</span>
                <span className="font-display text-2xl text-slate-900">94.8%</span>
              </div>
              <div className="bg-white p-6 rounded-3xl">
                <span className="font-body text-xs text-slate-500 block mb-4">Risk Factor</span>
                <span className="font-display text-2xl text-slate-900">Low</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

