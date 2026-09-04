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
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import ReportModal from '../components/ui/ReportModal';
import CreateHousingModal from '../components/modals/CreateHousingModal';
import { fetchRoommatePosts, toggleRoommateInterest, updateRoommateStatus } from '../redux/slices/roommateSlice';
import { toast } from 'sonner';

export default function RoommateFinder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading } = useSelector((state) => state.roommate);

  const [searchQuery, setSearchQuery] = useState('');
  
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
      toast.success('Interest sent successfully');
      dispatch(fetchRoommatePosts({ search: searchQuery }));
    } else {
      toast.error(res.payload || 'Failed to send request');
    }
  };

  const handleMarkFilled = async (postId) => {
    if (window.confirm("Are you sure you want to mark this vacancy as Filled? This cannot be undone here.")) {
      const res = await dispatch(updateRoommateStatus({ id: postId, status: 'Filled' }));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Vacancy marked as Filled');
      } else {
        toast.error(res.payload || 'Failed to update status');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] font-heading">Roommate Finder</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Post vacancies and find fellow students to share your living space.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none"
            onClick={() => setIsRequestsModalOpen(true)}
          >
            <Inbox className="w-4 h-4 mr-2" />
            Requests
          </Button>
          <Button
            variant="primary"
            className="flex-1 sm:flex-none"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Vacancy
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by location or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-body)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[var(--text-main)] outline-none transition-all"
          />
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20 text-[var(--text-muted)]">Loading posts...</div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No roommates found"
            description="Be the first to post a vacancy or roommate requirement!"
            actionLabel="Clear Search"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const isOwner = user?._id === post.author?._id;
              const hasInterested = post.interestedUsers?.includes(user?._id);

              return (
                <Card key={post._id} hover className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">{post.roomType}</span>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">{post.vacancy} Vacancy</span>
                      </div>
                      {!isOwner && (
                        <button
                          onClick={() => setReportTarget({ type: 'RoommatePost', id: post._id })}
                          className="p-1.5 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          title="Report this post"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[var(--text-main)] font-heading leading-tight">{post.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {post.location}
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-3 line-clamp-3">
                      {post.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">Gender: {post.genderPreference}</span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">Status: {post.status}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-light)] flex justify-between items-center">
                    <div>
                      <div className="text-sm text-[var(--text-muted)]">Rent Share</div>
                      <div className="text-lg font-bold text-[#2563EB]">₹{post.rentShare.toLocaleString()} <span className="text-xs font-normal text-[var(--text-muted)]">/ mo</span></div>
                    </div>
                    
                    {!isOwner && post.status === 'Available' && (
                      <Button
                        variant={hasInterested ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => toggleInterest(post._id, post.author._id)}
                      >
                        {hasInterested ? 'Interest Sent' : 'Show Interest'}
                      </Button>
                    )}

                    {isOwner && post.status === 'Available' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="!text-emerald-700 !bg-emerald-50 hover:!bg-emerald-100 border-emerald-200"
                        onClick={() => handleMarkFilled(post._id)}
                      >
                        Mark as Filled
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <div className="text-[10px] text-[var(--text-muted)]">Posted by {post.author?.name || 'Student'}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
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
