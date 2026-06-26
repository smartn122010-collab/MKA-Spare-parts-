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
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-red rounded-full" />
          Search
        </h2>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Type to search products..."
            className="w-full bg-bg-panel border border-brand-red/50 rounded-full px-6 py-3 pl-12 outline-none focus:border-brand-red transition-colors text-white"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              navigate(`/search?q=${encodeURIComponent(e.target.value)}`, { replace: true });
            }}
          />
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-brand-red animate-pulse">Searching catalog...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <SearchIcon size={64} className="mb-4 opacity-50" />
          <p className="text-xl">No products match your search "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-panel border border-zinc-800 rounded-2xl overflow-hidden group"
            >
              <div className="h-48 bg-zinc-900 relative overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                )}
              </div>
              <div className="p-5">
                <div className="text-xs text-brand-red font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold">₹{product.price}</div>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <Star size={16} className="fill-current mr-1" />
                    {product.rating}
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
