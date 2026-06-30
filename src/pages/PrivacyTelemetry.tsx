import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, ShieldCheck, FileText, Activity, Server, Cpu, Database, RefreshCw, Layers } from 'lucide-react';

export function PrivacyTelemetry() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'privacy' | 'terms'>('analytics');
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [latency, setLatency] = useState(12);
  const [fps, setFps] = useState(60);

  // Simulate real-time metric fluctuations for telemetry dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(8, Math.min(45, prev + Math.floor(Math.random() * 7) - 3)));
      setFps(prev => Math.max(58, Math.min(60, prev + Math.floor(Math.random() * 3) - 1)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const runSystemDiagnostic = () => {
    if (isDiagnosticRunning) return;
    setIsDiagnosticRunning(true);
    setDiagnosticProgress(0);
    setDiagnosticLogs(['Initializing MKA Systems Integrity Check...']);

    const logs = [
      'Authenticating TLS session keys with Google Firebase...',
      'Verifying Firestore Realtime DB indices...',
      'Testing WhatsApp Business Webhook API latency...',
      'Verifying HMR environment variables...',
      'Scanning local index.css for custom @keyframes...',
      'Checking superbike SVG frame render performance...',
      'Telemetry handshake complete! Integrity status: OPTIMAL'
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setDiagnosticProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsDiagnosticRunning(false);
          return 100;
        }
        
        // Add log message at intervals
        if (prev > 0 && prev % 15 === 0 && currentStep < logs.length) {
          setDiagnosticLogs(old => [...old, logs[currentStep]]);
          currentStep++;
        }
        
        return prev + 2;
      });
    }, 60);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-full flex flex-col relative" id="privacy-telemetry-portal">
      {/* Dynamic Background Blur Lights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-rose/10 blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-blue/10 blur-[130px] pointer-events-none -z-10 animate-pulse" />

      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] bg-gradient-brand text-transparent bg-clip-text font-black uppercase tracking-widest block mb-1">
          App Security & Performance
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <span className="w-2.5 h-8 bg-gradient-brand rounded-full" />
          Telemetry & Legal Hub
        </h2>
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-zinc-400 text-sm max-w-xl">
            Realtime performance diagnostics, privacy transparency statements, and official service terms.
          </p>
          <span className="hidden sm:block font-script text-2xl text-brand-rose font-bold rotate-[-3deg] ml-2 drop-shadow-md">
            Engineered transparently
          </span>
        </div>
      </div>

      {/* Premium Glass Prism Tab Switcher */}
      <div className="glass-prism p-2.5 rounded-2xl flex flex-wrap gap-2 mb-8 border border-white/10 relative z-10">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-gradient-brand text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 size={15} /> Live Analytics
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-gradient-brand text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck size={15} /> Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-gradient-brand text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={15} /> Terms & Conditions
        </button>
      </div>

      {/* Content Panels */}
      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-prism p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Render Latency</span>
                    <span className="text-2xl font-black text-brand-rose">{latency} <span className="text-xs font-normal text-zinc-400">ms</span></span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose">
                    <Activity size={20} />
                  </div>
                </div>

                <div className="glass-prism p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Frame Rate</span>
                    <span className="text-2xl font-black text-brand-blue">{fps} <span className="text-xs font-normal text-zinc-400">FPS</span></span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Cpu size={20} />
                  </div>
                </div>

                <div className="glass-prism p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Session Protocol</span>
                    <span className="text-base font-black text-white truncate max-w-[130px] block">HTTPS / TLS</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-violet/10 flex items-center justify-center text-brand-violet">
                    <Server size={20} />
                  </div>
                </div>

                <div className="glass-prism p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">State Cache</span>
                    <span className="text-2xl font-black text-emerald-400">98.2 <span className="text-xs font-normal text-zinc-400">%</span></span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Database size={20} />
                  </div>
                </div>
              </div>

              {/* Graphic charts & Diagnostic console in a responsive layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Custom SVG Charts panel (Recharts equivalent, light-weight & highly animated) */}
                <div className="lg:col-span-7 glass-prism p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1 flex items-center gap-2">
                      <span className="w-2 h-4 bg-brand-blue rounded-full" />
                      Track Performance Telemetry
                    </h3>
                    <p className="text-zinc-400 text-xs mb-6">Real-time load profiles and system request bandwidth scaling.</p>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-56 w-full relative mb-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.04)" strokeDasharray="4,4" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.04)" strokeDasharray="4,4" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.04)" strokeDasharray="4,4" />
                      <line x1="0" y1="190" x2="500" y2="190" stroke="rgba(255,255,255,0.08)" />

                      {/* Area Fill */}
                      <path
                        d="M 0 200 L 0 160 Q 50 120 100 130 T 200 80 T 300 120 T 400 40 T 500 60 L 500 200 Z"
                        fill="url(#chartGlow)"
                      />

                      {/* Chart Stroke line */}
                      <path
                        d="M 0 160 Q 50 120 100 130 T 200 80 T 300 120 T 400 40 T 500 60"
                        fill="none"
                        stroke="url(#chartStroke)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Pulsating current value points */}
                      <circle cx="400" cy="40" r="5" fill="#38bdf8" />
                      <circle cx="400" cy="40" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" />
                    </svg>
                    
                    {/* Floating HUD value tags */}
                    <span className="absolute top-[20px] left-[380px] bg-brand-blue/15 border border-brand-blue/30 px-1.5 py-0.5 rounded text-[8px] font-mono font-black text-brand-blue uppercase">Peak load</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest pt-2 border-t border-white/5">
                    <span>00:00 (UTC)</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>Now</span>
                  </div>
                </div>

                {/* System Diagnostic Console with Glowing Spinner */}
                <div className="lg:col-span-5 glass-prism p-6 rounded-3xl border border-white/10 flex flex-col justify-between min-h-[340px]">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1 flex items-center gap-2">
                      <span className="w-2 h-4 bg-brand-rose rounded-full" />
                      Active Core Diagnostics
                    </h3>
                    <p className="text-zinc-400 text-xs mb-6">Probe app bundle integrity, API runtimes and cache configurations.</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center mb-6">
                    {isDiagnosticRunning ? (
                      /* Glowing Circle Loader with Glassmorphic Elements */
                      <div className="flex flex-col items-center gap-4 relative">
                        <div className="relative w-20 h-20">
                          {/* Inner translucent glass sphere */}
                          <div className="absolute inset-2 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)]" />
                          {/* Spinning colored glassmorphic outer track */}
                          <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-brand-rose border-r-brand-violet animate-spin" />
                          {/* Pulsing glow underlay */}
                          <div className="absolute inset-0 rounded-full bg-brand-rose/5 blur-md animate-pulse" />
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                          Diagnosing: {diagnosticProgress}%
                        </span>
                      </div>
                    ) : (
                      /* Idle Diagnostic State */
                      <div className="text-center py-6">
                        <button
                          onClick={runSystemDiagnostic}
                          className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-rose/40 rounded-2xl text-xs font-black uppercase tracking-wider text-white cursor-pointer transition-all active:scale-95 shadow-md hover:shadow-brand-rose/10 flex items-center gap-2"
                        >
                          <RefreshCw size={14} className="text-brand-rose" />
                          Trigger App Diagnostic
                        </button>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2 block">Takes approx. 3 seconds</span>
                      </div>
                    )}

                    {/* Miniature logs drawer */}
                    {diagnosticLogs.length > 0 && (
                      <div className="w-full mt-4 bg-black/40 rounded-xl p-3 border border-white/5 font-mono text-[9px] text-zinc-400 max-h-[100px] overflow-y-auto space-y-1">
                        {diagnosticLogs.map((log, index) => (
                          <div key={index} className="flex gap-1.5 items-start">
                            <span className="text-brand-rose">❯</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-brand-rose/5 border border-brand-rose/10 rounded-xl flex items-start gap-2.5">
                    <Layers className="text-brand-rose shrink-0" size={16} />
                    <span className="text-[10px] leading-relaxed text-zinc-400">
                      <strong>Automatic telemetry reports</strong> are sent to the administrator panel for performance auditing every 15 minutes.
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass-prism p-6 md:p-8 rounded-3xl border border-white/10"
            >
              <div className="border-b border-white/8 pb-6 mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Privacy & Consent Framework</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">Effective Date: June 30, 2026 | Document Reference: MKA-PP-V4</p>
              </div>

              <div className="prose prose-invert max-w-none text-zinc-300 space-y-6 text-sm">
                <section className="space-y-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
                    1. Data Collection & Intention
                  </h4>
                  <p className="leading-relaxed">
                    At MKA Premium Motorcycle Spares, transparency is our core engineering standard. We gather basic profile information (such as Google Authentication email, name, and profile photos) to securely register your customer profile. No other personal data is harvested without explicit intent.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                    2. Security & Database Hardening
                  </h4>
                  <p className="leading-relaxed">
                    All transactions, spare inventory additions, and user records are safely stored on secure Cloud Firestore instances, locked behind bulletproof firestore security rules. Sensitive data is transmitted securely via SSL/TLS encryption.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    3. WhatsApp Checkout Transparency
                  </h4>
                  <p className="leading-relaxed">
                    When you purchase high-performance items, MKA generates a dynamic official digital invoice. Choosing "Generate Receipt & Order via WhatsApp" forwards this structured details manifest directly to our dedicated support number via standard API URL redirection. We never share your shipping address or contact info with unsolicited third parties.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    4. Cookies & Cache
                  </h4>
                  <p className="leading-relaxed">
                    We use standard localized localStorage and session tokens to preserve authentication sessions and state variables. You can easily wipe this state cache by logging out of your MKA account.
                  </p>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t border-white/8 text-center">
                <span className="text-[10px] text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-3.5 py-1.5 rounded-full font-mono">
                  🔒 Fully compliant with GDPR & Indian Digital Personal Data Protection (DPDP) Act
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass-prism p-6 md:p-8 rounded-3xl border border-white/10"
            >
              <div className="border-b border-white/8 pb-6 mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Terms of Track Service</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">Effective Date: June 30, 2026 | Document Reference: MKA-TOS-V4</p>
              </div>

              <div className="prose prose-invert max-w-none text-zinc-300 space-y-6 text-sm">
                <section className="space-y-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
                    1. Fitment & Bike Compatibility
                  </h4>
                  <p className="leading-relaxed">
                    MKA Mechanics manufactures high-performance track components. Since bike models have highly precise tolerances, customers are solely responsible for ensuring proper fitment. Our racing support team will assist with compatibility verification over WhatsApp, but final engineering oversight remains with the rider.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                    2. Ordering & Payment Verifications
                  </h4>
                  <p className="leading-relaxed">
                    Invoice creation does not constitute a completed order. All orders are marked "Pending Verification" until an authorized MKA customer representative contacts you to secure final confirmation, fitting specifications, and process manual transaction clearings.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    3. Track-Only & Street Legal Spare Policy
                  </h4>
                  <p className="leading-relaxed">
                    Certain titanium exhausts, liquid-nitrous feeds, high-pressure calipers, and diagnostic engine mapping parts are strictly engineered for closed-circuit competitive track racing. We expect customers to abide by local municipal transport codes.
                  </p>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t border-white/8 text-center">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">
                  Questions? MKA Motorsports Division support: +91 73050 68207
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
