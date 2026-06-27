import { useNavigate } from "react-router-dom";
import { TrendingUp, Verified, Check, History, Lock, Rocket, Bolt, Wifi, BarChart } from "lucide-react";

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
  return (
    <div className="w-full pb-12">
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
            <StatCard title="System Reach" value="4.2M" detail="Top 5% Tier" icon={TrendingUp} />
            <StatCard title="MLR Compliance" value="99.8%" detail="Audit Ready" icon={Verified} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8 px-10 -mt-10 relative z-30">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[32px] shadow-sm border border-white/20">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="font-display text-2xl text-slate-900 mb-1">Launch Readiness</h2>
                <p className="font-sans text-sm text-slate-500">Projected go-live in 4 business days</p>
              </div>
              <button 
                onClick={() => navigate("/regulatory-hub")}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-body text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Accelerate</span> <Bolt className="h-4 w-4" />
              </button>
            </div>
            <div className="relative py-8">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200/70 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-[65%] h-[2px] bg-blue-600 -translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
              <div className="relative flex justify-between">
                <TimelineItem icon={Check} label="Creative" status="done" />
                <TimelineItem icon={Check} label="Medical" status="done" />
                <TimelineItem icon={History} label="Legal Review" status="current" />
                <TimelineItem icon={Lock} label="Final Signoff" status="todo" />
                <TimelineItem icon={Rocket} label="Deployment" status="todo" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-[32px]">
              <span className="font-body text-xs text-slate-500 uppercase tracking-widest">ROI Analysis</span>
              <div className="mt-4">
                <span className="font-display text-6xl text-slate-900">12.4x</span>
              </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-[32px] text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-body text-xs text-white/50 uppercase tracking-widest">Real-time Audience</span>
                  <h3 className="font-display text-2xl mt-4">84.2k <span className="text-blue-400 text-sm">+1.2k</span></h3>
                </div>
                <Wifi className="text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-200/40 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-lg text-slate-900">Regulatory Pulse</h2>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <div className="space-y-4">
              <div className="bg-white/50 p-4 rounded-2xl group hover:bg-white transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-500 font-bold text-[10px] uppercase tracking-tighter">High Priority</span>
                  <span className="text-slate-400 font-mono text-[10px]">#MLR-881</span>
                </div>
                <p className="font-display text-base text-slate-800 leading-snug mb-3">Oncology Q4 Core Claims Matrix</p>
                <span className="text-slate-500 font-body text-xs">Due in 4h</span>
              </div>
              <div className="bg-white/30 p-4 rounded-2xl group hover:bg-white transition-all cursor-pointer">
                 <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-600 font-bold text-[10px] uppercase tracking-tighter">In Review</span>
                  <span className="text-slate-400 font-mono text-[10px]">#MLR-902</span>
                </div>
                <p className="font-display text-base text-slate-800 leading-snug mb-3">Patient Portal Localization - EMEA</p>
                <span className="text-slate-500 font-body text-xs">Pending Legal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
