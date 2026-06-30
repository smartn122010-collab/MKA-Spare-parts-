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
    
    // Generate dynamic Invoice ID and Date
    const invoiceNum = `MKA-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentDateTime = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    
    // Clean price string and calculate Tax
    const cleanPrice = parseFloat(product.price.toString().replace(/,/g, '')) || 0;
    const cgst = Math.round(cleanPrice * 0.09); // 9% Central GST
    const sgst = Math.round(cleanPrice * 0.09); // 9% State GST
    const grandTotal = cleanPrice + cgst + sgst;

    const text = `=========================================
       📄 OFFICIAL DIGITAL BILL RECEIPT
=========================================
🏢 *COMPANY:* MKA PREMIUM MOTORCYCLE SPARES
🌐 *WEBSITE:* www.mkamotors.com
📞 *SUPPORT:* +91 73050 68207
-----------------------------------------
🏷️ *INVOICE NO:* ${invoiceNum}
📅 *DATE & TIME:* ${currentDateTime} (IST)
🚦 *ORDER STATUS:* PENDING VERIFICATION
=========================================

👤 *CUSTOMER BILLING DETAILS:*
-----------------------------------------
• *Full Name:* ${formData.name}
• *Contact:* ${formData.contact} (Age: ${formData.age})
• *City / Region:* ${formData.location}
• *Shipping Address:* ${formData.address}

🏍️ *ORDERED PRODUCTS:*
-----------------------------------------
• *Item:* ${product.name}
• *Category:* ${product.category}
• *Quantity:* 1 Unit

💳 *FINANCIAL BREAKDOWN (INR):*
-----------------------------------------
• *Item Subtotal:* ₹${cleanPrice.toLocaleString('en-IN')}
• *CGST (@9.0%):* ₹${cgst.toLocaleString('en-IN')}
• *SGST (@9.0%):* ₹${sgst.toLocaleString('en-IN')}
• *Shipping Fee:* FREE (Complementary Promo)

📢 *NET PAYABLE TOTAL:* ₹${grandTotal.toLocaleString('en-IN')}
=========================================
Thank you for choosing MKA Mechanics!
Our engineering team will contact you shortly on WhatsApp
to verify bike compatibility and dispatch your shipment.
=========================================`;

    const url = `https://wa.me/7305068207?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    navigate('/products');
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto min-h-full flex flex-col relative">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 w-fit bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 hover:border-brand-rose/30 transition-all text-xs font-black uppercase tracking-wider cursor-pointer active:scale-95 shadow-md hover:shadow-brand-rose/10"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Decorative background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-rose/10 blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-blue/10 blur-[130px] pointer-events-none -z-10 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-prism rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-white/10"
      >
        <div className="p-8 bg-white/[0.01] border-b border-white/8 flex flex-col sm:flex-row items-center gap-6 relative">
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 shadow-lg relative group">
            <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-20 transition-opacity" />
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-[10px]">No Image</div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-brand-rose font-black uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-ping" />
              Secure Checkout Portal
            </div>
            <h2 className="text-2xl font-black mb-1.5 text-white tracking-tight">{product.name}</h2>
            <div className="text-xl font-black text-brand-blue flex items-center gap-2 justify-center sm:justify-start">
              <span>₹{product.price}</span>
              <span className="text-xs font-normal text-zinc-400 line-through">₹{(parseFloat(product.price.toString().replace(/,/g, '')) * 1.2).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Elegant handwritten script text */}
          <div className="sm:absolute sm:top-8 sm:right-8 flex flex-col items-center sm:items-end mt-2 sm:mt-0">
            <span className="font-script text-3xl text-brand-rose font-bold rotate-[-6deg] drop-shadow-md">
              Special Fitment
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">MKA Racing division</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6.5">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2.5 h-5 bg-gradient-brand rounded-full" />
              Billing Information
            </h3>
            <span className="text-xs font-mono text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 rounded-full">
              ⚡ GST Registered
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-brand-rose/50 focus:shadow-[0_0_15px_rgba(244,63,94,0.15)] rounded-2xl px-4 py-3.5 outline-none text-white transition-all text-sm font-medium" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Contact Number (WhatsApp)</label>
              <input required name="contact" value={formData.contact} onChange={handleChange} className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-brand-violet/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] rounded-2xl px-4 py-3.5 outline-none text-white transition-all text-sm font-medium" placeholder="+91 73050 68207" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Age</label>
              <input required name="age" type="number" value={formData.age} onChange={handleChange} className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-brand-rose/50 focus:shadow-[0_0_15px_rgba(244,63,94,0.15)] rounded-2xl px-4 py-3.5 outline-none text-white transition-all text-sm font-medium" placeholder="25" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">City / Location</label>
              <input required name="location" value={formData.location} onChange={handleChange} className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-brand-blue/50 focus:shadow-[0_0_15px_rgba(56,189,248,0.15)] rounded-2xl px-4 py-3.5 outline-none text-white transition-all text-sm font-medium" placeholder="Chennai" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black tracking-widest text-zinc-400 uppercase">Full Delivery Address</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-brand-violet/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] rounded-2xl px-4 py-3.5 outline-none text-white transition-all text-sm resize-none font-medium" placeholder="123 Racing Lane, High-Performance Sector, Apartment 10A..." />
          </div>

          <button type="submit" className="mt-4 group relative overflow-hidden py-4.5 rounded-2xl font-black uppercase tracking-widest text-sm text-white shadow-xl shadow-[#25D366]/10 border border-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            {/* Iridescent background flow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#25D366] bg-[size:200%_auto] hover:bg-[position:right_center] transition-all duration-700" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <span className="relative flex items-center justify-center gap-2.5">
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Generate Receipt & Order via WhatsApp
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
