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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-light)] w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)]">
          <h2 className="text-lg font-bold text-[var(--text-main)]">Sell an Item</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-body)] text-[var(--text-muted)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <form id="create-listing-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Item Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Scientific Calculator Casio"
                className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] placeholder-[var(--input-placeholder)] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Price (???)*</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    className="w-full pl-9 pr-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                >
                  <option value="Books">Books & Notes</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Cycles">Cycles</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item, how old it is, defects, etc."
                rows={4}
                className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] placeholder-[var(--input-placeholder)] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.images[0]}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">For this demo, just paste an image URL (e.g., from Unsplash).</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border-light)] flex justify-end gap-3 bg-[var(--bg-body)] rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} disabled={isCreating}>Cancel</Button>
          <Button variant="primary" form="create-listing-form" type="submit" disabled={isCreating}>
            {isCreating ? 'Posting...' : 'Post Item'}
          </Button>
        </div>

      </div>
    </div>
  );
}
