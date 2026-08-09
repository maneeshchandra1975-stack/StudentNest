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
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { toast } from 'sonner';

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
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 3,
    title: 'Dell 24" IPS Full HD Monitor with HDMI Cable',
    category: 'Electronics',
    price: 5800,
    condition: 'Excellent',
    seller: 'Anish R. (CSE 2nd Year)',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 4,
    title: 'Ergonomic Mesh Study Chair with Lumbar Support',
    category: 'Furniture',
    price: 2400,
    condition: 'Good',
    seller: 'Kavya M. (BBA 3rd Year)',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1294?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
];

export default function Marketplace() {
  const [items, setItems] = useState(mockItems);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedIds, setSavedIds] = useState([]);

  const toggleSave = (id) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
      toast.info('Item removed from wishlist');
    } else {
      setSavedIds([...savedIds, id]);
      toast.success('Item saved to wishlist');
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
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
            Buy and sell pre-owned textbooks, gear, cycles, and study essentials safely on campus.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => toast.success('Open Sell Item Modal')}
        >
          Sell an Item
        </Button>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="relative max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search textbooks, electronics, cycles..."
            className="sn-input pl-10 pr-4 py-2.5 w-full text-xs"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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

      {/* Product Items Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No marketplace items found"
          description="Try selecting a different category or clearing your search term."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 border border-slate-200">
                    {item.condition}
                  </div>
                  <button
                    onClick={() => toggleSave(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-600 hover:text-rose-500 shadow-xs transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${savedIds.includes(item.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                    {item.category}
                  </div>

                  <h3 className="text-sm font-bold text-[#111827] line-clamp-2 font-heading">
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
                <Button
                  variant="secondary"
                  size="sm"
                  icon={MessageSquare}
                  onClick={() => toast.success(`Starting chat with ${item.seller}`)}
                >
                  Chat
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
