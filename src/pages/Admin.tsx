import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Offer, AdminStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Tag, LayoutDashboard, Edit2, Trash2, Plus, X, Lock, Unlock, Save } from 'lucide-react';
import { useAuth } from '../AuthContext';

export function Admin() {
  const { user, signInWithGoogle, logout, loading } = useAuth();
  const isAdmin = user?.email === 'smartnp09812@gmail.com' || 
                  user?.email === 'ka8255633@gmail.com' ||
                  user?.uid === 'NmCEpOC9DcaEwfc22bmxF79moJG3' || 
                  user?.displayName?.toUpperCase().includes('ASRAFALI') || 
                  user?.email?.toUpperCase().includes('ASRAFALI');

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
    if (pinInput.toUpperCase() === 'ASRAFALI') {
      setPinAuthenticated(true);
      setPinError('');
      return;
    }
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

  if (loading) {
    return <div className="flex h-full items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-6 relative">
        <motion.div 
          initial={{ scale: 0.94, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="glass-panel border-white/10 p-10 rounded-[32px] w-full max-w-md shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/5 rounded-full blur-2xl" />
          <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-brand-rose/25">
            <Lock size={26} />
          </div>
          <h2 className="text-2xl font-black mb-2 text-white uppercase tracking-wider">Admin Access</h2>
          <p className="text-zinc-400 text-sm mb-8">Sign in with an authenticated administrator account to manage products and offers.</p>
          <button 
            onClick={signInWithGoogle} 
            className="w-full bg-gradient-brand hover:scale-[1.02] active:scale-[0.98] text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs border border-white/10 shadow-lg shadow-brand-rose/20 cursor-pointer transition-all"
          >
            Sign In with Google
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center p-6 relative">
        <motion.div 
          initial={{ scale: 0.94, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="glass-panel border-white/10 p-10 rounded-[32px] w-full max-w-md shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/5 rounded-full blur-2xl" />
          <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-brand-rose/25">
            <Lock size={26} />
          </div>
          <h2 className="text-2xl font-black mb-2 text-white uppercase tracking-wider">Access Denied</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Signed in as <span className="text-brand-rose font-bold">{user.email || user.uid}</span>. Your credentials lack administrative privileges.</p>
          <button 
            onClick={logout} 
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  if (!pinAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center p-6 relative">
        <motion.div 
          initial={{ scale: 0.94, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="glass-panel border-white/10 p-10 rounded-[32px] w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-2xl" />
          <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-brand-rose/25">
            {savedPin ? <Lock size={26} /> : <Save size={26} />}
          </div>
          <h2 className="text-2xl font-black text-center text-white uppercase tracking-wider mb-8">{savedPin ? 'Enter Admin PIN' : 'Set Admin PIN'}</h2>
          
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-5">
            <input 
              type="password" 
              placeholder="Enter PIN" 
              value={pinInput} 
              onChange={e => setPinInput(e.target.value)} 
              className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-4 text-center tracking-widest text-2xl font-black text-white focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] outline-none transition-all" 
              required 
            />
            {!savedPin && (
              <input 
                type="password" 
                placeholder="Confirm PIN" 
                value={confirmPinInput} 
                onChange={e => setConfirmPinInput(e.target.value)} 
                className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-4 text-center tracking-widest text-2xl font-black text-white focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] outline-none transition-all" 
                required 
              />
            )}
            {pinError && <p className="text-brand-rose text-xs font-bold text-center animate-shake">{pinError}</p>}
            <button 
              type="submit" 
              className="bg-gradient-brand hover:scale-[1.02] active:scale-[0.98] text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs border border-white/10 shadow-lg shadow-brand-rose/20 cursor-pointer transition-all mt-2"
            >
              {savedPin ? 'Unlock Admin Panel' : 'Save PIN & Enter'}
            </button>
            {savedPin && (
              <button 
                type="button" 
                onClick={resetPin} 
                className="text-zinc-500 hover:text-brand-rose text-xs font-bold uppercase tracking-wider mt-2 transition-colors cursor-pointer"
              >
                Reset PIN (Clears current PIN)
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto pb-32 relative">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <span className="w-2.5 h-8 bg-gradient-brand rounded-full" /> Admin Panel
        </h2>
        <button 
          onClick={() => setPinAuthenticated(false)} 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 border border-white/5 hover:border-white/10 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
        >
          <Unlock size={14} /> Lock
        </button>
      </div>

      <div className="flex gap-1.5 mb-10 bg-white/[0.02] border border-white/6 p-1.5 rounded-2xl w-fit backdrop-blur-md">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-gradient-brand text-white shadow-md shadow-brand-rose/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <LayoutDashboard size={14} /> Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('products')} 
          className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'products' ? 'bg-gradient-brand text-white shadow-md shadow-brand-rose/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <Package size={14} /> Products
        </button>
        <button 
          onClick={() => setActiveTab('offers')} 
          className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'offers' ? 'bg-gradient-brand text-white shadow-md shadow-brand-rose/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <Tag size={14} /> Offers
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { key: 'totalStock', label: 'Total Stock', styleClass: 'glass-card-rose' },
            { key: 'totalServices', label: 'Total Services', styleClass: 'glass-card-violet' },
            { key: 'todaySales', label: 'Today\'s Sales', styleClass: 'glass-card-blue', prefix: '₹' },
            { key: 'monthSales', label: 'Month Sales', styleClass: 'glass-card-rose', prefix: '₹' },
            { key: 'yearSales', label: 'Year Sales', styleClass: 'glass-card-violet', prefix: '₹' },
          ].map((stat, sIdx) => (
            <div 
              key={stat.key} 
              className={`rounded-[28px] p-6.5 relative group overflow-hidden border transition-all duration-300 hover:scale-[1.02] shadow-lg ${stat.styleClass}`}
            >
              <button 
                onClick={() => { setEditingStat(stat.key as keyof AdminStats); setStatEditValue(stats[stat.key as keyof AdminStats].toString()); }} 
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-gradient-brand rounded-full text-white border border-white/5 transition-all z-10 cursor-pointer active:scale-90"
                title="Edit stat value"
              >
                <Edit2 size={14} />
              </button>
              <h4 className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-3">{stat.label}</h4>
              <div className="text-4xl font-black text-white tracking-tight">
                {stat.prefix || ''}{stats[stat.key as keyof AdminStats]}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'products' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button 
            onClick={() => { setEditingProduct(null); setProductForm({ name: '', category: '', price: 0, rating: 5, description: '', inStock: true, imageUrl: '' }); setIsProductModalOpen(true); }} 
            className="mb-8 flex items-center gap-2 bg-gradient-brand hover:scale-[1.02] text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-wider border border-white/10 shadow-lg shadow-brand-rose/15 cursor-pointer transition-all"
          >
            <Plus size={16} /> Add New Product
          </button>
          
          <div className="glass-panel border-white/8 rounded-[28px] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/8">
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest">Product</th>
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest">Category</th>
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest">Price</th>
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest">Stock</th>
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-white/4 hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 md:p-5 font-extrabold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                          {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <span className="truncate max-w-[150px] md:max-w-[240px]">{p.name}</span>
                      </td>
                      <td className="p-4 md:p-5 text-sm text-zinc-300 font-medium">{p.category}</td>
                      <td className="p-4 md:p-5 text-sm text-white font-extrabold">₹{p.price}</td>
                      <td className="p-4 md:p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.inStock ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {p.inStock ? 'In Stock' : 'Out'}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <button onClick={() => { setEditingProduct(p); setProductForm(p); setIsProductModalOpen(true); }} className="p-2 text-zinc-400 hover:text-brand-blue transition-colors cursor-pointer" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-zinc-400 hover:text-brand-rose transition-colors cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'offers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button 
            onClick={() => { setEditingOffer(null); setOfferForm({ code: '', description: '', discount: '', expiryDate: '' }); setIsOfferModalOpen(true); }} 
            className="mb-8 flex items-center gap-2 bg-gradient-brand hover:scale-[1.02] text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-wider border border-white/10 shadow-lg shadow-brand-rose/15 cursor-pointer transition-all"
          >
            <Plus size={16} /> Add New Offer
          </button>
          
          <div className="glass-panel border-white/8 rounded-[28px] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/8">
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest">Code</th>
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest">Discount</th>
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest">Expiry</th>
                    <th className="p-4 md:p-5 text-[10px] font-black text-brand-blue uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(o => (
                    <tr key={o.id} className="border-b border-white/4 hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 md:p-5 font-black text-brand-rose tracking-wider font-mono text-base">{o.code}</td>
                      <td className="p-4 md:p-5 text-sm font-extrabold text-white">{o.discount}</td>
                      <td className="p-4 md:p-5 text-sm text-zinc-300 font-medium">{new Date(o.expiryDate).toLocaleDateString()}</td>
                      <td className="p-4 md:p-5 text-right">
                        <button onClick={() => { setEditingOffer(o); setOfferForm(o); setIsOfferModalOpen(true); }} className="p-2 text-zinc-400 hover:text-brand-blue transition-colors cursor-pointer" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => deleteOffer(o.id)} className="p-2 text-zinc-400 hover:text-brand-rose transition-colors cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat Edit Modal */}
      <AnimatePresence>
        {editingStat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setEditingStat(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.94, opacity: 0 }} 
              className="glass-panel bg-white/[0.03] backdrop-blur-3xl border border-white/12 rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">Edit {editingStat}</h3>
              <input 
                type="number" 
                value={statEditValue} 
                onChange={e => setStatEditValue(e.target.value)} 
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-4 mb-8 outline-none text-white text-lg font-black text-center focus:border-brand-violet/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" 
              />
              <div className="flex gap-3.5">
                <button 
                  onClick={() => setEditingStat(null)} 
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveStat} 
                  className="flex-1 py-4 rounded-2xl bg-gradient-brand text-white font-bold text-xs uppercase tracking-widest border border-white/10 shadow-lg shadow-brand-rose/25 transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsProductModalOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.94, opacity: 0 }} 
              className="glass-panel bg-white/[0.03] backdrop-blur-3xl border border-white/12 rounded-[32px] p-8 md:p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsProductModalOpen(false)} 
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-full transition-all cursor-pointer active:scale-90"
              >
                <X size={18} />
              </button>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-8">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Name</label>
                  <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Category</label>
                  <input value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Price (₹)</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Rating (0-5)</label>
                  <input type="number" step="0.1" value={productForm.rating} onChange={e => setProductForm({...productForm, rating: Number(e.target.value)})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Image URL</label>
                  <input value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Description</label>
                  <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows={3} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] resize-none transition-all" />
                </div>
                <div className="flex items-center gap-3 mt-2 md:col-span-2">
                  <input type="checkbox" checked={productForm.inStock} onChange={e => setProductForm({...productForm, inStock: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-white/5 accent-brand-rose" id="stock" />
                  <label htmlFor="stock" className="text-xs font-black uppercase tracking-wider text-zinc-300">In Stock</label>
                </div>
              </div>
              <button 
                onClick={saveProduct} 
                className="w-full mt-8 bg-gradient-brand hover:scale-[1.02] text-white py-4 rounded-2xl font-black uppercase tracking-wider text-sm border border-white/10 shadow-lg shadow-brand-rose/25 transition-all cursor-pointer"
              >
                Save Product
              </button>
            </motion.div>
          </div>
        )}

        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsOfferModalOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.94, opacity: 0 }} 
              className="glass-panel bg-white/[0.03] backdrop-blur-3xl border border-white/12 rounded-[32px] p-8 w-full max-w-md relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsOfferModalOpen(false)} 
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-full transition-all cursor-pointer active:scale-90"
              >
                <X size={18} />
              </button>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-8">{editingOffer ? 'Edit Offer' : 'Add Offer'}</h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Offer Code</label>
                  <input value={offerForm.code} onChange={e => setOfferForm({...offerForm, code: e.target.value})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] uppercase transition-all" placeholder="MKA50" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Discount Text</label>
                  <input value={offerForm.discount} onChange={e => setOfferForm({...offerForm, discount: e.target.value})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" placeholder="50%" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Expiry Date</label>
                  <input type="date" value={offerForm.expiryDate} onChange={e => setOfferForm({...offerForm, expiryDate: e.target.value})} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Description</label>
                  <textarea value={offerForm.description} onChange={e => setOfferForm({...offerForm, description: e.target.value})} rows={2} className="bg-white/[0.02] border border-white/10 focus:border-brand-violet/50 rounded-2xl px-4 py-3.5 outline-none text-white text-sm focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] resize-none transition-all" />
                </div>
              </div>
              <button 
                onClick={saveOffer} 
                className="w-full mt-8 bg-gradient-brand hover:scale-[1.02] text-white py-4 rounded-2xl font-black uppercase tracking-wider text-sm border border-white/10 shadow-lg shadow-brand-rose/25 transition-all cursor-pointer"
              >
                Save Offer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
