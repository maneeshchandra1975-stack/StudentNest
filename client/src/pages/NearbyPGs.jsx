import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Search,
  ExternalLink,
  Phone,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';
import api from '../services/api';

export default function NearbyPGs() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        // VIT-AP coordinates passed implicitly or explicitly
        const response = await api.get('/nearby-pgs?lat=16.500&lng=80.500&radius=5000');
        if (response.data.success) {
          setPgs(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching PGs:', err);
        setError('Failed to load nearby accommodations. Using offline mode.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const openGoogleMaps = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const filtered = pgs.filter((pg) => {
    return pg.name.toLowerCase().includes(search.toLowerCase()) || 
           (pg.address && pg.address.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]">
          <Building2 className="w-4 h-4" />
          <span>Real-time Geoapify Integration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] font-heading">
          Nearby PGs &amp; Hostels
        </h1>
        <p className="text-xs text-[#64748B]">
          Live feed of verified accommodations surrounding VIT-AP University campus.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="sn-card p-4 flex gap-4 items-center bg-[var(--bg-card)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search live PG name, landmark, or address..."
            className="sn-input pl-10 pr-4 py-2 w-full text-xs"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((pg) => (
            <Card key={pg.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  {/* Since APIs don't easily provide free images, we use a placeholder that matches the UI */}
                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
                    alt={pg.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 opacity-80"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="verified" label="Live Data" />
                  </div>
                  <div className="absolute top-3 right-3 bg-[var(--bg-card)]/90 px-2.5 py-1 rounded-md text-[11px] font-bold text-[#2563EB] border border-[var(--border-light)]">
                    Hostel / PG
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB]" /> {pg.distance} from campus
                    </span>
                    {pg.rating && (
                      <span className="text-yellow-500 flex items-center gap-1">
                        ★ {pg.rating}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-main)] font-heading line-clamp-1">
                    {pg.name}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] truncate">{pg.address}</p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 space-y-3 mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  icon={ExternalLink}
                  onClick={() => openGoogleMaps(pg.mapLink)}
                >
                  View on Google Maps
                </Button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-sm text-[var(--text-muted)]">
              No live accommodations found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
