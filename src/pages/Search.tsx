import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Search as SearchIcon, Star } from 'lucide-react';

export function Search() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsList);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <span className="w-2.5 h-8 bg-gradient-brand rounded-full" />
          Search
        </h2>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Type to search products..."
            className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 focus:border-brand-violet/50 rounded-full px-6 py-3.5 pl-12 outline-none transition-all text-white font-medium text-sm shadow-lg focus:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              navigate(`/search?q=${encodeURIComponent(e.target.value)}`, { replace: true });
            }}
          />
          <SearchIcon size={18} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-rose">
          <div className="w-12 h-12 rounded-full border-4 border-brand-violet/20 border-t-brand-rose animate-spin mb-4" />
          <p className="font-bold animate-pulse text-sm tracking-wider uppercase">Searching catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <SearchIcon size={64} className="mb-4 opacity-40 text-brand-violet" />
          <p className="text-xl font-bold">No products match your search "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel glass-panel-interactive rounded-[24px] overflow-hidden group"
            >
              <div className="h-48 bg-white/[0.01] relative overflow-hidden border-b border-white/6">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-xs">No Image</div>
                )}
              </div>
              <div className="p-5.5">
                <div className="text-[10px] text-brand-blue font-black mb-1 uppercase tracking-widest">{product.category}</div>
                <h3 className="font-extrabold text-white text-base mb-2.5 truncate group-hover:text-brand-rose transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-black text-white">₹{product.price}</div>
                  <div className="flex items-center text-yellow-500 text-sm bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    <Star size={13} className="fill-current mr-1" />
                    <span className="font-bold text-xs">{product.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
