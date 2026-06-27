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
  ChevronRight as ChevronRightIcon 
} from "lucide-react";

const campaignData = [
  {
    id: "CMP-9021-X",
    name: "Quantum Leap Q4",
    region: "North America",
    budget: 1240000,
    progress: 75,
    risk: "Low Risk",
    riskColor: "blue",
    status: "Active",
    statusColor: "blue",
  },
  {
    id: "CMP-4482-Y",
    name: "Project Solaris EMEA",
    region: "Europe",
    budget: 890000,
    progress: 50,
    risk: "High Compliance",
    riskColor: "red",
    status: "MLR Review",
    statusColor: "orange",
  },
  {
    id: "CMP-1109-Z",
    name: "Neo-Gen Branding",
    region: "Global",
    budget: 2450000,
    progress: 66,
    risk: "Low Risk",
    riskColor: "blue",
    status: "Active",
    statusColor: "blue",
  },
];

const CampaignRow = ({ campaign }) => {
  const navigate = useNavigate();
  return (
    <tr className="group hover:bg-slate-100/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="font-display text-base text-slate-800 group-hover:text-blue-600 transition-colors">{campaign.name}</span>
          <span className="font-sans text-xs text-slate-500">{campaign.id}</span>
        </div>
      </td>
      <td className="px-6 py-5 font-sans text-sm text-slate-700">{campaign.region}</td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <span className="font-body text-sm font-bold text-slate-800">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(campaign.budget)}
          </span>
          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${campaign.progress}%` }}></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 bg-${campaign.riskColor}-600/10 text-${campaign.riskColor}-600 text-[11px] font-body font-bold rounded-full`}>
          {campaign.risk}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-${campaign.statusColor}-600 ${campaign.status === 'Active' ? 'animate-pulse' : ''}`}></span>
          <span className="font-body text-sm font-bold text-slate-800">{campaign.status}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="Quick Edit">
            <Edit className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="Duplicate">
            <Copy className="h-5 w-5" />
          </button>
          <button 
            onClick={() => navigate("/analytics")}
            className="p-2 hover:bg-slate-200 rounded-lg text-blue-600 transition-colors" 
            title="Analytics"
          >
            <BarChart2 className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export function Campaigns() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100/50">
      <div className="px-8 pt-12 pb-6">
        <div className="flex items-end justify-between mb-12">
          <div className="relative">
            <span className="absolute -top-10 -left-6 font-display text-[120px] text-blue-600/5 select-none pointer-events-none">01</span>
            <h1 className="font-display text-4xl text-slate-900 tracking-tighter">Campaign <span className="text-blue-600 italic">Intelligence</span></h1>
            <p className="font-sans text-sm text-slate-500 max-w-md mt-2">
              Manage high-velocity commercial assets with real-time MLR compliance monitoring and budget orchestration.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-body text-xs font-bold rounded-full hover:bg-slate-50 transition-all">
              <FileDown className="h-5 w-5" />
              Export Report
            </button>
            <button 
              onClick={() => navigate("/campaign-studio")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-body text-xs font-bold rounded-full shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="h-5 w-5" />
              New Campaign
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-9 flex flex-col gap-6">
            <div className="flex items-center justify-between bg-slate-100 p-2 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white shadow-sm px-4 py-2 rounded-xl gap-3">
                  <Filter className="h-5 w-5 text-slate-400" />
                  <span className="font-body font-bold text-sm text-slate-600">Filters:</span>
                  <div className="h-4 w-[1px] bg-slate-200/70 mx-2"></div>
                  <select className="bg-transparent border-none outline-none font-sans text-sm text-slate-800 cursor-pointer">
                    <option>All Regions</option>
                    <option>North America</option>
                    <option>EMEA</option>
                    <option>APAC</option>
                  </select>
                  <select className="bg-transparent border-none outline-none font-sans text-sm text-slate-800 cursor-pointer">
                    <option>Active Status</option>
                    <option>Draft</option>
                    <option>In Review</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4">
                <span className="font-body text-xs text-slate-400 uppercase tracking-widest">324 Records found</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-5 font-body font-bold text-slate-400 text-[11px] uppercase tracking-widest">Campaign Identifier</th>
                    <th className="px-6 py-5 font-body font-bold text-slate-400 text-[11px] uppercase tracking-widest">Region</th>
                    <th className="px-6 py-5 font-body font-bold text-slate-400 text-[11px] uppercase tracking-widest">Budget Allocation</th>
                    <th className="px-6 py-5 font-body font-bold text-slate-400 text-[11px] uppercase tracking-widest">Risk Index</th>
                    <th className="px-6 py-5 font-body font-bold text-slate-400 text-[11px] uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 font-body font-bold text-slate-400 text-[11px] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {campaignData.map(campaign => <CampaignRow key={campaign.id} campaign={campaign} />)}
                </tbody>
              </table>
              <div className="px-6 py-4 flex items-center justify-between bg-slate-50/20">
                <span className="font-sans text-sm text-slate-500">Showing 1-3 of 324</span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors font-body font-bold px-4 bg-blue-600 text-white">1</button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors font-body font-bold px-4">2</button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors font-body font-bold px-4">3</button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 flex flex-col gap-8">
            <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white">
              <div className="relative z-10 flex flex-col gap-6">
                <div>
                  <span className="font-body text-xs uppercase tracking-widest text-blue-300/70">Global Utilization</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl text-blue-300">84.2</span>
                    <span className="font-display text-2xl text-blue-300/60">%</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-300 text-slate-900 font-body text-xs font-bold rounded-xl hover:bg-white transition-colors">
                  View Insights
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-slate-900">Featured</h3>
                <button className="text-blue-600 font-body text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-body font-bold text-sm text-slate-800 truncate">Velocity Sprint B</span>
                    <span className="font-sans text-xs text-slate-500">Updated 2h ago</span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <Bolt className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-body font-bold text-sm text-slate-800 truncate">Alpha Growth Lab</span>
                    <span className="font-sans text-xs text-slate-500">Updated 5h ago</span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
                <span className="font-body font-bold text-sm text-slate-800">MLR Compliance</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-sans">Approved Assets</span>
                  <span className="text-slate-800 font-body font-bold">142</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-sans">Awaiting Legal</span>
                  <span className="text-slate-800 font-body font-bold">12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-sans">Avg. Cycle Time</span>
                  <span className="text-slate-800 font-body font-bold">4.2 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
