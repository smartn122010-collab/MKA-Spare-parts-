import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Send } from 'lucide-react';

export function RegisterCustomer() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product as Product | undefined;

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    location: '',
    age: '',
  });

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl mb-4">No product selected.</p>
        <button onClick={() => navigate('/products')} className="text-brand-red hover:underline">Go back to Products</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*New Order: ${product.name}*\n\n*Customer Details:*\nName: ${formData.name}\nContact: ${formData.contact}\nAge: ${formData.age}\nAddress: ${formData.address}\nLocation: ${formData.location}\n\n*Product Details:*\nPrice: ₹${product.price}\nCategory: ${product.category}`;
    const url = `https://wa.me/7305068207?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    navigate('/products');
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto min-h-full flex flex-col">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 w-fit">
        <ArrowLeft size={20} /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-panel border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-8 bg-zinc-900 border-b border-zinc-800 flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Image</div>
            )}
          </div>
          <div>
            <div className="text-sm text-brand-red font-bold uppercase tracking-wider mb-1">Selected Product</div>
            <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
            <div className="text-xl text-zinc-300">₹{product.price}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold mb-2">Customer Registration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Contact Number</label>
              <input required name="contact" value={formData.contact} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors" placeholder="+91 0000000000" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Age</label>
              <input required name="age" type="number" value={formData.age} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors" placeholder="25" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">City / Location</label>
              <input required name="location" value={formData.location} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors" placeholder="Chennai" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Full Delivery Address</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors resize-none" placeholder="123 Main St, Apartment 4B..." />
          </div>

          <button type="submit" className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold transition-colors text-lg shadow-lg">
            <Send size={20} />
            Confirm & Send Order via WhatsApp
          </button>
        </form>
      </motion.div>
    </div>
  );
}
