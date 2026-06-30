import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-bg-dark text-brand-red">Loading...</div>;
  }

  return (
    <div className="h-screen w-full bg-bg-dark flex flex-col relative overflow-hidden items-center justify-center">
      {/* Background accents in Rose, Violet, and Light Blue */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/10 left-1/10 w-[450px] h-[450px] bg-brand-rose/15 rounded-full blur-[140px] animate-float" />
        <div className="absolute bottom-1/10 right-1/10 w-[500px] h-[500px] bg-brand-violet/15 rounded-full blur-[160px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-blue/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 glass-panel p-10 md:p-12 rounded-[32px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center max-w-md w-full mx-4 border border-white/10"
      >
        <motion.div 
          animate={{ 
            y: [-8, 8, -8],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-22 h-22 rounded-2xl bg-gradient-brand mb-8 flex items-center justify-center text-3xl font-black shadow-[0_12px_30px_rgba(244,63,94,0.4)] text-white"
        >
          MKA
        </motion.div>
        
        <h1 className="text-3xl font-black tracking-wider mb-2 text-center uppercase text-white">
          MKA <span className="text-gradient">MOTOR</span>
        </h1>
        <p className="text-xs font-bold tracking-widest text-zinc-400 mb-10 text-center uppercase">Two Wheeler Spares</p>

        <button 
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-zinc-950 py-4 px-6 rounded-2xl font-bold transition-all shadow-[0_8px_25px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_35px_rgba(139,92,246,0.3)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}
