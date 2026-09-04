import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Heart,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  Map,
  List,
  Check,
  Phone,
  MessageSquare,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { toast } from 'sonner';

const initialProperties = [
  {
    id: 1,
    title: '2BHK Shared Apartment near VIT-AP Gate 2',
    rent: 8500,
    distance: 1.2,
    type: 'Shared Room',
    amenities: ['Wi-Fi', 'Furnished', 'AC', 'Power Backup'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    owner: 'Suresh Kumar (Verified Owner)',
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
    owner: 'Maneesh C. (Student)',
    location: 'Capital Heights, Amaravati',
    verified: true,
  },
  {
    id: 4,
    title: 'Luxury 1BHK Studio Apartment for Couples / Singles',
    rent: 13500,
    distance: 2.0,
    type: 'Full Flat',
    amenities: ['Private Kitchen', 'AC', 'Smart TV', 'Parking'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    owner: 'Green Valley Residences',
    location: 'Mandadam Main Road',
    verified: true,
  },
];

export default function Housing() {
  const [properties, setProperties] = useState(initialProperties);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [maxRent, setMaxRent] = useState(15000);
  const [savedIds, setSavedIds] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const toggleSave = (id) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
      toast.info('Removed from saved properties');
    } else {
      setSavedIds([...savedIds, id]);
      toast.success('Property saved to your student workspace');
    }
  };

  const filtered = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(search.toLowerCase()) ||
      prop.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || prop.type === selectedType;
    const matchesRent = prop.rent <= maxRent;
    return matchesSearch && matchesType && matchesRent;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
            <Building2 className="w-4 h-4" />
            <span>Campus Housing &amp; Accommodations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] font-heading">
            Student Housing &amp; PGs
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Verified student rooms, flatshare opportunities, and PGs near VIT-AP University.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-[var(--bg-card)] text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-[var(--text-main)]'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'map'
                ? 'bg-[var(--bg-card)] text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-[var(--text-main)]'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Interactive Map
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sn-card p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location, PG name, or landmark..."
            className="sn-input pl-10 pr-4 py-2 w-full text-xs"
          />
        </div>

        {/* Type Select */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="sn-input px-3 py-2 w-full text-xs font-medium text-[var(--text-main)]"
          >
            <option value="all">All Property Types</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Private Room">Private Room</option>
            <option value="Flatmate">Flatmate Wanted</option>
            <option value="Full Flat">Full Apartment</option>
          </select>
        </div>

        {/* Max Rent Slider */}
        <div className="sm:col-span-4 space-y-1 px-1">
          <div className="flex justify-between text-xs text-[#64748B] font-semibold">
            <span>Max Budget</span>
            <span className="text-[#2563EB] font-bold">₹{maxRent.toLocaleString()} / mo</span>
          </div>
          <input
            type="range"
            min="5000"
            max="20000"
            step="500"
            value={maxRent}
            onChange={(e) => setMaxRent(Number(e.target.value))}
            className="w-full accent-[#2563EB] cursor-pointer"
          />
        </div>
      </div>

      {/* Results View */}
      {viewMode === 'map' ? (
        <div className="sn-card p-8 text-center space-y-3 bg-[var(--bg-body)] border-dashed">
          <MapPin className="w-8 h-8 text-[#2563EB] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
            VIT-AP Interactive Map View
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Showing properties surrounding VIT-AP University campus within a 3km radius.
          </p>
          <div className="h-64 rounded-2xl bg-slate-200 flex items-center justify-center text-xs text-[var(--text-muted)] font-medium">
            [ Leaflet OpenStreetMap Container — VIT-AP Coordinates: 16.4971° N, 80.5002° E ]
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No housing listings match your filter"
          description="Try increasing your budget range or selecting 'All Property Types'."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedType('all');
            setMaxRent(15000);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <Card key={prop.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="verified" />
                  </div>
                  <button
                    onClick={() => toggleSave(prop.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[var(--bg-card)]/90 text-slate-600 hover:text-rose-500 shadow-xs transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${savedIds.includes(prop.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-[#64748B] flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold">
                      {prop.type}
                    </span>
                    <span className="flex items-center gap-1 text-[var(--text-muted)]">
                      <MapPin className="w-3.5 h-3.5" /> {prop.distance} km from campus
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-main)] line-clamp-2 font-heading">
                    {prop.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prop.amenities.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-[#64748B] font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                <div>
                  <div className="text-lg font-extrabold text-[var(--text-main)] font-heading">
                    ₹{prop.rent.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{prop.location}</div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => toast.success(`Connecting with owner: ${prop.owner}`)}
                >
                  Contact Owner
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
