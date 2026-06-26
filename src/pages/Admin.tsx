import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Offer, AdminStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Tag, LayoutDashboard, Edit2, Trash2, Plus, X, Lock, Unlock, Save } from 'lucide-react';
import { useAuth } from '../AuthContext';

export function Admin() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'smartnp09812@gmail.com' || user?.uid === 'NmCEpOC9DcaEwfc22bmxF79moJG3';

  const [pinAuthenticated, setPinAuthenticated] = useState(false);
  const [savedPin, setSavedPin] = useState<string | null>(localStorage.getItem('adminPin'));
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'offers'>('dashboard');
  
  // Dashboard Stats
  const [stats, setStats] = useState<AdminStats>({
    totalStock: Number(localStorage.getItem('admin_totalStock')) || 0,
    totalServices: Number(localStorage.getItem('admin_totalServices')) || 0,
    todaySales: Number(localStorage.getItem('admin_todaySales')) || 0,
    monthSales: Number(localStorage.getItem('admin_monthSales')) || 0,
    yearSales: Number(localStorage.getItem('admin_yearSales')) || 0,
  });
  const [editingStat, setEditingStat] = useState<keyof AdminStats | null>(null);
  const [statEditValue, setStatEditValue] = useState('');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ name: '', category: '', price: 0, rating: 5, description: '', inStock: true, imageUrl: '' });

  // Offers
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({ code: '', description: '', discount: '', expiryDate: '' });

  useEffect(() => {
    if (pinAuthenticated) {
      fetchProducts();
      fetchOffers();
    }
  }, [pinAuthenticated]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'products');
    }
  };

  const fetchOffers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'offers'));
      setOffers(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Offer)));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'offers');
    }
  };

  const saveStat = () => {
    if (editingStat) {
      const val = Number(statEditValue);
      setStats(prev => ({ ...prev, [editingStat]: val }));
      localStorage.setItem(`admin_${editingStat}`, val.toString());
      setEditingStat(null);
    }
  };

  const saveProduct = async () => {
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productForm);
      } else {
        await addDoc(collection(db, 'products'), productForm);
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (e) {
      handleFirestoreError(e, editingProduct ? OperationType.UPDATE : OperationType.CREATE, 'products');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
    }
  };

  const saveOffer = async () => {
    try {
      if (editingOffer) {
        await updateDoc(doc(db, 'offers', editingOffer.id), offerForm);
      } else {
        await addDoc(collection(db, 'offers'), offerForm);
      }
      setIsOfferModalOpen(false);
      fetchOffers();
    } catch (e) {
      handleFirestoreError(e, editingOffer ? OperationType.UPDATE : OperationType.CREATE, 'offers');
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'offers', id));
      fetchOffers();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `offers/${id}`);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (savedPin) {
      if (pinInput === savedPin) setPinAuthenticated(true);
      else setPinError('Incorrect PIN');
    } else {
      if (pinInput === confirmPinInput && pinInput.length >= 4) {
        localStorage.setItem('adminPin', pinInput);
        setSavedPin(pinInput);
        setPinAuthenticated(true);
      } else {
        setPinError('PINs must match and be at least 4 digits');
      }
    }
  };

  const resetPin = () => {
    localStorage.removeItem('adminPin');
    setSavedPin(null);
    setPinAuthenticated(false);
    setPinInput('');
    setConfirmPinInput('');
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-bg-panel border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl text-center">
          <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-red">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-zinc-400">You do not have permission to view this page.</p>
        </motion.div>
      </div>
    );
  }

  if (!pinAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-bg-panel border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-red">
            {savedPin ? <Lock size={32} /> : <Save size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">{savedPin ? 'Enter Admin PIN' : 'Set Admin PIN'}</h2>
          
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
            <input type="password" placeholder="Enter PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center tracking-widest text-xl focus:border-brand-red outline-none" required />
            {!savedPin && (
              <input type="password" placeholder="Confirm PIN" value={confirmPinInput} onChange={e => setConfirmPinInput(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center tracking-widest text-xl focus:border-brand-red outline-none" required />
            )}
            {pinError && <p className="text-brand-red text-sm text-center">{pinError}</p>}
            <button type="submit" className="bg-brand-red hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors mt-2">
              {savedPin ? 'Unlock Admin Panel' : 'Save PIN & Enter'}
            </button>
            {savedPin && (
              <button type="button" onClick={resetPin} className="text-zinc-500 hover:text-white text-sm mt-2 transition-colors">Reset PIN (Warning: Clears current PIN)</button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-red rounded-full" /> Admin Panel
        </h2>
        <button onClick={() => setPinAuthenticated(false)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <Unlock size={20} /> Lock
        </button>
      </div>

      <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-brand-red text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}><LayoutDashboard size={18} /> Dashboard</button>
        <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors ${activeTab === 'products' ? 'bg-brand-red text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}><Package size={18} /> Products</button>
        <button onClick={() => setActiveTab('offers')} className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors ${activeTab === 'offers' ? 'bg-brand-red text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}><Tag size={18} /> Offers</button>
      </div>

      {activeTab === 'dashboard' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { key: 'totalStock', label: 'Total Stock', color: 'from-red-500/20 to-brand-red/5', border: 'border-red-500/30' },
            { key: 'totalServices', label: 'Total Services', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30' },
            { key: 'todaySales', label: 'Today\'s Sales (₹)', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30' },
            { key: 'monthSales', label: 'Month Sales (₹)', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30' },
            { key: 'yearSales', label: 'Year Sales (₹)', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30' },
          ].map(stat => (
            <div key={stat.key} className={`bg-gradient-to-br ${stat.color} border ${stat.border} p-6 rounded-3xl relative group overflow-hidden`}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button onClick={() => { setEditingStat(stat.key as keyof AdminStats); setStatEditValue(stats[stat.key as keyof AdminStats].toString()); }} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black rounded-full transition-colors z-10">
                <Edit2 size={16} />
              </button>
              <h4 className="text-zinc-300 font-medium mb-2">{stat.label}</h4>
              <div className="text-4xl font-bold">{stats[stat.key as keyof AdminStats]}</div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'products' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', category: '', price: 0, rating: 5, description: '', inStock: true, imageUrl: '' }); setIsProductModalOpen(true); }} className="mb-6 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl transition-colors">
            <Plus size={20} /> Add New Product
          </button>
          <div className="bg-bg-panel border border-zinc-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-medium text-zinc-400">Product</th>
                  <th className="p-4 font-medium text-zinc-400">Category</th>
                  <th className="p-4 font-medium text-zinc-400">Price</th>
                  <th className="p-4 font-medium text-zinc-400">Stock</th>
                  <th className="p-4 font-medium text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                    <td className="p-4 font-medium flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      {p.name}
                    </td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">₹{p.price}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${p.inStock ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{p.inStock ? 'Yes' : 'No'}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingProduct(p); setProductForm(p); setIsProductModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-zinc-400 hover:text-brand-red"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'offers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button onClick={() => { setEditingOffer(null); setOfferForm({ code: '', description: '', discount: '', expiryDate: '' }); setIsOfferModalOpen(true); }} className="mb-6 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl transition-colors">
            <Plus size={20} /> Add New Offer
          </button>
          <div className="bg-bg-panel border border-zinc-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="p-4 font-medium text-zinc-400">Code</th>
                  <th className="p-4 font-medium text-zinc-400">Discount</th>
                  <th className="p-4 font-medium text-zinc-400">Expiry</th>
                  <th className="p-4 font-medium text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map(o => (
                  <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                    <td className="p-4 font-bold text-brand-red">{o.code}</td>
                    <td className="p-4">{o.discount}</td>
                    <td className="p-4">{new Date(o.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingOffer(o); setOfferForm(o); setIsOfferModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={() => deleteOffer(o.id)} className="p-2 text-zinc-400 hover:text-brand-red"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Stat Edit Modal */}
      <AnimatePresence>
        {editingStat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-bg-dark border border-zinc-800 rounded-3xl p-8 w-full max-w-sm relative">
              <h3 className="text-xl font-bold mb-4">Edit {editingStat}</h3>
              <input type="number" value={statEditValue} onChange={e => setStatEditValue(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mb-6 outline-none focus:border-brand-red" />
              <div className="flex gap-3">
                <button onClick={() => setEditingStat(null)} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
                <button onClick={saveStat} className="flex-1 py-3 rounded-xl bg-brand-red hover:bg-red-600 transition-colors">Save</button>
              </div>
            </motion.div>
          </div>
        )}

        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-bg-dark border border-zinc-800 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Name</label>
                  <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Category</label>
                  <input value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Price (₹)</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Rating (0-5)</label>
                  <input type="number" step="0.1" value={productForm.rating} onChange={e => setProductForm({...productForm, rating: Number(e.target.value)})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red" />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-sm text-zinc-400">Image URL</label>
                  <input value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red" placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-sm text-zinc-400">Description</label>
                  <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows={3} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red resize-none" />
                </div>
                <div className="flex items-center gap-3 mt-2 md:col-span-2">
                  <input type="checkbox" checked={productForm.inStock} onChange={e => setProductForm({...productForm, inStock: e.target.checked})} className="w-5 h-5 accent-brand-red" id="stock" />
                  <label htmlFor="stock" className="font-medium">In Stock</label>
                </div>
              </div>
              <button onClick={saveProduct} className="w-full mt-8 bg-brand-red hover:bg-red-600 text-white py-4 rounded-xl font-bold transition-colors">Save Product</button>
            </motion.div>
          </div>
        )}

        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-bg-dark border border-zinc-800 rounded-3xl p-8 w-full max-w-md relative">
              <button onClick={() => setIsOfferModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-bold mb-6">{editingOffer ? 'Edit Offer' : 'Add Offer'}</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Offer Code</label>
                  <input value={offerForm.code} onChange={e => setOfferForm({...offerForm, code: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red uppercase" placeholder="MKA50" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Discount Text</label>
                  <input value={offerForm.discount} onChange={e => setOfferForm({...offerForm, discount: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red" placeholder="50%" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Expiry Date</label>
                  <input type="date" value={offerForm.expiryDate} onChange={e => setOfferForm({...offerForm, expiryDate: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Description</label>
                  <textarea value={offerForm.description} onChange={e => setOfferForm({...offerForm, description: e.target.value})} rows={2} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red resize-none" />
                </div>
              </div>
              <button onClick={saveOffer} className="w-full mt-8 bg-brand-red hover:bg-red-600 text-white py-4 rounded-xl font-bold transition-colors">Save Offer</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
