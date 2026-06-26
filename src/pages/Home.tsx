import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, ArrowRight, Phone, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col min-h-full pb-20">
      {/* Hero Slideshow */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={SLIDES[currentSlide].img}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
          <motion.h2 
            key={`title-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-bold mb-8 text-center text-white drop-shadow-lg"
          >
            {SLIDES[currentSlide].title}
          </motion.h2>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
            <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            <div className="relative flex items-center bg-bg-panel backdrop-blur-md rounded-full border border-brand-red/50 overflow-hidden">
              <input 
                type="text" 
                placeholder="Search spare parts, categories..."
                className="flex-1 bg-transparent px-6 py-4 outline-none text-white placeholder:text-zinc-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="px-6 h-full flex items-center justify-center bg-brand-red hover:bg-red-500 transition-colors">
                <SearchIcon size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Offers Section */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-red rounded-full" />
            Today's Offers
          </h3>
          <button onClick={() => navigate('/offers')} className="text-brand-red text-sm flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] bg-bg-panel border border-brand-red/20 p-6 rounded-2xl flex-shrink-0 cursor-pointer hover:border-brand-red transition-colors" onClick={() => navigate('/offers')}>
              <div className="text-brand-red font-mono text-sm mb-2">USE CODE: MKA{i}0</div>
              <h4 className="font-bold text-lg mb-1">{i}0% OFF on Brakes</h4>
              <p className="text-zinc-400 text-sm">Valid until tomorrow</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Quick Link */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-12 flex justify-center">
        <button 
          onClick={() => navigate('/products')}
          className="group relative px-8 py-4 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-brand-red transition-all"
        >
          <div className="absolute inset-0 bg-brand-red/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative flex items-center gap-3 font-bold text-lg">
            Explore All Products <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </span>
        </button>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-20">
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl text-center">
          <h3 className="text-2xl font-bold mb-2">Contact Us</h3>
          <h4 className="text-xl text-brand-red font-bold mb-6">M K A MOTORS</h4>
          <p className="text-zinc-400 mb-8">Two Wheeler Spares Whole Dealers<br/>For product enquiries and wholesale orders, contact us anytime.</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:7305068207" className="flex items-center gap-2 bg-bg-dark px-6 py-3 rounded-xl hover:text-brand-red transition-colors border border-zinc-800">
              <Phone size={20} /> 7305068207
            </a>
            <a href="mailto:mkamotors16@outlook.com" className="flex items-center gap-2 bg-bg-dark px-6 py-3 rounded-xl hover:text-brand-red transition-colors border border-zinc-800">
              <Mail size={20} /> mkamotors16@outlook.com
            </a>
            <a href="https://whatsapp.com/channel/0029VbDLD8lDDmFa22OmnV2g" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-6 py-3 rounded-xl hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20">
              <MessageSquare size={20} /> WhatsApp Channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
