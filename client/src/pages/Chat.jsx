import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import Button from '../components/ui/Button';
import InterestRequestsModal from '../components/ui/InterestRequestsModal';
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

export default function Chat() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const interestIdParam = searchParams.get('interestId');
  const conversationIdParam = searchParams.get('conversationId');

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

  const messagesEndRef = useRef(null);

  // 1. Initialize Socket Connection & Fetch Conversations
  useEffect(() => {
    dispatch(fetchConversations());

    if (accessToken) {
      initSocket(accessToken);
    }
  }, [dispatch, accessToken]);

  // 2. Handle URL parameters for direct conversation navigation
  useEffect(() => {
    if (interestIdParam) {
      dispatch(fetchOrCreateByInterest(interestIdParam));
    } else if (conversationIdParam) {
      dispatch(fetchConversationById(conversationIdParam));
    }
  }, [interestIdParam, conversationIdParam, dispatch]);

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
        if (newMsg.conversation === activeConversation._id) {
          dispatch(addMessage(newMsg));
        }
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Controlled Real-Time Chat</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#111827] font-heading">
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
      <div className="sn-card h-[600px] grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
        {/* Left Column: Conversation List */}
        <div className="md:col-span-4 border-r border-[#E2E8F0] flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-[#E2E8F0]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="sn-input pl-9 pr-3 py-1.5 w-full text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoadingConversations ? (
              <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No active accepted chats</p>
                <p className="text-[11px] text-slate-400">
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
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isActive ? 'bg-blue-50/70 border-l-4 border-[#2563EB]' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs shrink-0">
                      {convPartner.name ? convPartner.name.charAt(0).toUpperCase() : 'S'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#111827] truncate">
                          {convPartner.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {conv.lastMessageAt
                            ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#2563EB] truncate font-medium">
                        {getListingTitle(conv)}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
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
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {!activeConversation || error ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50">
              <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-base font-bold text-[#111827] font-heading">
                  Chat Access Protected
                </h4>
                <p className="text-xs text-[#64748B]">
                  Direct messaging is locked until the seller or post owner accepts your interest request.
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
              <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs">
                    {partner.name ? partner.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#111827] flex items-center gap-1">
                      <span>{partner.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </h3>
                    <div className="text-[10px] text-[#64748B] font-medium">
                      {getListingTitle(activeConversation)}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Phone}
                  onClick={() => toast.info(`Contact phone: ${partner.phone || 'Available in profile'}`)}
                >
                  Contact Info
                </Button>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                {isLoadingMessages ? (
                  <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                    <span>Loading conversation history...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center space-y-1">
                    <p className="text-xs text-slate-500 font-medium">This is the start of your conversation.</p>
                    <p className="text-[11px] text-slate-400">Say hello to coordinate details!</p>
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
                          className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#2563EB] text-white rounded-br-none shadow-2xs'
                              : 'bg-white text-[#111827] border border-[#E2E8F0] rounded-bl-none shadow-2xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                {typingUser && (
                  <div className="text-[11px] text-slate-400 italic px-2">
                    {typingUser} is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-[#E2E8F0] bg-white flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="sn-input flex-1 px-4 py-2 text-xs"
                />
                <Button type="submit" variant="primary" size="sm" icon={Send} disabled={isSending}>
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
