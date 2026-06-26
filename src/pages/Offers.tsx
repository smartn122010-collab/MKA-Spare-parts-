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
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-full">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-2 h-8 bg-brand-red rounded-full" />
        Exclusive Offers
      </h2>

      <div className="bg-brand-red/10 border border-brand-red/30 rounded-2xl p-6 mb-10 flex gap-4">
        <Tag className="text-brand-red shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-brand-red mb-1">How to Redeem</h4>
          <p className="text-zinc-300 text-sm">Copy the offer code and visit the MKA motor shop branch. Tell the code to the manager to get the discount on your product price.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-brand-red animate-pulse">Loading offers...</div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Tag size={64} className="mb-4 opacity-50" />
          <p className="text-xl">No active offers at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const isExpired = new Date(offer.expiryDate) < new Date();
            
            return (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-bg-panel border rounded-2xl p-6 relative overflow-hidden ${isExpired ? 'border-zinc-800 opacity-60' : 'border-zinc-700 hover:border-brand-red'}`}
              >
                {isExpired && (
                  <div className="absolute top-4 right-4 text-xs font-bold bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">Expired</div>
                )}
                <div className="text-3xl font-bold text-white mb-2">{offer.discount} OFF</div>
                <p className="text-zinc-400 mb-6">{offer.description}</p>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 font-mono text-center tracking-widest text-lg text-brand-red">
                    {offer.code}
                  </div>
                  <button 
                    onClick={() => !isExpired && handleCopy(offer.id, offer.code)}
                    disabled={isExpired}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:hover:bg-zinc-800 rounded-xl transition-colors text-white"
                  >
                    {copiedId === offer.id ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
                  </button>
                </div>
                
                <div className="mt-4 text-xs text-zinc-500 text-center">
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
