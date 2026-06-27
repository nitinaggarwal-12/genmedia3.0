import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  Sparkles,
  Unlock,
  Lock,
  GripVertical
} from "lucide-react";
import { useCampaign } from "@/context/CampaignContext";

interface MappedSubmission {
  id: string;
  campaignId: string;
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
  copyText: string;
  complianceScore: number;
  regulatoryReasoning: string;
  activeViolations: any[];
  assets: any[];
}

export function RegulatoryHub() {
  const { campaigns, updateCampaign, addNotification, teamMembers } = useCampaign();
  
  // Find dynamic reviewers from team governance
  const medicalReviewer = teamMembers?.find(t => t.role === "Medical") || { 
    name: "Dr. Sarah Jenkins", 
    role: "Medical Reviewer",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150" 
  };
  const legalReviewer = teamMembers?.find(t => t.role === "Legal") || { 
    name: "Robert Lee, JD", 
    role: "Legal Counsel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150" 
  };
  const regulatoryReviewer = teamMembers?.find(t => t.role === "Regulatory") || { 
    name: "Maria Garcia", 
    role: "Regulatory Lead",
    avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=150" 
  };
  
  // Selected submission for the Consensus Drawer
  const [selectedSub, setSelectedSub] = useState<MappedSubmission | null>(null);
  
  // Local state to track the interactive vote in the drawer
  const [regVote, setRegVote] = useState<"Approved" | "Pending">("Pending");

  // Map campaigns to submissions list dynamically
  const submissions: MappedSubmission[] = campaigns.map(c => {
    const isAtRisk = c.complianceScore < 90;
    const isApproved = c.status === "Completed";
    
    let status: "At Risk" | "Approved" | "Under Review" = "Under Review";
    let statusColor: "red" | "blue" | "orange" = "orange";
    let stage: ("done" | "at_risk" | "todo")[] = ["done", "done", "todo"];
    
    if (isApproved) {
      status = "Approved";
      statusColor = "blue";
      stage = ["done", "done", "done"];
    } else if (isAtRisk) {
      status = "At Risk";
      statusColor = "red";
      stage = ["done", "at_risk", "todo"];
    }
    
    return {
      id: `MLR-${c.id.substring(5, 9).toUpperCase()}-${c.createdAt.toString().substring(8, 12)}`,
      campaignId: c.id,
      name: c.name,
      type: c.assets.length > 0 && c.assets[0].type === "video" ? "Video" : "Document",
      icon: c.assets.length > 0 && c.assets[0].type === "video" ? PlayCircle : FileText,
      status,
      statusColor,
      stage,
      cycle: isApproved ? "Final Audit" : isAtRisk ? "Round 1 of 3" : "Round 2 of 3",
      eta: isApproved ? "Released to Production" : isAtRisk ? "Revisions Required" : "Est. 12h remaining",
      reviewerVotes: {
        medical: "Approved" as const,
        legal: (isAtRisk ? "Pending" : "Approved") as const,
        regulatory: (isApproved ? "Approved" : "Pending") as const
      },
      copyText: c.copyText,
      complianceScore: c.complianceScore,
      regulatoryReasoning: c.regulatoryReasoning,
      activeViolations: c.activeViolations,
      assets: c.assets
    };
  });

  // Sync drawer vote state if the selected submission changes (e.g. updated from context)
  useEffect(() => {
    if (selectedSub) {
      const current = submissions.find(s => s.campaignId === selectedSub.campaignId);
      if (current) {
        setRegVote(current.reviewerVotes.regulatory);
      }
    }
  }, [campaigns, selectedSub?.campaignId]);

  const openReviewDrawer = (sub: MappedSubmission) => {
    setSelectedSub(sub);
    setRegVote(sub.reviewerVotes.regulatory);
  };

  const closeReviewDrawer = () => {
    setSelectedSub(null);
  };

  const handleCastRegulatoryVote = () => {
    setRegVote("Approved");
  };

  // Finalize MLR Approval (updates campaign status to Completed in the global context)
  const handleFinalApproval = () => {
    if (!selectedSub) return;
    
    updateCampaign(selectedSub.campaignId, {
      status: "Completed",
      step: 5
    });

    addNotification(
      "MLR Approval Granted",
      `Campaign '${selectedSub.name}' has received final MLR sign-off and is released to production.`,
      "success"
    );

    closeReviewDrawer();
  };

  const handleRequestRevisions = () => {
    if (!selectedSub) return;

    updateCampaign(selectedSub.campaignId, {
      status: "Creative",
      step: 3
    });

    addNotification(
      "Revisions Requested",
      `Campaign '${selectedSub.name}' has been returned to Creative by the Regulatory Lead.`,
      "warning"
    );

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
    if (!selectedSub) return 2;
    let count = 2; // Medical and Legal are pre-approved in our mock
    if (selectedSub.status === "At Risk") {
      count = 1; // Legal blocks if at risk!
    }
    if (regVote === "Approved") count += 1;
    return count;
  };

  const consensusCount = getConsensusCount();
  const progressPercent = (consensusCount / 3) * 100;
  const allApproved = consensusCount === 3;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50 relative">
      
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            Regulatory Intelligence Hub
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            MLR Compliance Engine
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Reviews</span>
              <span className="text-sm font-bold text-slate-800">
                {submissions.filter(s => s.status !== "Approved").length}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">At Risk</span>
              <span className="text-sm font-bold text-slate-800">
                {submissions.filter(s => s.status === "At Risk").length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid (Cockpit Table) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 w-full overflow-hidden">
        <div className="col-span-12 flex flex-col gap-6 h-full min-h-0">
          {/* Filter Tabs & Search Bar (shrink-0) */}
          <div className="flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center gap-6">
              <button className="font-body text-xs font-bold text-slate-800 border-b-2 border-blue-600 pb-1 uppercase tracking-wider">
                All Assets
              </button>
              <button className="font-body text-xs font-bold text-slate-400 hover:text-slate-800 pb-1 transition-colors uppercase tracking-wider">
                Under Review ({submissions.filter(s => s.status === "Under Review").length})
              </button>
              <button className="font-body text-xs font-bold text-slate-400 hover:text-slate-800 pb-1 transition-colors uppercase tracking-wider">
                At Risk ({submissions.filter(s => s.status === "At Risk").length})
              </button>
              <button className="font-body text-xs font-bold text-slate-400 hover:text-slate-800 pb-1 transition-colors uppercase tracking-wider">
                Approved ({submissions.filter(s => s.status === "Approved").length})
              </button>
            </div>
            <button className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Submissions Table Card (flex-1 min-h-0) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <th className="px-6 py-4 font-body text-[9px] font-bold text-slate-400 uppercase tracking-wider">Asset Identity</th>
                    <th className="px-6 py-4 font-body text-[9px] font-bold text-slate-400 uppercase tracking-wider">Clearance Status</th>
                    <th className="px-6 py-4 font-body text-[9px] font-bold text-slate-400 uppercase tracking-wider">Review Cycle</th>
                    <th className="px-6 py-4 font-body text-[9px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="group hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center text-blue-600 shrink-0">
                            <submission.icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-slate-800 truncate">{submission.name}</p>
                            <p className="font-mono text-[9px] text-slate-455 mt-1">{submission.id} • HCP-Facing</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-wider">
                            <span className="text-slate-400">M / L / R</span>
                            {submission.status === "At Risk" ? (
                              <span className="text-red-550 flex items-center gap-0.5 font-extrabold">
                                <AlertTriangle size={10} /> {submission.status}
                              </span>
                            ) : submission.status === "Approved" ? (
                              <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-extrabold">
                                {submission.status}
                              </span>
                            ) : (
                              <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md font-extrabold">
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
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-sans font-bold text-slate-700">{submission.cycle}</span>
                          <span className="font-sans text-[10px] text-slate-400">{submission.eta}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => openReviewDrawer(submission)}
                          className={`px-4 py-2 rounded-xl font-body text-xs font-bold transition-all shadow-sm cursor-pointer ${
                            submission.status === 'Approved' 
                              ? 'bg-slate-150 text-slate-500 hover:bg-slate-200' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 shadow-blue-600/10'
                          }`}
                        >
                          {submission.status === 'Approved' ? 'View Record' : 'Review Audit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
         3. SLIDE-OUT CONSENSUS COCKPIT DRAWER (VIEWPORT-FIT COCKPIT!)
         ===================================================================== */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Translucent Backdrop */}
          <div 
            onClick={closeReviewDrawer}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[1000px] h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 z-10 animate-slide-in-right overflow-hidden">
            
            {/* Drawer Header (shrink-0) */}
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-800">{selectedSub.name}</h3>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">{selectedSub.id} • Regulatory Consensus Room</p>
                </div>
              </div>
              <button 
                onClick={closeReviewDrawer}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body (Split View - Viewport-locked!) */}
            <div className="flex-1 min-h-0 p-8 grid grid-cols-10 gap-8 overflow-hidden">
              
              {/* LEFT PANE (60%): FDA Claims Ontology Graph (flex-1 h-full) */}
              <div className="col-span-10 lg:col-span-6 flex flex-col gap-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 shadow-inner h-full min-h-0">
                <div className="border-b border-slate-200/60 pb-3 shrink-0">
                  <h4 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-blue-600" size={14} /> FDA Claims Compliance Map
                  </h4>
                  <p className="text-[10px] text-slate-450 mt-0.5">
                    Relational mapping of clinical trial primary endpoints to secondary marketing claims.
                  </p>
                </div>

                {/* Graph Canvas (flex-1) */}
                <div className="flex-1 min-h-0 flex items-center justify-center bg-white border border-slate-200 rounded-xl overflow-hidden p-4 relative shadow-sm h-full">
                  {/* Fixed Coordinate Container */}
                  <div className="relative w-[480px] h-[280px] shrink-0" style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}>
                    {/* SVG Connector Lines */}
                    <svg width="100%" height="100%" className="absolute inset-0 z-0 pointer-events-none">
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

                    {/* Center Node */}
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

                  <div className="absolute bottom-3 left-3 bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider opacity-80">
                    FDA Compliance Map
                  </div>
                </div>
              </div>

              {/* RIGHT PANE (40%): MLR Consensus Voting Stack (h-full flex flex-col) */}
              <div className="col-span-10 lg:col-span-4 flex flex-col justify-between h-full min-h-0">
                
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="border-b border-slate-100 pb-3 shrink-0">
                    <h4 className="font-display text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Users className="text-blue-600" size={14} /> MLR Review Consensus
                    </h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">
                      Real-time voting alignment of Medical, Legal, and Regulatory leads.
                    </p>
                  </div>

                  {/* Reviewer Cards Stack (flex-1 scrollable) */}
                  <div className="flex-1 overflow-y-auto min-h-0 space-y-3 mt-4 pr-1">
                    {/* Medical Affairs (Approved) */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between shadow-sm shrink-0">
                      <div className="flex items-center gap-3">
                        {medicalReviewer.avatar && medicalReviewer.avatar.startsWith("http") ? (
                          <img src={medicalReviewer.avatar} alt={medicalReviewer.name} className="w-8 h-8 rounded-lg object-cover border border-emerald-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-bold">
                            {medicalReviewer.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{medicalReviewer.name}</span>
                          <span className="text-[9px] text-slate-400">Medical Affairs Director</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg shadow-sm">
                        <CheckCircle2 size={10} /> Approved
                      </span>
                    </div>

                    {/* Legal Affairs (Approved or Pending) */}
                    <div className={`p-3.5 border rounded-2xl flex items-center justify-between shadow-sm shrink-0 ${
                      selectedSub.status === "At Risk" 
                        ? "bg-amber-50/60 border-amber-100" 
                        : "bg-emerald-50 border-emerald-100"
                    }`}>
                      <div className="flex items-center gap-3">
                        {legalReviewer.avatar && legalReviewer.avatar.startsWith("http") ? (
                          <img src={legalReviewer.avatar} alt={legalReviewer.name} className="w-8 h-8 rounded-lg object-cover border border-emerald-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-bold">
                            {legalReviewer.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{legalReviewer.name}</span>
                          <span className="text-[9px] text-slate-400">Legal Compliance Lead</span>
                        </div>
                      </div>
                      {selectedSub.status === "At Risk" ? (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg shadow-sm">
                          Pending Revisions
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg shadow-sm">
                          <CheckCircle2 size={10} /> Approved
                        </span>
                      )}
                    </div>

                    {/* Regulatory Affairs (Interactive) */}
                    <div className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all shrink-0 ${
                      regVote === "Approved" 
                        ? "bg-emerald-50 border-emerald-100 shadow-sm" 
                        : "bg-amber-50/60 border-amber-100 shadow-sm"
                    }`}>
                      <div className="flex items-center gap-3">
                        {regulatoryReviewer.avatar && regulatoryReviewer.avatar.startsWith("http") ? (
                          <img src={regulatoryReviewer.avatar} alt={regulatoryReviewer.name} className="w-8 h-8 rounded-lg object-cover border border-amber-200" />
                        ) : (
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${
                            regVote === "Approved" 
                              ? "bg-emerald-100 border-emerald-200 text-emerald-600" 
                              : "bg-amber-100 border-amber-200 text-amber-600 animate-pulse"
                          }`}>
                            {regulatoryReviewer.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{regulatoryReviewer.name}</span>
                          <span className="text-[9px] text-slate-400">Regulatory Affairs Lead</span>
                        </div>
                      </div>
                      
                      {regVote === "Approved" ? (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg shadow-sm">
                          <CheckCircle2 size={10} /> Approved
                        </span>
                      ) : selectedSub.status === "At Risk" ? (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                          Blocked
                        </span>
                      ) : (
                        <button 
                          onClick={handleCastRegulatoryVote}
                          className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-white bg-amber-500 hover:bg-amber-600 border border-amber-400 px-3 py-1 rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          Cast Vote
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Consensus Progress Bar & Submit Gate (shrink-0) */}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-4 shrink-0">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      <span>Consensus Progress ({consensusCount}/3 Approved)</span>
                      <span className={allApproved ? "text-emerald-600" : "text-amber-600"}>
                        {selectedSub.status === "At Risk" 
                          ? "Blocked by Compliance" 
                          : allApproved 
                            ? "Consensus Reached" 
                            : "Pending Regulatory Sign-Off"}
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
                      onClick={handleRequestRevisions}
                      className="py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-body text-xs font-bold transition-colors cursor-pointer"
                    >
                      Request Revisions
                    </button>
                    <button 
                      disabled={!allApproved || selectedSub.status === "At Risk"}
                      onClick={handleFinalApproval}
                      className={`py-3 text-white rounded-xl font-body text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        allApproved && selectedSub.status !== "At Risk"
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
