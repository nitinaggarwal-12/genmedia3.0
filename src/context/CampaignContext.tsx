import React, { createContext, useContext, useState, useEffect } from "react";

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  therapeuticArea: string;
  pdfName: string | null;
  metrics: {
    hazard_ratio?: string;
    rfs_rate?: string;
    p_value?: string;
  };
  copyText: string;
  complianceScore: number;
  regulatoryReasoning: string;
  activeViolations: { word: string; rule: string; count: number }[];
  assets: { name: string; size: string; resolution: string; url: string; status: "Compliant" | "Violating"; type: "image" | "video" }[];
  status: "Creative" | "Medical" | "Legal Review" | "Final Signoff" | "Deployment" | "Completed";
  step: number;
  budget: number;
  updatedAt: number;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  timestamp: number;
  read: boolean;
}

interface CampaignContextType {
  campaigns: Campaign[];
  notifications: Notification[];
  activeCampaignId: string | null;
  activeCampaign: Campaign | null;
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt">) => string;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;
  addNotification: (title: string, message: string, type?: "success" | "warning" | "info") => void;
  clearNotifications: () => void;
  markNotificationsAsRead: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    name: "Zygardia Q3 Launch Campaign",
    brand: "product_a",
    therapeuticArea: "Oncology (Renal Cell Carcinoma)",
    pdfName: "Zygardia_Post_Nephrectomy_Study.pdf",
    metrics: {
      hazard_ratio: "0.58",
      rfs_rate: "78.4%",
      p_value: "<0.001"
    },
    copyText: "ZYGARDIA 10mg is guaranteed to offer a miracle cure with sustained trial results.",
    complianceScore: 78,
    regulatoryReasoning: "The promotional copy contains high-risk absolute efficacy claims ('guaranteed') and speculative superlatives ('miracle cure') that violate FDA Rule 21 CFR 312.7 and Merck Brand Guidelines. Efficacy claims must be supported by double-blind clinical data and avoid absolute guarantees.",
    activeViolations: [
      {
        word: "miracle cure",
        rule: "FDA Rule 21 CFR 312.7: Promotion of investigational drugs. Do not represent as safe or effective. Avoid speculative superlatives.",
        count: 1
      },
      {
        word: "guaranteed",
        rule: "Merck Brand Guideline Section 4.2: Efficacy claims must be supported by double-blind clinical data. Avoid absolute claims.",
        count: 1
      }
    ],
    assets: [
      {
        name: "zygardia_microbiology_hero.png",
        size: "2.8 MB",
        resolution: "1920 x 1080px",
        url: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=800",
        status: "Compliant",
        type: "image"
      }
    ],
    status: "Legal Review",
    step: 3,
    budget: 45,
    updatedAt: Date.now() - 3600000 * 2,
    createdAt: Date.now() - 3600000 * 24 * 3
  },
  {
    id: "camp-2",
    name: "Keytruda Adjuvant Briefing",
    brand: "product_b",
    therapeuticArea: "Oncology (Renal Cell Carcinoma)",
    pdfName: "KEYNOTE-564_Brief.pdf",
    metrics: {
      hazard_ratio: "0.68",
      rfs_rate: "77.3%",
      p_value: "0.002"
    },
    copyText: "KEYTRUDA adjuvant therapy demonstrated a statistically significant improvement in recurrence-free survival (HR 0.68, p=0.002) compared to placebo in patients with intermediate-high or high risk of recurrence.",
    complianceScore: 96,
    regulatoryReasoning: "Excellent work. The copy is fully grounded in the provided clinical trial metrics and contains no high-risk absolute claims. It complies with general FDA promotional guidelines.",
    activeViolations: [],
    assets: [
      {
        name: "keytruda_clinical_patient.png",
        size: "2.8 MB",
        resolution: "1920 x 1080px",
        url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800",
        status: "Compliant",
        type: "image"
      }
    ],
    status: "Completed",
    step: 5,
    budget: 80,
    updatedAt: Date.now() - 3600000 * 12,
    createdAt: Date.now() - 3600000 * 24 * 5
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Veeva Sync Successful",
    message: "Campaign 'Keytruda Adjuvant Briefing' has been successfully transmitted to Veeva Vault PromoMats.",
    type: "success",
    timestamp: Date.now() - 3600000 * 12,
    read: false
  },
  {
    id: "notif-2",
    title: "Compliance Alert",
    message: "Campaign 'Zygardia Q3 Launch' was blocked due to a low compliance score (78/100).",
    type: "warning",
    timestamp: Date.now() - 3600000 * 2,
    read: false
  }
];

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const storedCampaigns = localStorage.getItem("maestro_campaigns");
    const storedNotifications = localStorage.getItem("maestro_notifications");
    const storedActiveId = localStorage.getItem("maestro_active_campaign_id");

    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    } else {
      // Pre-populate
      setCampaigns(MOCK_CAMPAIGNS);
      localStorage.setItem("maestro_campaigns", JSON.stringify(MOCK_CAMPAIGNS));
    }

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications(MOCK_NOTIFICATIONS);
      localStorage.setItem("maestro_notifications", JSON.stringify(MOCK_NOTIFICATIONS));
    }

    if (storedActiveId) {
      setActiveCampaignId(storedActiveId);
    }
  }, []);

  // Save state to localStorage when it changes
  const saveCampaigns = (newCampaigns: Campaign[]) => {
    setCampaigns(newCampaigns);
    localStorage.setItem("maestro_campaigns", JSON.stringify(newCampaigns));
  };

  const saveNotifications = (newNotifs: Notification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem("maestro_notifications", JSON.stringify(newNotifs));
  };

  const addCampaign = (campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt">) => {
    const id = `camp-${Date.now()}`;
    const newCampaign: Campaign = {
      ...campaign,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const newCampaigns = [newCampaign, ...campaigns];
    saveCampaigns(newCampaigns);
    addNotification("New Campaign Created", `Campaign '${campaign.name}' has been initialized.`, "info");
    return id;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    const newCampaigns = campaigns.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          updatedAt: Date.now()
        };
      }
      return c;
    });
    saveCampaigns(newCampaigns);
  };

  const deleteCampaign = (id: string) => {
    const newCampaigns = campaigns.filter(c => c.id !== id);
    saveCampaigns(newCampaigns);
    if (activeCampaignId === id) {
      selectCampaign(null);
    }
    addNotification("Campaign Deleted", "The campaign has been removed from the system.", "warning");
  };

  const selectCampaign = (id: string | null) => {
    setActiveCampaignId(id);
    if (id) {
      localStorage.setItem("maestro_active_campaign_id", id);
    } else {
      localStorage.removeItem("maestro_active_campaign_id");
    }
  };

  const addNotification = (title: string, message: string, type: "success" | "warning" | "info" = "info") => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  const markNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || null;

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        notifications,
        activeCampaignId,
        activeCampaign,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        selectCampaign,
        addNotification,
        clearNotifications,
        markNotificationsAsRead
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};
