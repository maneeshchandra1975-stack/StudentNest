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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-light)] w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)]">
          <h2 className="text-lg font-bold text-[var(--text-main)]">Post a Vacancy / Find Roommate</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-body)] text-[var(--text-muted)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <form id="create-housing-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Need 1 roommate for 2BHK near gate 2"
                className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] placeholder-[var(--input-placeholder)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Happy Homes PG, Amaravati"
                  className="w-full pl-9 pr-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Rent Share (??? / mo)*</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="number"
                    name="rentShare"
                    value={formData.rentShare}
                    onChange={handleChange}
                    placeholder="5000"
                    className="w-full pl-9 pr-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Vacancies</label>
                <input
                  type="number"
                  name="vacancy"
                  value={formData.vacancy}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Room Type</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                >
                  <option value="Shared Room">Shared Room</option>
                  <option value="Private Room">Private Room</option>
                  <option value="Entire Flat">Entire Flat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Gender Pref.</label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none"
                >
                  <option value="Any">Any</option>
                  <option value="Male Only">Male Only</option>
                  <option value="Female Only">Female Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Amenities, food availability, strict rules, etc."
                rows={4}
                className="w-full px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] placeholder-[var(--input-placeholder)] outline-none resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border-light)] flex justify-end gap-3 bg-[var(--bg-body)] rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} disabled={isCreating}>Cancel</Button>
          <Button variant="primary" form="create-housing-form" type="submit" disabled={isCreating}>
            {isCreating ? 'Posting...' : 'Post Vacancy'}
          </Button>
        </div>

      </div>
    </div>
  );
}
