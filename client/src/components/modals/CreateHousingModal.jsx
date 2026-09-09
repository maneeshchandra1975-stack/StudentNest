import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, MapPin, IndianRupee } from 'lucide-react';
import Button from '../ui/Button';
import { createRoommatePost } from '../../redux/slices/roommateSlice';
import { toast } from 'sonner';

export default function CreateHousingModal({ onClose }) {
  const dispatch = useDispatch();
  const { isCreating } = useSelector((state) => state.roommate);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    rentShare: '',
    roomType: 'Shared Room',
    vacancy: '1',
    genderPreference: 'Any',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.rentShare || !formData.description || !formData.location) {
      return toast.error('Please fill all required fields');
    }
    const res = await dispatch(createRoommatePost({ 
      ...formData, 
      rentShare: Number(formData.rentShare),
      vacancy: Number(formData.vacancy)
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Housing post created successfully!');
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
              Post a <span className="text-gradient-primary">Vacancy</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
              Find verified VIT-AP flatmates to share your room or apartment.
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
          <form id="create-housing-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Listing Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Need 1 roommate for 2BHK flat near North Gate"
                className="sn-input w-full px-4 py-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Location / Apartment Name *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Capital Heights, Inavolu Road (1.5 km)"
                  className="sn-input w-full pl-10 pr-4 py-2.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                  Rent Share (₹ / mo) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="number"
                    name="rentShare"
                    value={formData.rentShare}
                    onChange={handleChange}
                    placeholder="5000"
                    className="sn-input w-full pl-10 pr-4 py-2.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                  Vacancies Count
                </label>
                <input
                  type="number"
                  name="vacancy"
                  value={formData.vacancy}
                  onChange={handleChange}
                  min="1"
                  className="sn-input w-full px-4 py-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="sn-input w-full px-4 py-2.5 text-xs cursor-pointer"
                >
                  <option value="Shared Room">Shared Room</option>
                  <option value="Private Room">Private Room</option>
                  <option value="2BHK Flat">2BHK Flatshare</option>
                  <option value="3BHK Flat">3BHK Flatshare</option>
                  <option value="Entire Flat">Entire Flat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                  Gender Preference
                </label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="sn-input w-full px-4 py-2.5 text-xs cursor-pointer"
                >
                  <option value="Any">Any Gender</option>
                  <option value="Male Only">Male Students Only</option>
                  <option value="Female Only">Female Students Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Description &amp; Amenities *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention Wi-Fi, AC, attached washroom, study routine, dietary preferences, and contact hours."
                rows={3}
                className="sn-input w-full px-4 py-2.5 text-xs resize-none"
              />
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
            form="create-housing-form" 
            type="submit" 
            disabled={isCreating}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-white font-black text-xs shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            {isCreating ? 'Posting Vacancy...' : 'Publish Vacancy Listing'}
          </button>
        </div>

      </div>
    </div>
  );
}
