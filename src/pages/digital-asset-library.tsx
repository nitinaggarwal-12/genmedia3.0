import React, { useState } from 'react';
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
  Loader2
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
  const { campaigns } = useCampaign();
  const [activeTab, setActiveTab] = useState<'catalog' | 'ingest'>('catalog');
  const [isUploading, setIsUploading] = useState(false);
  const [hasFile, setHasFile] = useState(true); 
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfPage, setPdfPage] = useState(1);

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

  // Simulate file upload & parsing
  const handleFileUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setHasFile(false);
    
    setTimeout(() => {
      setIsUploading(false);
      setHasFile(true);
      setPdfPage(1);
    }, 2000);
  };

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
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/30 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Database size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Library Assets</span>
              <span className="text-sm font-bold text-slate-800">{allAssets.length + 140}</span>
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
              : 'text-slate-400 hover:text-slate-800'
          }`}
        >
          Asset Catalog
        </button>
        <button 
          onClick={() => setActiveTab('ingest')}
          className={`pb-3 font-body text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ingest' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-slate-400 hover:text-slate-800'
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
            {/* Search & Filters Bar (shrink-0) */}
            <div className="flex flex-col lg:flex-row gap-4 items-center bg-white shadow-sm rounded-full px-6 py-2.5 border border-slate-200/60 shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                <Search className="h-4 w-4 text-blue-600" />
                <input className="w-full bg-transparent border-none outline-none font-sans text-xs text-slate-900 placeholder:text-slate-400/80" placeholder="Search by tags, version, or MLR ID..." type="text"/>
              </div>
              <div className="h-6 w-px bg-slate-200/70 hidden lg:block"></div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 font-body text-[10px] font-bold hover:bg-blue-600/10 hover:text-blue-600 transition-all cursor-pointer">
                  <Tag className="h-3.5 w-3.5" /> Tags
                </button>
                <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 text-white font-body text-[10px] font-bold shadow-md shadow-blue-600/10 cursor-pointer">
                  <Settings className="h-3.5 w-3.5" /> Filters
                </button>
              </div>
            </div>

            {/* Catalog Subheader (shrink-0) */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 shrink-0">
              <div className="flex gap-4 items-center">
                <h2 className="font-display text-base font-bold text-slate-900">Recent Collections</h2>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px]">VER: 4.2.0</span>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="p-1.5 rounded-md bg-white shadow-sm text-blue-600">
                  <Grid size={16} />
                </button>
                <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-850">
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Assets Grid (flex-1) */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4">
              <div className="grid grid-cols-12 gap-6">
                {/* Featured Card */}
                <div className="col-span-12 lg:col-span-8 group relative rounded-3xl overflow-hidden bg-slate-800 shadow-sm border border-slate-200/60 h-48">
                  <img src="https://images.unsplash.com/photo-1558494949-7e335284534f?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" alt="Global Oncology Q3 Portfolio Strategy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600/95 backdrop-blur-md text-white font-body text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
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
                      <p className="font-sans text-[11px] text-orange-950/80 mt-1">Pending legal signature for EMEA oncology campaigns.</p>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-orange-500 text-white font-body text-xs font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/10 cursor-pointer">
                      Review Queue
                    </button>
                  </div>
                </div>

                {/* Render Mapped Assets */}
                {allAssets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
                
                {/* Upload Card Trigger */}
                <div 
                  onClick={() => setActiveTab('ingest')}
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 group bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300/80 hover:border-blue-600 transition-all cursor-pointer h-full min-h-[160px]"
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
            
            {/* LEFT PANE (60%): High-Fidelity PDF Document Viewer (h-full flex flex-col) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col bg-slate-900 border border-slate-850 rounded-3xl shadow-xl h-full relative overflow-hidden">
              
              {/* PDF Header (shrink-0) */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-2.5">
                  <FileText className="text-teal-400" size={16} />
                  <span className="font-body text-xs font-bold uppercase tracking-wider text-slate-300">
                    {hasFile ? "NEJM-2026-889.pdf" : "No Document Loaded"}
                  </span>
                </div>
                {hasFile && (
                  <span className="font-mono text-[9px] font-bold px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg">
                    345 KB · Source Document
                  </span>
                )}
              </div>

              {/* Scrollable PDF Canvas (flex-1) */}
              <div className="flex-1 overflow-y-auto bg-slate-950 p-8 flex justify-center items-start min-h-0">
                {isUploading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="animate-spin text-teal-400" size={32} />
                    <span className="font-body text-xs font-bold uppercase tracking-wider">Extracting RAG Telemetry...</span>
                  </div>
                ) : !hasFile ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                    <FileText size={48} className="text-slate-700 mb-3" />
                    <p className="font-body text-sm font-bold text-slate-400">No trial document ingested</p>
                    <p className="font-sans text-xs text-slate-500 mt-1">Upload a PDF briefing on the right to trigger parsing.</p>
                  </div>
                ) : (
                  /* Mock Physical PDF Page */
                  <div 
                    className="w-full max-w-[420px] bg-white text-slate-900 p-8 rounded-sm shadow-2xl flex flex-col gap-5 aspect-[1/1.4] select-text transition-all duration-300 shrink-0"
                    style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                  >
                    {/* Academic Paper Title */}
                    <div className="flex flex-col border-b border-slate-200 pb-3">
                      <span className="text-[7px] font-bold uppercase tracking-widest text-slate-455">The New England Journal of Medicine</span>
                      <h4 className="font-display text-[11px] font-black text-slate-950 mt-1.5 leading-snug">
                        Adjuvant V940 (mRNA-4157) plus Pembrolizumab in Resected High-Risk Stage III/IV Melanoma
                      </h4>
                      <span className="text-[7px] font-semibold text-slate-400 mt-1">
                        Vol. 394 · No. 12 · Clinical Trial Report
                      </span>
                    </div>

                    {/* Abstract Text with Teal Bounding Box Highlight */}
                    <div className="flex flex-col gap-4 text-[9px] leading-relaxed text-slate-700">
                      <p>
                        <strong>BACKGROUND:</strong> Adjuvant immunotherapy has improved recurrence-free survival in patients with resected high-risk melanoma. However, the risk of recurrence remains substantial.
                      </p>
                      
                      {/* Highlighted RAG sentence */}
                      <p className="bg-teal-400/25 text-slate-950 font-medium px-2 py-1.5 border-l-2 border-teal-500 rounded-sm leading-normal shadow-sm">
                        <strong>RESULTS:</strong> In this phase 2b trial, the combination of personalized mRNA vaccine V940 plus pembrolizumab demonstrated an unprecedented 24-month recurrence-free survival (RFS) rate of 78.4% compared to pembrolizumab monotherapy, translating to a Hazard Ratio of 0.58 (95% CI: 0.32-0.84) and a 42% reduction in distant metastasis risk.
                      </p>
                      
                      <p>
                        <strong>CONCLUSIONS:</strong> Adjuvant treatment with the V940 personalized mRNA vaccine in combination with pembrolizumab prolongs recurrence-free survival in stage III/IV melanoma.
                      </p>
                    </div>

                    {/* Page Footer */}
                    <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between text-[6.5px] text-slate-400 font-semibold">
                      <span>nejm.org/clinical-trials</span>
                      <span>Page {pdfPage} of 14</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Glassmorphic PDF Toolbar (shrink-0) */}
              {hasFile && !isUploading && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-full px-5 py-2.5 flex items-center gap-4 text-slate-400 shadow-xl z-10 select-none">
                  <button onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))} className="hover:text-white transition-colors cursor-pointer"><ZoomOut size={14} /></button>
                  <span className="text-[10px] font-bold text-slate-200">{pdfZoom}%</span>
                  <button onClick={() => setPdfZoom(Math.min(150, pdfZoom + 10))} className="hover:text-white transition-colors cursor-pointer"><ZoomIn size={14} /></button>
                  
                  <div className="w-px h-3.5 bg-slate-800"></div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPdfPage(Math.max(1, pdfPage - 1))} className="hover:text-white transition-colors cursor-pointer"><ChevronLeft size={14} /></button>
                    <span className="text-[10px] font-bold text-slate-200">{pdfPage} / 14</span>
                    <button onClick={() => setPdfPage(Math.min(14, pdfPage + 1))} className="hover:text-white transition-colors cursor-pointer"><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT PANE (40%): Ingestion dropzone & RAG Telemetry (h-full flex flex-col) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
              
              {/* 1. File Upload Dropzone (shrink-0) */}
              <div 
                onClick={handleFileUpload}
                className="p-6 bg-white border-2 border-dashed border-slate-200 hover:border-blue-600 hover:bg-blue-50/10 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 group cursor-pointer h-36 shrink-0 select-none shadow-sm"
              >
                <div className="p-2 bg-slate-100 border border-slate-200 rounded-xl group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-300 text-slate-450 shrink-0">
                  <UploadCloud size={18} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-850 group-hover:text-blue-600 transition-colors">
                    Drag & drop clinical trials PDF or click to browse
                  </span>
                  <span className="text-[9px] text-slate-400">Supports PDF, PPTX, XLSX up to 25MB</span>
                </div>
              </div>

              {/* 2. Extracted Insights Panel (Teal RAG Telemetry Card - shrink-0) */}
              {hasFile && !isUploading && (
                <div className="relative p-5 bg-white border border-teal-500/25 rounded-3xl shadow-sm flex items-center justify-between gap-6 overflow-hidden shrink-0">
                  <div className="absolute -left-10 -top-10 w-28 h-28 bg-teal-500/5 rounded-full filter blur-2xl"></div>
                  
                  <div className="flex flex-col gap-1 z-10 min-w-0 flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Extracted RAG Telemetry</span>
                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      <span className="font-display font-black text-xl text-teal-600">Hazard Ratio: 0.58</span>
                      <span className="text-[8px] font-bold text-teal-600 uppercase tracking-wider bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                        42% Risk Reduction
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-600 font-medium leading-relaxed mt-1">
                      Statistically significant OS improvement validated in adjuvant stage III/IV Melanoma trials.
                    </p>
                  </div>
                  
                  {/* Sparkline */}
                  <div className="w-16 h-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                    <svg width="100%" height="100%" viewBox="0 0 100 25" preserveAspectRatio="none">
                      <path 
                        d="M 0 22 Q 20 2, 50 18 T 100 5" 
                        fill="none" 
                        stroke="#0d9488" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* 3. Extraction Summary Metadata List (flex-1 min-h-0 flex flex-col) */}
              {hasFile && !isUploading && (
                <div className="p-6 bg-white border border-slate-200/60 rounded-3xl shadow-sm flex flex-col gap-5 flex-1 min-h-0">
                  <div className="border-b border-slate-100 pb-3 shrink-0">
                    <h4 className="font-body text-xs font-bold uppercase tracking-wider text-slate-500">Extraction Summary</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto min-h-0 pr-1">
                    {[
                      { label: "Target Asset", val: "V940 (mRNA personalized)" },
                      { label: "Oncology Indication", val: "High-Risk Stage III/IV Melanoma" },
                      { label: "Telemetry Standard", val: "Adjuvant Sequencing Protocol" },
                      { label: "Source Reference", val: "NEJM-2026-889 · Trial Phase 2b" }
                    ].map((meta, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{meta.label}</span>
                        <span className="text-xs font-bold text-slate-800 leading-snug">{meta.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-bold uppercase rounded-full">
                      <CheckCircle2 size={12} className="text-emerald-500" /> Grounded & Indexed
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                      View Citation Record <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
