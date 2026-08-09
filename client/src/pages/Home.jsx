import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

const mockFeaturedHousing = [
  {
    id: 1,
    title: '2BHK Shared Apartment near VIT-AP Gate 2',
    rent: '₹8,500 / month',
    distance: '1.2 km from campus',
    amenities: 'Wi-Fi · Furnished · AC',
    type: 'Shared Room',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 2,
    title: 'Single Private Room in Deluxe PG',
    rent: '₹11,000 / month',
    distance: '0.8 km from campus',
    amenities: 'Food Included · Wi-Fi · Laundry',
    type: 'Private Room',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 3,
    title: '3BHK Flatmates Wanted (Inavolu Road)',
    rent: '₹7,200 / month',
    distance: '1.5 km from campus',
    amenities: 'Power Backup · Gym · Kitchen',
    type: 'Flatmate',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
];

const mockMarketplaceItems = [
  {
    id: 1,
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    price: '₹650',
    condition: 'Like New',
    seller: 'Rahul S. (CSE 3rd Year)',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Hero Sprint Bicycle 21 Speed Gear',
    price: '₹4,200',
    condition: 'Good',
    seller: 'Priya K. (ECE 4th Year)',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Dell 24" Full HD Monitor (IPS Display)',
    price: '₹5,800',
    condition: 'Excellent',
    seller: 'Anish R. (CSE 2nd Year)',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState([]);

  const toggleSave = (id) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
      toast.info('Removed from saved listings');
    } else {
      setSavedIds([...savedIds, id]);
      toast.success('Listing saved to your workspace');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/housing?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-16 py-4">
      {/* ── 1. Hero Section ─────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
          <span>Exclusively for Verified VIT-AP University Students</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight font-heading leading-tight">
          Find your place on campus.
        </h1>

        <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
          Discover trusted student housing, verified PGs, and second-hand essentials within your campus community.
        </p>

        {/* Compact Search Bar */}
        <form onSubmit={handleSearch} className="pt-2 max-w-xl mx-auto">
          <div className="sn-card p-2 flex items-center gap-2 shadow-sm focus-within:border-[#2563EB]">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apartments, PGs, books, bicycles near VIT-AP..."
              className="w-full text-sm bg-transparent text-[#111827] placeholder:text-slate-400 focus:outline-none"
            />
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </div>
        </form>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/housing')}
          >
            Explore Housing
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/marketplace')}
          >
            Browse Marketplace
          </Button>
        </div>
      </div>

      {/* ── 2. Verified Trust Badges ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        {[
          {
            title: 'Verified Student Identity',
            desc: 'Every user is authenticated using their official @vitapstudent.ac.in university domain.',
            icon: ShieldCheck,
          },
          {
            title: 'Zero Brokerage Fees',
            desc: 'Direct peer-to-peer student transactions with zero broker commission or hidden fees.',
            icon: Building2,
          },
          {
            title: 'Safe Campus Marketplace',
            desc: 'Buy and sell textbooks, bicycles, and electronics safely with fellow batchmates.',
            icon: ShoppingBag,
          },
        ].map((feature, idx) => (
          <div key={idx} className="sn-card p-6 space-y-3 border-[#E2E8F0] bg-white">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100">
              <feature.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111827] font-heading">{feature.title}</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* ── 3. Featured Campus Housing Section ──────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#111827] font-heading">
              Featured Housing &amp; PGs
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Verified accommodations within walking or cycling distance from campus.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/housing')}
            className="hidden sm:inline-flex"
          >
            View All Housing <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockFeaturedHousing.map((property) => (
            <Card key={property.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="verified" />
                  </div>
                  <button
                    onClick={() => toggleSave(property.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-600 hover:text-rose-500 shadow-sm transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${savedIds.includes(property.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-[#64748B] flex items-center justify-between">
                    <span>{property.type}</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" /> {property.distance}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#111827] line-clamp-2 font-heading">
                    {property.title}
                  </h3>

                  <div className="text-xs text-[#64748B] font-medium">
                    {property.amenities}
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <div>
                  <div className="text-base font-extrabold text-[#111827] font-heading">{property.rent}</div>
                  <div className="text-[10px] text-slate-400">Includes maintenance</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/housing')}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── 4. Student Marketplace Preview Section ────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#111827] font-heading">
              Student Marketplace Essentials
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Buy and sell pre-loved textbooks, cycles, and monitors directly from batchmates.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplace')}
            className="hidden sm:inline-flex"
          >
            Explore Marketplace <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockMarketplaceItems.map((item) => (
            <Card key={item.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 border border-slate-200">
                    {item.condition}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#111827] line-clamp-1 font-heading">
                    {item.title}
                  </h3>
                  <div className="text-xs text-[#64748B]">
                    Seller: <span className="font-semibold text-slate-700">{item.seller}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <div className="text-lg font-extrabold text-[#2563EB] font-heading">{item.price}</div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/marketplace')}>
                  Contact Seller
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
