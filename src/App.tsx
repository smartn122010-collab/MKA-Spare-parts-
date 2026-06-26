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
  if (loading) return <div className="h-screen flex items-center justify-center bg-bg-dark text-brand-red">Loading...</div>;
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
