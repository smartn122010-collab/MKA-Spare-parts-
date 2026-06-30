import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Search, Package, UserPlus, Tag, User, Settings, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../AuthContext';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  const isAdmin = user?.email === 'smartnp09812@gmail.com' || user?.uid === 'NmCEpOC9DcaEwfc22bmxF79moJG3';

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/offers", icon: Tag, label: "Offers" },
    { to: "/profile", icon: User, label: "Profile" },
    ...(isAdmin ? [{ to: "/admin", icon: Settings, label: "Admin Panel" }] : []),
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-dark relative">
      {/* Background ambient glowing glassmorphic blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-rose/10 rounded-full blur-[160px] animate-float" />
        <div className="absolute top-1/4 right-[-200px] w-[700px] h-[700px] bg-brand-violet/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[160px] animate-float-delayed" />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:text-brand-rose transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - Glassmorphic design */}
      <aside className={cn(
        "fixed md:relative z-40 w-66 h-full bg-white/[0.02] backdrop-blur-3xl border-r border-white/8 transition-transform duration-300 ease-in-out shadow-[4px_0_24px_0_rgba(0,0,0,0.3)]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-6 pt-18 md:pt-8 relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center font-black text-xl text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]">
              MKA
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white">
                MKA <span className="text-gradient">MOTOR</span>
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Spare Parts</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3.5 px-4.5 py-3 rounded-xl transition-all duration-300 font-medium text-sm group",
                  isActive 
                    ? "bg-gradient-brand text-white shadow-[0_8px_20px_rgba(139,92,246,0.35)] border border-white/10" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 hover:border hover:border-white/5 border border-transparent"
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-zinc-400 group-hover:text-brand-blue")} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/8 pt-6">
            <div className="text-[10px] font-medium tracking-wider text-zinc-500 text-center uppercase leading-relaxed">
              &copy; M K A MOTORS.<br/>All Rights Reserved.
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
