import React, { useState } from "react";
import { 
  Plus, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  PlayCircle, 
  Activity, 
  Users, 
  X, 
  Check,
  ShieldCheck
} from "lucide-react";

// =====================================================================
// REGULATORY HUB PAGE WITH INTERACTIVE CONSENSUS DRAWER
// =====================================================================

interface Submission {
  id: string;
  name: string;
  type: string;
  icon: any;
  status: "At Risk" | "Approved" | "Under Review";
  statusColor: "red" | "blue" | "orange";
  stage: ("done" | "at_risk" | "todo")[];
  cycle: string;
  eta: string;
  reviewerVotes: {
    medical: "Approved" | "Pending";
    legal: "Approved" | "Pending";
    regulatory: "Approved" | "Pending";
  };
}

export function RegulatoryHub() {
  // State-driven submissions list
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "MLR-2024-0892",
      name: "Q4 Cardio-Vascular Clinical Summary",
      type: "Document",
      icon: FileText,
      status: "At Risk",
      statusColor: "red",
      stage: ["done", "at_risk", "todo"],
      cycle: "Round 3 of 5",
      eta: "Est. 48h remaining",
      reviewerVotes: {
        medical: "Approved",
        legal: "Approved",
        regulatory: "Pending"
      }
    },
    {
      id: "MLR-2024-0914",
      name: "Oncology Awareness Digital Campaign",
      type: "Video",
      icon: PlayCircle,
      status: "Approved",
      statusColor: "blue",
      stage: ["done", "done", "done"],
      cycle: "Final Audit",
      eta: "Released to Production",
      reviewerVotes: {
        medical: "Approved",
        legal: "Approved",
        regulatory: "Approved"
      }
    },
  ]);

  // Selected submission for the Consensus Drawer
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  
  // Local state to track the interactive vote in the drawer
  const [regVote, setRegVote] = useState<"Approved" | "Pending">("Pending");

  const openReviewDrawer = (sub: Submission) => {
    setSelectedSub(sub);
    setRegVote(sub.reviewerVotes.regulatory);
  };

  const closeReviewDrawer = () => {
    setSelectedSub(null);
  };

  // Simulate Regulatory Lead casting their vote
  const handleCastRegulatoryVote = () => {
    setRegVote("Approved");
  };

  // Finalize MLR Approval (promotes the asset to Approved in the main table)
  const handleFinalApproval = () => {
    if (!selectedSub) return;
    
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === selectedSub.id) {
        return {
          ...sub,
          status: "Approved",
          statusColor: "blue",
          stage: ["done", "done", "done"],
          cycle: "Final Audit",
          eta: "Released to Production",
          reviewerVotes: {
            ...sub.reviewerVotes,
            regulatory: "Approved"
          }
        };
      }
      return sub;
    }));

    closeReviewDrawer();
  };

  // Claims spiderweb ontology graph coordinates (500x300 grid)
  const centerNode = { x: 240, y: 140 };
  const primaryNodes = [
    { id: 'audience', label: 'Target Audience', x: 90, y: 60, color: 'text-amber-600 border-amber-200 bg-amber-50 shadow-sm' },
    { id: 'safety', label: 'Safety Data', x: 390, y: 60, color: 'text-emerald-600 border-emerald-255 bg-emerald-50 shadow-sm' },
    { id: 'efficacy', label: 'Product Efficacy', x: 90, y: 220, color: 'text-blue-600 border-blue-200 bg-blue-50 shadow-sm' },
    { id: 'value', label: 'Payer Value', x: 390, y: 220, color: 'text-purple-600 border-purple-200 bg-purple-50 shadow-sm' }
  ];

  const secondaryNodes = [
    { id: 'segment', label: 'Patient Segment', x: 20, y: 30, parentX: 90, parentY: 60, color: 'text-slate-500 border-slate-200 bg-white' },
    { id: 'dosage', label: 'Dosage Toxicity', x: 460, y: 30, parentX: 390, parentY: 60, color: 'text-slate-500 border-slate-200 bg-white' },
    { id: 'trials', label: 'Clinical Study X', x: 20, y: 250, parentX: 90, parentY: 220, color: 'text-slate-500 border-slate-200 bg-white' },
    { id: 'rebates', label: 'Prior Auth Rebate', x: 460, y: 250, parentX: 390, parentY: 220, color: 'text-slate-500 border-slate-200 bg-white' }
  ];

  // Calculate consensus progress
  const getConsensusCount = () => {
    let count = 2; // Medical and Legal are pre-approved in our mock
    if (regVote === "Approved") count += 1;
    return count;
  };

  const consensusCount = getConsensusCount();
  const progressPercent = (consensusCount / 3) * 100;
  const allApproved = consensusCount === 3;

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* =====================================================================
         1. HERO HEADER BANNER
         ===================================================================== */}
      <section className="relative px-10 pt-12 pb-24 overflow-hidden bg-white border-b border-slate-200/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-blue-600 tracking-[0.2em] uppercase font-bold mb-4 block">
              Regulatory Intelligence Hub
            </span>
            <h1 className="font-display text-5xl lg:text-6xl leading-[1.1] text-slate-900 tracking-tight mb-6">
              MLR Workflow<br/>
              <span className="text-blue-600 font-light italic">Compliance Engine</span>
            </h1>
            <p className="font-sans text-base text-slate-500 max-w-md">
              Real-time oversight of asset lifecycle through Medical, Legal, and Regulatory gateways. High-trust auditing for global pharmaceutical standards.
            </p>
          </div>
          
          {/* Stats Indicators */}
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col min-w-[180px] shadow-sm">
              <span className="font-body text-xs text-slate-400 uppercase tracking-wider">Active Assets</span>
              <span className="font-display text-4xl font-bold text-slate-800 mt-2">142</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col min-w-[180px] shadow-sm">
              <span className="font-body text-xs text-red-500/80 uppercase tracking-wider">At Risk</span>
              <span className="font-display text-4xl font-bold text-red-500 mt-2">01</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
         2. SUBMISSIONS LIST SECTION
         ===================================================================== */}
      <section className="px-10 -mt-12 relative z-20">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Filter Tabs */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-6">
                <button className="font-body text-xs font-bold text-slate-800 border-b-2 border-blue-600 pb-1 uppercase tracking-wider">
                  All Assets
                </button>
                <button className="font-body text-xs font-bold text-slate-400 hover:text-slate-800 pb-1 transition-colors uppercase tracking-wider">
                  Medical (24)
                </button>
                <button className="font-body text-xs font-bold text-slate-400 hover:text-slate-800 pb-1 transition-colors uppercase tracking-wider">
                  Legal (18)
                </button>
                <button className="font-body text-xs font-bold text-slate-400 hover:text-slate-800 pb-1 transition-colors uppercase tracking-wider">
                  Regulatory (12)
                </button>
              </div>
              <button className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 transition-all">
                <Filter className="h-4 w-4" />
              </button>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-6 py-4 font-body text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Identity</th>
                    <th className="px-6 py-4 font-body text-xs font-bold text-slate-400 uppercase tracking-wider">Clearance Status</th>
                    <th className="px-6 py-4 font-body text-xs font-bold text-slate-400 uppercase tracking-wider">Review Cycle</th>
                    <th className="px-6 py-4 font-body text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center text-blue-600">
                            <submission.icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-sm font-bold text-slate-800 truncate">{submission.name}</p>
                            <p className="font-mono text-[10px] text-slate-400 mt-1">{submission.id} • HCP-Facing</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider">
                            <span className="text-slate-400">M / L / R</span>
                            {submission.status === "At Risk" ? (
                              <span className="text-red-500 flex items-center gap-0.5 font-extrabold">
                                <AlertTriangle size={10} /> {submission.status}
                              </span>
                            ) : (
                              <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md font-extrabold">
                                {submission.status}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 h-1.5 w-28">
                            <div className={`h-full w-1/3 ${submission.stage[0] === 'done' ? 'bg-blue-600' : 'bg-slate-200'} rounded-full`}></div>
                            <div className={`h-full w-1/3 ${submission.stage[1] === 'done' ? 'bg-blue-600' : submission.stage[1] === 'at_risk' ? 'bg-red-500 animate-pulse' : 'bg-slate-200'} rounded-full`}></div>
                            <div className={`h-full w-1/3 ${submission.stage[2] === 'done' ? 'bg-blue-600' : 'bg-slate-200'} rounded-full`}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-sans text-xs font-bold text-slate-700">{submission.cycle}</span>
                          <span className="font-sans text-[10px] text-slate-400">{submission.eta}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <button 
                          onClick={() => openReviewDrawer(submission)}
                          className={`px-5 py-2 rounded-xl font-body text-xs font-bold transition-all shadow-sm ${
                            submission.status === 'Approved' 
                              ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 shadow-blue-600/10'
                          }`}
                        >
                          {submission.status === 'Approved' ? 'Archive' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
         3. SLIDE-OUT CONSENSUS COCKPIT DRAWER
         ===================================================================== */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Translucent Backdrop */}
          <div 
            onClick={closeReviewDrawer}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[1000px] h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 z-10 animate-slide-in-right">
            
            {/* Drawer Header */}
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-800">{selectedSub.name}</h3>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">{selectedSub.id} • Regulatory Consensus Room</p>
                </div>
              </div>
              <button 
                onClick={closeReviewDrawer}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body (Split View) */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-10 gap-8">
              
              {/* LEFT PANE (60%): FDA Claims Ontology Graph */}
              <div className="col-span-10 lg:col-span-6 flex flex-col gap-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 shadow-inner">
                <div className="border-b border-slate-200/60 pb-3">
                  <h4 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-blue-600" size={14} /> FDA Claims Compliance Map
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Relational mapping of clinical trial primary endpoints to secondary marketing claims.
                  </p>
                </div>

                {/* Graph Canvas */}
                <div className="flex-1 min-h-[340px] flex items-center justify-center bg-white border border-slate-200 rounded-xl overflow-hidden p-4 relative shadow-sm">
                  
                  {/* Fixed Coordinate Container */}
                  <div className="relative w-[480px] h-[280px] shrink-0" style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}>
                    
                    {/* SVG Connector Lines */}
                    <svg width="100%" height="100%" className="absolute inset-0 z-0 pointer-events-none">
                      {/* Center to Primary */}
                      {primaryNodes.map(node => (
                        <line 
                          key={node.id}
                          x1={centerNode.x} 
                          y1={centerNode.y} 
                          x2={node.x} 
                          y2={node.y} 
                          stroke="rgba(59, 130, 246, 0.25)"
                          strokeWidth="2"
                        />
                      ))}
                      {/* Primary to Secondary */}
                      {secondaryNodes.map(node => (
                        <line 
                          key={node.id}
                          x1={node.parentX} 
                          y1={node.parentY} 
                          x2={node.x} 
                          y2={node.y} 
                          stroke="rgba(148, 163, 184, 0.2)"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                      ))}
                    </svg>

                    {/* Center Node (Core Claim) */}
                    <div 
                      className="absolute z-10 flex flex-col items-center justify-center w-20 h-20 bg-blue-600 border-2 border-white rounded-full shadow-lg shadow-blue-600/20 select-none cursor-pointer hover:scale-105 transition-transform"
                      style={{ left: `${centerNode.x - 40}px`, top: `${centerNode.y - 40}px` }}
                    >
                      <span className="text-lg">⚖️</span>
                      <span className="text-[8px] font-bold tracking-wider text-white mt-1 uppercase text-center px-1">
                        Core Claim
                      </span>
                    </div>

                    {/* Primary Nodes */}
                    {primaryNodes.map(node => (
                      <div 
                        key={node.id}
                        className={`absolute z-10 flex flex-col items-center justify-center w-14 h-14 border rounded-full transition-all hover:scale-105 cursor-pointer select-none ${node.color}`}
                        style={{ left: `${node.x - 28}px`, top: `${node.y - 28}px` }}
                      >
                        <span className="text-[7px] font-bold text-center uppercase tracking-wider leading-tight px-1 whitespace-normal">
                          {node.label}
                        </span>
                      </div>
                    ))}

                    {/* Secondary Nodes */}
                    {secondaryNodes.map(node => (
                      <div 
                        key={node.id}
                        className={`absolute z-10 flex flex-col items-center justify-center w-12 h-12 border rounded-full transition-all hover:scale-105 cursor-pointer select-none ${node.color}`}
                        style={{ left: `${node.x - 24}px`, top: `${node.y - 24}px` }}
                      >
                        <span className="text-[6.5px] font-bold text-center leading-tight px-1 whitespace-normal">
                          {node.label}
                        </span>
                      </div>
                    ))}

                  </div>

                  {/* Indicator Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider opacity-80">
                    FDA Compliance Map
                  </div>
                </div>

              </div>

              {/* RIGHT PANE (40%): MLR Consensus Voting Stack */}
              <div className="col-span-10 lg:col-span-4 flex flex-col justify-between gap-6">
                
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Users className="text-blue-600" size={14} /> MLR Review Consensus
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Real-time voting alignment of Medical, Legal, and Regulatory leads.
                    </p>
                  </div>

                  {/* Reviewer Cards Stack */}
                  <div className="space-y-3">
                    
                    {/* Medical Affairs (Approved) */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          SJ
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">Sarah Jenkins, MD</span>
                          <span className="text-[9px] text-slate-400">Medical Affairs Director</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg shadow-sm">
                        <CheckCircle2 size={10} /> Approved
                      </span>
                    </div>

                    {/* Legal Affairs (Approved) */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          RL
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">Robert Lee, JD</span>
                          <span className="text-[9px] text-slate-400">Legal Compliance Lead</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg shadow-sm">
                        <CheckCircle2 size={10} /> Approved
                      </span>
                    </div>

                    {/* Regulatory Affairs (Interactive) */}
                    <div className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                      regVote === "Approved" 
                        ? "bg-emerald-50 border-emerald-100 shadow-sm" 
                        : "bg-amber-50/60 border-amber-100 shadow-sm"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${
                          regVote === "Approved" 
                            ? "bg-emerald-100 border-emerald-200 text-emerald-600" 
                            : "bg-amber-100 border-amber-200 text-amber-600 animate-pulse"
                        }`}>
                          MG
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">Maria Garcia</span>
                          <span className="text-[9px] text-slate-400">Regulatory Affairs Lead</span>
                        </div>
                      </div>
                      
                      {regVote === "Approved" ? (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg shadow-sm">
                          <CheckCircle2 size={10} /> Approved
                        </span>
                      ) : (
                        <button 
                          onClick={handleCastRegulatoryVote}
                          className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-white bg-amber-500 hover:bg-amber-600 border border-amber-400 px-3 py-1 rounded-lg shadow-sm transition-all"
                        >
                          Cast Vote
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                {/* Consensus Progress Bar & Submit Gate */}
                <div className="border-t border-slate-100 pt-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      <span>Consensus Progress ({consensusCount}/3 Approved)</span>
                      <span className={allApproved ? "text-emerald-600" : "text-amber-600"}>
                        {allApproved ? "Consensus Reached" : "Pending Regulatory Sign-Off"}
                      </span>
                    </div>
                    
                    {/* Sleek Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          allApproved ? "bg-emerald-500" : "bg-gradient-to-r from-emerald-500 to-amber-500"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={closeReviewDrawer}
                      className="py-3 border border-slate-200 text-slate-600 rounded-xl font-body text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Request Revisions
                    </button>
                    <button 
                      disabled={!allApproved}
                      onClick={handleFinalApproval}
                      className={`py-3 text-white rounded-xl font-body text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                        allApproved 
                          ? "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 shadow-blue-600/20" 
                          : "bg-slate-300 shadow-none cursor-not-allowed"
                      }`}
                    >
                      <span>Final Approval</span>
                      <ShieldCheck size={14} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
