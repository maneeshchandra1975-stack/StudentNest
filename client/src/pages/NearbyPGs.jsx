import React, { useState } from 'react';
import {
  Building2,
  Phone,
  MapPin,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

const defaultNearbyPGs = [
  {
    id: 1,
    name: 'Anand Executive Student PG',
    type: 'Gents PG',
    rentStarting: 8500,
    distanceFromCampus: 0.8,
    ownerName: 'Anand Kumar (Owner)',
    ownerPhone: '+91 98765 43210',
    address: 'Near VIT-AP North Gate, Inavolu Road',
    coordinates: { lat: 16.4985, lng: 80.5015 },
    amenities: ['3 Times Meals', 'Wi-Fi', 'Daily Housekeeping', 'Power Backup', 'AC Rooms'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
  },
  {
    id: 2,
    name: 'Sri Sai Women’s Luxury Hostel',
    type: 'Ladies PG',
    rentStarting: 9000,
    distanceFromCampus: 1.1,
    ownerName: 'Smt. Lakshmi Reddy (Owner)',
    ownerPhone: '+91 91234 56789',
    address: 'Opposite Amaravati Main Arch, Inavolu',
    coordinates: { lat: 16.4950, lng: 80.5040 },
    amenities: ['CCTV Security', 'Biometric Entry', 'Home Cooked Food', 'Washing Machine', 'Study Hall'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
  },
  {
    id: 3,
    name: 'Capital Green Valley Apartments',
    type: 'Apartment',
    rentStarting: 12500,
    distanceFromCampus: 1.8,
    ownerName: 'Venkatesh Rao (Manager)',
    ownerPhone: '+91 99887 76655',
    address: 'Mandadam High Road, Vijayawada Sector 4',
    coordinates: { lat: 16.5020, lng: 80.4950 },
    amenities: ['Covered Bike Parking', 'Elevator', 'Gym Access', 'Water Purifier', 'Balcony View'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    isVerified: true,
  },
];

export default function NearbyPGs() {
  const [pgs, setPgs] = useState(defaultNearbyPGs);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const openGoogleMaps = (pg) => {
    const query = encodeURIComponent(`${pg.name}, ${pg.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const filtered = pgs.filter((pg) => {
    const matchesSearch =
      pg.name.toLowerCase().includes(search.toLowerCase()) ||
      pg.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || pg.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]">
          <Building2 className="w-4 h-4" />
          <span>Curated Internet &amp; Campus Aggregator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111827] font-heading">
          Nearby PGs &amp; Hostels
        </h1>
        <p className="text-xs text-[#64748B]">
          Verified PG accommodations, hostels, and apartments surrounding VIT-AP University campus with direct owner contact details.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="sn-card p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nearby PG name, landmark, or address..."
            className="sn-input pl-10 pr-4 py-2 w-full text-xs"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="sn-input px-3 py-2 w-full text-xs font-medium text-[#111827]"
          >
            <option value="all">All Accommodations</option>
            <option value="Gents PG">Gents PG</option>
            <option value="Ladies PG">Ladies PG</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((pg) => (
          <Card key={pg.id} hover className="overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={pg.image}
                  alt={pg.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="verified" />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 px-2.5 py-1 rounded-md text-[11px] font-bold text-[#2563EB] border border-slate-200">
                  {pg.type}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB]" /> {pg.distanceFromCampus} km from campus
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#111827] font-heading line-clamp-1">
                  {pg.name}
                </h3>

                <p className="text-xs text-slate-500 truncate">{pg.address}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {pg.amenities.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-3 border-t border-slate-100 space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-extrabold text-[#111827] font-heading">
                    ₹{pg.rentStarting.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">{pg.ownerName}</div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Phone}
                  onClick={() => toast.info(`Owner Contact: ${pg.ownerPhone}`)}
                >
                  {pg.ownerPhone}
                </Button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                icon={ExternalLink}
                onClick={() => openGoogleMaps(pg)}
              >
                View on Google Maps
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
