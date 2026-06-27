import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Tag, 
  Settings, 
  Grid, 
  List, 
  Play, 
  FileText, 
  MoreVertical, 
  Plus, 
  ChevronRight, 
  History,
  UploadCloud,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  Database,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Loader2,
  X,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useCampaign } from '@/context/CampaignContext';

const BASE_MOCK_ASSETS = [
  {
    id: "mock-1",
    type: 'video',
    name: 'Brand_Manifesto_2024.mp4',
    status: 'Approved',
    statusColor: 'blue' as const,
    thumbnail: 'https://images.unsplash.com/photo-1528892952491-035c6d37a85c?q=80&w=2070&auto=format&fit=crop',
    duration: '00:42',
    campaignName: 'System Default'
  },
  {
    id: "mock-2",
    type: 'document',
    name: 'Compliance_Guidelines_EMEA.pdf',
    status: 'V3.1 Draft',
    statusColor: 'orange' as const,
    campaignName: 'System Default'
  },
  {
    id: "mock-3",
    type: 'image',
    name: 'Product_Shot_Vial_01.jpg',
    status: 'Approved',
    statusColor: 'blue' as const,
    thumbnail: 'https://images.unsplash.com/photo-1584982235212-9b01552a44a8?q=80&w=2070&auto=format&fit=crop',
    campaignName: 'System Default'
  },
];

const AssetCard = ({ asset }: { asset: any }) => {
  const renderAsset = () => {
    switch (asset.type) {
      case 'video':
        return (
          <div className="aspect-square relative overflow-hidden bg-slate-950">
            {asset.thumbnail ? (
              <img src={asset.thumbnail} className="w-full h-full object-cover opacity-80" alt={asset.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                <Play size={24} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-blue-600 flex items-center justify-center shadow-lg cursor-pointer">
                <Play style={{ fill: 'currentColor' }} className="ml-0.5" size={14} />
              </button>
            </div>
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white font-mono text-[9px] font-bold">
              {asset.duration || "0:05"}
            </span>
          </div>
        );
      case 'document':
        return (
          <div className="aspect-square relative overflow-hidden bg-slate-100 flex items-center justify-center">
            <FileText className="h-14 w-14 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
          </div>
        );
      case 'image':
        return (
          <div className="aspect-square relative overflow-hidden">
            <img src={asset.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300"} className="w-full h-full object-cover" alt={asset.name} />
          </div>
        );
      default: return null
    }
  }

  return (
    <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200/65 flex flex-col justify-between">
      <div>
        {renderAsset()}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <span className="font-display font-bold text-xs text-slate-850 truncate pr-2 block" title={asset.name}>
              {asset.name}
            </span>
            <MoreVertical className="h-4 w-4 text-slate-400 shrink-0 cursor-pointer" />
          </div>
          <p className="text-[9px] text-slate-450 truncate font-sans mb-2">Campaign: {asset.campaignName}</p>
        </div>
      </div>
      <div className="px-4 pb-4 pt-0 border-t border-slate-50/50">
        <div className="flex items-center gap-2 mt-2">
          <span className={`w-1.5 h-1.5 rounded-full ${
            asset.status === 'Approved' || asset.status === 'Compliant' ? 'bg-blue-600' : 'bg-orange-500'
          }`}></span>
          <span className="font-sans text-[10px] text-slate-550 font-bold">
            {asset.status === "Compliant" ? "Approved" : asset.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export function DigitalAssetLibrary() {
  const { campaigns, clinicalTrials, ingestTrial } = useCampaign();
  const [activeTab, setActiveTab] = useState<'catalog' | 'ingest'>('catalog');
  
  // Ingestion States
  const [selectedTrialId, setSelectedTrialId] = useState<string>("");
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestionStep, setIngestionStep] = useState(0);
  
  // Form States for Ingestion
  const [newTitle, setNewTitle] = useState("");
  const [newPdfName, setNewPdfName] = useState("");
  const [newHr, setNewHr] = useState("0.60");
  const [newRfs, setNewRfs] = useState("75.0%");
  const [newPval, setNewPval] = useState("<0.01");
  const [newClaims, setNewClaims] = useState("");

  // Document Viewer States
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfPage, setPdfPage] = useState(1);

  // Set default selected trial on mount
  useEffect(() => {
    if (clinicalTrials.length > 0 && !selectedTrialId) {
      setSelectedTrialId(clinicalTrials[0].id);
    }
  }, [clinicalTrials]);

  const selectedTrial = clinicalTrials.find(t => t.id === selectedTrialId) || clinicalTrials[0] || null;

  // Extract all assets generated in CampaignStudio dynamically
  const generatedAssets = campaigns.flatMap(c => 
    c.assets.map((asset, idx) => ({
      id: `gen-${c.id}-${idx}`,
      type: asset.type,
      name: asset.name,
      status: asset.status,
      thumbnail: asset.url,
      duration: asset.type === "video" ? "0:05" : undefined,
      campaignName: c.name
    }))
  );

  const allAssets = [...generatedAssets, ...BASE_MOCK_ASSETS];

  // Run RAG Ingestion Simulation
  const handleRunIngestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPdfName) return;

    setIsIngesting(true);
    setIngestionStep(0);

    const stepsInterval = setInterval(() => {
      setIngestionStep(prev => {
        if (prev >= 3) {
          clearInterval(stepsInterval);
          // Complete Ingestion
          ingestTrial({
            name: newTitle,
            pdfName: newPdfName.endsWith(".pdf") ? newPdfName : `${newPdfName}.pdf`,
            metrics: {
              hazard_ratio: newHr,
              rfs_rate: newRfs,
              p_value: newPval
            },
            claims: newClaims.split("\n").filter(c => c.trim() !== "")
          });
          setIsIngesting(false);
          setShowIngestModal(false);
          // Reset Form
          setNewTitle("");
          setNewPdfName("");
          setNewHr("0.60");
          setNewRfs("75.0%");
          setNewPval("<0.01");
          setNewClaims("");
          return 0;
        }
        return prev + 1;
      });
    }, 800);
  };

  const ingestionStepTexts = [
    "Reading PDF document structure...",
    "Extracting clinical trials endpoints...",
    "Generating high-dimensional vector embeddings...",
    "Indexing nodes in PixelRAG database..."
  ];

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden bg-slate-50">
      
      {/* Compact Cockpit Header */}
      <header className="flex justify-between items-center shrink-0 bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-600/10 rounded-full text-blue-600 font-body text-[9px] uppercase tracking-widest font-bold">
            Content Operations
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-1.5">
            Content Intelligence Library
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-55/40 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Database size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Library Assets</span>
              <span className="text-sm font-bold text-slate-800">{allAssets.length + clinicalTrials.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Controls (shrink-0) */}
      <div className="flex border-b border-slate-200 gap-8 shrink-0">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 font-body text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'catalog' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-slate-400 hover:text-slate-855'
          }`}
        >
          Asset Catalog
        </button>
        <button 
          onClick={() => setActiveTab('ingest')}
          className={`pb-3 font-body text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ingest' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-slate-400 hover:text-slate-855'
          }`}
        >
          <Database size={14} />
          Clinical Ingestion & RAG
        </button>
      </div>

      {/* Tab Content Area (flex-1 min-h-0) */}
      <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        
        {/* ==========================================
           TAB 1: ASSET CATALOG
           ========================================== */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-6 h-full min-h-0">
            {/* Search & Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center bg-white shadow-sm rounded-full px-6 py-2.5 border border-slate-200/60 shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                <Search className="h-4 w-4 text-blue-600" />
                <input className="w-full bg-transparent border-none outline-none font-sans text-xs text-slate-900 placeholder:text-slate-400/80" placeholder="Search by tags, version, or MLR ID..." type="text"/>
              </div>
              <div className="h-6 w-px bg-slate-200/70 hidden lg:block"></div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-105 text-slate-600 font-body text-[10px] font-bold hover:bg-blue-600/10 hover:text-blue-600 transition-all cursor-pointer">
                  <Tag className="h-3.5 w-3.5" /> Tags
                </button>
                <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 text-white font-body text-[10px] font-bold shadow-md shadow-blue-600/10 cursor-pointer">
                  <Settings className="h-3.5 w-3.5" /> Filters
                </button>
              </div>
            </div>

            {/* Catalog Subheader */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 shrink-0">
              <div className="flex gap-4 items-center">
                <h2 className="font-display text-base font-bold text-slate-900">Recent Collections</h2>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px]">VER: 4.2.0</span>
              </div>
            </div>

            {/* Scrollable Assets Grid */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4">
              <div className="grid grid-cols-12 gap-6">
                {/* Featured Card */}
                <div className="col-span-12 lg:col-span-8 group relative rounded-3xl overflow-hidden bg-slate-800 shadow-sm border border-slate-200/60 h-48">
                  <img src="https://images.unsplash.com/photo-1558494949-7e335284534f?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" alt="Global Oncology Q3 Strategy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-body text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.2 h-1.2 rounded-full bg-white animate-pulse"></span>
                      Approved for Use
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="font-display text-base font-bold text-white">Global Oncology Q3 Portfolio Strategy</h3>
                    <p className="text-[10px] text-slate-300 mt-1">Orchestrated medical core claims master deck</p>
                  </div>
                </div>

                {/* MLR Pipeline Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col h-48">
                  <div className="flex-1 bg-orange-500/10 rounded-3xl p-5 relative overflow-hidden group border border-orange-500/20 flex flex-col justify-between">
                    <History className="absolute -right-4 -top-4 h-24 w-24 text-orange-500/10 group-hover:rotate-12 transition-transform duration-500" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-orange-900">MLR Pipeline</h4>
                      <p className="font-sans text-[11px] text-orange-950/80 mt-1">Pending legal signature for EMEA campaigns.</p>
                    </div>
                    <button 
                      onClick={() => navigate("/regulatory-hub")}
                      className="w-full py-2 rounded-xl bg-orange-500 text-white font-body text-xs font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/10 cursor-pointer"
                    >
                      Review Queue
                    </button>
                  </div>
                </div>

                {/* Render Mapped Assets */}
                {allAssets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
                
                {/* Upload Card Trigger */}
                <div 
                  onClick={() => setActiveTab('ingest')}
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 group bg-slate-100 hover:bg-blue-50/20 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300/80 hover:border-blue-600 transition-all cursor-pointer h-full min-h-[160px]"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-2 group-hover:bg-blue-600/10 group-hover:text-blue-600 transition-colors shrink-0">
                      <Plus size={18} />
                    </div>
                    <p className="font-body text-xs font-bold text-slate-800">Ingest Clinical Trial</p>
                    <p className="font-sans text-[10px] text-slate-450 mt-0.5">Upload PDF for RAG extraction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
           TAB 2: CLINICAL INGESTION & RAG VIEW (VIEWPORT-LOCKED!)
           ========================================== */}
        {activeTab === 'ingest' && (
          <div className="grid grid-cols-12 gap-8 h-full min-h-0 flex-1 overflow-hidden">
            
            {/* LEFT PANE (60%): High-Fidelity PDF Document Viewer */}
            <div className="col-span-12 lg:col-span-7 flex flex-col bg-slate-900 border border-slate-850 rounded-3xl shadow-xl h-full relative overflow-hidden">
              
              {/* PDF Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-2.5">
                  <FileText className="text-teal-400" size={16} />
                  <span className="font-body text-xs font-bold uppercase tracking-wider text-slate-300 truncate max-w-[300px]">
                    {selectedTrial ? selectedTrial.pdfName : "No Document Ingested"}
                  </span>
                </div>
                {selectedTrial && (
                  <span className="font-mono text-[9px] font-bold px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg">
                    Source Document · RAG Grounded
                  </span>
                )}
              </div>

              {/* Scrollable PDF Canvas */}
              <div className="flex-1 overflow-y-auto bg-slate-950 p-8 flex justify-center items-start min-h-0">
                {!selectedTrial ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                    <FileText size={48} className="text-slate-700 mb-3" />
                    <p className="font-body text-sm font-bold text-slate-400">No trial document ingested</p>
                    <p className="font-sans text-xs text-slate-500 mt-1">Use the ingestion dropzone on the right to upload a study.</p>
                  </div>
                ) : (
                  /* Mock Physical PDF Page */
                  <div 
                    className="w-full max-w-[450px] bg-white text-slate-900 p-8 rounded-sm shadow-2xl flex flex-col gap-5 aspect-[1/1.4] select-text transition-all duration-300 shrink-0"
                    style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                  >
                    {/* Academic Paper Title */}
                    <div className="flex flex-col border-b border-slate-250 pb-3">
                      <span className="text-[7px] font-bold uppercase tracking-widest text-slate-400">Clinical Trial Evaluation Report</span>
                      <h4 className="font-display text-[10px] font-black text-slate-950 mt-1.5 leading-snug">
                        {selectedTrial.name}
                      </h4>
                      <span className="text-[7px] font-semibold text-slate-400 mt-1">
                        Ingested: {new Date(selectedTrial.ingestedAt).toLocaleDateString()} · Index Node ID: {selectedTrial.id}
                      </span>
                    </div>

                    {/* Abstract Text with Teal Bounding Box Highlight */}
                    <div className="flex flex-col gap-4 text-[8.5px] leading-relaxed text-slate-700">
                      <p>
                        <strong>BACKGROUND:</strong> Adjuvant clinical therapies are evaluated to reduce recurrence risk in high-risk patient cohorts. Systematic endpoint monitoring is required to establish statistical significance.
                      </p>
                      
                      {/* Highlighted RAG sentence */}
                      <div className="bg-teal-400/20 text-slate-950 font-medium p-3 border-l-2 border-teal-500 rounded-sm leading-normal shadow-sm flex flex-col gap-1.5">
                        <p className="font-bold uppercase text-[7px] tracking-wider text-teal-700">Extracted Primary Endpoint Telemetry:</p>
                        <p>
                          <strong>RESULTS:</strong> The clinical study demonstrated an adjuvant Recurrence-Free Survival (RFS) rate of <span className="font-bold text-teal-700">{selectedTrial.metrics.rfs_rate}</span> compared to control. This translates to an audited Hazard Ratio (HR) of <span className="font-bold text-teal-700">{selectedTrial.metrics.hazard_ratio}</span> (p-value: <span className="font-bold text-teal-700">{selectedTrial.metrics.p_value}</span>).
                        </p>
                      </div>
                      
                      {selectedTrial.claims.length > 0 && (
                        <div className="flex flex-col gap-1 mt-1">
                          <strong className="text-[8px] uppercase tracking-wider text-slate-500">Extracted Core Claims:</strong>
                          <ul className="list-disc pl-3 space-y-1 text-slate-600">
                            {selectedTrial.claims.map((claim, idx) => (
                              <li key={idx}>{claim}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Page Footer */}
                    <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between text-[6px] text-slate-400 font-semibold">
                      <span>maestro.ai/rag-pipeline</span>
                      <span>Page {pdfPage} of 1</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Glassmorphic PDF Toolbar */}
              {selectedTrial && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-full px-5 py-2.5 flex items-center gap-4 text-slate-400 shadow-xl z-10 select-none">
                  <button onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))} className="hover:text-white transition-colors cursor-pointer"><ZoomOut size={14} /></button>
                  <span className="text-[10px] font-bold text-slate-200">{pdfZoom}%</span>
                  <button onClick={() => setPdfZoom(Math.min(150, pdfZoom + 10))} className="hover:text-white transition-colors cursor-pointer"><ZoomIn size={14} /></button>
                </div>
              )}

            </div>

            {/* RIGHT PANE (40%): Ingestion dropzone & RAG Telemetry */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
              
              {/* 1. File Upload Dropzone */}
              <div 
                onClick={() => setShowIngestModal(true)}
                className="p-5 bg-white border-2 border-dashed border-slate-250 hover:border-blue-600 hover:bg-blue-50/10 rounded-3xl flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-300 group cursor-pointer h-32 shrink-0 select-none shadow-sm"
              >
                <div className="p-2 bg-slate-100 border border-slate-200 rounded-xl group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-300 text-slate-450 shrink-0">
                  <UploadCloud size={16} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-850 group-hover:text-blue-600 transition-colors">
                    Click to Ingest New Clinical Trial (RAG)
                  </span>
                  <span className="text-[9px] text-slate-400">Extracts metrics and claims to ground Campaign Studio</span>
                </div>
              </div>

              {/* 2. Extracted Insights Panel (Teal RAG Telemetry Card) */}
              {selectedTrial && (
                <div className="relative p-4 bg-white border border-teal-500/25 rounded-3xl shadow-sm flex items-center justify-between gap-6 overflow-hidden shrink-0">
                  <div className="absolute -left-10 -top-10 w-28 h-28 bg-teal-500/5 rounded-full filter blur-2xl"></div>
                  
                  <div className="flex flex-col gap-0.5 z-10 min-w-0 flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Active Trial Telemetry</span>
                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      <span className="font-display font-black text-lg text-teal-650">Hazard Ratio: {selectedTrial.metrics.hazard_ratio}</span>
                      <span className="text-[8px] font-bold text-teal-655 uppercase tracking-wider bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                        RFS: {selectedTrial.metrics.rfs_rate}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium leading-normal mt-1 truncate">
                      Grounded in {selectedTrial.pdfName} · p-value: {selectedTrial.metrics.p_value}
                    </p>
                  </div>
                  
                  {/* Sparkline */}
                  <div className="w-14 h-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1 shrink-0">
                    <svg width="100%" height="100%" viewBox="0 0 100 25" preserveAspectRatio="none">
                      <path 
                        d="M 0 22 Q 20 2, 50 18 T 100 5" 
                        fill="none" 
                        stroke="#0d9488" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* 3. Clinical Documents Ledger (Scrollable List!) */}
              <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <h4 className="font-body text-xs font-bold uppercase tracking-wider text-slate-600">Clinical Documents Ledger</h4>
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-slate-100 pr-1">
                  {clinicalTrials.map((trial) => (
                    <div 
                      key={trial.id}
                      onClick={() => setSelectedTrialId(trial.id)}
                      className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                        selectedTrialId === trial.id 
                          ? "bg-blue-50/40" 
                          : "hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`p-2 rounded-xl bg-slate-100 text-slate-400 shrink-0 ${
                          selectedTrialId === trial.id ? "bg-blue-100 text-blue-600" : ""
                        }`}>
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-body font-bold text-xs text-slate-800 truncate" title={trial.name}>
                            {trial.name}
                          </p>
                          <p className="font-sans text-[9px] text-slate-450 mt-0.5">
                            {trial.pdfName} · Ingested {new Date(trial.ingestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          HR: {trial.metrics.hazard_ratio}
                        </span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ==========================================
         INGESTION MODAL (RAG SIMULATOR)
         ========================================== */}
      {showIngestModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/65 max-w-md w-full p-6 flex flex-col gap-5 animate-slide-in-top">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Database className="text-blue-600" size={18} />
                <h3 className="font-display font-bold text-sm text-slate-900">Ingest Clinical Study (RAG)</h3>
              </div>
              {!isIngesting && (
                <button 
                  onClick={() => setShowIngestModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Ingesting State Loader */}
            {isIngesting ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={36} />
                <div className="flex flex-col gap-1">
                  <p className="font-body font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Running PixelRAG Pipeline
                  </p>
                  <p className="font-sans text-[10px] text-slate-500 animate-pulse mt-0.5">
                    {ingestionStepTexts[ingestionStep]}
                  </p>
                </div>
                
                {/* Simulated Progress Bar */}
                <div className="w-48 h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 mt-2">
                  <div 
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(ingestionStep + 1) * 25}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleRunIngestion} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Study Title</label>
                  <input 
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Lenvima Adjuvant RCC Phase 3 Trial"
                    className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">PDF Source Filename</label>
                  <input 
                    type="text"
                    required
                    value={newPdfName}
                    onChange={(e) => setNewPdfName(e.target.value)}
                    placeholder="e.g. Lenvima_RCC_Study_2026.pdf"
                    className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Hazard Ratio</label>
                    <input 
                      type="text"
                      required
                      value={newHr}
                      onChange={(e) => setNewHr(e.target.value)}
                      placeholder="e.g. 0.62"
                      className="px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">RFS Rate</label>
                    <input 
                      type="text"
                      required
                      value={newRfs}
                      onChange={(e) => setNewRfs(e.target.value)}
                      placeholder="e.g. 75.4%"
                      className="px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">p-value</label>
                    <input 
                      type="text"
                      required
                      value={newPval}
                      onChange={(e) => setNewPval(e.target.value)}
                      placeholder="e.g. <0.01"
                      className="px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body font-bold text-[10px] text-slate-500 uppercase tracking-wider">Core Clinical Claims (One per line)</label>
                  <textarea 
                    value={newClaims}
                    onChange={(e) => setNewClaims(e.target.value)}
                    placeholder="Significant improvement in recurrence-free survival.&#10;Consistent safety profile across cohorts."
                    rows={3}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowIngestModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-body text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-xs font-bold shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Run Ingestion</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
