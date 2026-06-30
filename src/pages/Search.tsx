import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, Star, X, ShoppingCart } from 'lucide-react';

export function Search() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
              whileHover={{ y: -5 }}
              onClick={() => setSelectedProduct(product)}
              className="glass-panel glass-panel-interactive rounded-[24px] overflow-hidden cursor-pointer group"
            >
              <div className="h-48 bg-white/[0.01] relative overflow-hidden border-b border-white/6">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-xs">No Image</div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-gradient-brand text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg">Out of Stock</span>
                  </div>
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

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="glass-panel bg-white/[0.03] backdrop-blur-3xl border border-white/12 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row shadow-[0_32px_64px_-15px_rgba(0,0,0,0.8)]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-gradient-brand rounded-full text-white transition-all z-20 hover:scale-110 cursor-pointer border border-white/10"
              >
                <X size={18} />
              </button>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-white/[0.01] relative overflow-hidden border-r border-white/6">
                {selectedProduct.imageUrl ? (
                   <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-xs">No Image</div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                <div className="text-xs text-brand-blue font-black uppercase tracking-widest mb-2">{selectedProduct.category}</div>
                <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-tight">{selectedProduct.name}</h2>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-3xl font-black text-white">₹{selectedProduct.price}</span>
                  <div className="flex items-center bg-white/5 border border-white/5 px-3 py-1 rounded-full text-yellow-500">
                    <Star size={15} className="fill-current mr-1.5" />
                    <span className="font-bold text-sm">{selectedProduct.rating}</span>
                  </div>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${selectedProduct.inStock ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex-1 border-t border-white/6 pt-6">
                  <h4 className="text-base font-extrabold text-white uppercase tracking-wider mb-2.5">Description</h4>
                  <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap">{selectedProduct.description}</p>
                </div>

                <button 
                  onClick={() => {
                    navigate(`/register-customer`, { state: { product: selectedProduct } });
                  }}
                  disabled={!selectedProduct.inStock}
                  className="w-full mt-8 flex items-center justify-center gap-2.5 bg-gradient-brand hover:scale-[1.02] active:scale-[0.98] disabled:bg-white/5 disabled:border-white/5 disabled:scale-100 disabled:text-zinc-500 disabled:shadow-none text-white py-4 rounded-2xl font-bold transition-all text-base shadow-lg shadow-brand-rose/25 cursor-pointer border border-white/10"
                >
                  <ShoppingCart size={20} />
                  {selectedProduct.inStock ? 'Order Now via WhatsApp' : 'Currently Unavailable'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
