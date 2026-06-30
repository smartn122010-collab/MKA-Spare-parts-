import React, { useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import { LogOut, Camera, User } from 'lucide-react';
import { motion } from 'motion/react';

export function Profile() {
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.photoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center pt-24 relative">
      <motion.div 
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel border-white/10 p-10 md:p-12 rounded-[32px] w-full flex flex-col items-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 w-full h-36 bg-gradient-to-r from-brand-rose/20 via-brand-violet/20 to-brand-blue/10 border-b border-white/6" />
        
        <div className="relative group cursor-pointer mt-8" onClick={() => fileInputRef.current?.click()}>
          <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center relative z-10 shadow-xl transition-all group-hover:scale-105">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={44} className="text-zinc-400" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <h2 className="text-2xl font-black mt-6 z-10 text-white uppercase tracking-wider">{user?.displayName || 'MKA Customer'}</h2>
        <p className="text-zinc-400 font-medium z-10 mb-8 text-sm">{user?.email}</p>

        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-brand-rose border border-white/8 hover:border-white/10 text-white rounded-2xl transition-all duration-300 z-10 font-bold text-xs uppercase tracking-widest cursor-pointer hover:shadow-lg hover:shadow-brand-rose/20 active:scale-95"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
