import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Gauge, 
  Activity, 
  Sparkles, 
  Flame, 
  Disc, 
  Settings, 
  ArrowRight, 
  RotateCcw,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PartDetail {
  id: string;
  name: string;
  category: string;
  desc: string;
  benefit: string;
  durability: string;
  performanceBonus: string;
  recommendedCategory: string;
}

const BIKE_PARTS: Record<string, PartDetail> = {
  engine: {
    id: 'engine',
    name: 'Racing Engine Core',
    category: 'Engine Components',
    desc: 'High-compression multi-valve cylinder block engineered for maximum volumetric efficiency.',
    benefit: 'Drastically smoother throttle response and higher peak thermal capacity.',
    durability: '98% (High-Strength Alloy)',
    performanceBonus: '+15 BHP',
    recommendedCategory: 'engine'
  },
  brakes: {
    id: 'brakes',
    name: 'Dual Ceramic Disk Brakes',
    category: 'Braking System',
    desc: 'Ventilated floating rotor assembly with multi-piston calipers for progressive heat dissipation.',
    benefit: 'Near-zero brake fade under high-speed deceleration or track conditions.',
    durability: '95% (Carbon-Ceramic Matrix)',
    performanceBonus: '-12m Stop Distance',
    recommendedCategory: 'brakes'
  },
  exhaust: {
    id: 'exhaust',
    name: 'Titanium Exhaust Silencer',
    category: 'Exhaust Systems',
    desc: 'Straight-through acoustic design with carbon fiber heat shielding and back-pressure tuning.',
    benefit: 'Gives the engine a deep, resonant rumble while optimizing high-RPM scavenging.',
    durability: '99% (Grade 5 Titanium)',
    performanceBonus: '+6% Exhaust Flow',
    recommendedCategory: 'exhaust'
  },
  transmission: {
    id: 'transmission',
    name: 'Heavy-Duty Brass Chain Kit',
    category: 'Sprockets & Chains',
    desc: 'Pre-stretched gold-plated O-ring roller chain paired with CNC hardened rear sprockets.',
    benefit: 'Eliminates driveline power loss and provides supreme tensile endurance.',
    durability: '97% (Chromoly Steel / Gold O-Ring)',
    performanceBonus: '99.4% Power Transfer',
    recommendedCategory: 'sprockets'
  },
  chassis: {
    id: 'chassis',
    name: 'Aero Carbon Fiber Tank Cover',
    category: 'Body & Accessories',
    desc: 'Autoclave-cured dry carbon shell designed to optimize knee-grip ergonomics and weight distribution.',
    benefit: 'Reduces deadweight and adds pristine racing aesthetics.',
    durability: '100% (Dry Carbon Fiber)',
    performanceBonus: '-1.8 kg Weight Reduction',
    recommendedCategory: 'accessories'
  }
};

export function InteractiveBikeLab() {
  const [selectedPart, setSelectedPart] = useState<PartDetail>(BIKE_PARTS.engine);
  const [throttle, setThrottle] = useState(30); // 0 to 100
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [backfireCount, setBackfireCount] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>('engine');
  const [currentBhp, setCurrentBhp] = useState(115);
  const navigate = useNavigate();

  // Sounds are simulated with visual pulses & haptics.
  const backfireTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-calculated variables based on throttle and Nitro
  const calculatedThrottle = isNitroActive ? 120 : throttle;
  const rpm = Math.round(1500 + (calculatedThrottle / 100) * 10500); // 1500 to 12000 RPM
  const speed = Math.round((calculatedThrottle / 100) * 299); // 0 to 299 km/h
  
  // Dynamic gear selection based on speed
  let gear = 'N';
  if (speed > 0 && speed <= 45) gear = '1';
  else if (speed > 45 && speed <= 90) gear = '2';
  else if (speed > 90 && speed <= 140) gear = '3';
  else if (speed > 140 && speed <= 195) gear = '4';
  else if (speed > 195 && speed <= 250) gear = '5';
  else if (speed > 250) gear = '6';

  // Back-flame effect handler
  const triggerBackfire = () => {
    setBackfireCount(prev => prev + 1);
    if (backfireTimerRef.current) clearTimeout(backfireTimerRef.current);
    backfireTimerRef.current = setTimeout(() => {
      setBackfireCount(0);
    }, 800);
  };

  // Nitro Boost click handler
  const activateNitro = () => {
    if (isNitroActive) return;
    setIsNitroActive(true);
    triggerBackfire();
    
    // Gradual decline of nitro
    setTimeout(() => {
      setIsNitroActive(false);
      triggerBackfire();
    }, 4000);
  };

  useEffect(() => {
    // Dynamically calculate fluctuating BHP based on RPM and parts modifier
    const baseBhp = 95 + (rpm / 12000) * 80;
    const bonus = selectedPart ? parseFloat(selectedPart.performanceBonus) || 0 : 0;
    setCurrentBhp(Math.round(baseBhp + bonus));
  }, [rpm, selectedPart]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (backfireTimerRef.current) clearTimeout(backfireTimerRef.current);
    };
  }, []);

  // Dynamic Neon Underglow color based on speed and Nitro
  let underglowColor = 'rgba(139, 92, 246, 0.45)'; // Idle purple
  if (isNitroActive) {
    underglowColor = 'rgba(244, 63, 94, 0.85)'; // Nitro blazing rose red
  } else if (speed > 220) {
    underglowColor = 'rgba(244, 63, 94, 0.7)'; // Redline speed
  } else if (speed > 110) {
    underglowColor = 'rgba(56, 189, 248, 0.65)'; // High speed cyan
  }

  // Calculate dynamic shake intensity
  const shakeAnimation = speed > 0 
    ? `engine-rumble ${Math.max(0.04, 0.4 - (speed / 300) * 0.35)}s linear infinite`
    : 'none';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-20" id="bike-simulation-lab">
      {/* Lab Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[10px] bg-gradient-brand text-transparent bg-clip-text font-black uppercase tracking-widest block mb-2">
            MKA HIGH-PERFORMANCE EXPERIENCE
          </span>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            <span className="w-2.5 h-8 bg-gradient-brand rounded-full" />
            Superbike Simulation & Parts Lab
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <p className="text-zinc-400 text-sm max-w-xl">
              Rev the racing engine, activate the nitrous flow, and inspect how premium MKA spares unleash peak velocities.
            </p>
            <span className="font-script text-2xl text-brand-rose font-bold rotate-[-3deg] ml-1.5 block drop-shadow-md">
              Engineered to Conquer the Track
            </span>
          </div>
        </div>
        
        {/* RPM / Engine State Indicator HUD */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/6 px-4 py-2.5 rounded-2xl backdrop-blur-md">
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">ENGINE METRIC</span>
            <span className="text-xs font-mono font-extrabold text-white">
              {rpm >= 9500 ? '🔥 PERFORMANCE REDLINE' : '✅ SYS NOMINAL'}
            </span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full relative">
            <span className={`absolute inset-0 rounded-full ${rpm >= 9500 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
            <span className={`absolute inset-0 rounded-full ${rpm >= 9500 ? 'bg-rose-600' : 'bg-emerald-500'}`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN (SVG Superbike & Throttle controls) */}
        <div className="lg:col-span-7 glass-prism rounded-[32px] p-5 sm:p-7.5 flex flex-col justify-between overflow-hidden relative min-h-[480px]">
          
          {/* Background Ambient glows */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-brand-rose/5 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-blue/5 rounded-full blur-[110px] pointer-events-none" />

          {/* HUD Top metrics */}
          <div className="flex justify-between items-start z-10">
            <div className="font-mono bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-[11px] text-zinc-300">
              SPEED: <span className="text-brand-rose font-black">{speed} km/h</span>
            </div>
            <div className="font-mono bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-[11px] text-zinc-300 flex items-center gap-1.5">
              <Activity size={12} className="text-brand-violet animate-pulse" />
              GEAR: <span className="text-brand-blue font-black">{gear}</span>
            </div>
          </div>

          {/* SUPERBIKE INTERACTIVE SVG PLATFORM */}
          <div className="relative my-4 flex items-center justify-center min-h-[240px] max-w-full">
            
            {/* Realtime Backfire Pops or Sparks overlay */}
            <AnimatePresence>
              {backfireCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: 120, y: 15 }}
                  animate={{ opacity: 1, scale: [1, 1.4, 1], x: 140, y: 10 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute z-20 pointer-events-none"
                >
                  <Flame size={44} className="text-orange-500 fill-current drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]" />
                  <span className="absolute left-10 -top-2 bg-rose-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded text-white tracking-widest whitespace-nowrap">
                    BACKFIRE!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NITRO FLOW OVERLAY */}
            <AnimatePresence>
              {isNitroActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none bg-radial from-brand-blue/20 to-transparent blur-md z-0"
                />
              )}
            </AnimatePresence>

            {/* SUPERBIKE SVG */}
            <svg 
              viewBox="0 0 600 320" 
              style={{ animation: shakeAnimation }}
              className={`w-full max-w-[480px] h-auto drop-shadow-[0_16px_32px_rgba(0,0,0,0.75)] z-10 transition-all duration-300 ${isNitroActive ? 'animate-[bounce_0.15s_infinite]' : ''}`}
            >
              <defs>
                <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
                <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ROADWAY LINE */}
              <line x1="20" y1="280" x2="580" y2="280" stroke="rgba(255,255,255,0.06)" strokeWidth="4" strokeDasharray="8,8" />

              {/* CYBERPUNK NEON UNDERGLOW BEAM */}
              <path 
                d="M 120 270 L 480 270" 
                stroke={underglowColor} 
                strokeWidth="10" 
                strokeLinecap="round"
                filter="url(#neonGlow)" 
                opacity="0.8" 
                className="transition-all duration-300"
              />

              {/* REAR WHEEL SYSTEM (LEFT) */}
              <g transform="translate(130, 210)">
                {/* Tire Tread Marks */}
                <circle cx="0" cy="0" r="63" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeDasharray="6,8" />
                {/* Outer Rim */}
                <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                {/* Interactive Rim Highlight */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r="60" 
                  fill="none" 
                  stroke={activeHotspot === 'transmission' ? '#38bdf8' : 'rgba(255,255,255,0.2)'} 
                  strokeWidth="4" 
                  className="transition-colors duration-300"
                />
                
                {/* SPINNING SPOKES */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: speed > 0 ? Math.max(0.1, 2.5 - (speed / 100)) : 0, 
                    ease: "linear" 
                  }}
                >
                  <circle cx="0" cy="0" r="50" fill="none" stroke="url(#wheelGrad)" strokeWidth="3" strokeDasharray="30, 10, 15, 20" />
                  <line x1="-50" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                  <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                  <line x1="-35" y1="-35" x2="35" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                  <line x1="35" y1="-35" x2="-35" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                </motion.g>
                
                {/* Brake Caliper */}
                <path d="M-40,-40 L-25,-45 L-20,-30 Z" fill="#f43f5e" opacity="0.9" />
              </g>

              {/* FRONT WHEEL SYSTEM (RIGHT) */}
              <g transform="translate(470, 210)">
                {/* Tire Tread Marks */}
                <circle cx="0" cy="0" r="63" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeDasharray="6,8" />
                {/* Outer Rim */}
                <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                {/* Disk Brake Rotors Highlight */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r="60" 
                  fill="none" 
                  stroke={activeHotspot === 'brakes' ? '#f43f5e' : 'rgba(255,255,255,0.2)'} 
                  strokeWidth="4"
                  className="transition-colors duration-300"
                />
                
                {/* SPINNING SPOKES */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: speed > 0 ? Math.max(0.1, 2.5 - (speed / 100)) : 0, 
                    ease: "linear" 
                  }}
                >
                  <circle cx="0" cy="0" r="50" fill="none" stroke="url(#wheelGrad)" strokeWidth="3" strokeDasharray="25, 15, 5, 25" />
                  <line x1="-50" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                  <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                  <line x1="-35" y1="-35" x2="35" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                  <line x1="35" y1="-35" x2="-35" y2="35" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                </motion.g>
                
                {/* Brembo Style Red calipers */}
                <path d="M30,-30 L45,-25 L40,-15 Z" fill="#f43f5e" opacity="0.95" />
              </g>

              {/* FRAME & MAIN BODY CHASSIS */}
              {/* Swingarm rear fork connecting back hub to chassis */}
              <line x1="130" y1="210" x2="250" y2="190" stroke="rgba(255,255,255,0.4)" strokeWidth="12" strokeLinecap="round" />
              <line x1="130" y1="210" x2="250" y2="190" stroke="#110d24" strokeWidth="8" strokeLinecap="round" />

              {/* Rear Sprocket Golden Chain Link - ANIMATED SPIN */}
              <path 
                d="M130,195 L250,180 L250,200 L130,225 Z" 
                fill="none" 
                stroke={activeHotspot === 'transmission' ? '#fbbf24' : 'rgba(251,191,36,0.45)'} 
                strokeWidth="3" 
                style={{
                  strokeDasharray: '6,4',
                  animation: speed > 0 ? `chain-spin ${Math.max(0.04, 0.8 - (speed / 300) * 0.75)}s linear infinite` : 'none'
                }}
                className="transition-colors duration-300"
              />

              {/* Engine Block representation */}
              <rect 
                x="240" 
                y="140" 
                width="95" 
                height="75" 
                rx="10" 
                fill="#0d091a" 
                stroke={activeHotspot === 'engine' ? '#8b5cf6' : 'rgba(255,255,255,0.15)'} 
                strokeWidth="3.5"
                className="transition-all duration-300"
              />
              {/* Cooling fins inside engine */}
              <line x1="250" y1="155" x2="320" y2="155" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
              <line x1="250" y1="170" x2="325" y2="170" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
              <line x1="250" y1="185" x2="320" y2="185" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
              <line x1="250" y1="200" x2="310" y2="200" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />

              {/* Cylinder head spark glow - High speed physical flashing */}
              {speed > 0 && (
                <circle 
                  cx="285" 
                  cy="170" 
                  r="14" 
                  fill="url(#chassisGrad)" 
                  style={{
                    animation: `spark-pulse ${Math.max(0.04, 0.35 - (rpm / 12000) * 0.3)}s steps(2) infinite`
                  }}
                  className="pointer-events-none"
                />
              )}

              {/* Exhaust Pipe Silencer */}
              <path 
                d="M270,210 L230,230 L100,220" 
                fill="none" 
                stroke="rgba(255,255,255,0.45)" 
                strokeWidth="7" 
                strokeLinecap="round" 
              />
              {/* Exhaust Muffler Core */}
              <path 
                d="M140,225 L65,215 L62,190 L135,208 Z" 
                fill="#16122d" 
                stroke={activeHotspot === 'exhaust' ? '#f43f5e' : 'rgba(255,255,255,0.22)'} 
                strokeWidth="3"
                className="transition-colors duration-300"
              />
              <line x1="62" y1="202" x2="135" y2="216" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

              {/* Main Frame / Chassis Tubes (Futuristic trellis) */}
              <path 
                d="M250,190 L330,130 L450,110 M250,190 L370,190 L450,110" 
                fill="none" 
                stroke="url(#chassisGrad)" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />

              {/* Fuel Tank & Tail Section */}
              <path 
                d="M170,120 L240,110 L350,90 L380,140 L310,190 Z" 
                fill="#070414" 
                stroke={activeHotspot === 'chassis' ? '#8b5cf6' : 'rgba(255,255,255,0.12)'} 
                strokeWidth="3"
                className="transition-colors duration-300"
              />
              {/* Tank accent styling */}
              <path d="M260,113 C290,105 320,105 340,115" fill="none" stroke="#f43f5e" strokeWidth="3" opacity="0.8" />

              {/* Seat */}
              <path d="M190,130 L250,135 L285,160 Z" fill="#0c0a17" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

              {/* FRONT FORKS SYSTEM (Right) */}
              <g transform="translate(450, 110)">
                {/* Triple tree and handlebars */}
                <line x1="0" y1="0" x2="-25" y2="-20" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round" />
                <line x1="-30" y1="-20" x2="-10" y2="-20" stroke="rgba(255,255,255,0.8)" strokeWidth="4" />
                
                {/* Dual front forks slider */}
                <line 
                  x1="0" 
                  y1="0" 
                  x2="20" 
                  y2="100" 
                  stroke={activeHotspot === 'brakes' ? '#38bdf8' : 'rgba(255,255,255,0.3)'} 
                  strokeWidth="6.5" 
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                />
                <line x1="3" y1="15" x2="17" y2="85" stroke="#fbbf24" strokeWidth="2" />
              </g>

              {/* TAIL LIGHT & COWL */}
              <path d="M135,130 L170,120 L190,140 Z" fill="#0f0b24" />
              <path d="M132,126 L138,126 L135,134 Z" fill="#f43f5e" filter="url(#neonGlow)" />

              {/* EXHAUST MICRO PARTICLES (Dynamic floating puff balls when revved) */}
              {speed > 0 && (
                <g>
                  <motion.circle 
                    cx="48" 
                    cy="200" 
                    r={4 + (rpm / 3500)} 
                    fill="rgba(244,63,94,0.5)" 
                    animate={{ x: [-10, -90], y: [0, -40], opacity: [1, 0], scale: [1, 2.2] }}
                    transition={{ repeat: Infinity, duration: Math.max(0.3, 1.0 - (rpm / 8000)), ease: "easeOut" }}
                  />
                  <motion.circle 
                    cx="48" 
                    cy="200" 
                    r={3 + (rpm / 5000)} 
                    fill="rgba(139,92,246,0.4)" 
                    animate={{ x: [-5, -70], y: [10, -15], opacity: [1, 0], scale: [1, 1.8] }}
                    transition={{ repeat: Infinity, duration: Math.max(0.4, 1.2 - (rpm / 8000)), ease: "easeOut", delay: 0.25 }}
                  />
                </g>
              )}

              {/* INTERACTIVE HOTSPOT BUTTONS (Overlaid on SVG elements) */}
              {/* 1. Engine core hotspot */}
              <g 
                className="cursor-pointer group/hotspot" 
                onClick={() => { setSelectedPart(BIKE_PARTS.engine); setActiveHotspot('engine'); }}
              >
                <circle 
                  cx="285" 
                  cy="175" 
                  r="15" 
                  fill="rgba(139,92,246,0.2)" 
                  stroke={activeHotspot === 'engine' ? '#8b5cf6' : 'rgba(255,255,255,0.4)'} 
                  strokeWidth="2.5" 
                />
                <circle cx="285" cy="175" r="5" fill="#8b5cf6" className="group-hover/hotspot:scale-130 transition-transform duration-300" />
              </g>

              {/* 2. Brakes system hotspot */}
              <g 
                className="cursor-pointer group/hotspot" 
                onClick={() => { setSelectedPart(BIKE_PARTS.brakes); setActiveHotspot('brakes'); }}
              >
                <circle 
                  cx="470" 
                  cy="210" 
                  r="15" 
                  fill="rgba(244,63,94,0.2)" 
                  stroke={activeHotspot === 'brakes' ? '#f43f5e' : 'rgba(255,255,255,0.4)'} 
                  strokeWidth="2.5" 
                />
                <circle cx="470" cy="210" r="5" fill="#f43f5e" className="group-hover/hotspot:scale-130 transition-transform duration-300" />
              </g>

              {/* 3. Exhaust hotspot */}
              <g 
                className="cursor-pointer group/hotspot" 
                onClick={() => { setSelectedPart(BIKE_PARTS.exhaust); setActiveHotspot('exhaust'); }}
              >
                <circle 
                  cx="95" 
                  cy="208" 
                  r="15" 
                  fill="rgba(244,63,94,0.2)" 
                  stroke={activeHotspot === 'exhaust' ? '#f43f5e' : 'rgba(255,255,255,0.4)'} 
                  strokeWidth="2.5" 
                />
                <circle cx="95" cy="208" r="5" fill="#f43f5e" className="group-hover/hotspot:scale-130 transition-transform duration-300" />
              </g>

              {/* 4. Transmission hotspot */}
              <g 
                className="cursor-pointer group/hotspot" 
                onClick={() => { setSelectedPart(BIKE_PARTS.transmission); setActiveHotspot('transmission'); }}
              >
                <circle 
                  cx="180" 
                  cy="205" 
                  r="15" 
                  fill="rgba(56,189,248,0.2)" 
                  stroke={activeHotspot === 'transmission' ? '#38bdf8' : 'rgba(255,255,255,0.4)'} 
                  strokeWidth="2.5" 
                />
                <circle cx="180" cy="205" r="5" fill="#38bdf8" className="group-hover/hotspot:scale-130 transition-transform duration-300" />
              </g>

              {/* 5. Fuel tank / Body hotspot */}
              <g 
                className="cursor-pointer group/hotspot" 
                onClick={() => { setSelectedPart(BIKE_PARTS.chassis); setActiveHotspot('chassis'); }}
              >
                <circle 
                  cx="280" 
                  cy="115" 
                  r="15" 
                  fill="rgba(139,92,246,0.2)" 
                  stroke={activeHotspot === 'chassis' ? '#8b5cf6' : 'rgba(255,255,255,0.4)'} 
                  strokeWidth="2.5" 
                />
                <circle cx="280" cy="115" r="5" fill="#8b5cf6" className="group-hover/hotspot:scale-130 transition-transform duration-300" />
              </g>
            </svg>
          </div>

          {/* DYNAMIC SPECS METRIC STRIP */}
          <div className="grid grid-cols-3 gap-3 border-t border-white/6 pt-4 mt-2">
            <div className="bg-white/[0.01] p-3 rounded-2xl border border-white/4 text-center">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">ENGINE RPM</span>
              <span className="text-sm font-black font-mono text-white mt-1 block">
                {rpm.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/[0.01] p-3 rounded-2xl border border-white/4 text-center">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">HORSEPOWER</span>
              <span className="text-sm font-black font-mono text-brand-rose mt-1 block">
                {currentBhp} BHP
              </span>
            </div>
            <div className="bg-white/[0.01] p-3 rounded-2xl border border-white/4 text-center">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">AIR VELOCITY</span>
              <span className="text-sm font-black font-mono text-brand-blue mt-1 block">
                {Math.round(speed * 0.27)} Mach
              </span>
            </div>
          </div>

          {/* CONTROLS AREA (Throttle slider & Quick backfire pop) */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-zinc-400">
              <span className="flex items-center gap-1"><Gauge size={14} className="text-brand-violet" /> Rotate Throttle Grip</span>
              <span className="font-mono text-white font-bold">{throttle}%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={throttle} 
                onChange={(e) => setThrottle(Number(e.target.value))}
                disabled={isNitroActive}
                className="flex-1 accent-brand-rose bg-white/10 h-2 rounded-lg cursor-pointer disabled:opacity-40" 
              />
              
              {/* Backfire Spark Action Button */}
              <button 
                onClick={triggerBackfire}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-rose/40 rounded-xl text-[10px] font-black uppercase tracking-wider text-white cursor-pointer active:scale-95 hover:scale-[1.03] transition-all flex items-center gap-1.5 duration-300 shadow-md hover:shadow-brand-rose/10"
                title="Rev up and spark release backfire pop!"
              >
                <Flame size={12} className="text-brand-rose animate-pulse" />
                Backfire
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Telemetry HUD & Live Recommendation Specs) */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          
          {/* TOP INSTRUMENTATION HOOD (Reactive RPM indicator & Speed dialer) */}
          <div className="glass-prism rounded-[32px] p-6 relative overflow-hidden flex-1 border border-white/10">
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />
            
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4 flex items-center gap-1.5">
              <Activity size={14} /> telemetry hud diagnostics
            </h4>

            {/* Simulated Live Sound Wave / Vibration Bars */}
            <div className="flex items-end gap-1.5 h-16 bg-black/35 rounded-2xl px-5 border border-white/4 mb-5 relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                Harmonic Vibration Frequencies
              </div>
              <div className="flex items-end justify-between w-full h-8 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                  // Speed fluctuations based on RPM state
                  const delay = bar * 0.04;
                  const duration = rpm > 8000 ? 0.15 : rpm > 4000 ? 0.35 : 0.6;
                  return (
                    <motion.div
                      key={bar}
                      animate={{ 
                        height: rpm > 1500 
                          ? [6, Math.max(8, (rpm / 12000) * 32 * Math.sin(bar)), 6] 
                          : [4, 6, 4] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration, 
                        delay,
                        ease: "easeInOut"
                      }}
                      className={`w-1.5 rounded-t-sm ${
                        rpm >= 9500 
                          ? 'bg-rose-500' 
                          : bar > 10 
                            ? 'bg-brand-violet' 
                            : 'bg-brand-blue'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* NITRO FLOW SWITCH BOARD */}
            <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/6 rounded-2xl mb-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider flex items-center gap-1">
                  <Flame size={12} className="text-brand-rose" /> Liquid Nitrous Feed
                </span>
                <span className="text-xs text-zinc-500 mt-0.5">Increases throttle flow input past 120%</span>
              </div>
              
              <button
                onClick={activateNitro}
                disabled={isNitroActive}
                className={`px-5 py-3 rounded-xl font-black uppercase tracking-widest text-xs border transition-all cursor-pointer shadow-md flex items-center gap-1.5 duration-300 ${
                  isNitroActive
                    ? 'bg-brand-blue text-white border-brand-blue shadow-brand-blue/30 scale-95 cursor-not-allowed'
                    : 'bg-gradient-brand hover:shadow-brand-rose/25 text-white border-white/10 hover:scale-105 active:scale-95 shadow-lg'
                }`}
              >
                <Zap size={14} className={isNitroActive ? 'animate-bounce' : ''} />
                {isNitroActive ? 'BOOSTING...' : 'NITRO BOOST'}
              </button>
            </div>
          </div>

          {/* DYNAMIC RECOMMENDATION HUD */}
          <div className="glass-prism rounded-[32px] p-6 relative overflow-hidden flex-1 flex flex-col justify-between border border-white/10">
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-violet/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-white/6 pb-3 mb-4">
                <span className="text-[10px] text-brand-rose font-black uppercase tracking-widest">
                  active part diagnostic
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  PART_ID: #{selectedPart.id.toUpperCase()}
                </span>
              </div>

              <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1.5 flex items-center gap-2">
                {selectedPart.name}
              </h4>
              <p className="text-brand-blue text-[11px] font-black uppercase tracking-widest mb-3">
                🔧 Category: {selectedPart.category}
              </p>

              <div className="space-y-3.5 my-4">
                <div className="bg-white/[0.01] border border-white/4 p-3 rounded-2xl">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Engineering Specs</span>
                  <p className="text-zinc-300 text-xs mt-1 leading-relaxed">
                    {selectedPart.desc}
                  </p>
                </div>

                <div className="bg-white/[0.01] border border-white/4 p-3 rounded-2xl">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Performance Output Gain</span>
                  <p className="text-brand-rose font-extrabold text-sm mt-1">
                    {selectedPart.performanceBonus}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-white/[0.01] border border-white/4 p-3 rounded-xl text-center">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest block">Material Integrity</span>
                    <span className="text-xs font-black text-white mt-1 block">{selectedPart.durability}</span>
                  </div>
                  <div className="bg-white/[0.01] border border-white/4 p-3 rounded-xl text-center">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest block">Ideal Operating temp</span>
                    <span className="text-xs font-black text-white mt-1 block">85°C - 105°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explore Button with high-fidelity transitions */}
            <button
              onClick={() => {
                navigate(`/products?category=${encodeURIComponent(selectedPart.recommendedCategory)}`);
              }}
              className="w-full mt-2 group relative py-4 bg-gradient-brand rounded-2xl overflow-hidden border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-rose/20 duration-300"
            >
              <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-px bg-gradient-to-r from-brand-rose via-brand-violet to-brand-blue opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
              
              <span className="relative flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                <Settings size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                Inspect MKA Spare Catalog 
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
