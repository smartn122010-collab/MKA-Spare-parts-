import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Offer } from '../types';
import { motion } from 'motion/react';
import { Tag, Copy, Check } from 'lucide-react';

export function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers'));
        const offersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
        setOffers(offersList);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'offers');
        console.error("Error fetching offers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-full relative">
      <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
        <span className="w-2.5 h-8 bg-gradient-brand rounded-full" />
        Exclusive Offers
      </h2>

      <div className="glass-panel border-white/10 rounded-[24px] p-6 mb-10 flex gap-4.5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-rose/5 rounded-full blur-2xl" />
        <Tag className="text-brand-rose shrink-0 animate-bounce mt-1" size={22} />
        <div>
          <h4 className="font-extrabold text-brand-rose uppercase tracking-wider text-sm mb-1.5">How to Redeem</h4>
          <p className="text-zinc-300 text-sm leading-relaxed">Copy the offer code and visit the MKA motor shop branch. Present the active code to the manager to instantly receive a discount on your product order.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-rose">
          <div className="w-12 h-12 rounded-full border-4 border-brand-violet/20 border-t-brand-rose animate-spin mb-4" />
          <p className="font-bold animate-pulse text-sm tracking-wider uppercase">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <Tag size={64} className="mb-4 opacity-50 text-brand-violet animate-pulse" />
          <p className="text-xl font-bold">No active offers at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, idx) => {
            const isExpired = new Date(offer.expiryDate) < new Date();
            // Alternating glass styles of rose, violet, and lite blue mixed colour palette
            const glassStyles = ['glass-card-rose', 'glass-card-violet', 'glass-card-blue'];
            const chosenStyle = glassStyles[idx % glassStyles.length];
            
            return (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-[28px] p-7 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] border ${chosenStyle} ${isExpired ? 'opacity-50 border-zinc-800 shadow-none' : 'shadow-lg hover:shadow-2xl'}`}
              >
                {isExpired && (
                  <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider bg-white/5 text-zinc-400 px-3 py-1 rounded-full border border-white/5">Expired</div>
                )}
                <div className="text-4xl font-black text-white mb-2 tracking-tight uppercase">
                  {offer.discount} <span className="text-gradient">OFF</span>
                </div>
                <p className="text-zinc-300 text-sm mb-6.5 font-medium leading-relaxed">{offer.description}</p>
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex-1 bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3.5 font-mono text-center tracking-widest text-xl font-black text-white select-all">
                    {offer.code}
                  </div>
                  <button 
                    onClick={() => !isExpired && handleCopy(offer.id, offer.code)}
                    disabled={isExpired}
                    className="p-4 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded-2xl transition-all text-white border border-white/10 cursor-pointer active:scale-90"
                    title="Copy Code"
                  >
                    {copiedId === offer.id ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} className="text-zinc-200" />}
                  </button>
                </div>
                
                <div className="mt-5 text-[11px] font-bold tracking-wider text-zinc-400 text-center uppercase">
                  Valid until {new Date(offer.expiryDate).toLocaleDateString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
