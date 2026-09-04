import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Search,
  BookOpen,
  Laptop,
  Bike,
  Armchair,
  ShieldCheck,
  Plus,
  Flag,
  Inbox,
  X,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import CreateListingModal from '../components/modals/CreateListingModal';
import { fetchMarketplaceItems, toggleInterest, updateMarketplaceStatus } from '../redux/slices/marketplaceSlice';
import api from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'All Items', value: 'all', icon: ShoppingBag },
  { label: 'Books & Notes', value: 'Books', icon: BookOpen },
  { label: 'Electronics', value: 'Electronics', icon: Laptop },
  { label: 'Cycles', value: 'Cycles', icon: Bike },
  { label: 'Furniture', value: 'Furniture', icon: Armchair },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { items, isLoading } = useSelector((state) => state.marketplace);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [reportModalItem, setReportModalItem] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  // Fetch items on mount and when category/search changes
  useEffect(() => {
    dispatch(fetchMarketplaceItems({ 
      search: searchQuery, 
      category: activeCategory === 'all' ? '' : activeCategory 
    }));
  }, [dispatch, activeCategory, searchQuery]);

  const handleToggleInterest = async (itemId, recipientId) => {
    const res = await dispatch(toggleInterest({ itemId, recipientId }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Interest sent successfully');
      dispatch(fetchMarketplaceItems({ 
        search: searchQuery, 
        category: activeCategory === 'all' ? '' : activeCategory 
      }));
    } else {
      toast.error(res.payload || 'Failed to send request');
    }
  };

  const handleMarkSold = async (itemId) => {
    if (window.confirm("Are you sure you want to mark this item as Sold? This cannot be undone here.")) {
      const res = await dispatch(updateMarketplaceStatus({ id: itemId, status: 'Sold' }));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Item marked as Sold');
      } else {
        toast.error(res.payload || 'Failed to update status');
      }
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reports', {
        targetType: 'MarketplaceItem',
        targetId: reportModalItem._id,
        reason: reportReason,
        description: reportDescription
      });
      toast.success('Report submitted successfully');
      setReportModalItem(null);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] font-heading">Marketplace</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Buy and sell securely within the campus.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none"
            onClick={() => setIsRequestsModalOpen(true)}
          >
            <Inbox className="w-4 h-4 mr-2" />
            Requests
          </Button>
          <Button
            variant="primary"
            className="flex-1 sm:flex-none"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Sell an Item
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search for textbooks, cycles, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-body)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20' 
                    : 'bg-[var(--bg-body)] text-[var(--text-muted)] hover:bg-[var(--border-light)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20 text-[var(--text-muted)]">Loading items...</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No items found"
          description="We couldn't find any items matching your search or category."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setActiveCategory('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isOwner = user?._id === item.seller?._id;
            const hasInterested = item.interestedUsers?.includes(user?._id);

            return (
              <Card key={item._id} hover className="overflow-hidden flex flex-col group border-[var(--border-light)]">
                <div className="relative aspect-[4/3] bg-[var(--bg-body)] overflow-hidden">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={item.status === 'Available' ? 'success' : 'secondary'} className="shadow-sm">
                      {item.status}
                    </Badge>
                  </div>
                  {!isOwner && (
                    <button
                      onClick={() => setReportModalItem(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[var(--bg-card)]/90 text-slate-600 hover:text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                      title="Report this item"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-main)] font-heading leading-tight line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1">{item.category} • {item.condition}</p>
                    </div>
                    <div className="text-lg font-extrabold text-[#2563EB]">₹{item.price.toLocaleString()}</div>
                  </div>
                  
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 mt-2 mb-4 flex-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[var(--border-light)]">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[var(--text-main)] truncate">
                        {item.seller?.name || 'Student'}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Verified Student
                      </div>
                    </div>
                    
                    {item.status === 'Available' ? (
                      <>
                        {!isOwner && (
                          <Button
                            variant={hasInterested ? "secondary" : "primary"}
                            size="sm"
                            onClick={() => handleToggleInterest(item._id, item.seller._id)}
                          >
                            {hasInterested ? 'Interest Sent' : 'Show Interest'}
                          </Button>
                        )}

                        {isOwner && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="!text-emerald-700 !bg-emerald-50 hover:!bg-emerald-100 border-emerald-200"
                            onClick={() => handleMarkSold(item._id)}
                          >
                            Mark Sold
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        {item.status}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateListingModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      <InterestRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
      />

      {/* Report Modal */}
      {reportModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-md shadow-xl border border-[var(--border-light)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold">Report Listing</h3>
              </div>
              <button onClick={() => setReportModalItem(null)} className="text-[var(--text-muted)] hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReportSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Reason for reporting</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-[var(--text-main)] outline-none"
                >
                  <option value="">Select a reason...</option>
                  <option value="SCAM">Suspicious or Scam</option>
                  <option value="INAPPROPRIATE">Inappropriate Content</option>
                  <option value="SPAM">Spam</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Additional Details</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-[var(--text-main)] outline-none resize-none"
                  placeholder="Please provide more details..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setReportModalItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1 !bg-rose-600 hover:!bg-rose-700 !text-white !border-rose-600">
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
