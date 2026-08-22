import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, CheckCheck, MessageSquare, Heart, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsReadApi,
  markAllAsReadApi,
  addRealtimeNotification,
} from '../../redux/slices/notificationSlice';
import { getSocket } from '../../services/socket';
import { toast } from 'sonner';

export default function NotificationDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { notifications, unreadCount, isLoading } = useSelector((state) => state.notifications);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 1. Fetch notifications & unread count on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, isAuthenticated]);

  // 2. Attach Socket.IO real-time notification listener
  useEffect(() => {
    const socket = getSocket();
    if (socket && isAuthenticated) {
      socket.on('new_notification', (newNotif) => {
        console.log('[SOCKET REAL-TIME NOTIFICATION RECEIVED]', newNotif);
        dispatch(addRealtimeNotification(newNotif));

        // Toast feedback popup
        toast(newNotif.title, {
          description: newNotif.message,
          icon: <Sparkles className="w-4 h-4 text-[#2563EB]" />,
        });
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [dispatch, isAuthenticated]);

  // 3. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    setIsOpen(false);
    if (!notif.isRead) {
      dispatch(markAsReadApi(notif._id));
    }

    // Actionable Navigation logic
    if (notif.type === 'INTEREST_ACCEPTED' || notif.type === 'NEW_MESSAGE') {
      navigate(`/messages?conversationId=${notif.relatedEntityId}`);
    } else if (notif.type === 'INTEREST_RECEIVED' || notif.type === 'INTEREST_REJECTED' || notif.type === 'INTEREST_CANCELLED') {
      navigate('/housing');
    } else {
      navigate('/notifications');
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    dispatch(markAllAsReadApi());
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'INTEREST_RECEIVED':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'INTEREST_ACCEPTED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'INTEREST_REJECTED':
      case 'INTEREST_CANCELLED':
        return <XCircle className="w-4 h-4 text-amber-500" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-4 h-4 text-[#2563EB]" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-[#2563EB] rounded-full ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#111827] font-heading">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* List Feed */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <Bell className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-500">No notifications yet</p>
                <p className="text-[11px] text-slate-400">Updates on interest requests &amp; chats appear here.</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                    !notif.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs ${!notif.isRead ? 'font-bold text-[#111827]' : 'font-medium text-slate-700'} truncate`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-2.5 border-t border-[#E2E8F0] bg-slate-50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
