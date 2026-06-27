import React, { useState } from 'react';
import { 
  Filter, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Shield, 
  X, 
  ArrowRight,
  User
} from 'lucide-react';
import { useCampaign } from '@/context/CampaignContext';

export function TeamGovernance() {
  const { teamMembers, addTeamMember, deleteTeamMember } = useCampaign();
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Regulatory" | "Medical" | "Legal" | "Brand Manager">("Medical");
  const [status, setStatus] = useState<"Active" | "Away">("Active");

  const handleOnboardMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addTeamMember({
      name,
      role,
      status
    });

    // Reset Form
    setName("");
    setRole("Medical");
    setStatus("Active");
    setShowOnboardModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50">
      
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            Authority & Protocol
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            Team Governance
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-55/40 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Seats</span>
              <span className="text-sm font-bold text-slate-800">{teamMembers.length} / 20</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 w-full overflow-hidden">
        
        {/* Left Column (8 Columns) - Personnel Directory */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col h-full min-h-0">
          {/* Table Header Controls (shrink-0) */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="font-display text-base font-bold text-slate-900">Personnel Directory</h2>
            <div className="flex gap-2.5">
              <button 
                onClick={() => setShowOnboardModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-body text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-blue-600/10 transition-all cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                Onboard Member
              </button>
            </div>
          </div>

          {/* Table Container (flex-1) */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider">User Identity</th>
                  <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider">Global Role</th>
                  <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider">Node Status</th>
                  <th className="px-6 py-4 font-body font-bold text-[9px] text-slate-400 uppercase tracking-wider text-center">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {teamMembers.map((member) => {
                  const email = member.name.toLowerCase().replace(/\s+/g, '.') + "@maestro.ai";
                  const roleLabel = member.role === "Regulatory" ? "Regulatory Lead" : member.role === "Medical" ? "Medical Reviewer" : member.role === "Legal" ? "Legal Counsel" : "Brand Manager";
                  
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/40 transition-colors group text-xs text-slate-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=150";
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-body font-bold text-slate-805 truncate">{member.name}</div>
                            <div className="font-sans text-[10px] text-slate-450 mt-0.5">{email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans font-semibold text-slate-700">{roleLabel}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          member.status === 'Active' ? 'bg-blue-600/10 text-blue-600' : 'bg-slate-100 text-slate-500 italic'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => deleteTeamMember(member.id)}
                          className="p-1 text-slate-455 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Member"
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

        {/* Right Column (4 Columns) - Role Hierarchies & Info */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          {/* 1. Role Hierarchies Card (flex-1) */}
          <div className="flex-1 bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-0">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-[55px] rounded-full pointer-events-none"></div>
            
            <div className="border-b border-white/10 pb-3 shrink-0">
              <span className="font-body text-[9px] text-white/50 uppercase tracking-widest block">Access Controls</span>
              <h3 className="font-display text-base font-bold text-white mt-1">Role Hierarchies</h3>
            </div>

            {/* Roles list */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3.5 my-5 pr-1">
              {[
                { name: "Clinical Lead", desc: "Access study RAG ingestion & groundings", status: "Active" },
                { name: "Compliance Officer", desc: "Cast MLR votes & trigger audit notes", status: "Active" },
                { name: "Legal Counsel", desc: "Override regulatory holds & sign policies", status: "Active" },
                { name: "Brand Executive", desc: "Approve campaign budgets & target forecasts", status: "Active" }
              ].map((role, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="min-w-0 flex-1 pr-3">
                    <span className="font-body font-bold text-xs text-white/95 block">{role.name}</span>
                    <span className="text-[9px] text-slate-400 leading-normal mt-0.5 block">{role.desc}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                    role.status === "Active" ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-550"
                  }`}>
                    {role.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-2 bg-blue-650 hover:bg-blue-700 text-white rounded-xl font-body text-xs font-bold transition-colors cursor-pointer shadow-md shrink-0">
              Audit Permissions
            </button>
          </div>

          {/* 2. Security Pulse Card (shrink-0) */}
          <div className="p-6 bg-white border border-slate-200/50 rounded-3xl shrink-0 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-body font-bold text-xs text-slate-800">Security Gate Status</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-sans">Last Audit Run</span>
                <span className="text-slate-800 font-body font-bold">24 Hours Ago</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-sans">Policy Version</span>
                <span className="text-slate-805 font-body font-bold">V4.8.2-Core</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-sans">System Integrity</span>
                <span className="text-emerald-600 font-body font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> 100% Secure
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ==========================================
         ONBOARD USER MODAL
         ========================================== */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/65 max-w-sm w-full p-6 flex flex-col gap-5 animate-slide-in-top">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <User className="text-blue-600" size={18} />
                <h3 className="font-display font-bold text-sm text-slate-900">Onboard Team Member</h3>
              </div>
              <button 
                onClick={() => setShowOnboardModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleOnboardMember} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Jonathan Ross"
                  className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Global Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 outline-none focus:border-blue-600 bg-white"
                >
                  <option value="Medical">Medical Reviewer</option>
                  <option value="Regulatory">Regulatory Lead</option>
                  <option value="Legal">Legal Counsel</option>
                  <option value="Brand Manager">Brand Manager</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Node Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 outline-none focus:border-blue-600 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Away">Away</option>
                </select>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-body text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-xs font-bold shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Onboard Member</span>
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
