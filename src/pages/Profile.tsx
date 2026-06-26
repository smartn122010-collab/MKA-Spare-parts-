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
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center pt-24">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bg-panel border border-zinc-800 p-10 rounded-3xl w-full flex flex-col items-center shadow-2xl backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-brand-red/20 to-transparent" />
        
        <div className="relative group cursor-pointer mt-4" onClick={() => fileInputRef.current?.click()}>
          <div className="w-32 h-32 rounded-full border-4 border-bg-dark overflow-hidden bg-zinc-800 flex items-center justify-center relative z-10">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-zinc-500" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={32} className="text-white" />
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

        <h2 className="text-2xl font-bold mt-6 z-10">{user?.displayName || 'MKA Customer'}</h2>
        <p className="text-zinc-400 z-10 mb-8">{user?.email}</p>

        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-brand-red text-white rounded-xl transition-colors z-10 font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
