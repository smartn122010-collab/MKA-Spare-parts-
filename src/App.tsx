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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#07050d] text-brand-rose relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-rose/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none" />
        <div className="w-12 h-12 rounded-full border-4 border-brand-violet/20 border-t-brand-rose animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest font-black text-zinc-400">Loading Session...</p>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
