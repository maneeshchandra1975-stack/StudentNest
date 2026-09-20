import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  ExternalLink,
  AlertCircle,
  Compass,
  Star,
  Building2
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* ── Aurora Hero Header Banner ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-8 sm:p-12 backdrop-blur-xl shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider shadow-sm">
              <Compass className="w-4 h-4" />
              <span>Real-Time Geospatial Map</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground font-heading tracking-tight leading-tight">
              Nearby PGs &amp; <span className="text-primary">Hostels</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium max-w-xl">
              Live geospatial map of student accommodations, verified hostels, and apartments situated directly around the university campus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-background/50 border border-border text-sm font-bold text-foreground flex items-center gap-3 shadow-sm backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(63,125,90,0.8)]" />
              <span>{pgs.length > 0 ? `${pgs.length} Accommodations Located` : 'Scanning Area...'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Search & Filter Bar ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-2xl p-4 flex gap-4 items-center shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search live PG name, landmark, road, or area..."
            className="pl-11 pr-4 py-5 w-full text-sm bg-background/50 border-border/50 focus-visible:ring-primary shadow-inner rounded-xl"
          />
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm font-bold shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* ── Cards Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden flex flex-col h-full border-border/50">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="p-5 pt-0 mt-auto">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((pg) => (
              <motion.div
                key={pg.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden flex flex-col justify-between h-full group border-border/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      <img
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
                        alt={pg.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20" />
                      
                      <div className="absolute top-3 left-3">
                        <Badge variant="verified" className="bg-success text-success-foreground border-0 shadow-sm px-2.5 py-0.5">
                          Live Verified
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-accent border border-border shadow-sm">
                        Hostel / PG
                      </div>
                    </div>

                    <div className="p-5 space-y-3 relative z-10 -mt-8">
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground bg-card rounded-lg px-2 py-1 shadow-sm border border-border/40 inline-flex">
                        <span className="flex items-center gap-1 text-primary">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{pg.distance || 'Near Campus'}</span>
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-start pt-2">
                        <h3 className="text-xl font-extrabold text-foreground font-heading line-clamp-1 group-hover:text-primary transition-colors pr-2">
                          {pg.name}
                        </h3>
                        {pg.rating && (
                          <span className="flex items-center gap-1 font-black text-warning shrink-0 mt-1">
                            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                            {pg.rating}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                        {pg.address}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-4 border-t border-border/50 mt-auto bg-card/50">
                    <Button
                      variant="default"
                      className="w-full rounded-xl font-bold text-sm shadow-sm hover:shadow-md"
                      onClick={() => openGoogleMaps(pg.mapLink)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Navigate on Google Maps
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filtered.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full">
              <div className="flex flex-col items-center justify-center py-20 bg-card/40 border border-border/50 border-dashed rounded-3xl">
                <Building2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-base text-muted-foreground font-semibold">No live accommodations found matching your search.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
