import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  MapPin,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';
import { toast } from 'sonner';
import { cn } from '../utils/cn';

const mockRoommatePosts = [
  {
    id: 1,
    title: 'Looking for 1 Roommate in 2BHK Flat (Inavolu Road)',
    author: 'Maneesh C. (CSE 3rd Year)',
    roomType: 'Shared Room',
    vacancy: 1,
    rentShare: 4500,
    location: 'Inavolu Main Road (1.2 km from VIT-AP)',
    description: 'Spacious ventilated room with attached bathroom, Wi-Fi, and kitchen setup.',
    preferences: ['Non-smoker', 'Quiet Study', 'Early Riser'],
    status: 'Available',
  },
  {
    id: 2,
    title: 'Private Room Vacancy in 3BHK Gated Apartment',
    author: 'Priya Verma (ECE 4th Year)',
    roomType: 'Private Room',
    vacancy: 2,
    rentShare: 6500,
    location: 'Capital Heights, Amaravati (1.8 km)',
    description: 'Fully furnished private bedroom with AC, balcony, and power backup.',
    preferences: ['Vegetarian', 'Clean & Organized', 'Night Owl'],
    status: 'Available',
  },
  {
    id: 3,
    title: 'Flatmate Needed for 2BHK Deluxe Flat near North Gate',
    author: 'Rahul Sharma (CSE 2nd Year)',
    roomType: '2BHK Flatshare',
    vacancy: 1,
    rentShare: 5200,
    location: 'Near VIT-AP North Gate (0.9 km)',
    description: 'Looking for a chill flatmate to share rent and food expenses.',
    preferences: ['Non-smoker', 'Gamers Welcome'],
    status: 'Available',
  },
];

export default function Roommates() {
  const [posts, setPosts] = useState(mockRoommatePosts);
  const [search, setSearch] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [interestedIds, setInterestedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating post
  const [newTitle, setNewTitle] = useState('');
  const [newRoomType, setNewRoomType] = useState('Shared Room');
  const [newVacancy, setNewVacancy] = useState(1);
  const [newRent, setNewRent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleInterest = (id, author) => {
    if (interestedIds.includes(id)) {
      setInterestedIds(interestedIds.filter((item) => item !== id));
      toast.info('Cancelled interest request');
    } else {
      setInterestedIds([...interestedIds, id]);
      toast.success(`Interest request sent to ${author}! Waiting for seller acceptance.`);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle || !newRent || !newLocation || !newDesc) {
      toast.error('Please fill all required fields');
      return;
    }

    const created = {
      id: Date.now(),
      title: newTitle,
      author: 'Maneesh (You)',
      roomType: newRoomType,
      vacancy: Number(newVacancy),
      rentShare: Number(newRent),
      location: newLocation,
      description: newDesc,
      preferences: ['Verified Student'],
      status: 'Available',
    };

    setPosts([created, ...posts]);
    setIsModalOpen(false);
    toast.success('Roommate vacancy posted successfully!');

    // Reset
    setNewTitle('');
    setNewRent('');
    setNewLocation('');
    setNewDesc('');
  };

  const filtered = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedRoomType === 'all' || post.roomType === selectedRoomType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold mb-3 shadow-sm">
            <Users className="w-3.5 h-3.5" />
            <span>VIT-AP Flatmate &amp; PG Network</span>
          </div>
          <h1 className="text-4xl font-extrabold text-foreground font-heading tracking-tight">
            Roommate Finder
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Find compatible flatmates and verified rooms around Amaravati &amp; VIT-AP campus.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full sm:w-auto">
          <Button
            variant="default"
            className="w-full sm:w-auto rounded-full shadow-sm px-6"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Vacancy
          </Button>
        </motion.div>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location (e.g. Inavolu) or amenities..."
            className="w-full pl-11 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary shadow-inner"
          />
        </div>

        <div className="w-full md:w-64 shrink-0">
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer shadow-inner"
          >
            <option value="all">All Configurations</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Private Room">Private Room</option>
            <option value="2BHK Flatshare">2BHK Flatshare</option>
            <option value="3BHK Flatshare">3BHK Flatshare</option>
          </select>
        </div>
      </motion.div>

      {/* ── Feed Grid ──────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState
            title="No listings found"
            description="Be the first student to post a roommate vacancy!"
            actionLabel="Post Roommate Vacancy"
            onAction={() => setIsModalOpen(true)}
            icon={Users}
          />
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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
            {filtered.map((post) => {
              const isInterested = interestedIds.includes(post.id);
              return (
                <motion.div
                  key={post.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-6 flex flex-col justify-between space-y-4 border-border/50 shadow-sm h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {post.roomType}
                          </Badge>
                          {post.status && post.status !== 'Available' && (
                            <Badge variant="secondary" className="border-0">
                              {post.status}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {post.vacancy} Vacancy
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground font-heading line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span className="truncate">{post.location}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {post.description}
                      </p>

                      {/* Preferences */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {post.preferences.map((pref, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-muted text-[11px] font-bold text-muted-foreground border border-border/50">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 border-t border-border/60 flex flex-col gap-4 mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Rent Share</div>
                          <div className="text-2xl font-black text-foreground font-heading">
                            ₹{post.rentShare.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ mo</span>
                          </div>
                        </div>

                        {post.status === 'Available' ? (
                          <Button
                            variant={isInterested ? 'secondary' : 'default'}
                            size="default"
                            className={cn("rounded-full px-5 text-sm font-bold shadow-sm", isInterested && "bg-muted text-muted-foreground")}
                            onClick={() => toggleInterest(post.id, post.author)}
                          >
                            {isInterested ? 'Requested' : 'Interested'}
                          </Button>
                        ) : (
                          <Button variant="secondary" size="default" className="rounded-full px-5 text-sm font-bold opacity-50 cursor-not-allowed">
                            {post.status}
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Avatar className="w-7 h-7 border border-border/50 shadow-sm">
                          <AvatarFallback className="bg-secondary/10 text-secondary text-[10px] font-bold">
                            {post.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 font-semibold truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-success" /> {post.author}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Post Modal via shadcn Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="border-b border-border pb-4 mb-4">
            <DialogTitle className="text-xl font-heading font-bold text-foreground">
              Post Roommate Vacancy
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Listing Title</label>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 1 Roommate needed for 2BHK near Gate 2"
                required
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Room Type</label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                >
                  <option value="Shared Room">Shared Room</option>
                  <option value="Private Room">Private Room</option>
                  <option value="2BHK Flatshare">2BHK Flatshare</option>
                  <option value="3BHK Flatshare">3BHK Flatshare</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Vacancy Count</label>
                <Input
                  type="number"
                  min="1"
                  value={newVacancy}
                  onChange={(e) => setNewVacancy(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Rent Share (₹/month)</label>
                <Input
                  type="number"
                  value={newRent}
                  onChange={(e) => setNewRent(e.target.value)}
                  placeholder="e.g. 4500"
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Location</label>
                <Input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Inavolu Main Road"
                  required
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <Textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe the room, amenities, and roommate habits..."
                required
                className="bg-background/50 resize-none"
              />
            </div>

            <DialogFooter className="pt-4 mt-2 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" className="shadow-sm">
                Publish Vacancy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
