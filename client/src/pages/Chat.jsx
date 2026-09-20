import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Star,
  CheckCircle2,
  Flag,
} from 'lucide-react';

import Button from '../components/ui/Button';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
import ReviewModal from '../components/ui/ReviewModal';
import ReportModal from '../components/ui/ReportModal';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
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
import { cn } from '../utils/cn';

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
  const [reviewTarget, setReviewTarget] = useState(null); 
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // 1. Initialize Socket Connection & Fetch Conversations
  useEffect(() => {
    dispatch(fetchConversations());

    if (accessToken) {
      initSocket(accessToken);
    }

    const handleTokenRefresh = (e) => {
      initSocket(e.detail);
      if (activeConversation) {
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
            dispatch(sendMessageApi({ conversationId: activeConversation._id, text: textToSend }));
          }
        }
      );
    } else {
      dispatch(sendMessageApi({ conversationId: activeConversation._id, text: textToSend }));
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const partner = getPartner(conv);
    return partner.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const partner = getPartner(activeConversation);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-4 min-h-[calc(100vh-4rem)] flex flex-col">
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
      
      {activeConversation && partner && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          targetType="User"
          targetId={partner._id}
        />
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1 bg-primary/10 px-2 py-0.5 rounded-full">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Controlled Real-Time Chat</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-heading">
            Student Messages
          </h1>
        </div>

        <Button
          variant="outline"
          size="default"
          className="rounded-full shadow-sm border-border bg-background"
          onClick={() => setRequestsModalOpen(true)}
        >
          <Inbox className="w-4 h-4 mr-2" />
          Manage Interest Requests
        </Button>
      </motion.div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm font-semibold mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Chat UI */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
        className="flex-1 min-h-[600px] h-[calc(100vh-14rem)] bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row"
      >
        {/* Left Column: Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border/60 flex flex-col bg-muted/30">
          <div className="p-4 border-b border-border/60">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="pl-11 rounded-xl bg-background/50 border-border/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
            {isLoadingConversations ? (
              <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center gap-3 mt-10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-muted-foreground opacity-50" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">No active chats</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
                    Chat unlocks automatically when an interest request is accepted.
                  </p>
                </div>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?._id === conv._id;
                const convPartner = getPartner(conv);

                return (
                  <button
                    key={conv._id}
                    onClick={() => dispatch(setActiveConversation(conv))}
                    className={cn(
                      "w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all duration-200 group border border-transparent",
                      isActive 
                        ? "bg-background shadow-sm border-border/60 ring-1 ring-primary/20" 
                        : "hover:bg-muted/60"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-12 h-12 shadow-sm border border-border/50">
                        <AvatarFallback className={cn("text-sm font-bold", isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                          {convPartner.name ? convPartner.name.charAt(0).toUpperCase() : 'S'}
                        </AvatarFallback>
                      </Avatar>
                      {isActive && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-sm font-bold text-foreground font-heading truncate">
                          {convPartner.name}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {conv.lastMessageAt
                            ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>
                      <div className="text-[11px] text-primary truncate font-bold uppercase tracking-wider mb-0.5">
                        {getListingTitle(conv)}
                      </div>
                      <p className="text-xs text-muted-foreground truncate group-hover:text-foreground/80 transition-colors">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Thread */}
        <div className="flex-1 flex flex-col h-full bg-background relative">
          {!activeConversation || error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/10">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-foreground font-heading mb-2">
                Verified Campus Chat
              </h4>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
                Direct student-to-student messaging opens securely as soon as an interest request is accepted by the listing owner.
              </p>

              <Button
                variant="default"
                size="lg"
                className="rounded-full shadow-sm"
                onClick={() => setRequestsModalOpen(true)}
              >
                <Inbox className="w-4 h-4 mr-2" />
                View Pending Requests
              </Button>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 border-b border-border/60 flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 shadow-sm border border-border/50 hidden sm:block">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {partner.name ? partner.name.charAt(0).toUpperCase() : 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 font-heading">
                      {partner.name}
                      <ShieldCheck className="w-4 h-4 text-success" />
                    </h3>
                    <div className="text-[11px] text-muted-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
                      {getListingTitle(activeConversation)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 rounded-full bg-background"
                    onClick={() => toast.info(`Contact: ${partner.email || 'Available in profile'}`)}
                    title="Contact Details"
                  >
                    <Phone className="w-4 h-4 sm:mr-1.5 text-muted-foreground" />
                    <span className="hidden sm:inline text-xs font-semibold">Contact</span>
                  </Button>

                  {/* Mark as Sold Button (Seller Only) */}
                  {activeConversation?.interestRequest && activeConversation.interestRequest.recipient === currentUser?._id && activeConversation.interestRequest.status === 'Accepted' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 rounded-full bg-success hover:bg-success/90 text-success-foreground px-3 shadow-sm text-xs font-bold"
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
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Mark Sold
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 rounded-full border-warning/30 text-warning-foreground bg-warning/10 hover:bg-warning/20 px-3 text-xs font-bold"
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
                    <Star className="w-3.5 h-3.5 sm:mr-1.5 fill-warning text-warning" />
                    <span className="hidden sm:inline">Rate</span>
                  </Button>
                  
                  <button
                    className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
                    title="Report User"
                    onClick={() => setReportModalOpen(true)}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-muted/10">
                {isLoadingMessages ? (
                  <div className="h-full flex flex-col items-center justify-center text-sm text-muted-foreground gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Decrypting chat history...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-foreground">Secure Connection Established</p>
                    <p className="text-xs text-muted-foreground max-w-[250px] text-center leading-relaxed">Say hello and arrange a time to inspect the item or visit the room.</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;
                    const isLastMessage = idx === messages.length - 1;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg._id}
                        className={cn("flex flex-col", isMe ? 'items-end' : 'items-start')}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] md:max-w-md px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                              : 'bg-card text-foreground border border-border/50 rounded-2xl rounded-bl-sm'
                          )}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1.5 px-1 font-semibold">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </motion.div>
                    );
                  })
                )}
                {typingUser && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground italic px-2 font-medium">
                    {typingUser} is typing...
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Message Input Floating Bar */}
              <div className="p-4 bg-background border-t border-border/60 shrink-0">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2 bg-card border border-border/60 p-1.5 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-sm text-foreground placeholder:text-muted-foreground"
                  />
                  <Button 
                    type="submit" 
                    variant="default" 
                    size="icon" 
                    disabled={isSending || !input.trim()} 
                    className="w-10 h-10 rounded-full shrink-0 shadow-sm disabled:opacity-50"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
