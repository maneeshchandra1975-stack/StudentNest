import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Search,
  ExternalLink,
  Phone,
  Loader2,
  AlertCircle,
  Sparkles,
  Compass,
  ShieldCheck,
  Star,
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
    return (
      pg.name.toLowerCase().includes(search.toLowerCase()) || 
      (pg.address && pg.address.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8">
      {/* ── Aurora Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] p-6 sm:p-10 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-500/10 via-orange-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-orange-500" />
              <span>Real-Time Geoapify Navigation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] font-heading tracking-tight">
              Nearby PGs &amp; <span className="text-gradient-primary">Hostels</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
              Live geospatial map of student accommodations, verified hostels, and apartments situated directly around the VIT-AP University campus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-light)] text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{pgs.length > 0 ? `${pgs.length} Accommodations Located` : 'Scanning Area...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="sn-card p-4 flex gap-4 items-center bg-[var(--bg-card)]/90 backdrop-blur-xl border-[var(--border-light)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search live PG name, landmark, road, or area..."
            className="sn-input pl-10 pr-4 py-2.5 w-full text-xs"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Cards Grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[var(--text-muted)] space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold">Scanning campus surroundings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pg) => (
            <div
              key={pg.id}
              className="sn-card sn-card-hover overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900/10">
                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
                    alt={pg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-black/30" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                      Live Verified
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[var(--bg-card)]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-orange-600 dark:text-orange-400 border border-[var(--border-light)] shadow-xs">
                    Hostel / PG
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{pg.distance || 'Near Campus'}</span>
                    </span>
                    {pg.rating && (
                      <span className="text-amber-500 flex items-center gap-1 font-black">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {pg.rating}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-[var(--text-main)] font-heading line-clamp-1 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {pg.name}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed font-normal">
                    {pg.address}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[var(--border-light)] mt-2">
                <button
                  onClick={() => openGoogleMaps(pg.mapLink)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Navigate on Google Maps</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-16 text-sm text-[var(--text-muted)]">
              No live accommodations found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
