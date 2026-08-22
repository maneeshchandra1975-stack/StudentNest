import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  ShoppingBag,
  Search,
  Plus,
  Inbox,
  Heart,
  ShieldCheck,
  Phone,
  ExternalLink,
  MessageSquare,
  Filter,
  CheckCircle2,
  Flag,
  X,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import { toast } from 'sonner';

// --- MOCK DATA ---
const mockHousing = [
  {
    id: 1,
    title: '2BHK Shared Apartment near VIT-AP Gate 2',
    rent: 8500,
    distance: 1.2,
    type: 'Shared Room',
    amenities: ['Wi-Fi', 'Furnished', 'AC', 'Power Backup'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    owner: 'Suresh Kumar',
    location: 'Inavolu Road, Vijayawada',
    verified: true,
  },
  {
    id: 2,
    title: 'Single Private Room in Executive Student PG',
    rent: 11000,
    distance: 0.8,
    type: 'Private Room',
    amenities: ['Food Included', 'Wi-Fi', 'Laundry', 'Housekeeping'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    owner: 'Anand PG Services',
    location: 'Near VIT-AP North Gate',
    verified: true,
  },
  {
    id: 3,
    title: '3BHK Flatmates Wanted (CSE Senior Flat)',
    rent: 7200,
    distance: 1.5,
    type: 'Flatmate',
    amenities: ['Power Backup', 'Gym', 'Kitchen', 'Balcony'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    owner: 'Maneesh C.',
    location: 'Capital Heights, Amaravati',
    verified: true,
  },
];

const mockNearbyPGs = [
  {
    id: 101,
    name: 'Anand Executive Student PG',
    type: 'Gents PG',
    rentStarting: 8500,
    distanceFromCampus: 0.8,
    ownerName: 'Anand Kumar (Owner)',
    ownerPhone: '+91 98765 43210',
    address: 'Near VIT-AP North Gate, Inavolu Road',
    amenities: ['3 Times Meals', 'Wi-Fi', 'Daily Housekeeping', 'Power Backup', 'AC Rooms'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 102,
    name: 'Sri Sai Women’s Luxury Hostel',
    type: 'Ladies PG',
    rentStarting: 9000,
    distanceFromCampus: 1.1,
    ownerName: 'Smt. Lakshmi Reddy (Owner)',
    ownerPhone: '+91 91234 56789',
    address: 'Opposite Amaravati Main Arch, Inavolu',
    amenities: ['CCTV Security', 'Biometric Entry', 'Home Cooked Food', 'Washing Machine'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
  },
];

const mockRoommates = [
  {
    id: 201,
    title: 'Looking for 1 Roommate in 2BHK Flat (Inavolu Road)',
    author: 'Maneesh C. (CSE 3rd Year)',
    roomType: 'Shared Room',
    vacancy: 1,
    rentShare: 4500,
    location: 'Inavolu Main Road (1.2 km from VIT-AP)',
    description: 'Spacious ventilated room with attached bathroom, Wi-Fi, and kitchen setup.',
    preferences: ['Non-smoker', 'Quiet Study', 'Early Riser'],
  },
  {
    id: 202,
    title: 'Private Room Vacancy in 3BHK Gated Apartment',
    author: 'Priya Verma (ECE 4th Year)',
    roomType: 'Private Room',
    vacancy: 2,
    rentShare: 6500,
    location: 'Capital Heights, Amaravati (1.8 km)',
    description: 'Fully furnished private bedroom with AC, balcony, and power backup.',
    preferences: ['Vegetarian', 'Clean & Organized', 'Night Owl'],
  },
];

const mockMarketplace = [
  {
    id: 301,
    title: 'CLRS Introduction to Algorithms (3rd Ed.)',
    category: 'Books',
    price: 650,
    condition: 'Like New',
    seller: 'Rahul S. (CSE 3rd Year)',
    sellerId: 'user_123',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 302,
    title: 'Hero Sprint 21-Speed Mountain Gear Bicycle',
    category: 'Cycles',
    price: 4200,
    condition: 'Good',
    seller: 'Priya K. (ECE 4th Year)',
    sellerId: 'user_456',
    status: 'Reserved',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  },
];

export default function HousingHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('housing'); // 'housing' | 'nearby' | 'roommates' | 'marketplace'
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState([]);
  const [interestedIds, setInterestedIds] = useState([]);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);

  const toggleSave = (id) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
      toast.info('Removed from saved items');
    } else {
      setSavedIds([...savedIds, id]);
      toast.success('Saved to your student workspace');
    }
  };

  const toggleInterest = (id, name) => {
    if (interestedIds.includes(id)) {
      setInterestedIds(interestedIds.filter((item) => item !== id));
      toast.info('Interest request cancelled');
    } else {
      setInterestedIds([...interestedIds, id]);
      toast.success(`Interest request sent to ${name}! Waiting for acceptance.`);
    }
  };

  return (
    <div className="space-y-6 py-2">
      <InterestRequestsModal
        isOpen={requestsModalOpen}
        onClose={() => setRequestsModalOpen(false)}
        onSelectChat={() => navigate('/messages')}
      />

      {/* ── 1. Unified Hub Top Header ───────────────────────── */}
      <div className="sn-card p-6 bg-white space-y-4 border-[#E2E8F0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
              <Building2 className="w-4 h-4" />
              <span>All-In-One VIT-AP Student Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#111827] font-heading">
              Student Housing &amp; Marketplace Hub
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Campus flats, nearby verified PGs, roommate matching, and peer-to-peer marketplace in one unified space.
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
              onClick={() => toast.success('Open Add Listing Panel')}
            >
              Post Listing
            </Button>
          </div>
        </div>

        {/* Unified Search Input */}
        <div className="relative max-w-2xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flats, PGs, roommates, textbooks, or bicycles across all modules..."
            className="sn-input pl-10 pr-4 py-2.5 w-full text-xs"
          />
        </div>

        {/* ── 2. Unified Navigation Tabs ─────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          {[
            { id: 'housing', label: 'Campus Housing & Flats', icon: Building2, count: mockHousing.length },
            { id: 'nearby', label: 'Nearby PGs & Hostels', icon: MapPin, count: mockNearbyPGs.length },
            { id: 'roommates', label: 'Roommate Finder', icon: Users, count: mockRoommates.length },
            { id: 'marketplace', label: 'Student Marketplace', icon: ShoppingBag, count: mockMarketplace.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Tab Module Content ────────────────────────────── */}

      {/* TAB 1: CAMPUS HOUSING */}
      {activeTab === 'housing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockHousing.map((prop) => (
            <Card key={prop.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="verified" />
                  </div>
                  <button
                    onClick={() => toggleSave(prop.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-600 hover:text-rose-500 shadow-xs"
                  >
                    <Heart className={`w-4 h-4 ${savedIds.includes(prop.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold">{prop.type}</span>
                    <span>{prop.distance} km from campus</span>
                  </div>
                  <h3 className="text-base font-bold text-[#111827] font-heading line-clamp-2">{prop.title}</h3>
                  <div className="flex flex-wrap gap-1">
                    {prop.amenities.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">{a}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-extrabold text-[#111827] font-heading">₹{prop.rent.toLocaleString()} / mo</div>
                  <div className="text-[10px] text-slate-400">{prop.owner}</div>
                </div>
                <Button variant="primary" size="sm" onClick={() => toggleInterest(prop.id, prop.owner)}>
                  {interestedIds.includes(prop.id) ? 'Cancel Interest' : 'Interested'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: NEARBY PGS */}
      {activeTab === 'nearby' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockNearbyPGs.map((pg) => (
            <Card key={pg.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img src={pg.image} alt={pg.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3"><Badge variant="verified" /></div>
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#2563EB]">{pg.type}</div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#111827] font-heading">{pg.name}</h3>
                  <p className="text-xs text-slate-500">{pg.address} • {pg.distanceFromCampus} km from campus</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {pg.amenities.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-[#111827]">₹{pg.rentStarting.toLocaleString()} / mo</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">{pg.ownerName}</div>
                </div>
                <Button variant="primary" size="sm" icon={Phone} onClick={() => toast.info(`Call ${pg.ownerPhone}`)}>
                  {pg.ownerPhone}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: ROOMMATE FINDER */}
      {activeTab === 'roommates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockRoommates.map((post) => (
            <Card key={post.id} hover className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#2563EB] text-xs font-bold">{post.roomType}</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{post.vacancy} Vacancy</span>
                </div>
                <h3 className="text-base font-bold text-[#111827] font-heading">{post.title}</h3>
                <p className="text-xs text-slate-500">{post.location}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{post.description}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-[#2563EB]">₹{post.rentShare.toLocaleString()} / mo</div>
                  <div className="text-[10px] text-slate-400">{post.author}</div>
                </div>
                <Button variant={interestedIds.includes(post.id) ? 'secondary' : 'primary'} size="sm" onClick={() => toggleInterest(post.id, post.author)}>
                  {interestedIds.includes(post.id) ? 'Cancel Interest' : 'Interested'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockMarketplace.map((item) => (
            <Card key={item.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-700">{item.condition}</div>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase">{item.category}</span>
                  <h3 className="text-base font-bold text-[#111827] font-heading">{item.title}</h3>
                  <div className="text-xs text-slate-500">Seller: {item.seller}</div>
                </div>
              </div>
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-lg font-bold text-[#111827]">₹{item.price.toLocaleString()}</div>
                <Button variant={interestedIds.includes(item.id) ? 'secondary' : 'primary'} size="sm" onClick={() => toggleInterest(item.id, item.seller)}>
                  {interestedIds.includes(item.id) ? 'Cancel Interest' : 'Interested'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
