import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, XCircle, ShieldCheck, MessageSquare, Loader2 } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import ReviewModal from './ReviewModal';
import { toast } from 'sonner';
import api from '../../services/api';

export default function InterestRequestsModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequestForReview, setSelectedRequestForReview] = useState(null);

  const fetchRequests = async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const [resReceived, resSent] = await Promise.all([
        api.get('/interests/received'),
        api.get('/interests/sent'),
      ]);
      setReceivedRequests(resReceived.data.data || []);
      setSentRequests(resSent.data.data || []);
    } catch (err) {
      console.error('Failed to load interest requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRespond = async (id, action) => {
    try {
      const res = await api.patch(`/interests/${id}/respond`, { action });
      toast.success(`Request ${action.toLowerCase()} successfully`);

      setReceivedRequests(
        receivedRequests.map((req) => (req._id === id ? { ...req, status: action } : req))
      );

      if (action === 'Accepted' && res.data.data?.conversationId) {
        onClose();
        navigate(`/messages?conversationId=${res.data.data.conversationId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request');
    }
  };

  const handleCancelSent = async (id) => {
    try {
      await api.delete(`/interests/${id}/cancel`);
      setSentRequests(sentRequests.filter((req) => req._id !== id));
      toast.info('Interest request cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  const getItemTitle = (req) => {
    if (req.marketplaceItem) return req.marketplaceItem.title;
    if (req.roommatePost) return req.roommatePost.title;
    return 'Listing';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-foreground font-heading">
              Interest Requests <span className="text-primary">Manager</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Accept requests to reserve items or confirm roommates, and unlock direct peer chat.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 border-b border-border bg-muted/30 flex gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-2.5 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'received'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Received Requests ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2.5 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'sent'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Sent Requests ({sentRequests.length})
          </button>
        </div>

        {/* Content Feed */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-background/50">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading interest requests...</span>
            </div>
          ) : activeTab === 'received' ? (
            receivedRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No received interest requests yet.
              </div>
            ) : (
              receivedRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                          {req.listingType}
                        </span>
                        <Badge
                          variant={
                            req.status === 'Accepted'
                              ? 'active'
                              : req.status === 'Rejected'
                              ? 'overdue'
                              : 'pending'
                          }
                          label={req.status}
                        />
                      </div>
                      <h4 className="text-xs font-bold text-foreground">{getItemTitle(req)}</h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {req.sender?.name ? req.sender.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1">
                          <span>{req.sender?.name || 'Student'}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-success" />
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">{req.sender?.email}</div>
                      </div>
                    </div>

                    {req.status === 'Accepted' && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={MessageSquare}
                          onClick={() => {
                            onClose();
                            navigate(`/messages?interestId=${req._id}`);
                          }}
                        >
                          Chat
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="border-success/20 text-success hover:bg-success/10"
                          onClick={async () => {
                            try {
                              await api.patch(`/interests/${req._id}/complete`);
                              toast.success('Interaction completed! The buyer can now review you.');
                              fetchRequests();
                            } catch (e) {
                              toast.error('Failed to complete interaction');
                            }
                          }}
                        >
                          Mark Completed
                        </Button>
                      </div>
                    )}
                    
                    {req.status === 'Completed' && (
                      <Badge variant="active" label="Completed & Sold" />
                    )}
                  </div>

                  {req.status === 'Pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        icon={CheckCircle2}
                        onClick={() => handleRespond(req._id, 'Accepted')}
                      >
                        Accept &amp; Unlock Chat
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        icon={XCircle}
                        onClick={() => handleRespond(req._id, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )
          ) : sentRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No sent interest requests yet.
            </div>
          ) : (
            sentRequests.map((req) => (
              <div
                key={req._id}
                className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                      {req.listingType}
                    </span>
                    <h4 className="text-xs font-bold text-foreground mt-1">{getItemTitle(req)}</h4>
                    <div className="text-xs text-muted-foreground">
                      Listing Owner: <span className="font-bold text-foreground">{req.recipient?.name}</span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      req.status === 'Accepted'
                        ? 'active'
                        : req.status === 'Rejected'
                        ? 'overdue'
                        : 'pending'
                    }
                    label={req.status}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border text-xs">
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                  {req.status === 'Accepted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={MessageSquare}
                      onClick={() => {
                        onClose();
                        navigate(`/messages?interestId=${req._id}`);
                      }}
                    >
                      Chat with Owner
                    </Button>
                  )}
                  {req.status === 'Completed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => {
                         setSelectedRequestForReview(req);
                         setReviewModalOpen(true);
                      }}
                    >
                      Leave a Review
                    </Button>
                  )}
                  {req.status === 'Pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleCancelSent(req._id)}
                    >
                      Cancel Interest
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Review Modal Portal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedRequestForReview(null);
        }}
        interestRequestId={selectedRequestForReview?._id}
        revieweeName={selectedRequestForReview?.recipient?.name}
        onReviewSuccess={fetchRequests}
      />
    </div>
  );
}
