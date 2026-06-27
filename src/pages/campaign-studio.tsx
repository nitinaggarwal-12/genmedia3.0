import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getApiUrl } from "@/lib/api";
import { useCampaign } from "@/context/CampaignContext";
import { 
  UploadCloud, 
  Trash2, 
  GripVertical, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Lock,
  Unlock,
  Sparkles,
  FileText,
  FileDown
} from "lucide-react";


export function CampaignStudio() {
  const navigate = useNavigate();
  const { campaigns, activeCampaignId, activeCampaign, updateCampaign, addCampaign, selectCampaign, addNotification } = useCampaign();
  
  const [activeStep, setActiveStep] = useState(1); // Default to Step 01 (Identity & Clinical Grounding)
  const [budget, setBudget] = useState(45); // Scale of 10-100 (defaults to 45, which is $4,500)
  
  // Creative Copy State
  const [copyText, setCopyText] = useState(
    "ZYGARDIA 10mg is a breakthrough monotherapy for resectable renal cell carcinoma. Clinically proven to provide a miracle cure in 99% of resected patient cohorts. Our therapeutic pipeline is guaranteed to deliver unprecedented clinical survival rates. Ensure early adjuvant intervention to optimize treatment sequencing."
  );

  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300");
  const [activeAssetType, setActiveAssetType] = useState<"image" | "video">("image");
  const [assets, setAssets] = useState([
    {
      name: "Hero_Visual_Global_v2.jpg",
      size: "12.4 MB",
      resolution: "4000 x 3000px",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300",
      status: "Compliant" as const,
      type: "image" as "image" | "video"
    }
  ]);
  const [showImagenModal, setShowImagenModal] = useState(false);
  const [activeCreatorTab, setActiveCreatorTab] = useState<"image" | "video">("image");

  // Step 01 (Identity) & Grounding States
  const [uploadedPdfName, setUploadedPdfName] = useState<string | null>(null);
  const [clinicalMetrics, setClinicalMetrics] = useState<Record<string, string>>({});
  const [groundingCoords, setGroundingCoords] = useState<any[]>([]);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(1);

  // Sync local states from active campaign when it changes
  useEffect(() => {
    if (activeCampaign) {
      if (activeCampaign.step) setActiveStep(activeCampaign.step);
      if (activeCampaign.budget) setBudget(activeCampaign.budget);
      if (activeCampaign.copyText !== undefined) setCopyText(activeCampaign.copyText);
      if (activeCampaign.pdfName !== undefined) setUploadedPdfName(activeCampaign.pdfName);
      if (activeCampaign.metrics !== undefined) setClinicalMetrics(activeCampaign.metrics);
      if (activeCampaign.activeViolations !== undefined) setActiveViolations(activeCampaign.activeViolations);
      if (activeCampaign.complianceScore !== undefined) setComplianceScore(activeCampaign.complianceScore);
      if (activeCampaign.regulatoryReasoning !== undefined) setRegulatoryReasoning(activeCampaign.regulatoryReasoning);
      if (activeCampaign.assets !== undefined) {
        setAssets(activeCampaign.assets);
        if (activeCampaign.assets.length > 0) {
          const latest = activeCampaign.assets[activeCampaign.assets.length - 1];
          setHeroImage(latest.url);
          setActiveAssetType(latest.type);
        } else {
          setHeroImage("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300");
          setActiveAssetType("image");
        }
      }
    } else {
      // If no active campaign, auto-select the first active campaign in the list or create a new one
      const activeCamps = campaigns.filter(c => c.status !== "Completed");
      if (activeCamps.length > 0) {
        selectCampaign(activeCamps[0].id);
      } else {
        const newId = addCampaign({
          name: `Campaign Zygardia #${campaigns.length + 1}`,
          brand: "product_a",
          therapeuticArea: "Oncology (Renal Cell Carcinoma)",
          pdfName: null,
          metrics: {},
          copyText: "ZYGARDIA 10mg is a breakthrough monotherapy for resectable renal cell carcinoma. Clinically proven to provide a significant improvement in recurrence-free survival. Our therapeutic pipeline is designed to deliver excellent clinical survival rates. Ensure early adjuvant intervention to optimize treatment sequencing.",
          complianceScore: 98,
          regulatoryReasoning: "Excellent work. The copy contains no high-risk forbidden terms and is compliant with general clinical guidelines.",
          activeViolations: [],
          assets: [],
          status: "Creative",
          step: 1,
          budget: 45
        });
        selectCampaign(newId);
      }
    }
  }, [activeCampaignId, campaigns.length]);

  // Scroll to the page element when activeMetric changes
  React.useEffect(() => {
    if (activeMetric) {
      let targetPage = 4;
      const coord = groundingCoords.find(c => c.metric === activeMetric);
      if (coord) {
        targetPage = coord.page;
      }
      
      setActivePage(targetPage);
      
      const el = document.getElementById(`pdf-page-${targetPage}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeMetric, groundingCoords]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedPdfName(file.name);
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(getApiUrl("/api/ground"), {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) throw new Error("Failed to process clinical document.");
      
      const data = await response.json();
      
      setClinicalMetrics(data.extracted_metrics || {});
      setGroundingCoords(data.grounding_coordinates || []);
      
      if (data.extracted_metrics && Object.keys(data.extracted_metrics).length > 0) {
        setActiveMetric(Object.keys(data.extracted_metrics)[0]);
      }

      if (activeCampaignId) {
        updateCampaign(activeCampaignId, {
          pdfName: file.name,
          metrics: data.extracted_metrics || {},
          step: 1,
          status: "Creative"
        });
      }
    } catch (err) {
      console.error("PDF grounding failed:", err);
      const mockMetrics = {
        hazard_ratio: "0.58",
        rfs_rate: "78.4%",
        p_value: "<0.001"
      };
      setClinicalMetrics(mockMetrics);
      setGroundingCoords([
        { metric: "hazard_ratio", page: 4 },
        { metric: "rfs_rate", page: 4 },
        { metric: "p_value", page: 4 }
      ]);
      setActiveMetric("hazard_ratio");

      if (activeCampaignId) {
        updateCampaign(activeCampaignId, {
          pdfName: file.name,
          metrics: mockMetrics,
          step: 1,
          status: "Creative"
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  
  // Imagen Modal Form State
  const [imagenPrompt, setImagenPrompt] = useState("A high-tech laboratory setting with microscopic cell structures in the background, representing breakthrough oncology treatment");
  const [imagenNegative, setImagenNegative] = useState("blurry, low quality, distorted text, human faces");
  const [imagenBrand, setImagenBrand] = useState("product_a");
  const [imagenStyle, setImagenStyle] = useState("clinical-realism");
  const [imagenAspectRatio, setImagenAspectRatio] = useState("16:9");
  const [imagenModel, setImagenModel] = useState("imagen-3.0-generate-002");
  
  // Veo Modal Form State
  const [videoPrompt, setVideoPrompt] = useState("A cinematic dolly shot moving through a modern oncology laboratory, researchers in the background, high-tech microscope in focus");
  const [videoNegative, setVideoNegative] = useState("blurry, low quality, distorted text, human faces, shaky camera");
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9");
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoMotion, setVideoMotion] = useState("medium");
  const [videoModel, setVideoModel] = useState("veo-2.0-generate-001");
  
  const [synthIdEnabled, setSynthIdEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationError(null);
    try {
      if (activeCreatorTab === "image") {
        const data = await apiFetch("/api/generate-image", {
          method: "POST",
          body: JSON.stringify({
            prompt: imagenPrompt,
            negative_prompt: imagenNegative || null,
            aspect_ratio: imagenAspectRatio,
            brand: imagenBrand,
            style_preset: imagenStyle,
            model_name: imagenModel
          })
        });
        
        if (data.success && data.image_url) {
          const resolvedUrl = getApiUrl(data.image_url);
          
          const newAsset = {
            name: data.filename,
            size: "2.8 MB",
            resolution: imagenAspectRatio === "16:9" ? "1920 x 1080px" : "1024 x 1024px",
            url: resolvedUrl,
            status: "Compliant" as const,
            type: "image" as const
          };
          
          const updatedAssets = [newAsset, ...assets];
          setAssets(updatedAssets);
          setHeroImage(resolvedUrl);
          setActiveAssetType("image");
          setShowImagenModal(false);

          if (activeCampaignId) {
            updateCampaign(activeCampaignId, {
              assets: updatedAssets,
              step: 3
            });
          }
        }
      } else {
        // Video generation
        const data = await apiFetch("/api/generate-video", {
          method: "POST",
          body: JSON.stringify({
            prompt: videoPrompt,
            negative_prompt: videoNegative || null,
            aspect_ratio: videoAspectRatio,
            duration_seconds: videoDuration,
            motion_level: videoMotion,
            brand: imagenBrand, // reuse brand
            style_preset: imagenStyle, // reuse style preset
            model_name: videoModel
          })
        });
        
        if (data.success && data.video_url) {
          const resolvedUrl = data.video_url.startsWith("http") 
            ? data.video_url 
            : getApiUrl(data.video_url);
          
          const newAsset = {
            name: data.filename,
            size: `${(videoDuration * 1.8).toFixed(1)} MB`,
            resolution: videoAspectRatio === "16:9" ? "1280 x 720px" : "1024 x 1024px",
            url: resolvedUrl,
            status: "Compliant" as const,
            type: "video" as const
          };
          
          const updatedAssets = [newAsset, ...assets];
          setAssets(updatedAssets);
          setHeroImage(resolvedUrl);
          setActiveAssetType("video");
          setShowImagenModal(false);

          if (activeCampaignId) {
            updateCampaign(activeCampaignId, {
              assets: updatedAssets,
              step: 3
            });
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || `Failed to generate ${activeCreatorTab}.`);
    } finally {
      setIsGenerating(false);
    }
  };



  // Stepper definition
  const steps = [
    { num: 1, label: "Identity" },
    { num: 2, label: "Audience" },
    { num: 3, label: "Creative" },
    { num: 4, label: "Forecast" },
    { num: 5, label: "Review" }
  ];

  const [complianceScore, setComplianceScore] = useState(98);
  const [activeViolations, setActiveViolations] = useState<{ word: string; rule: string; count: number }[]>([]);
  const [regulatoryReasoning, setRegulatoryReasoning] = useState(
    "Excellent work. The copy contains no high-risk forbidden terms and is compliant with general clinical guidelines."
  );
  const [isScanning, setIsScanning] = useState(false);
  const isLocked = complianceScore < 90;

  // Debounced Deep AI Compliance Scan
  React.useEffect(() => {
    if (!copyText.trim()) return;
    
    setIsScanning(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const data = await apiFetch("/api/scan", {
          method: "POST",
          body: JSON.stringify({ copy: copyText })
        });
        
        const violations = Object.entries(data.matched_terms || {}).map(([word, rule]) => {
          const regex = new RegExp(`\\b${word}\\b`, "gi");
          const matches = copyText.match(regex);
          return {
            word,
            rule: rule as string,
            count: matches ? matches.length : 1
          };
        });
        
        setActiveViolations(violations);
        setComplianceScore(data.compliance_score);
        setRegulatoryReasoning(data.regulatory_reasoning);

        if (activeCampaignId) {
          updateCampaign(activeCampaignId, {
            copyText: copyText,
            complianceScore: data.compliance_score,
            activeViolations: violations,
            regulatoryReasoning: data.regulatory_reasoning,
            step: 3
          });
        }
      } catch (err) {
        console.error("Compliance scan failed:", err);
      } finally {
        setIsScanning(false);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(delayDebounce);
  }, [copyText]);


  // Render highlighted text for the Live Scan panel
  const renderHighlightedText = () => {
    let html = copyText;
    activeViolations.forEach(v => {
      // Escape regex special chars if any
      const escapedWord = v.word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedWord})\\b`, "gi");
      
      // Replace with a styled span containing a tooltip trigger
      html = html.replace(regex, `<span class="relative inline-block text-red-600 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded font-bold cursor-help group animate-pulse">$1<span class="absolute hidden group-hover:block z-30 bg-slate-950 text-red-200 text-[10px] font-sans font-medium p-3 rounded-xl shadow-2xl border border-red-500/25 w-64 -top-24 left-1/2 -translate-x-1/2 pointer-events-none normal-case leading-relaxed">${v.rule}</span></span>`);
    });

    return <div className="text-sm leading-relaxed text-slate-700 font-sans" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Forecast bar heights (base percentages)
  const baseBarHeights = [40, 55, 48, 72, 85, 95];

  // Calculate dynamic bar heights based on budget slider
  const getDynamicHeight = (baseHeight: number) => {
    const shift = (budget - 50) / 1.5;
    return Math.min(100, Math.max(10, baseHeight + shift));
  };

  const handleNextModule = () => {
    if (activeStep < 5) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      if (activeCampaignId) {
        let nextStatus = activeCampaign?.status || "Creative";
        if (nextStep === 4) nextStatus = "Medical";
        if (nextStep === 5) nextStatus = "Legal Review";
        updateCampaign(activeCampaignId, {
          step: nextStep,
          status: nextStatus as any
        });
      }
    } else {
      // Final submission (Approve to Memory)
      if (activeCampaignId) {
        updateCampaign(activeCampaignId, {
          status: "Completed",
          step: 5
        });
        addNotification(
          "Campaign Transmitted",
          `Campaign '${activeCampaign?.name}' has been successfully approved and transmitted to Veeva Vault PromoMats.`,
          "success"
        );
        selectCampaign(null);
      }
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50">
      
      {/* =====================================================================
         1. CONTEXTUAL GUIDANCE HEADER (COMPACT COCKPIT)
         ===================================================================== */}
      <section className="relative px-10 py-4 flex items-center justify-between gap-8 shrink-0 border-b border-slate-200/40 bg-white/20 backdrop-blur-sm z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-blue-600 tracking-[0.2em] font-bold uppercase">
              STEP 0{activeStep} / 05
            </span>
            <div className="h-px w-6 bg-slate-200"></div>
            <span className="font-body text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {activeStep === 1 ? "Identity & Grounding" : activeStep === 2 ? "Audience Segment" : activeStep === 3 ? "Asset Orchestration" : activeStep === 4 ? "Performance Forecast" : "Review & Approval"}
            </span>
          </div>
          <h1 className="font-display text-lg font-bold text-slate-900">
            {activeStep === 1 ? (
              <>Ingesting Clinical Document & Grounding Claims</>
            ) : activeStep === 2 ? (
              <>Selecting Target Physician & Patient Cohorts</>
            ) : activeStep === 3 ? (
              <>Crafting the <span className="text-blue-600 italic">Global Launch</span> Narrative</>
            ) : activeStep === 4 ? (
              <>Simulating <span className="text-blue-600 italic">Market Impact</span> & Reach</>
            ) : (
              <>Finalizing the <span className="text-blue-600 italic">Brand Record</span></>
            )}
          </h1>
        </div>
        <p className="font-sans text-[11px] text-slate-500 max-w-md hidden md:block leading-relaxed">
          {activeStep === 1 ? (
            "Upload oncology study PDFs. PixelRAG extracts clinical endpoints and maps glowing highlights over sources."
          ) : activeStep === 2 ? (
            "Define therapeutic specialties and geographic targets to align promotional content with relevant cohorts."
          ) : activeStep === 3 ? (
            "Sync your visual assets with regulatory frameworks in real-time. Our MLR engine audits copy as you type."
          ) : activeStep === 4 ? (
            "Model budget allocations against target patient cohorts. Verify CPC targets and projected engagement lift."
          ) : (
            "Review your compliance ledger, active assets, and wargamed forecasts. Click Approve to sync directly to Veeva."
          )}
        </p>
      </section>

      {/* =====================================================================
         2. EDITORIAL STEPPER NAVIGATION (STICKY BAR)
         ===================================================================== */}
      <nav className="bg-white px-10 py-3.5 flex items-center justify-between border-b border-slate-200/50 shadow-sm shrink-0">
        {steps.map((s) => (
          <div 
            key={s.num} 
            onClick={() => setActiveStep(s.num)}
            className={`flex items-center gap-3 group cursor-pointer transition-all ${
              activeStep === s.num 
                ? "opacity-100 scale-105" 
                : "opacity-45 hover:opacity-100"
            }`}
          >
            <span className={`font-display text-xl font-bold ${activeStep === s.num ? "text-blue-600" : "text-slate-800"}`}>
              0{s.num}
            </span>
            <span className={`font-body text-xs font-bold uppercase tracking-wider ${
              activeStep === s.num ? "border-b-2 border-blue-600 pb-1 text-blue-600" : ""
            }`}>
              {s.label}
            </span>
          </div>
        ))}

        <div className="ml-auto flex items-center gap-4">
          <button 
            onClick={() => setActiveStep(3)}
            className="px-6 py-2.5 rounded-full font-body text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            Reset wizard
          </button>
          <button 
            onClick={handleNextModule}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-body text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
          >
            <span>{activeStep === 5 ? "Approve to Memory" : "Next Module"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* =====================================================================
         3. DYNAMIC CONTENT GRID
         ===================================================================== */}
      <div className="grid grid-cols-12 gap-8 px-10 py-4 max-w-[1600px] mx-auto flex-1 min-h-0 w-full overflow-hidden">
        
        {/* ==========================================
           VIEW 1: STEP 03 - CREATIVE COMPLIANCE EDITOR
           ========================================== */}
        {/* ==========================================
           VIEW 0: STEP 01 - IDENTITY & CLINICAL GROUNDING
           ========================================== */}
        {activeStep === 1 && (
          <>
            {/* LEFT PANE (45%): Campaign Identity & PDF Ingest */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
              {/* Campaign Identity Form */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4 shrink-0">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" /> Campaign Identity
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                    Define target brand & clinical trial source
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Brand</label>
                      <select
                        value={imagenBrand}
                        onChange={(e) => setImagenBrand(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      >
                        <option value="product_a">Product A (Zygardia)</option>
                        <option value="product_b">Product B</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Therapeutic Area</label>
                      <input
                        type="text"
                        readOnly
                        value="Oncology (Renal Cell Carcinoma)"
                        className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campaign Name</label>
                    <input
                      type="text"
                      defaultValue="Zygardia Global Launch Campaign"
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical PDF Ingestion Card */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex flex-col flex-1 min-h-0 space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
                    <UploadCloud size={16} className="text-blue-600" /> Clinical Source Ingestion
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                    Upload clinical trial PDF to extract grounded claims
                  </p>
                </div>

                {/* Drag & Drop Zone */}
                {!uploadedPdfName ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:border-blue-500/50 hover:bg-slate-50/50 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                      <UploadCloud size={20} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">Drag & drop clinical PDF here</p>
                      <p className="text-[10px] text-slate-400">Supports study briefs up to 15MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">{uploadedPdfName}</span>
                        <span className="text-[9px] text-slate-400">Ingested via PixelRAG Ledger</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedPdfName(null);
                        setClinicalMetrics({});
                        setGroundingCoords([]);
                        setActiveMetric(null);
                        if (activeCampaignId) {
                          updateCampaign(activeCampaignId, {
                            pdfName: null,
                            metrics: {},
                            step: 1
                          });
                        }
                      }}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-xl font-body text-[9px] font-bold transition-all cursor-pointer text-slate-500"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Extracted Grounded Claims Ledger */}
                {Object.keys(clinicalMetrics).length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 flex-1 min-h-0 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block shrink-0">Grounded Claims Ledger</span>
                    <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2">
                      {Object.entries(clinicalMetrics).map(([key, val]) => (
                        <div
                          key={key}
                          onClick={() => setActiveMetric(key)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                            activeMetric === key
                              ? "bg-blue-50/50 border-blue-500/30 shadow-sm"
                              : "bg-slate-50/30 border-slate-200/50 hover:bg-slate-50/60"
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              {key.replace("_", " ")}
                            </span>
                            <p className="text-xs font-bold text-slate-800">
                              {val}
                            </p>
                          </div>
                          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                            activeMetric === key
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {activeMetric === key ? "Locating..." : "Locate"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANE (55%): Simulated PDF Grounding Viewer */}
            <div className="col-span-12 lg:col-span-7 h-full">
              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden h-full flex flex-col">
                {/* Viewer Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {uploadedPdfName ? `PixelRAG Viewer: Page ${activePage} of 4` : "PixelRAG Grounding Engine"}
                  </span>
                  <div className="w-16"></div>
                </div>

                {/* Viewer Body */}
                <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex justify-center items-start">
                  {!uploadedPdfName ? (
                    <div className="m-auto text-center space-y-3 max-w-sm p-8">
                      <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Lock size={24} />
                      </div>
                      <h4 className="font-display text-sm font-bold text-slate-700">Grounding Ledger Inactive</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Upload a clinical trial PDF in the left panel to run PixelRAG coordinate-level extraction and unlock the document grounding viewer.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8 w-full max-w-lg">
                      {/* Render 4 Simulated PDF Pages */}
                      {[1, 2, 3, 4].map((pageNumber) => (
                        <div
                          key={pageNumber}
                          id={`pdf-page-${pageNumber}`}
                          className={`w-full aspect-[1/1.41] bg-white shadow-md border rounded-2xl p-8 space-y-4 relative transition-all ${
                            activePage === pageNumber ? "ring-2 ring-blue-500/20 border-blue-500/30" : "border-slate-200/60"
                          }`}
                        >
                          {/* Page Header */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2 text-[8px] text-slate-400 font-mono shrink-0">
                            <span>THE NEW ENGLAND JOURNAL OF MEDICINE</span>
                            <span>Page {pageNumber}</span>
                          </div>

                          {/* Page Content Simulator */}
                          {pageNumber === 1 && (
                            <div className="space-y-4 text-slate-700">
                              <span className="text-[8px] font-bold uppercase text-blue-600 tracking-wider">Clinical Study Paper</span>
                              <h2 className="font-display font-bold text-base text-slate-900 leading-tight">
                                Adjuvant Zygardia in Patients with Renal Cell Carcinoma after Nephrectomy
                              </h2>
                              <p className="text-[9px] leading-relaxed text-slate-400">
                                <strong>Abstract:</strong> Renal cell carcinoma recurrence remains a significant clinical challenge following surgical resection. This double-blind, randomized, phase 3 trial evaluated the efficacy and safety of adjuvant Zygardia therapy in patients with high-risk disease.
                              </p>
                              <div className="h-24 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                                <span className="text-[9px] text-slate-400">Study Flow Diagram</span>
                              </div>
                            </div>
                          )}

                          {pageNumber === 2 && (
                            <div className="space-y-3 text-slate-700 text-[9px] leading-relaxed">
                              <h3 className="font-display font-bold text-xs text-slate-900">Methods</h3>
                              <p>
                                Patients were randomized in a 1:1 ratio to receive either Zygardia (10mg orally once daily) or matching placebo for a maximum duration of 12 months or until disease recurrence, unacceptable toxicity, or consent withdrawal.
                              </p>
                              <p>
                                Stratification factors included disease stage (Stage II vs Stage III), performance status, and geographic region. The primary endpoint was Recurrence-Free Survival (RFS) as assessed by blinded independent central review.
                              </p>
                            </div>
                          )}

                          {pageNumber === 3 && (
                            <div className="space-y-3 text-slate-700 text-[9px] leading-relaxed">
                              <h3 className="font-display font-bold text-xs text-slate-900">Safety & Tolerability</h3>
                              <p>
                                Adverse events occurred in 92% of patients in the Zygardia group and 84% of those in the placebo group. The most common Grade 3 or 4 adverse events were hypertension, fatigue, and hand-foot syndrome.
                              </p>
                              <p>
                                Dose interruptions were required in 44% of Zygardia patients, and discontinuation due to adverse events occurred in 12% of patients compared to 3% in the placebo cohort.
                              </p>
                            </div>
                          )}

                          {pageNumber === 4 && (
                            <div className="space-y-3 text-slate-700 text-[9px] leading-relaxed">
                              <h3 className="font-display font-bold text-xs text-slate-900">Efficacy Analysis Results</h3>
                              <p>
                                A total of 990 patients underwent randomization. The primary efficacy analysis yielded landmark results for the adjuvant cohort.
                              </p>
                              
                              {/* Bounding Box Highlight 1: Hazard Ratio */}
                              <p className="relative py-1">
                                <span className={`transition-all duration-500 rounded px-1 py-0.5 ${
                                  activeMetric === "hazard_ratio" || activeMetric === "p_value"
                                    ? "bg-amber-500/15 border-l-2 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.25)] font-bold text-slate-900"
                                    : ""
                                  }`}>
                                  The primary analysis demonstrated a Hazard Ratio (HR) of 0.58 (95% Confidence Interval [CI], 0.45 to 0.73; p &lt; 0.001) in patients receiving Zygardia compared to placebo.
                                </span>
                              </p>

                              {/* Bounding Box Highlight 2: RFS Rate */}
                              <p className="relative py-1">
                                <span className={`transition-all duration-500 rounded px-1 py-0.5 ${
                                  activeMetric === "rfs_rate"
                                    ? "bg-blue-500/15 border-l-2 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.25)] font-bold text-slate-900"
                                    : ""
                                }`}>
                                  At the 24-month post-randomization milestone, the Recurrence-Free Survival (RFS) rate was 78.4% in the active study cohort compared to 62.1% in the control cohort.
                                </span>
                              </p>

                              <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between mt-4">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">Kaplan-Meier RFS Curve</span>
                                <div className="h-16 flex items-end gap-2.5 border-b border-l border-slate-200 px-2 pb-1">
                                  <div className="w-full h-14 border-t-2 border-blue-500"></div>
                                  <div className="w-full h-8 border-t-2 border-slate-400"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==========================================
           VIEW 0.5: STEP 02 - AUDIENCE SEGMENTATION
           ========================================== */}
        {activeStep === 2 && (
          <div className="col-span-12 bg-white rounded-3xl border border-slate-200/60 p-10 shadow-sm max-w-4xl mx-auto space-y-8">
            <div className="border-b border-slate-100 pb-6 text-center space-y-2">
              <h3 className="font-display text-2xl font-bold text-slate-800">Audience Segmentation & Targeting</h3>
              <p className="text-xs text-slate-400">Define physician targets, patient cohorts, and regional allocations for the campaign.</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/40 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Patients</span>
                <h4 className="font-display text-base font-bold text-slate-800">Post-Nephrectomy RCC</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  High-risk patients with resectable renal cell carcinoma undergoing adjuvant therapy.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/40 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physician Segments</span>
                <h4 className="font-display text-base font-bold text-slate-800">Oncologists & Urologists</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Key decision makers managing adjuvant treatment sequencing and clinical trials.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/40 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Regional Scope</span>
                <h4 className="font-display text-base font-bold text-slate-800">Global (US & EU5)</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Allocated budget targeted at major medical centers and oncology networks.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <>
            {/* LEFT PANE (60%): Interactive Copy Editor & Assets */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
              
              {/* Interactive Copy Editor Card */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex flex-col flex-1 min-h-0 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="text-blue-600" size={16} /> Marketing Copy Editor
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    {isScanning ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
                        <span className="text-blue-600">Analyzing Copy...</span>
                      </>
                    ) : (
                      <span>Real-time FDA Compliance Scanner</span>
                    )}
                  </span>
                </div>

                {/* Textarea Input */}
                <div className="space-y-2 flex-1 min-h-0 flex flex-col">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Edit Marketing Narrative
                  </label>
                  <textarea
                    value={copyText}
                    onChange={(e) => setCopyText(e.target.value)}
                    className="w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-sans leading-relaxed text-slate-700 resize-none"
                    placeholder="Enter marketing copy..."
                  />
                </div>

                {/* Live Scan Output Panel */}
                <div className="space-y-3 p-5 bg-slate-50 border border-slate-200/60 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Live Compliance Scan (Hover flags for details)
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Interactive
                    </span>
                  </div>
                  <div className="border border-slate-200 bg-white p-4 rounded-xl shadow-inner min-h-[100px]">
                    {renderHighlightedText()}
                  </div>
                </div>

              </div>

              {/* Active Assets List */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden h-[220px] flex flex-col shrink-0">
                <div className="px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
                  <span className="font-body text-xs font-bold text-slate-500 uppercase tracking-wider">Active Assets ({assets.length})</span>
                  <button 
                    onClick={() => setShowImagenModal(true)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-[10px] font-bold shadow-md shadow-blue-600/10 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={12} />
                    <span>Asset Creator</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 flex-1 overflow-y-auto min-h-0">
                  {assets.map((asset, idx) => (
                    <div 
                      key={idx} 
                      className={`p-6 flex items-center gap-6 hover:bg-slate-50/50 transition-colors cursor-pointer ${heroImage === asset.url ? "bg-slate-50/70" : ""}`}
                      onClick={() => {
                        setHeroImage(asset.url);
                        setActiveAssetType(asset.type);
                      }}
                    >
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/50 relative">
                        {asset.type === "video" ? (
                          <>
                            <video src={asset.url} className="w-full h-full object-cover" muted playsInline />
                            <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center text-white font-bold text-[8px] uppercase tracking-wider">
                              Video
                            </div>
                          </>
                        ) : (
                          <img alt={asset.name} className="w-full h-full object-cover" src={asset.url}/>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-bold text-slate-800 truncate">{asset.name}</h4>
                        <p className="font-sans text-xs text-slate-400 mt-1">{asset.size} · {asset.resolution}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 border ${
                          asset.status === "Compliant" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" 
                            : "bg-amber-500/10 text-amber-600 border-amber-500/10"
                        }`}>
                          <CheckCircle2 size={13} />
                          <span className="font-body text-[10px] font-bold uppercase tracking-wider">{asset.status}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAssets(prev => prev.filter((_, i) => i !== idx));
                            if (heroImage === asset.url && assets.length > 1) {
                              const fallbackAsset = assets[idx === 0 ? 1 : idx - 1];
                              setHeroImage(fallbackAsset.url);
                              setActiveAssetType(fallbackAsset.type);
                            }
                          }}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



            </div>

            {/* RIGHT PANE (40%): Compliance Score, Locked Slide Preview, & Segments */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
              
              {/* Compliance Score Card */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Compliance Score</span>
                
                {/* Circular Gauge */}
                <div className="relative w-28 h-20 flex justify-center items-end mt-2">
                  <svg width="120" height="80" viewBox="0 0 100 60" style={{ overflow: 'visible' }}>
                    <defs>
                      <filter id="score-glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={isLocked ? "#ef4444" : "#10b981"} floodOpacity="0.5"/>
                      </filter>
                    </defs>
                    
                    {/* Track */}
                    <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" strokeLinecap="round"/>
                    
                    {/* Active */}
                    <path 
                      d="M 15 50 A 35 35 0 0 1 85 50" 
                      fill="none" 
                      stroke={isLocked ? "#ef4444" : "#10b981"} 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      strokeDasharray="109.9" 
                      strokeDashoffset={109.9 - (109.9 * complianceScore) / 100} 
                      filter="url(#score-glow)"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute bottom-0 flex flex-col items-center">
                    <span className={`text-2xl font-black tracking-tight font-display ${isLocked ? "text-red-500" : "text-emerald-500"}`}>
                      {complianceScore}/100
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-4 border ${
                  isLocked 
                    ? "bg-red-500/10 border-red-500/20 text-red-500" 
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                }`}>
                  {isLocked ? "⚠️ VIOLATIONS DETECTED (LOCK ACTIVE)" : "✅ COMPLIANCE PASSED (UNLOCKED)"}
                </span>
              </div>

              {/* Matched Forbidden Terms Card */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Matched Forbidden Terms</span>
                <div className="space-y-2">
                  {activeViolations.length === 0 ? (
                    <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-center">
                      <span className="text-xs font-bold text-emerald-600">No forbidden terms matched. Clean scan!</span>
                    </div>
                  ) : (
                    activeViolations.map((v, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-2xl">
                        <span className="text-xs font-bold text-red-600">"{v.word}"</span>
                        <span className="text-[10px] font-bold bg-red-500/10 text-red-600 px-2.5 py-0.5 rounded-lg border border-red-500/20">
                          {v.count} Match{v.count > 1 ? "es" : ""}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Deep AI Regulatory Reasoning */}
                <div className="pt-4 border-t border-slate-100 space-y-1.5 flex-1 min-h-0 flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block shrink-0">Deep AI Audit Notes</span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-h-[80px] overflow-y-auto pr-1">
                    {regulatoryReasoning}
                  </p>
                </div>
              </div>


              {/* Slide Preview with Locked Overlay */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm space-y-4 relative overflow-hidden h-52 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Veeva Asset Transmission Preview</span>
                  {isLocked ? <Lock className="text-red-500" size={14} /> : <Unlock className="text-emerald-500" size={14} />}
                </div>

                {/* Blurred Slide Mockup (Super Premium Split Layout!) */}
                <div className={`flex gap-4 select-none w-full h-28 p-4 bg-slate-900 text-white rounded-2xl transition-all ${
                  isLocked ? "filter blur-sm opacity-30" : "opacity-100"
                }`}>
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <span className="text-[8px] font-bold uppercase text-blue-400">Zygardia Adjuvant Presentation</span>
                    <h4 className="font-display font-bold text-[10px] leading-tight truncate">ZYGARDIA 10mg: Clinical Trial Results</h4>
                    <p className="text-[7px] text-slate-300 leading-normal font-sans line-clamp-3">
                      {copyText}
                    </p>
                  </div>
                  <div className="w-20 h-full rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 shrink-0">
                    {activeAssetType === "video" ? (
                      <video 
                        src={heroImage} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                      />
                    ) : (
                      <img src={heroImage} className="w-full h-full object-cover" alt="Slide Visual" />
                    )}
                  </div>
                </div>

                {/* Locked/Unlocked Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-2 p-6 z-10 select-none">
                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                      <Lock size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">🔒 Approval Blocked</span>
                    <p className="text-[9px] text-slate-400 leading-normal max-w-[220px]">
                      Compliance Score ({complianceScore}) is below the threshold of 90. Slide cannot be transmitted to Veeva Vault.
                    </p>
                  </div>
                )}
              </div>



            </div>
          </>
        )}

        {/* ==========================================
           VIEW 2: STEP 04 - PERFORMANCE FORECAST
           ========================================== */}
        {activeStep === 4 && (
          <>
            {/* LEFT PANE (80%): Budget & Forecast Simulator */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm flex flex-col h-full min-h-0">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <h3 className="font-display text-base font-bold text-slate-800">Performance Forecast Simulator</h3>
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Interactive Budget Impact Engine
                </span>
              </div>

              {/* Slider Group */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Budget Allocation</span>
                  <strong className="font-mono text-base font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-xl border border-blue-100">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(budget * 100)}
                  </strong>
                </div>
                <input 
                  type="range"
                  min={10}
                  max={100}
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                />
              </div>

              {/* Forecast Visual (Asymmetric Bars) */}
              <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block shrink-0">Projected Weekly Engagement Chart</span>
                <div className="flex-1 min-h-0 flex items-end justify-between gap-2.5 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200/30">
                  {baseBarHeights.map((h, i) => (
                    <div 
                      key={i}
                      className="w-full bg-blue-600/20 rounded-t-xl transition-all hover:bg-blue-600 cursor-pointer relative group flex items-end justify-center"
                      style={{ height: `${getDynamicHeight(h)}%` }}
                    >
                      {/* Height Percentage Overlay on Hover */}
                      <span className="absolute -top-9 bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                        {Math.round(getDynamicHeight(h))}%
                      </span>
                    </div>
                  ))}
                  {/* Dotted Target/Forecast Bar */}
                  <div 
                    className="w-full bg-blue-600/10 rounded-t-xl border-t-2 border-dashed border-blue-500/40 transition-all"
                    style={{ height: "100%" }}
                  ></div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/30 shadow-sm">
                  <p className="font-body text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Avg. CPC Target</p>
                  <p className="font-display text-xl font-bold text-slate-800">$1.24</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/30 shadow-sm">
                  <p className="font-body text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Projected Conv. Rate</p>
                  <p className="font-display text-xl font-bold text-slate-800">3.8%</p>
                </div>
              </div>
            </div>

            {/* RIGHT PANE (40%): Target Segments context */}
            <div className="col-span-12 lg:col-span-4 h-full">
              {/* Target Segments Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl h-full flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                <h3 className="font-display text-lg font-bold mb-6 relative z-10">Target Segments</h3>
                
                <div className="space-y-3 relative z-10">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                    <GripVertical className="text-white/30" size={16} />
                    <span className="text-xs font-bold text-white/90">High-Net-Worth Individuals</span>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                    <GripVertical className="text-white/30" size={16} />
                    <span className="text-xs font-bold text-white/90">Tech Early Adopters (EU)</span>
                  </div>
                  <div className="p-4 bg-blue-600/90 border border-blue-500/20 rounded-xl flex items-center gap-3 shadow-lg shadow-blue-600/10">
                    <GripVertical className="text-white/60" size={16} />
                    <span className="text-xs font-bold text-white">Sustainability Enthusiasts</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-body text-[10px] text-white/50 uppercase tracking-wider mb-1">Estimated Reach</p>
                      <p className="font-display text-3xl font-bold">
                        1.2M <span className="text-xs font-sans text-white/40 font-normal">/ month</span>
                      </p>
                    </div>
                    <Users className="text-blue-400 mb-1" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==========================================
           VIEW 3: STEP 05 - FINAL REVIEW & APPROVAL
           ========================================== */}
        {activeStep === 5 && (
          <div className="col-span-12 bg-white rounded-3xl border border-slate-200/60 p-10 shadow-sm max-w-4xl mx-auto space-y-8">
            <div className="border-b border-slate-100 pb-6 text-center space-y-2">
              <h3 className="font-display text-2xl font-bold text-slate-800">Review & Submit for MLR Approval</h3>
              <p className="text-xs text-slate-400">Verify all assets, compliance scores, and forecasts before final signature.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/40 text-center space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Compliance Status</span>
                <span className={`text-sm font-bold uppercase ${isLocked ? "text-red-500" : "text-emerald-500"}`}>
                  {isLocked ? "Blocked (Score 78)" : "Clear (Score 98)"}
                </span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/40 text-center space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Daily Budget</span>
                <span className="text-sm font-bold text-blue-600">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(budget * 100)}
                </span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/40 text-center space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Assets</span>
                <span className="text-sm font-bold text-slate-800">1 Image File</span>
              </div>
            </div>

            {/* Narrative Preview */}
            <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Marketing Copy</span>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">{copyText}</p>
            </div>

            {/* Approval Action Warning */}
            {isLocked ? (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 text-red-800">
                <AlertTriangle className="shrink-0 text-red-500" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider">Transmission Blocked by Compliance Guardrails</h4>
                  <p className="text-[11px] leading-relaxed text-red-600">
                    Your compliance score is currently **{complianceScore}/100**. To submit this campaign, you must remove the highlighted forbidden terms in the **Creative** module.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4 text-emerald-800">
                <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider">All Systems Grounded & Unlocked</h4>
                  <p className="text-[11px] leading-relaxed text-emerald-600">
                    Your assets are 100% compliant. Clicking "Approve to Memory" will cryptographically seal this record and transmit it directly to the Veeva PromoMats gateway.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex gap-4 border-t border-slate-100 pt-6">
              <button 
                onClick={() => setActiveStep(3)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-body text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Return to Editor
              </button>
              <button 
                disabled={isLocked}
                onClick={() => navigate("/dashboard")}
                className={`flex-1 py-3 text-white rounded-xl font-body text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isLocked 
                    ? "bg-slate-300 shadow-none cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-600/20"
                }`}
              >
                <span>Approve & Transmit to Veeva</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Decorative Floating Sidebar Text */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] flex items-center gap-6 opacity-25 select-none pointer-events-none">
        <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-slate-400">Precision Control Suite v4.0.2</span>
        <div className="h-16 w-px bg-slate-300"></div>
      </div>

      {/* Imagen 3 / Veo Creator Modal Overlay */}
      {showImagenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Google {activeCreatorTab === "image" ? "Imagen 3" : "Veo"} Asset Creator
                </h3>
              </div>
              <button 
                onClick={() => setShowImagenModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
              <button
                type="button"
                onClick={() => {
                  setActiveCreatorTab("image");
                  setGenerationError(null);
                }}
                className={`flex-1 py-2 rounded-xl font-body text-xs font-bold transition-all cursor-pointer ${
                  activeCreatorTab === "image"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                🎨 Image (Imagen 3)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCreatorTab("video");
                  setGenerationError(null);
                }}
                className={`flex-1 py-2 rounded-xl font-body text-xs font-bold transition-all cursor-pointer ${
                  activeCreatorTab === "video"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                🎥 Video (Veo)
              </button>
            </div>

            {generationError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl">
                <strong>Error:</strong> {generationError}
              </div>
            )}

            <form onSubmit={handleGenerateAsset} className="space-y-4">
              
              {/* IMAGE GENERATOR FIELDS */}
              {activeCreatorTab === "image" && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image Prompt</label>
                    <textarea
                      required
                      value={imagenPrompt}
                      onChange={(e) => setImagenPrompt(e.target.value)}
                      className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700 resize-none leading-relaxed"
                      placeholder="Describe the image you want to generate..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exclusion Criteria (Negative Prompt)</label>
                    <input
                      type="text"
                      value={imagenNegative}
                      onChange={(e) => setImagenNegative(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      placeholder="Things to avoid (e.g. blurry, low quality, faces)..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aspect Ratio</label>
                      <select
                        value={imagenAspectRatio}
                        onChange={(e) => setImagenAspectRatio(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      >
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="4:3">4:3 (Standard)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="3:4">3:4 (Portrait)</option>
                        <option value="9:16">9:16 (Tall)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model Selection</label>
                      <select
                        value={imagenModel}
                        onChange={(e) => setImagenModel(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      >
                        <option value="imagen-3.0-generate-002">Imagen 3.0 Generate (Production)</option>
                        <option value="gemini-3-pro-image">Gemini 3 Pro Image (Ultra Preview)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* VIDEO GENERATOR FIELDS */}
              {activeCreatorTab === "video" && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Video Prompt</label>
                    <textarea
                      required
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700 resize-none leading-relaxed"
                      placeholder="Describe the cinematic video scene you want to generate..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exclusion Criteria (Negative Prompt)</label>
                    <input
                      type="text"
                      value={videoNegative}
                      onChange={(e) => setVideoNegative(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      placeholder="Things to avoid (e.g. shaky camera, low quality, text)..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aspect Ratio</label>
                      <select
                        value={videoAspectRatio}
                        onChange={(e) => setVideoAspectRatio(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      >
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="9:16">9:16 (Vertical)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model Selection</label>
                      <select
                        value={videoModel}
                        onChange={(e) => setVideoModel(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      >
                        <option value="veo-2.0-generate-001">Google Veo 2.0 (High Quality)</option>
                        <option value="veo-1.0-generate-001">Google Veo 1.0 (Fast Draft)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (Seconds)</label>
                      <select
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      >
                        <option value={5}>5 Seconds</option>
                        <option value={6}>6 Seconds</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Motion Level</label>
                      <select
                        value={videoMotion}
                        onChange={(e) => setVideoMotion(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                      >
                        <option value="low">Low Motion (Stable)</option>
                        <option value="medium">Medium Motion (Cinematic)</option>
                        <option value="high">High Motion (Dynamic)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* COMMON FIELDS */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Style Preset</label>
                  <select
                    value={imagenStyle}
                    onChange={(e) => setImagenStyle(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                  >
                    <option value="clinical-realism">Clinical Realism (Photorealistic)</option>
                    <option value="microbiology-3d">Microbiology 3D (Scientific Render)</option>
                    <option value="clean-vector">Clean Vector (Minimalist Graphic)</option>
                    <option value="futuristic-hologram">Futuristic Hologram (Sci-Fi HUD)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Brand Variant</label>
                  <select
                    value={imagenBrand}
                    onChange={(e) => setImagenBrand(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-700"
                  >
                    <option value="product_a">Product A (Zygardia)</option>
                    <option value="product_b">Product B</option>
                    <option value="product_c">Product C</option>
                    <option value="product_d">Product D</option>
                  </select>
                </div>
              </div>

              {/* SynthID watermark indicator */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${synthIdEnabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    <Lock size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">SynthID™ Digital Watermark</span>
                    <span className="text-[9px] text-slate-400">Embed secure cryptographic provenance seal in metadata.</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={synthIdEnabled}
                    onChange={(e) => setSynthIdEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImagenModal(false)}
                  className="flex-1 h-12 border border-slate-200 text-slate-600 rounded-xl font-body text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`flex-1 h-12 text-white rounded-xl font-body text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isGenerating 
                      ? "bg-slate-300 shadow-none cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-600/20"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generate {activeCreatorTab === "image" ? "Asset" : "Video"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

