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

// =====================================================================
// ASSET CATALOG DATA
// =====================================================================
const assets = [
  {
    id: 1,
    type: 'video',
    name: 'Brand_Manifesto_2024.mp4',
    status: 'Approved',
    statusColor: 'blue',
    thumbnail: 'https://images.unsplash.com/photo-1528892952491-035c6d37a85c?q=80&w=2070&auto=format&fit=crop',
    duration: '00:42',
  },
  {
    id: 2,
    type: 'document',
    name: 'Compliance_Guidelines_EMEA.pdf',
    status: 'V3.1 Draft',
    statusColor: 'orange',
  },
  {
    id: 3,
    type: 'image',
    name: 'Product_Shot_Vial_01.jpg',
    status: 'Approved',
    statusColor: 'blue',
    thumbnail: 'https://images.unsplash.com/photo-1584982235212-9b01552a44a8?q=80&w=2070&auto=format&fit=crop',
  },
];

const AssetCard = ({ asset }: { asset: any }) => {
  const renderAsset = () => {
    switch (asset.type) {
      case 'video':
        return (
          <div className="aspect-square relative overflow-hidden">
            <img src={asset.thumbnail} className="w-full h-full object-cover" alt={asset.name} />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur text-blue-600 flex items-center justify-center shadow-lg">
                <Play style={{ fill: 'currentColor' }} className="ml-1" size={18} />
              </button>
            </div>
            <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur text-white font-mono text-[10px]">{asset.duration}</span>
          </div>
        );
      case 'document':
        return (
          <div className="aspect-square relative overflow-hidden bg-slate-100 flex items-center justify-center">
            <FileText className="h-16 w-16 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
          </div>
        );
      case 'image':
        return (
          <div className="aspect-square relative overflow-hidden">
            <img src={asset.thumbnail} className="w-full h-full object-cover" alt={asset.name} />
          </div>
        );
      default: return null
    }
  }

  return (
    <div className="col-span-12 md:col-span-4 lg:col-span-3 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-200/60">
      {renderAsset()}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="font-body font-bold text-sm text-slate-800 truncate pr-2">{asset.name}</span>
          <MoreVertical className="h-5 w-5 text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${asset.status === 'Approved' ? 'bg-blue-600' : 'bg-orange-500'}`}></span>
          <span className="font-sans text-xs text-slate-500">{asset.status}</span>
        </div>
      </div>
    </div>
  );
}

export function DigitalAssetLibrary() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ingest'>('catalog');
  const [isUploading, setIsUploading] = useState(false);
  const [hasFile, setHasFile] = useState(true); // Default to pre-populated mock file
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfPage, setPdfPage] = useState(1);

  // Simulate file upload & parsing
  const handleFileUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setHasFile(false);
    
    setTimeout(() => {
      setIsUploading(false);
      setHasFile(true);
      setPdfPage(1);
    }, 2000); // 2-second extraction delay
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      
      {/* =====================================================================
         1. DYNAMIC HEADER WITH TABS
         ===================================================================== */}
      <section className="px-10 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="relative">
            <h1 className="font-display text-4xl text-slate-900 tracking-tight max-w-xl">
              Content <span className="text-blue-600 italic">Intelligence</span> Library
            </h1>
            <p className="font-sans text-base text-slate-500 mt-2 max-w-lg">
              Enterprise-grade asset orchestration with real-time compliance tracking and RAG grounding.
            </p>
          </div>
          
          {/* Stats Counters */}
          <div className="flex gap-8 items-baseline">
            <div className="flex flex-col items-end">
              <span className="font-display text-5xl text-slate-900 leading-none">2.4k</span>
              <span className="font-body text-xs text-slate-500 uppercase tracking-widest mt-1">Total Assets</span>
            </div>
            <div className="w-px h-12 bg-slate-200/80"></div>
            <div className="flex flex-col items-end">
              <span className="font-display text-5xl text-blue-600 leading-none">98<span className="text-3xl">%</span></span>
              <span className="font-body text-xs text-slate-500 uppercase tracking-widest mt-1">MLR Compliance</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mt-8 gap-8">
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`pb-4 font-body text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'catalog' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            Asset Catalog
          </button>
          <button 
            onClick={() => setActiveTab('ingest')}
            className={`pb-4 font-body text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'ingest' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            <Database size={14} />
            Clinical Ingestion & RAG
          </button>
        </div>
      </section>

      {/* =====================================================================
         2. TAB CONTENT
         ===================================================================== */}
      <section className="px-10 pb-12">
        
        {/* ==========================================
           TAB 1: ASSET CATALOG
           ========================================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center bg-white shadow-sm rounded-full px-6 py-3 border border-slate-200/60">
              <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                <Search className="h-5 w-5 text-blue-600" />
                <input className="w-full bg-transparent border-none outline-none font-sans text-sm text-slate-900 placeholder:text-slate-400/80" placeholder="Search by tags, version, or MLR ID..." type="text"/>
              </div>
              <div className="h-8 w-px bg-slate-200/70 hidden lg:block"></div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-body text-xs font-bold hover:bg-blue-600/10 hover:text-blue-600 transition-all">
                  <Tag className="h-4 w-4" /> Tags
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-body text-xs font-bold shadow-lg shadow-blue-600/20">
                  <Settings className="h-4 w-4" /> Filters
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex gap-4 items-center">
                <h2 className="font-display text-lg text-slate-900">Recent Collections</h2>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]">VER: 4.2.0</span>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="p-2 rounded-md bg-white shadow-sm text-blue-600">
                  <Grid size={18} />
                </button>
                <button className="p-2 rounded-md text-slate-400 hover:text-slate-800">
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Featured Card */}
              <div className="col-span-12 lg:col-span-8 group relative rounded-3xl overflow-hidden bg-slate-800 shadow-sm border border-slate-200/60">
                <div className="aspect-[16/7] w-full overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1558494949-7e335284534f?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Global Oncology Q3 Portfolio Strategy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                  <div className="absolute top-6 left-6 z-20 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-body text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Approved for Use
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <h3 className="font-display text-xl text-white">Global Oncology Q3 Portfolio Strategy</h3>
                  </div>
                </div>
              </div>

              {/* EMEA Pipeline Card */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col gap-6">
                <div className="flex-1 bg-orange-500/10 rounded-3xl p-6 relative overflow-hidden group border border-orange-500/20">
                  <History className="absolute -right-4 -top-4 h-32 w-32 text-orange-500/10 group-hover:rotate-12 transition-transform duration-500" />
                  <h4 className="font-display text-lg text-orange-900 mb-2">MLR Pipeline</h4>
                  <p className="font-sans text-sm text-orange-950/80 mb-6">4 assets awaiting final legal signature for the EMEA region.</p>
                  <button className="w-full py-3 rounded-xl bg-orange-500 text-white font-body text-xs font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/10">
                    Review Queue
                  </button>
                </div>
              </div>

              {assets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
              
              {/* Upload Card Trigger */}
              <div 
                onClick={() => setActiveTab('ingest')}
                className="col-span-12 md:col-span-4 lg:col-span-3 group bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300/80 hover:border-blue-600 transition-all cursor-pointer"
              >
                <div className="aspect-square relative flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-3 group-hover:bg-blue-600/10 group-hover:text-blue-600 transition-colors">
                    <Plus />
                  </div>
                  <p className="font-body text-sm font-bold text-slate-800">Ingest Clinical Trial</p>
                  <p className="font-sans text-xs text-slate-500 mt-1">Upload PDF for RAG extraction</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
           TAB 2: CLINICAL INGESTION & RAG VIEW
           ========================================== */}
        {activeTab === 'ingest' && (
          <div className="grid grid-cols-12 gap-8">
            
            {/* LEFT PANE (60%): High-Fidelity PDF Document Viewer */}
            <div className="col-span-12 lg:col-span-7 flex flex-col bg-slate-900 border border-slate-850 rounded-3xl shadow-xl h-[620px] relative overflow-hidden">
              
              {/* PDF Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
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

              {/* Scrollable PDF Canvas */}
              <div className="flex-1 overflow-y-auto bg-slate-950 p-8 flex justify-center items-start">
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
                    className="w-full max-w-[440px] bg-white text-slate-900 p-8 rounded-sm shadow-2xl flex flex-col gap-5 aspect-[1/1.4] select-text transition-all duration-300"
                    style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                  >
                    
                    {/* Academic Paper Title */}
                    <div className="flex flex-col border-b border-slate-200 pb-3">
                      <span className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400">The New England Journal of Medicine</span>
                      <h4 className="font-display text-xs font-black text-slate-950 mt-1.5 leading-snug">
                        Adjuvant V940 (mRNA-4157) plus Pembrolizumab in Resected High-Risk Stage III/IV Melanoma
                      </h4>
                      <span className="text-[7px] font-semibold text-slate-400 mt-1">
                        Vol. 394 · No. 12 · Clinical Trial Report
                      </span>
                    </div>

                    {/* Abstract Text with Teal Bounding Box Highlight */}
                    <div className="flex flex-col gap-4 text-[9.5px] leading-relaxed text-slate-700">
                      <p>
                        <strong>BACKGROUND:</strong> Adjuvant immunotherapy has improved recurrence-free survival in patients with resected high-risk melanoma. However, the risk of recurrence remains substantial, and personalized therapeutic strategies targeting patient-specific neoantigens are warranted.
                      </p>
                      
                      {/* Highlighted RAG sentence */}
                      <p className="bg-teal-400/20 text-slate-950 font-medium px-2 py-1.5 border-l-2 border-teal-500 rounded-sm leading-normal shadow-sm">
                        <strong>RESULTS:</strong> In this phase 2b trial, the combination of personalized mRNA vaccine V940 plus pembrolizumab demonstrated an unprecedented 24-month recurrence-free survival (RFS) rate of 78.4% compared to pembrolizumab monotherapy, translating to a Hazard Ratio of 0.58 (95% CI: 0.32-0.84) and a 42% reduction in distant metastasis risk.
                      </p>
                      
                      <p>
                        <strong>CONCLUSIONS:</strong> Adjuvant treatment with the V940 personalized mRNA vaccine in combination with pembrolizumab prolongs recurrence-free survival in patients with resected high-risk melanoma without adding significant toxicities. Further phase 3 trials are ongoing to validate these findings.
                      </p>
                    </div>

                    {/* Page Footer */}
                    <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between text-[7px] text-slate-400 font-semibold">
                      <span>nejm.org/clinical-trials</span>
                      <span>Page {pdfPage} of 14</span>
                    </div>

                  </div>
                )}
              </div>

              {/* Floating Glassmorphic PDF Toolbar */}
              {hasFile && !isUploading && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-full px-5 py-2.5 flex items-center gap-4 text-slate-400 shadow-xl z-10 select-none">
                  <button onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))} className="hover:text-white transition-colors"><ZoomOut size={14} /></button>
                  <span className="text-[10px] font-bold text-slate-200">{pdfZoom}%</span>
                  <button onClick={() => setPdfZoom(Math.min(150, pdfZoom + 10))} className="hover:text-white transition-colors"><ZoomIn size={14} /></button>
                  
                  <div className="w-px h-3.5 bg-slate-800"></div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPdfPage(Math.max(1, pdfPage - 1))} className="hover:text-white transition-colors"><ChevronLeft size={14} /></button>
                    <span className="text-[10px] font-bold text-slate-200">{pdfPage} / 14</span>
                    <button onClick={() => setPdfPage(Math.min(14, pdfPage + 1))} className="hover:text-white transition-colors"><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT PANE (40%): Ingestion dropzone & RAG Telemetry */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              
              {/* 1. File Upload Dropzone */}
              <div 
                onClick={handleFileUpload}
                className="p-8 bg-white border-2 border-dashed border-slate-200 hover:border-blue-600 hover:bg-blue-50/20 rounded-3xl flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 group cursor-pointer h-44 select-none shadow-sm"
              >
                <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-300 text-slate-400">
                  <UploadCloud size={22} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Drag & drop clinical trials PDF or click to browse
                  </span>
                  <span className="text-[10px] text-slate-400">Supports PDF, PPTX, XLSX up to 25MB</span>
                </div>
              </div>

              {/* 2. Extracted Insights Panel (Teal RAG Telemetry Card) */}
              {hasFile && !isUploading && (
                <div className="relative p-6 bg-white border-2 border-teal-500/30 rounded-3xl shadow-sm flex items-center justify-between gap-6 overflow-hidden">
                  <div className="absolute -left-10 -top-10 w-28 h-28 bg-teal-500/5 rounded-full filter blur-2xl"></div>
                  
                  <div className="flex flex-col gap-1.5 z-10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Extracted RAG Telemetry</span>
                    <div className="flex items-baseline gap-2.5 mt-1">
                      <span className="font-display font-black text-2xl text-teal-600">Hazard Ratio: 0.58</span>
                      <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                        42% Risk Reduction
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium leading-relaxed mt-1">
                      Statistically significant OS improvement validated in adjuvant stage III/IV Melanoma trials.
                    </p>
                  </div>
                  
                  {/* Sparkline */}
                  <div className="w-20 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shrink-0">
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

              {/* 3. Extraction Summary Metadata List */}
              {hasFile && !isUploading && (
                <div className="p-6 bg-white border border-slate-200/60 rounded-3xl shadow-sm flex flex-col gap-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-body text-xs font-bold uppercase tracking-wider text-slate-500">Extraction Summary</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { label: "Target Asset", val: "V940 (mRNA personalized)" },
                      { label: "Oncology Indication", val: "High-Risk Stage III/IV Melanoma" },
                      { label: "Telemetry Standard", val: "Adjuvant Sequencing Protocol" },
                      { label: "Source Reference", val: "NEJM-2026-889 · Trial Phase 2b" }
                    ].map((meta, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{meta.label}</span>
                        <span className="text-xs font-bold text-slate-800">{meta.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-bold uppercase rounded-full">
                      <CheckCircle2 size={12} className="text-emerald-500" /> Grounded & Indexed
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                      View Citation Record <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </section>
    </div>
  );
}
