import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Products } from './pages/Products';
import { Offers } from './pages/Offers';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { RegisterCustomer } from './pages/RegisterCustomer';
import { PrivacyTelemetry } from './pages/PrivacyTelemetry';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#07050d] text-brand-rose relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-rose/5 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-blue/5 blur-[140px] pointer-events-none" />
        
        {/* Glassmorphic Loader Orb */}
        <div className="relative w-24 h-24 mb-6">
          {/* Glowing underlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 blur-xl animate-pulse" />
          {/* Inner frosted glass orb */}
          <div className="absolute inset-2.5 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25)] flex items-center justify-center z-10">
            <span className="text-[10px] font-black font-mono text-zinc-400 tracking-wider">MKA</span>
          </div>
          {/* Multi-layered rotating glassmorphic gradient ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-brand-rose border-r-brand-blue animate-spin" />
          <div className="absolute inset-1 rounded-full border-[3.5px] border-transparent border-b-brand-violet border-l-brand-rose animate-[spin_1.5s_linear_infinite_reverse]" />
        </div>

        <p className="font-mono text-xs uppercase tracking-widest font-black text-zinc-300">Loading Session...</p>
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5">MKA HIGH-PERFORMANCE EXPERIENCE</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="products" element={<Products />} />
            <Route path="offers" element={<Offers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<Admin />} />
            <Route path="register-customer" element={<RegisterCustomer />} />
            <Route path="privacy-telemetry" element={<PrivacyTelemetry />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
