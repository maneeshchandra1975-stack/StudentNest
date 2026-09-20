import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Heart,
  ShieldCheck,
  Building2,
  List,
  Map,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';
import { cn } from '../utils/cn';

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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent mb-3 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20 shadow-sm">
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Accommodations</span>
          </div>
          <h1 className="text-4xl font-extrabold text-foreground font-heading tracking-tight">
            Student Housing &amp; PGs
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Verified student rooms, flatshare opportunities, and PGs near VIT-AP University.
          </p>
        </motion.div>

        {/* View Toggle */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-1 p-1.5 bg-muted/50 rounded-2xl border border-border/50 text-sm font-bold shadow-inner">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer",
              viewMode === 'list'
                ? "bg-background text-primary shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn(
              "px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer",
              viewMode === 'map'
                ? "bg-background text-primary shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Map className="w-4 h-4" /> Map
          </button>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center shadow-sm">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PG name, or landmark..."
            className="w-full pl-11 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary shadow-inner"
          />
        </div>

        {/* Type Select */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer shadow-inner"
          >
            <option value="all">All Property Types</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Private Room">Private Room</option>
            <option value="Flatmate">Flatmate Wanted</option>
            <option value="Full Flat">Full Apartment</option>
          </select>
        </div>

        {/* Max Rent Slider */}
        <div className="sm:col-span-4 space-y-2 px-2">
          <div className="flex justify-between text-sm text-muted-foreground font-semibold">
            <span>Max Budget</span>
            <span className="text-primary font-bold">₹{maxRent.toLocaleString()} / mo</span>
          </div>
          <input
            type="range"
            min="5000"
            max="20000"
            step="500"
            value={maxRent}
            onChange={(e) => setMaxRent(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </motion.div>

      {/* Results View */}
      {viewMode === 'map' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted/20 border border-border/50 border-dashed rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto shadow-sm">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-foreground font-heading">
            Interactive Map View
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Showing properties surrounding VIT-AP University campus within a 3km radius.
          </p>
          <div className="h-80 w-full rounded-2xl bg-card border border-border/50 flex flex-col items-center justify-center text-muted-foreground font-medium shadow-inner mt-8">
            <Map className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Map Integration Placeholder</p>
            <p className="text-xs opacity-70 mt-1">Coordinates: 16.4971° N, 80.5002° E</p>
          </div>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState
            title="No housing listings match your filter"
            description="Try increasing your budget range or selecting 'All Property Types'."
            actionLabel="Reset Filters"
            icon={Building2}
            onAction={() => {
              setSearch('');
              setSelectedType('all');
              setMaxRent(15000);
            }}
          />
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
            {filtered.map((prop) => (
              <motion.div
                key={prop.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden flex flex-col justify-between h-full group border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="verified" className="shadow-sm backdrop-blur-md bg-background/90 font-bold border-0" />
                      </div>
                      <button
                        onClick={() => toggleSave(prop.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-md text-muted-foreground hover:text-rose-500 hover:bg-background shadow-sm transition-all cursor-pointer"
                      >
                        <Heart
                          className={cn("w-4 h-4 transition-colors", savedIds.includes(prop.id) && "fill-rose-500 text-rose-500")}
                        />
                      </button>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          {prop.type}
                        </Badge>
                        <span className="flex items-center gap-1 font-bold">
                          <MapPin className="w-3.5 h-3.5" /> {prop.distance} km
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground line-clamp-2 font-heading leading-tight group-hover:text-primary transition-colors">
                        {prop.title}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prop.amenities.map((item, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-muted text-[10px] text-muted-foreground font-bold border border-border/50">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-4 border-t border-border/60 flex items-center justify-between mt-auto bg-card">
                    <div>
                      <div className="text-xl font-black text-foreground font-heading">
                        ₹{prop.rent.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ mo</span>
                      </div>
                      <div className="text-[11px] font-medium text-muted-foreground truncate max-w-[120px]">{prop.location}</div>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      className="rounded-full shadow-sm font-bold text-xs px-4"
                      onClick={() => toast.success(`Connecting with owner: ${prop.owner}`)}
                    >
                      Contact
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
