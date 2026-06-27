import { useNavigate } from "react-router-dom";
import { 
  FileDown, 
  Plus, 
  Filter, 
  Edit, 
  Copy, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight, 
  Rocket, 
  Bolt, 
  ShieldCheck, 
  Trash2,
  ChevronRight as ChevronRightIcon 
} from "lucide-react";
import { useCampaign } from "@/context/CampaignContext";

const CampaignRow = ({ campaign }) => {
  const navigate = useNavigate();
  const { selectCampaign, deleteCampaign } = useCampaign();

  // Map budget to enterprise scale ($1k = $10,000, e.g. 45 = $450,000)
  const formattedBudget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(campaign.budget * 10000);
  
  // Progress = step * 20%
  const progress = campaign.step * 20;

  // Compliance Risk mapping
  let risk = "Low Risk";
  let riskClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (campaign.complianceScore < 90) {
    risk = "High Risk";
    riskClass = "bg-red-500/10 text-red-600 border-red-500/20";
  } else if (campaign.complianceScore < 95) {
    risk = "Medium Risk";
    riskClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";
  }

  // Status Color mapping
  const statusColors = {
    "Completed": "bg-emerald-500",
    "Legal Review": "bg-amber-500",
    "Medical": "bg-blue-500",
    "Creative": "bg-purple-500",
    "Final Signoff": "bg-indigo-500",
    "Deployment": "bg-blue-600"
  };
  const statusColorClass = statusColors[campaign.status] || "bg-slate-400";

  return (
    <tr className="group hover:bg-slate-50/40 transition-colors text-xs text-slate-700">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-display font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{campaign.name}</span>
          <span className="font-mono text-[9px] text-slate-450 mt-0.5">{campaign.id}</span>
        </div>
      </td>
      <td className="px-6 py-4 capitalize">{campaign.brand.replace("_", " ")}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-body font-bold text-slate-800">
            {formattedBudget}
          </span>
          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-0.5 border text-[9px] font-body font-bold rounded-full ${riskClass}`}>
          {risk}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${statusColorClass} ${campaign.status !== 'Completed' ? 'animate-pulse' : ''}`}></span>
          <span className="font-body font-bold text-slate-800">{campaign.status}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => {
              selectCampaign(campaign.id);
              navigate("/campaign-studio");
            }}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer" 
            title={campaign.status === "Completed" ? "View" : "Resume Draft"}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => deleteCampaign(campaign.id)}
            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer" 
            title="Delete Campaign"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export function Campaigns() {
  const navigate = useNavigate();
  const { campaigns, selectCampaign, addCampaign } = useCampaign();

  const handleCreateNew = () => {
    selectCampaign(null); // Clear active draft
    navigate("/campaign-studio");
  };

  // Calculate MLR compliance stats for the sidebar
  const totalCampaigns = campaigns.length;
  const approvedAssets = campaigns.filter(c => c.status === "Completed").length;
  const awaitingLegal = campaigns.filter(c => c.status === "Legal Review").length;
  const avgCompliance = totalCampaigns > 0
    ? Math.round(campaigns.reduce((sum, c) => sum + c.complianceScore, 0) / totalCampaigns)
    : 98;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50">
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            Campaign Portfolio
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            Campaign Intelligence
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-body text-xs font-bold rounded-xl transition-all cursor-pointer">
            <FileDown className="h-4 w-4" />
            Export Report
          </button>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-body text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 w-full overflow-hidden">
        {/* Left Column (9 Columns) - Table list */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 h-full min-h-0">
          {/* Filters Row (shrink-0) */}
          <div className="flex items-center justify-between bg-slate-100 p-2 rounded-2xl shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white shadow-sm px-4 py-2 rounded-xl gap-3">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="font-body font-bold text-xs text-slate-600">Filters:</span>
                <div className="h-4 w-[1px] bg-slate-200/70 mx-2"></div>
                <select className="bg-transparent border-none outline-none font-sans text-xs text-slate-850 cursor-pointer">
                  <option>All Brands</option>
                  <option>Product A (Zygardia)</option>
                  <option>Product B</option>
                </select>
                <select className="bg-transparent border-none outline-none font-sans text-xs text-slate-850 cursor-pointer">
                  <option>All Statuses</option>
                  <option>Creative</option>
                  <option>Medical</option>
                  <option>Legal Review</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <span className="font-body text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                {totalCampaigns} Record{totalCampaigns !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>

          {/* Table Card (flex-1 min-h-0) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 sticky top-0 bg-white border-b border-slate-100 z-10">
                    <th className="px-6 py-4 font-body font-bold text-slate-400 text-[9px] uppercase tracking-wider">Campaign Identifier</th>
                    <th className="px-6 py-4 font-body font-bold text-slate-400 text-[9px] uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-4 font-body font-bold text-slate-400 text-[9px] uppercase tracking-wider">Budget Allocation</th>
                    <th className="px-6 py-4 font-body font-bold text-slate-400 text-[9px] uppercase tracking-wider">Risk Index</th>
                    <th className="px-6 py-4 font-body font-bold text-slate-400 text-[9px] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-body font-bold text-slate-400 text-[9px] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {campaigns.map(campaign => <CampaignRow key={campaign.id} campaign={campaign} />)}
                </tbody>
              </table>
            </div>
            {/* Pagination Footer (shrink-0) */}
            <div className="px-6 py-3 flex items-center justify-between bg-slate-50/30 border-t border-slate-100 shrink-0">
              <span className="font-sans text-xs text-slate-500">Showing 1-{totalCampaigns} of {totalCampaigns}</span>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                  <ChevronLeft className="h-4 w-4 text-slate-500" />
                </button>
                <button className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors font-body font-bold text-xs bg-blue-600 text-white">1</button>
                <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 Columns) - Side stats */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full min-h-0">
          {/* Global Utilization Card */}
          <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 text-white shrink-0">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-5">
              <div>
                <span className="font-body text-[9px] uppercase tracking-widest text-blue-300/70 block">Average Compliance</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-display text-4xl font-bold text-blue-300">{avgCompliance}</span>
                  <span className="font-display text-lg text-blue-300/60">%</span>
                </div>
              </div>
              <button 
                onClick={() => navigate("/analytics")}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-body text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
              >
                View Analytics
              </button>
            </div>
          </div>

          {/* Featured/Sprints (flex-1 min-h-0) */}
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <h3 className="font-display text-base font-bold text-slate-900 shrink-0">Featured Workspace</h3>
            <div className="space-y-3 flex-1 overflow-y-auto min-h-0 pr-1">
              <div className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-200/50 hover:shadow-sm transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-bold text-xs text-slate-800 truncate">Velocity Sprint B</span>
                  <span className="font-sans text-[10px] text-slate-450 mt-0.5">Updated 2h ago</span>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
              <div className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-200/50 hover:shadow-sm transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Bolt className="h-5 w-5" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-bold text-xs text-slate-800 truncate">Alpha Growth Lab</span>
                  <span className="font-sans text-[10px] text-slate-450 mt-0.5">Updated 5h ago</span>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* MLR Quick Stats Card (shrink-0) */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/50 shrink-0 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="font-body font-bold text-xs text-slate-800">MLR Quick Stats</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-sans">Approved Campaigns</span>
                <span className="text-slate-800 font-body font-bold">{approvedAssets}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-sans">Awaiting Audit</span>
                <span className="text-slate-800 font-body font-bold">{awaitingLegal}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-sans">Avg. Score</span>
                <span className="text-slate-855 font-body font-bold">{avgCompliance}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
