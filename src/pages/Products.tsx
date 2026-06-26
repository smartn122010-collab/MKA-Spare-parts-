import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Package, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
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

  const handleOrder = (product: Product) => {
    navigate(`/register-customer`, { state: { product } });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="w-2 h-8 bg-brand-red rounded-full" />
        Product Catalog
      </h2>

      {loading ? (
        <div className="flex justify-center py-20 text-brand-red animate-pulse">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <Package size={64} className="mb-4 opacity-50" />
          <p className="text-xl">No products currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedProduct(product)}
              className="bg-bg-panel border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-red/50 transition-colors group"
            >
              <div className="h-48 bg-zinc-900 relative overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm">Out of Stock</span>
                  </div>
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

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-bg-dark border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-brand-red rounded-full text-white transition-colors z-20"
              >
                <X size={20} />
              </button>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-zinc-900 relative">
                {selectedProduct.imageUrl ? (
                   <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                <div className="text-sm text-brand-red font-bold uppercase tracking-wider mb-2">{selectedProduct.category}</div>
                <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-white">₹{selectedProduct.price}</span>
                  <div className="flex items-center bg-zinc-900 px-3 py-1 rounded-full text-yellow-500">
                    <Star size={16} className="fill-current mr-1" />
                    <span className="font-bold">{selectedProduct.rating}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedProduct.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-bold mb-2">Description</h4>
                  <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{selectedProduct.description}</p>
                </div>

                <button 
                  onClick={() => handleOrder(selectedProduct)}
                  disabled={!selectedProduct.inStock}
                  className="w-full mt-8 flex items-center justify-center gap-2 bg-brand-red hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white py-4 rounded-xl font-bold transition-colors text-lg"
                >
                  <ShoppingCart size={24} />
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
