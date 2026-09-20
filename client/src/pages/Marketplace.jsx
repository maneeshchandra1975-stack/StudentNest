import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  BookOpen,
  Laptop,
  Bike,
  Armchair,
  ShieldCheck,
  Plus,
  Flag,
  Inbox,
  AlertTriangle,
} from 'lucide-react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import CreateListingModal from '../components/modals/CreateListingModal';
import { fetchMarketplaceItems, toggleInterest, updateMarketplaceStatus } from '../redux/slices/marketplaceSlice';
import api from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

const categories = [
  { label: 'All Items', value: 'all', icon: ShoppingBag },
  { label: 'Books & Notes', value: 'Books', icon: BookOpen },
  { label: 'Electronics', value: 'Electronics', icon: Laptop },
  { label: 'Cycles', value: 'Cycles', icon: Bike },
  { label: 'Furniture', value: 'Furniture', icon: Armchair },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { items, isLoading } = useSelector((state) => state.marketplace);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  
  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalItem, setReportModalItem] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  // Fetch items on mount and when category/search changes
  useEffect(() => {
    dispatch(fetchMarketplaceItems({ 
      search: searchQuery, 
      category: activeCategory === 'all' ? '' : activeCategory 
    }));
  }, [dispatch, activeCategory, searchQuery]);

  const handleToggleInterest = async (itemId, recipientId) => {
    const res = await dispatch(toggleInterest({ itemId, recipientId }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Interest sent successfully');
      dispatch(fetchMarketplaceItems({ 
        search: searchQuery, 
        category: activeCategory === 'all' ? '' : activeCategory 
      }));
    } else {
      toast.error(res.payload || 'Failed to send request');
    }
  };

  const handleMarkSold = async (itemId) => {
    if (window.confirm("Are you sure you want to mark this item as Sold? This cannot be undone here.")) {
      const res = await dispatch(updateMarketplaceStatus({ id: itemId, status: 'Sold' }));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Item marked as Sold');
      } else {
        toast.error(res.payload || 'Failed to update status');
      }
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason || !reportDescription) return;
    
    try {
      await api.post('/reports', {
        targetType: 'MarketplaceItem',
        targetId: reportModalItem._id,
        reason: reportReason,
        description: reportDescription
      });
      toast.success('Report submitted successfully');
      setIsReportModalOpen(false);
      setReportModalItem(null);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    }
  };

  const openReportModal = (item) => {
    setReportModalItem(item);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3 shadow-sm">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>VIT-AP Peer-to-Peer Hub</span>
          </div>
          <h1 className="text-4xl font-extrabold text-foreground font-heading tracking-tight">Campus Marketplace</h1>
          <p className="text-muted-foreground mt-2 text-lg">Direct student exchange with zero platform commissions.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none rounded-full bg-background"
            onClick={() => setIsRequestsModalOpen(true)}
          >
            <Inbox className="w-4 h-4 mr-2" />
            Inbox
          </Button>
          <Button
            variant="default"
            className="flex-1 sm:flex-none rounded-full shadow-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Sell Item
          </Button>
        </motion.div>
      </div>

      {/* ── Search & Filter Panel ──────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search textbooks, calculators, cycles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary shadow-inner"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full pb-1 scrollbar-hide items-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer select-none',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Items Grid ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <span className="text-sm font-semibold">Loading marketplace listings...</span>
        </div>
      ) : items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState
            icon={ShoppingBag}
            title="No items found"
            description="We couldn't find any items matching your search or category."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          />
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
            {items.map((item) => {
              const isOwner = user?._id === item.seller?._id;
              const hasInterested = item.interestedUsers?.includes(user?._id);

              return (
                <motion.div
                  key={item._id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="overflow-hidden flex flex-col h-full group border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      <img
                        src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Top Overlay Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant={item.status === 'Available' ? 'success' : 'secondary'} className="shadow-sm backdrop-blur-md bg-background/90 font-bold border-0">
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className="shadow-sm backdrop-blur-md bg-background/90 text-foreground border-0 font-bold uppercase tracking-wider text-[10px]">
                          {item.condition}
                        </Badge>
                      </div>

                      {/* Floating Price Badge */}
                      <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-border/50">
                        <span className="text-lg font-black text-foreground font-heading">₹{item.price.toLocaleString()}</span>
                      </div>

                      {/* Report Button */}
                      {!isOwner && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openReportModal(item); }}
                          className="absolute top-3 right-3 p-2 rounded-xl bg-background/80 backdrop-blur-md text-muted-foreground hover:text-destructive hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-border/50"
                          title="Report this item"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col bg-card">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-foreground font-heading leading-tight line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{item.category}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-5 flex-1 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Footer Actions */}
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/60">
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <Avatar className="w-8 h-8 border border-border/50 shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                              {item.seller?.name?.charAt(0) || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="truncate">
                            <div className="text-xs font-bold text-foreground truncate">
                              {item.seller?.name || 'Student'}
                            </div>
                            <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </div>
                          </div>
                        </div>
                        
                        {item.status === 'Available' ? (
                          <>
                            {!isOwner && (
                              <Button
                                variant={hasInterested ? "secondary" : "default"}
                                size="sm"
                                className={cn("rounded-full px-4 text-xs font-bold", hasInterested ? "bg-muted text-muted-foreground" : "shadow-sm")}
                                onClick={() => handleToggleInterest(item._id, item.seller._id)}
                              >
                                {hasInterested ? 'Requested' : 'I want this'}
                              </Button>
                            )}

                            {isOwner && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4 text-xs font-bold border-success text-success hover:bg-success hover:text-success-foreground"
                                onClick={() => handleMarkSold(item._id)}
                              >
                                Mark Sold
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button variant="secondary" size="sm" className="rounded-full px-4 text-xs font-bold opacity-50 cursor-not-allowed">
                            Sold Out
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateListingModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      <InterestRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
      />

      {/* Report Dialog using shadcn */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Report Listing
            </DialogTitle>
            <DialogDescription>
              Help us keep the campus marketplace safe. Your report will be reviewed by administrators.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleReportSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Reason for reporting</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a reason...</option>
                <option value="SCAM">Suspicious or Scam</option>
                <option value="INAPPROPRIATE">Inappropriate Content</option>
                <option value="SPAM">Spam</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Additional Details</label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                required
                rows={4}
                placeholder="Please provide more details about why you're reporting this item..."
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsReportModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
