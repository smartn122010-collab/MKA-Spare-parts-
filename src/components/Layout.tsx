import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Package, Tag, User, Settings, BarChart3, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../AuthContext';
import { SuperbikeCanvasBackground } from './SuperbikeCanvasBackground';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAdmin = user?.email === 'smartnp09812@gmail.com' || 
                  user?.email === 'ka8255633@gmail.com' ||
                  user?.uid === 'NmCEpOC9DcaEwfc22bmxF79moJG3' || 
                  user?.displayName?.toUpperCase().includes('ASRAFALI') || 
                  user?.email?.toUpperCase().includes('ASRAFALI');

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search Parts" },
    { to: "/products", icon: Package, label: "All Products" },
    { to: "/offers", icon: Tag, label: "Deals & Offers" },
    { to: "/profile", icon: User, label: "My Profile" },
    { to: "/privacy-telemetry", icon: BarChart3, label: "Analytics & Legal" },
    ...(isAdmin ? [{ to: "/admin", icon: Settings, label: "Admin Panel" }] : []),
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-bg-dark relative">
      {/* Superbike Animated Canvas Track & Particle Background Simulation */}
      <SuperbikeCanvasBackground />

      {/* Shifting Gradient Color Animation layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-45">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-rose/12 rounded-full blur-[160px] animate-float" />
        <div className="absolute top-1/4 right-[-200px] w-[700px] h-[700px] bg-brand-violet/12 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-brand-blue/12 rounded-full blur-[160px] animate-float-delayed" />
      </div>

      {/* Premium Glass Prism Top Horizontal Header - Replaces Web Sidebar */}
      <header className="relative z-40 w-full px-4 md:px-6 pt-4 shrink-0">
        <div className="glass-prism max-w-7xl mx-auto px-5 py-3 rounded-[24px] border border-white/10 flex items-center justify-between shadow-[0_12px_40px_-4px_rgba(0,0,0,0.6)]">
          
          {/* Logo Brand Group */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center font-black text-lg text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]">
              MKA
            </div>
            <div>
              <h1 className="text-sm md:text-base font-black tracking-wider text-white uppercase flex items-center gap-1">
                MKA <span className="text-gradient">MOTOR</span>
              </h1>
              <p className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase leading-none">Spares Division</p>
            </div>
          </div>

          {/* Desktop/PC Navigation Link Group */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-wider relative group",
                  isActive 
                    ? "text-white bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={13.5} className={cn("transition-transform group-hover:scale-110", isActive ? "text-brand-rose" : "text-zinc-400 group-hover:text-brand-blue")} />
                    <span>{item.label.split(' ')[0]}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeHeaderIndicator"
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-gradient-brand"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls Area */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-5.5 h-5.5 rounded-full border border-brand-rose/40" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-5.5 h-5.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-[9px] font-bold text-brand-violet uppercase">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-bold text-zinc-300 max-w-[100px] truncate">{user.displayName || 'Rider'}</span>
                
                <button 
                  onClick={() => logout()}
                  title="Logout Session"
                  className="p-1 rounded-lg text-zinc-400 hover:text-brand-rose hover:bg-white/5 transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-4.5 py-2 bg-gradient-brand text-white font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-rose/25 cursor-pointer flex items-center gap-1.5"
              >
                Sign In <ChevronRight size={13} />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area - Full screen, padded for Desktop/Mobile Bottom Navigation Dock */}
      <main className="flex-1 w-full overflow-y-auto relative z-10 pb-24 md:pb-6 pt-2">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Premium Glass Prism Mobile Bottom Navigation Dock (Visible on Mobile Only) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="glass-prism rounded-[24px] px-3.5 py-3 border border-white/10 shadow-[0_16px_32px_rgba(0,0,0,0.6)] flex items-center justify-around backdrop-blur-2xl">
          {navItems.slice(0, 6).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all relative",
                isActive ? "text-white" : "text-zinc-400"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={cn("transition-transform duration-300", isActive ? "scale-110 text-brand-rose" : "text-zinc-400")} />
                  <span className="text-[9px] font-bold tracking-tight">{item.label.split(' ')[0]}</span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeBottomIndicator"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-rose" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

