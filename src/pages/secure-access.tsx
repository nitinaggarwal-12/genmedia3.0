import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export function SecureAccess() {
  const navigate = useNavigate();
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMFA(true);
  };

  const handleMFAChange = (value: string, index: number) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`mfa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleMFAKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && mfaCode[index] === "" && index > 0) {
      const prevInput = document.getElementById(`mfa-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAuthenticate = () => {
    // Navigate to Executive Dashboard on successful authentication
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans text-slate-900 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col w-full min-h-[calc(100vh-48px)] lg:flex-row relative overflow-hidden max-w-[1600px] mx-auto bg-white shadow-2xl rounded-3xl border border-slate-200/50">
        
        {/* =====================================================================
           LEFT COLUMN: IMMERSIVE BRANDING & NEWS
           ===================================================================== */}
        <aside className="relative w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-end p-12 overflow-hidden bg-teal-800 text-white min-h-[400px] lg:min-h-0">
          {/* Decorative Giant Letter 'M' */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-5 pointer-events-none select-none">
            <span className="font-display text-[320px] font-bold leading-none">M</span>
          </div>

          <div className="relative z-10 space-y-8 max-w-md">
            {/* System Status */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-teal-200/60">System Status /</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[11px] font-bold text-emerald-300">All Systems Operational</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight">
                The future of content, <span className="italic font-light text-teal-200">orchestrated.</span>
              </h1>
              <p className="text-sm text-teal-100/80 leading-relaxed max-w-sm">
                Welcome to Maestro ContentStudio v4.2. Experience the new generative workflow engine and real-time collaboration suite.
              </p>
            </div>

            {/* Latest Update Card */}
            <div className="pt-6">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-teal-200">
                  <span>Latest Update</span>
                  <span className="opacity-60">2m ago</span>
                </div>
                <p className="font-display text-sm font-semibold leading-snug">
                  SSO performance improved by 40% across global regions.
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Decorative Badge */}
          <div className="absolute bottom-12 left-12 font-mono text-[9px] tracking-[0.5em] uppercase text-white/30 [writing-mode:vertical-rl] pointer-events-none">
            Security Protocols Active • Maestro v4.2
          </div>
        </aside>

        {/* =====================================================================
           RIGHT COLUMN: AUTHENTICATION CORE
           ===================================================================== */}
        <section className="flex-1 bg-white flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-[400px] space-y-10">
            
            {/* Header & Logo */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-800 flex items-center justify-center rounded-xl shadow-lg shadow-teal-800/10 text-white">
                  <KeyRound size={20} />
                </div>
                <span className="font-display text-xl font-bold tracking-tight text-slate-800">
                  Maestro <span className="font-light text-slate-400">ContentStudio</span>
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-slate-900">Secure Access</h2>
                <p className="text-slate-500 text-sm">Enter your credentials to manage your digital ecosystem.</p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Work Email</label>
                  <div className="relative">
                    <input 
                      required
                      type="email"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-800 focus:bg-white transition-all placeholder:text-slate-300" 
                      placeholder="name@company.com" 
                    />
                    <Mail className="absolute right-4 top-3.5 text-slate-300" size={16} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <button type="button" className="text-xs font-bold text-teal-800 hover:text-teal-700 transition-colors">Forgot?</button>
                  </div>
                  <div className="relative">
                    <input 
                      required
                      type="password"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-800 focus:bg-white transition-all placeholder:text-slate-300" 
                      placeholder="••••••••" 
                    />
                    <Lock className="absolute right-4 top-3.5 text-slate-300" size={16} />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-12 bg-teal-800 text-white rounded-xl font-display text-sm font-bold shadow-xl shadow-teal-900/10 hover:bg-teal-750 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Platform</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow h-px bg-slate-100"></div>
              <span className="px-4 font-mono text-[9px] text-slate-400 uppercase tracking-widest">Enterprise SSO</span>
              <div className="flex-grow h-px bg-slate-100"></div>
            </div>

            {/* SSO Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={handleAuthenticate}
                className="flex items-center justify-center gap-2 h-12 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"></path>
                </svg>
                <span className="text-xs font-bold text-slate-600">Azure AD</span>
              </button>
              <button 
                type="button"
                onClick={handleAuthenticate}
                className="flex items-center justify-center gap-2 h-12 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.286c-3.472 0-6.286-2.814-6.286-6.286 0-3.472 2.814-6.286 6.286-6.286 3.472 0 6.286 2.814 6.286 6.286 0 3.472-2.814 6.286-6.286 6.286z"></path>
                </svg>
                <span className="text-xs font-bold text-slate-600">Okta</span>
              </button>
            </div>

            {/* Footer Help */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>© 2024 Maestro Studio</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-teal-800 transition-colors">Security Portal</a>
                <a href="#" className="hover:text-teal-800 transition-colors">Support</a>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* =====================================================================
         MFA OVERLAY MODAL (POPUP ON LOGIN SUBMIT)
         ===================================================================== */}
      {showMFA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 space-y-8 animate-zoom-in">
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-teal-800">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-slate-900">Verify Identity</h3>
                <p className="text-xs text-slate-500">Enter the 6-digit code sent to your mobile device.</p>
              </div>
            </div>

            {/* 6-Digit MFA Inputs */}
            <div className="flex justify-between gap-2">
              {mfaCode.map((val, idx) => (
                <input
                  key={idx}
                  id={`mfa-${idx}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleMFAChange(e.target.value, idx)}
                  onKeyDown={(e) => handleMFAKeyDown(e, idx)}
                  className="w-10 h-12 text-center font-display text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-800 focus:ring-2 focus:ring-teal-800/10 focus:outline-none transition-all"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button 
                type="button"
                onClick={handleAuthenticate}
                className="w-full h-12 bg-teal-800 text-white rounded-xl font-display text-sm font-bold shadow-lg shadow-teal-950/10 hover:bg-teal-750 transition-colors"
              >
                Verify & Authenticate
              </button>
              <button 
                type="button"
                onClick={() => setShowMFA(false)}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors text-center block"
              >
                Cancel and return
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
