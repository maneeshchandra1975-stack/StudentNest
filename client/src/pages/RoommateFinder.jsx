import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Search,
  Plus,
  Inbox,
  ShieldCheck,
  Flag,
  Sparkles,
  Building2,
  CheckCircle2,
  Heart,
  User,
  Filter,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import ReportModal from '../components/ui/ReportModal';
import CreateHousingModal from '../components/modals/CreateHousingModal';
import { fetchRoommatePosts, toggleRoommateInterest, updateRoommateStatus } from '../redux/slices/roommateSlice';
import { toast } from 'sonner';

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
    <div className="space-y-8 py-2">
      {/* ── Aurora Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] p-6 sm:p-10 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Campus Flatmate Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] font-heading tracking-tight">
              Smart Roommate <span className="text-gradient-primary">Finder</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
              Discover verified VIT-AP flatmates, post vacancy requirements, and secure housing directly with zero middleman broker fees.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              className="flex-1 sm:flex-none !rounded-xl !py-2.5 !px-4"
              onClick={() => setIsRequestsModalOpen(true)}
            >
              <Inbox className="w-4 h-4 mr-2 text-indigo-500" />
              <span>Incoming Requests</span>
            </Button>
            <Button
              variant="primary"
              className="flex-1 sm:flex-none !rounded-xl !py-2.5 !px-4 shadow-lg shadow-indigo-500/20"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Post Vacancy</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Floating Controls ── */}
      <div className="sn-card p-4 space-y-4 bg-[var(--bg-card)]/90 backdrop-blur-xl border-[var(--border-light)]">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by area, PG name, apartment, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sn-input pl-10 pr-4 py-2.5 w-full text-xs"
            />
          </div>

          {/* Room Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {ROOM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] border border-transparent hover:border-[var(--border-light)]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Roommate Listings Bento Grid ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[var(--text-muted)] space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold">Loading roommate vacancies...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No roommate vacancies found"
          description="Try modifying your search keywords or be the first to post a new room vacancy!"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedType('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const isOwner = user?._id === post.author?._id;
            const hasInterested = post.interestedUsers?.includes(user?._id);

            return (
              <div
                key={post._id}
                className="sn-card sn-card-hover p-6 flex flex-col justify-between space-y-5 group relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Top Bar: Room Type & Vacancy Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-black border border-indigo-500/20 uppercase tracking-wider">
                        {post.roomType || 'Shared Room'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                        {post.vacancy} Vacancy
                      </span>
                    </div>

                    {!isOwner && (
                      <button
                        onClick={() => setReportTarget({ type: 'RoommatePost', id: post._id })}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Report this listing"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="text-lg font-black text-[var(--text-main)] font-heading leading-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{post.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3 font-normal">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-light)]">
                      Gender: {post.genderPreference || 'Any'}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {post.status || 'Available'}
                    </span>
                  </div>
                </div>

                {/* Bottom Action & Price */}
                <div className="space-y-3 pt-4 border-t border-[var(--border-light)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider block">
                        Rent Share
                      </span>
                      <div className="text-xl font-black text-indigo-600 dark:text-cyan-400 font-heading">
                        ₹{post.rentShare?.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-[var(--text-muted)]">/ mo</span>
                      </div>
                    </div>

                    {!isOwner && post.status === 'Available' && (
                      <button
                        onClick={() => toggleInterest(post._id, post.author?._id)}
                        className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          hasInterested
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                            : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasInterested ? 'fill-current text-rose-500' : ''}`} />
                        <span>{hasInterested ? 'Requested' : 'Show Interest'}</span>
                      </button>
                    )}

                    {isOwner && post.status === 'Available' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="!text-emerald-600 !bg-emerald-500/10 !border-emerald-500/20 hover:!bg-emerald-500/20 !rounded-xl"
                        onClick={() => handleMarkFilled(post._id)}
                      >
                        Mark as Filled
                      </Button>
                    )}
                  </div>

                  {/* Student Identity Verification Stamp */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-medium pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Posted by {post.author?.name || 'Verified Student'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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

