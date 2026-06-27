import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SecureAccess } from "@/pages/secure-access";
import { Dashboard } from "@/pages/dashboard";
import { Campaigns } from "@/pages/campaigns";
import { CampaignStudio } from "@/pages/campaign-studio";
import { RegulatoryHub } from "@/pages/regulatory-hub";
import { AudienceIntelligence } from "@/pages/audience-intelligence";
import { DigitalAssetLibrary } from "@/pages/digital-asset-library";
import { AdvancedAnalytics } from "@/pages/advanced-analytics";
import { TeamGovernance } from "@/pages/team-governance";
import { Settings } from "@/pages/settings";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Full-screen Login Route (Initial Screen) */}
        <Route path="/" element={<SecureAccess />} />

        {/* Authenticated Routes with Sidebar & Header */}
        <Route 
          path="/*" 
          element={
            <div className="flex h-screen bg-slate-100 overflow-hidden">
              {/* Sidebar */}
              <Sidebar />
              
              {/* Main Content Area */}
              <div className="flex flex-col flex-1 ml-64 min-w-0 h-full relative">
                {/* Header */}
                <Header />
                
                {/* Scrollable Page Wrapper */}
                <main className="flex-1 overflow-y-auto pt-16">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/campaign-studio" element={<CampaignStudio />} />
                    <Route path="/regulatory-hub" element={<RegulatoryHub />} />
                    <Route path="/audience-intelligence" element={<AudienceIntelligence />} />
                    <Route path="/content-library" element={<DigitalAssetLibrary />} />
                    <Route path="/analytics" element={<AdvancedAnalytics />} />
                    <Route path="/team" element={<TeamGovernance />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}
