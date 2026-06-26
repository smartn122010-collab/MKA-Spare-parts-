import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Search, Package, UserPlus, Tag, User, Settings, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../AuthContext';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/offers", icon: Tag, label: "Offers" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/admin", icon: Settings, label: "Admin Panel" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-dark">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-zinc-800 text-white hover:text-brand-red transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative z-40 w-64 h-full bg-bg-panel backdrop-blur-xl border-r border-zinc-800 transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-6 pt-16 md:pt-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center font-bold text-xl text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              MKA
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">MKA MOTOR</h1>
              <p className="text-xs text-zinc-400">Spare Parts</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-brand-red/10 text-brand-red border-l-2 border-brand-red" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-zinc-800 pt-6">
            <div className="text-xs text-zinc-500 text-center">
              &copy; M K A MOTORS.<br/>All Rights Reserved.
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative">
        <Outlet />
      </main>
    </div>
  );
}
