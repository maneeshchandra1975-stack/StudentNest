import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Search,
  Plus,
  Inbox,
  ShieldCheck,
  Flag,
  Sparkles,
  Heart,
  User,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import ReportModal from '../components/ui/ReportModal';
import CreateHousingModal from '../components/modals/CreateHousingModal';
import { Input } from '../components/ui/Input';
import { fetchRoommatePosts, toggleRoommateInterest, updateRoommateStatus } from '../redux/slices/roommateSlice';
import { toast } from 'sonner';
import { cn } from '../utils/cn';

const ROOM_TYPES = ['All', 'Shared Room', 'Private Room', '2BHK Flat', '3BHK Flat'];

export default function RoommateFinder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading } = useSelector((state) => state.roommate);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchRoommatePosts({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  const toggleInterest = async (postId, recipientId) => {
    const res = await dispatch(toggleRoommateInterest({ postId, recipientId }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Interest request submitted to flatmate!');
      dispatch(fetchRoommatePosts({ search: searchQuery }));
    } else {
      toast.error(res.payload || 'Failed to send request');
    }
  };

  const handleMarkFilled = async (postId) => {
    if (window.confirm("Are you sure you want to mark this vacancy as Filled?")) {
      const res = await dispatch(updateRoommateStatus({ id: postId, status: 'Filled' }));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Vacancy marked as Filled');
      } else {
        toast.error(res.payload || 'Failed to update status');
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedType === 'All') return true;
    return post.roomType?.toLowerCase().includes(selectedType.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold mb-3 shadow-sm uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>VIT-AP Flatmate &amp; PG Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground font-heading tracking-tight leading-tight">
            Roommate Finder
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl font-medium">
            Discover verified flatmates, post vacancy requirements, and secure housing directly with zero middleman broker fees.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-full shadow-sm px-6 font-bold"
            onClick={() => setIsRequestsModalOpen(true)}
          >
            <Inbox className="w-4 h-4 mr-2" />
            Incoming Requests
          </Button>
          <Button
            variant="default"
            className="w-full sm:w-auto rounded-full shadow-sm px-6 font-bold"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Vacancy
          </Button>
        </motion.div>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by area, PG name, apartment, or keywords..."
            className="w-full pl-12 rounded-2xl py-6 bg-background/50 border-border/50 focus-visible:ring-primary shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {ROOM_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border shadow-sm",
                selectedType === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border/50 hover:border-border hover:bg-muted/50"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Feed Grid ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-primary space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loading roommate vacancies...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState
            title="No roommate vacancies found"
            description="Try modifying your search keywords or be the first to post a new room vacancy!"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedType('All');
            }}
            icon={Users}
          />
        </motion.div>
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
            {filteredPosts.map((post) => {
              const isOwner = user?._id === post.author?._id;
              const hasInterested = post.interestedUsers?.includes(user?._id);

              return (
                <motion.div
                  key={post._id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-6 flex flex-col justify-between space-y-5 border-border/50 shadow-sm h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 group bg-card/60 backdrop-blur-sm">
                    <div className="space-y-4">
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
                            {post.roomType || 'Shared Room'}
                          </Badge>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] font-bold">
                            {post.vacancy} Vacancy
                          </Badge>
                        </div>
                        
                        {!isOwner && (
                          <button
                            onClick={() => setReportTarget({ type: 'RoommatePost', id: post._id })}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Report this listing"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Title & Location */}
                      <div>
                        <h3 className="text-lg font-extrabold text-foreground font-heading line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 font-medium">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span className="truncate">{post.location}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                        {post.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="outline" className="bg-background text-muted-foreground border-border/50">
                          Gender: {post.genderPreference || 'Any'}
                        </Badge>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {post.status || 'Available'}
                        </Badge>
                      </div>
                    </div>

                    {/* Bottom Action & Price */}
                    <div className="pt-5 border-t border-border/50 flex flex-col gap-4 mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                            Rent Share
                          </span>
                          <div className="text-2xl font-black text-foreground font-heading">
                            ₹{post.rentShare?.toLocaleString()}{' '}
                            <span className="text-xs font-bold text-muted-foreground">/ mo</span>
                          </div>
                        </div>

                        {!isOwner && post.status === 'Available' && (
                          <Button
                            variant={hasInterested ? 'outline' : 'default'}
                            className={cn("rounded-full px-5 text-xs font-bold shadow-sm transition-all", 
                              hasInterested && "bg-background text-muted-foreground border-border")}
                            onClick={() => toggleInterest(post._id, post.author?._id)}
                          >
                            <Heart className={cn("w-3.5 h-3.5 mr-2", hasInterested && "fill-current text-destructive")} />
                            {hasInterested ? 'Requested' : 'Show Interest'}
                          </Button>
                        )}

                        {isOwner && post.status === 'Available' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-success/10 text-success border border-success/20 hover:bg-success/20 rounded-full px-4 font-bold"
                            onClick={() => handleMarkFilled(post._id)}
                          >
                            Mark as Filled
                          </Button>
                        )}
                      </div>

                      {/* Student Identity Verification Stamp */}
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground font-bold">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                          <User className="w-3 h-3 text-secondary" />
                        </div>
                        <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
                        <span className="truncate">Posted by {post.author?.name || 'Verified Student'}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Modals ── */}
      {isCreateModalOpen && (
        <CreateHousingModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      <InterestRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
      />

      <ReportModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetId={reportTarget?.id}
        targetType={reportTarget?.type}
      />
    </div>
  );
}
