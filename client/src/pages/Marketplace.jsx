import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  BookOpen,
  Laptop,
  Bike,
  Armchair,
  CheckCircle2,
  Heart,
  MessageSquare,
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
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'All Items', value: 'all', icon: ShoppingBag },
  { label: 'Books & Notes', value: 'Books', icon: BookOpen },
  { label: 'Electronics', value: 'Electronics', icon: Laptop },
  { label: 'Cycles', value: 'Cycles', icon: Bike },
  { label: 'Furniture', value: 'Furniture', icon: Armchair },
];

const mockItems = [
  {
    id: 1,
    title: 'CLRS Introduction to Algorithms (3rd Ed.)',
    category: 'Books',
    price: 650,
    condition: 'Like New',
    seller: 'Rahul S. (CSE 3rd Year)',
    sellerId: 'user_123',
    status: 'Available', // 'Available' | 'Reserved' | 'Sold'
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 2,
    title: 'Hero Sprint 21-Speed Mountain Gear Bicycle',
    category: 'Cycles',
    price: 4200,
    condition: 'Good',
    seller: 'Priya K. (ECE 4th Year)',
    sellerId: 'user_456',
    status: 'Reserved',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 3,
    title: 'Dell 24" IPS Full HD Monitor with HDMI Cable',
    category: 'Electronics',
    price: 5800,
    condition: 'Like New',
    seller: 'Maneesh (You)',
    sellerId: 'user_me',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockItems);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [savedIds, setSavedIds] = useState([]);
  const [interestedIds, setInterestedIds] = useState([]);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [reportModalItem, setReportModalItem] = useState(null);
  const [reportReason, setReportReason] = useState('');

  const toggleSave = (id) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
      toast.info('Item removed from wishlist');
    } else {
      setSavedIds([...savedIds, id]);
      toast.success('Item saved to wishlist');
    }
  };

  const toggleInterest = (item) => {
    if (interestedIds.includes(item.id)) {
      setInterestedIds(interestedIds.filter((id) => id !== item.id));
      toast.info('Interest request cancelled');
    } else {
      setInterestedIds([...interestedIds, item.id]);
      toast.success(`Interest request sent to ${item.seller}! Waiting for acceptance.`);
    }
  };

  const markItemAsSold = (id) => {
    setItems(items.map((it) => (it.id === id ? { ...it, status: 'Sold' } : it)));
    toast.success('Item marked as SOLD');
  };

  const submitReport = (e) => {
    e.preventDefault();
    toast.success(`Report submitted for "${reportModalItem.title}". Our team will review it.`);
    setReportModalItem(null);
    setReportReason('');
  };

  const filtered = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchesPrice = item.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Requests Modal */}
      <InterestRequestsModal
        isOpen={requestsModalOpen}
        onClose={() => setRequestsModalOpen(false)}
        onSelectChat={(sellerName) => navigate('/messages')}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Peer-to-Peer Student Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#111827] font-heading">
            Student Marketplace
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Buy and sell pre-owned textbooks, gear, cycles, and study essentials safely.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={Inbox}
            onClick={() => setRequestsModalOpen(true)}
          >
            Interest Requests
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => toast.success('Open Sell Item Modal')}
          >
            Sell an Item
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sn-card p-4 space-y-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search textbooks, electronics, cycles..."
              className="sn-input pl-10 pr-4 py-2.5 w-full text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="sn-input px-3 py-2.5 w-full text-xs font-medium text-[#111827]"
            >
              <option value="all">All Conditions</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div className="sm:col-span-3 space-y-1">
            <div className="flex justify-between text-xs text-[#64748B] font-semibold">
              <span>Max Price</span>
              <span className="text-[#2563EB] font-bold">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No marketplace items found"
          description="Try adjusting your category, condition, or max price range filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('all');
            setSelectedCondition('all');
            setMaxPrice(10000);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isMyItem = item.sellerId === 'user_me';
            const isInterested = interestedIds.includes(item.id);

            return (
              <Card key={item.id} hover className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-white/90 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 border border-slate-200">
                        {item.condition}
                      </span>
                      <Badge
                        variant={
                          item.status === 'Available'
                            ? 'active'
                            : item.status === 'Reserved'
                            ? 'pending'
                            : 'overdue'
                        }
                        label={item.status}
                      />
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <button
                        onClick={() => toggleSave(item.id)}
                        className="p-2 rounded-full bg-white/90 text-slate-600 hover:text-rose-500 shadow-xs transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${savedIds.includes(item.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => setReportModalItem(item)}
                        title="Report Listing"
                        className="p-2 rounded-full bg-white/90 text-slate-400 hover:text-rose-600 shadow-xs transition-colors"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                      {item.category}
                    </div>

                    <h3 className="text-base font-bold text-[#111827] line-clamp-1 font-heading">
                      {item.title}
                    </h3>

                    <div className="text-xs text-[#64748B] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.seller}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="text-lg font-extrabold text-[#111827] font-heading">
                    ₹{item.price.toLocaleString()}
                  </div>

                  {isMyItem ? (
                    item.status !== 'Sold' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => markItemAsSold(item.id)}
                      >
                        Mark as Sold
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Sold Out</span>
                    )
                  ) : (
                    <Button
                      variant={isInterested ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => toggleInterest(item)}
                    >
                      {isInterested ? 'Cancel Interest' : 'Interested'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Report Modal */}
      {reportModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Report Listing
              </h3>
              <button onClick={() => setReportModalItem(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Why are you reporting <strong className="text-[#111827]">{reportModalItem.title}</strong>?
            </p>

            <form onSubmit={submitReport} className="space-y-3">
              <textarea
                rows="3"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the reason (e.g. misleading price, spam, prohibited item)..."
                className="sn-input w-full p-3 text-xs"
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setReportModalItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" size="sm">
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
