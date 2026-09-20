import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Upload, IndianRupee } from 'lucide-react';
import Button from '../ui/Button';
import { createMarketplaceItem } from '../../redux/slices/marketplaceSlice';
import { toast } from 'sonner';

export default function CreateListingModal({ onClose }) {
  const dispatch = useDispatch();
  const { isCreating } = useSelector((state) => state.marketplace);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'Good',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'], // default mockup image
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      return toast.error('Please fill all required fields');
    }
    const res = await dispatch(createMarketplaceItem({ ...formData, price: Number(formData.price) }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Listing created successfully!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)]/95 border border-[var(--border-light)] w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] backdrop-blur-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
          <div>
            <h2 className="text-xl font-black text-[var(--text-main)] font-heading">
              Sell an <span className="text-gradient-primary">Item</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
              List student equipment, books, tech, or cycles for campus peer exchange.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <form id="create-listing-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Scientific Calculator Casio fx-991EX"
                className="sn-input w-full px-4 py-2.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                  Price (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    className="sn-input w-full pl-10 pr-4 py-2.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="sn-input w-full px-4 py-2.5 text-xs cursor-pointer"
                >
                  <option value="Books">Books &amp; Notes</option>
                  <option value="Electronics">Electronics &amp; Tech</option>
                  <option value="Cycles">Cycles &amp; Mobility</option>
                  <option value="Furniture">Furniture &amp; Room</option>
                  <option value="Other">Other Necessities</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="sn-input w-full px-4 py-2.5 text-xs cursor-pointer"
              >
                <option value="Like New">Like New (Mint)</option>
                <option value="Good">Good (Lightly Used)</option>
                <option value="Fair">Fair (Noticeable Wear)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail the condition, age, reasons for selling, and pickup point inside VIT-AP."
                rows={3}
                className="sn-input w-full px-4 py-2.5 text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Product Image URL
              </label>
              <input
                type="text"
                value={formData.images[0]}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                placeholder="https://..."
                className="sn-input w-full px-4 py-2.5 text-xs font-mono"
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                Paste a direct photo URL of the item or leave default mockup photo.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-light)] flex justify-end gap-3 bg-[var(--bg-card-subtle)]/50">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isCreating}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            form="create-listing-form" 
            type="submit" 
            disabled={isCreating}
            className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            {isCreating ? 'Publishing...' : 'Publish Market Listing'}
          </button>
        </div>

      </div>
    </div>
  );
}
