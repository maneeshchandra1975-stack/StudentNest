import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Send,
  Lock,
  ShieldCheck,
  Phone,
  Inbox,
  AlertCircle,
  Loader2,
  User,
  Star,
  CheckCircle2,
  Flag,
} from 'lucide-react';
import Button from '../components/ui/Button';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import ReviewModal from '../components/ui/ReviewModal';
import ReportModal from '../components/ui/ReportModal';
import { toast } from 'sonner';
import {
  fetchConversations,
  fetchConversationById,
  fetchMessages,
  sendMessageApi,
  fetchOrCreateByInterest,
  setActiveConversation,
  addMessage,
} from '../redux/slices/chatSlice';
import { initSocket, getSocket } from '../services/socket';
import api from '../services/api';

export default function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const interestIdParam = searchParams.get('interestId');
  const conversationIdParam = searchParams.get('conversationId');
  const openRequestsParam = searchParams.get('openRequests');

  const { user: currentUser, accessToken } = useSelector((state) => state.auth);
  const {
    conversations,
    activeConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    error,
  } = useSelector((state) => state.chat);

  const [input, setInput] = useState('');
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // { interestRequestId, partnerName }
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // 1. Initialize Socket Connection & Fetch Conversations
  useEffect(() => {
    dispatch(fetchConversations());

    if (accessToken) {
      initSocket(accessToken);
    }

    const handleTokenRefresh = (e) => {
      console.log('[CHAT] Token refreshed, re-initializing socket...');
      initSocket(e.detail);
      if (activeConversation) {
        // Re-join the conversation room if we were in one
        const socket = getSocket();
        if (socket) {
          socket.emit('join_conversation', { conversationId: activeConversation._id });
        }
      }
    };

    window.addEventListener('token_refreshed', handleTokenRefresh);
    return () => window.removeEventListener('token_refreshed', handleTokenRefresh);
  }, [dispatch, accessToken, activeConversation]);

  // 2. Handle URL parameters for direct conversation navigation and opening requests
  useEffect(() => {
    if (interestIdParam) {
      dispatch(fetchOrCreateByInterest(interestIdParam));
    } else if (conversationIdParam) {
      dispatch(fetchConversationById(conversationIdParam));
    }
    
    if (openRequestsParam === 'true') {
      setRequestsModalOpen(true);
      // Clean up the URL to prevent reopening on refresh
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('openRequests');
      navigate(`/messages?${newParams.toString()}`, { replace: true });
    }
  }, [interestIdParam, conversationIdParam, openRequestsParam, dispatch, navigate, searchParams]);

  // 3. When activeConversation changes, join room and fetch messages
  useEffect(() => {
    if (!activeConversation) return;

    dispatch(fetchMessages(activeConversation._id));

    const socket = getSocket();
    if (socket) {
      socket.emit('join_conversation', { conversationId: activeConversation._id }, (res) => {
        if (res && !res.success) {
          toast.error(res.message || 'Could not join chat room');
        }
      });

      socket.on('receive_message', (newMsg) => {
        // Reducer will automatically handle updating the sidebar and/or active chat feed
        dispatch(addMessage(newMsg));
      });

      socket.on('user_typing', ({ name, isTyping }) => {
        if (isTyping) {
          setTypingUser(name);
        } else {
          setTypingUser(null);
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave_conversation', { conversationId: activeConversation._id });
        socket.off('receive_message');
        socket.off('user_typing');
      }
    };
  }, [activeConversation, dispatch]);

  // 4. Auto scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to format partner details
  const getPartner = (conv) => {
    if (!conv || !conv.participants) return { name: 'Student', email: '' };
    return (
      conv.participants.find((p) => p._id !== currentUser?._id) ||
      conv.participants[0] || { name: 'Student', email: '' }
    );
  };

  const getListingTitle = (conv) => {
    if (!conv || !conv.interestRequest) return 'Accepted Interaction';
    const req = conv.interestRequest;
    if (req.listingType === 'Marketplace' && req.marketplaceItem) {
      return `Item: ${req.marketplaceItem.title || 'Marketplace Item'}`;
    }
    if (req.listingType === 'Roommate' && req.roommatePost) {
      return `Roommate: ${req.roommatePost.title || 'Flatshare'}`;
    }
    return 'Accepted Student Request';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation) return;

    const textToSend = input.trim();
    setInput('');

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit(
        'send_message',
        { conversationId: activeConversation._id, text: textToSend },
        (res) => {
          if (!res || !res.success) {
            // Fallback to REST API if socket callback fails
            dispatch(sendMessageApi({ conversationId: activeConversation._id, text: textToSend }));
          }
        }
      );
    } else {
      // Fallback REST API
      dispatch(sendMessageApi({ conversationId: activeConversation._id, text: textToSend }));
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const partner = getPartner(conv);
    return partner.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const partner = getPartner(activeConversation);

  return (
    <div className="space-y-4 py-2">
      <InterestRequestsModal
        isOpen={requestsModalOpen}
        onClose={() => setRequestsModalOpen(false)}
      />
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        interestRequestId={reviewTarget?.interestRequestId}
        revieweeName={reviewTarget?.partnerName}
        onReviewSuccess={() => {
          toast.success('Rating submitted successfully!');
          setReviewModalOpen(false);
        }}
      />
      
      {/* Report Modal */}
      {activeConversation && partner && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          targetType="User"
          targetId={partner._id}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Controlled Real-Time Chat</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text-main)] font-heading">
            Student Messages &amp; Direct Chat
          </h1>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Inbox}
          onClick={() => setRequestsModalOpen(true)}
        >
          Manage Interest Requests
        </Button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Chat Box */}
      <div className="sn-card h-[640px] grid grid-cols-1 md:grid-cols-12 overflow-hidden border-[var(--border-light)] shadow-xl">
        {/* Left Column: Conversation List */}
        <div className="md:col-span-4 border-r border-[var(--border-light)] flex flex-col bg-[var(--bg-card-subtle)]/50 backdrop-blur-md">
          <div className="p-3.5 border-b border-[var(--border-light)]">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search active conversations..."
                className="sn-input pl-10 pr-3 py-2 w-full text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-light)]/60">
            {isLoadingConversations ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Inbox className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                <p className="text-xs text-[var(--text-muted)] font-semibold">No active accepted chats</p>
                <p className="text-[11px] text-[var(--text-muted)] opacity-80">
                  Chat unlocks automatically when an interest request is accepted.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?._id === conv._id;
                const convPartner = getPartner(conv);

                return (
                  <div
                    key={conv._id}
                    onClick={() => dispatch(setActiveConversation(conv))}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all duration-150 ${
                      isActive 
                        ? 'bg-indigo-500/10 dark:bg-indigo-600/20 border-l-4 border-indigo-500' 
                        : 'hover:bg-[var(--bg-card)]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {convPartner.name ? convPartner.name.charAt(0).toUpperCase() : 'S'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[var(--text-main)] truncate">
                          {convPartner.name}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {conv.lastMessageAt
                            ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>
                      <div className="text-[11px] text-indigo-500 dark:text-indigo-400 truncate font-semibold">
                        {getListingTitle(conv)}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Thread */}
        <div className="md:col-span-8 flex flex-col h-full bg-[var(--bg-card)]">
          {!activeConversation || error ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4 bg-[var(--bg-card-subtle)]/30">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-base font-bold text-[var(--text-main)] font-heading">
                  Verified Chat Protected
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Direct student-to-student messaging opens as soon as an interest request is accepted by the owner.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Inbox}
                onClick={() => setRequestsModalOpen(true)}
              >
                View Interest Requests
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-3.5 border-b border-[var(--border-light)] flex items-center justify-between bg-[var(--bg-card)] shrink-0 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {partner.name ? partner.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span>{partner.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </h3>
                    <div className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold truncate max-w-xs">
                      {getListingTitle(activeConversation)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Phone}
                    onClick={() => toast.info(`Contact: ${partner.email || 'Available in profile'}`)}
                    className="text-xs"
                  >
                    Contact
                  </Button>

                  {/* Mark as Sold Button (Seller Only) */}
                  {activeConversation?.interestRequest && activeConversation.interestRequest.recipient === currentUser?._id && activeConversation.interestRequest.status === 'Accepted' && (
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={async () => {
                        try {
                          await api.patch(`/interests/${activeConversation.interestRequest._id}/complete`);
                          toast.success('Interaction completed! The buyer can now review you.');
                          dispatch(fetchConversations());
                        } catch (e) {
                          toast.error('Failed to complete interaction');
                        }
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1 text-white" />
                      Mark Sold
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs"
                    onClick={() => {
                      const req = activeConversation?.interestRequest;
                      if (!req) {
                        toast.error('Could not find interaction details');
                        return;
                      }
                      setReviewTarget({
                        interestRequestId: req._id,
                        partnerName: partner.name,
                      });
                      setReviewModalOpen(true);
                    }}
                  >
                    <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" />
                    Rate
                  </Button>
                  
                  <button
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Report User"
                    onClick={() => setReportModalOpen(true)}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--bg-card-subtle)]/30">
                {isLoadingMessages ? (
                  <div className="p-8 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span>Loading conversation history...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center space-y-1.5 my-auto">
                    <p className="text-xs text-[var(--text-muted)] font-bold">This is the start of your encrypted conversation.</p>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80">Say hello to coordinate item inspection or room visits!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white rounded-br-xs shadow-md shadow-indigo-500/15'
                              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-light)] rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] mt-1 px-1 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                {typingUser && (
                  <div className="text-[11px] text-[var(--text-muted)] italic px-2">
                    {typingUser} is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-[var(--border-light)] bg-[var(--bg-card)] flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="sn-input flex-1 px-4 py-2.5 text-xs sm:text-sm"
                />
                <Button type="submit" variant="primary" size="sm" icon={Send} disabled={isSending} className="shadow-md shadow-indigo-500/20">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
