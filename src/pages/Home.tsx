import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, ArrowRight, Phone, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InteractiveBikeLab } from '../components/InteractiveBikeLab';

const SLIDES = [
  { id: 1, img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop', title: 'Premium Superbikes' },
  { id: 2, img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop', title: 'Genuine Spare Parts' },
  { id: 3, img: 'https://images.unsplash.com/photo-1620882194639-6552a4209ce2?q=80&w=2069&auto=format&fit=crop', title: 'Engine Components' },
];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20 relative">
      {/* Hero Slideshow */}
      <div className="relative w-full h-[52vh] md:h-[62vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={SLIDES[currentSlide].img}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/50 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
          <motion.h2 
            key={`title-${currentSlide}`}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-black mb-8 text-center text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-tight uppercase"
          >
            {SLIDES[currentSlide].title}
          </motion.h2>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
            <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            <div className="relative flex items-center bg-white/[0.04] backdrop-blur-2xl rounded-full border border-white/12 overflow-hidden shadow-2xl pl-2">
              <input 
                type="text" 
                placeholder="Search premium spare parts, categories..."
                className="flex-1 bg-transparent px-5 py-4.5 outline-none text-white placeholder:text-zinc-400 font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="mr-2 px-6 h-12 flex items-center justify-center bg-gradient-brand hover:scale-105 active:scale-95 transition-all rounded-full text-white cursor-pointer shadow-lg shadow-brand-rose/25"
              >
                <SearchIcon size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Offers Section */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <span className="w-2.5 h-7 bg-gradient-brand rounded-full" />
            Exclusive Deals
          </h3>
          <button 
            onClick={() => navigate('/offers')} 
            className="text-brand-rose hover:text-brand-violet text-sm font-bold flex items-center gap-1 hover:underline transition-colors"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        {/* Mixed colors: Rose, Violet, Lite Blue glass cards */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          <div 
            className="min-w-[300px] glass-card-rose p-7 rounded-[24px] flex-shrink-0 cursor-pointer hover:scale-[1.03] hover:shadow-[0_12px_24px_rgba(244,63,94,0.2)] transition-all" 
            onClick={() => navigate('/offers')}
          >
            <div className="text-brand-rose font-mono text-xs font-black tracking-widest mb-3 uppercase">USE CODE: MKA10</div>
            <h4 className="font-extrabold text-xl text-white mb-2">10% OFF on Brakes</h4>
            <p className="text-zinc-300 text-sm">Genuine ceramic disc rotors & shoes</p>
          </div>

          <div 
            className="min-w-[300px] glass-card-violet p-7 rounded-[24px] flex-shrink-0 cursor-pointer hover:scale-[1.03] hover:shadow-[0_12px_24px_rgba(139,92,246,0.2)] transition-all" 
            onClick={() => navigate('/offers')}
          >
            <div className="text-brand-violet font-mono text-xs font-black tracking-widest mb-3 uppercase">USE CODE: MKA20</div>
            <h4 className="font-extrabold text-xl text-white mb-2">20% OFF on Engine Oils</h4>
            <p className="text-zinc-300 text-sm">Premium synthetic racing lubricants</p>
          </div>

          <div 
            className="min-w-[300px] glass-card-blue p-7 rounded-[24px] flex-shrink-0 cursor-pointer hover:scale-[1.03] hover:shadow-[0_12px_24px_rgba(56,189,248,0.2)] transition-all" 
            onClick={() => navigate('/offers')}
          >
            <div className="text-brand-blue font-mono text-xs font-black tracking-widest mb-3 uppercase">USE CODE: MKA30</div>
            <h4 className="font-extrabold text-xl text-white mb-2">30% OFF on Chain Sprockets</h4>
            <p className="text-zinc-300 text-sm">Ultra-durable brass plated sets</p>
          </div>
        </div>
      </div>

      {/* Interactive Bike Laboratory & Parts Simulation */}
      <InteractiveBikeLab />

      {/* Products Quick Link */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-16 flex justify-center">
        <button 
          onClick={() => navigate('/products')}
          className="group relative px-8 py-4.5 bg-white/[0.03] rounded-2xl overflow-hidden border border-white/8 hover:border-brand-violet/40 hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)] transition-all cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-brand opacity-[0.06] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative flex items-center gap-3.5 font-bold text-base tracking-wide text-white">
            Explore All Products <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        </button>
      </div>

      {/* Contact Section - Premium Glass Prism */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-20">
        <div className="glass-prism p-10 rounded-[32px] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-violet/10 rounded-full blur-[80px]" />
          
          <h3 className="text-3xl font-black mb-2 text-white uppercase tracking-tight">Contact Us</h3>
          <h4 className="text-xl font-extrabold mb-5 uppercase tracking-wide">
            MKA <span className="text-gradient font-black">MOTORS</span>
          </h4>
          <p className="text-zinc-300 mb-10 max-w-xl mx-auto text-sm leading-relaxed">
            Two Wheeler Spares Whole Dealers.<br/>
            For premium products, genuine enquiries and wholesale orders, connect with our support agents instantly.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <a href="tel:7305068207" className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3.5 rounded-2xl text-white hover:text-brand-rose transition-all border border-white/6 hover:border-white/12 shadow-lg">
              <Phone size={18} className="text-brand-rose" /> 
              <span className="font-semibold text-sm">7305068207</span>
            </a>
            <a href="mailto:mkamotors16@outlook.com" className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3.5 rounded-2xl text-white hover:text-brand-violet transition-all border border-white/6 hover:border-white/12 shadow-lg">
              <Mail size={18} className="text-brand-violet" /> 
              <span className="font-semibold text-sm">mkamotors16@outlook.com</span>
            </a>
            <a href="https://whatsapp.com/channel/0029VbDLD8lDDmFa22OmnV2g" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15 px-6 py-3.5 rounded-2xl transition-all border border-[#25D366]/20 shadow-lg">
              <MessageSquare size={18} /> 
              <span className="font-bold text-sm">WhatsApp Channel</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
