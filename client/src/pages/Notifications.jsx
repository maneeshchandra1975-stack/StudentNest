import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Heart,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  Loader2,
  Filter,
  Check,
} from 'lucide-react';
import Button from '../components/ui/Button';
import {
  fetchNotifications,
  markAsReadApi,
  markAllAsReadApi,
} from '../redux/slices/notificationSlice';
import { toast } from 'sonner';

export default function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const { notifications, unreadCount, isLoading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markAsReadApi(notif._id));
    }

    if (notif.type === 'INTEREST_ACCEPTED' || notif.type === 'NEW_MESSAGE') {
      navigate(`/messages?conversationId=${notif.relatedEntityId}`);
    } else {
      navigate('/housing');
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsReadApi());
    toast.success('All notifications marked as read');
  };

  const handleMarkSingleRead = (e, id) => {
    e.stopPropagation();
    dispatch(markAsReadApi(id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'INTEREST_RECEIVED':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'INTEREST_ACCEPTED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'INTEREST_REJECTED':
      case 'INTEREST_CANCELLED':
        return <XCircle className="w-5 h-5 text-amber-500" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-[#2563EB]" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-1">
            <Bell className="w-4 h-4" />
            <span>Activity &amp; Real-Time Alerts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#111827] font-heading">
            Student Notifications
          </h1>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllRead}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 bg-white p-1.5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'unread'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block pr-3">
          Click any notification to navigate directly to the listing or chat.
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="sn-card p-12 text-center space-y-3 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-[#111827]">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-xs text-slate-500">
                When students express interest in your posts or send you messages, alerts will appear here.
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`sn-card p-4 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md ${
                !notif.isRead
                  ? 'bg-blue-50/40 border-l-4 border-l-[#2563EB] border-[#E2E8F0]'
                  : 'bg-white border-[#E2E8F0]'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm ${
                      !notif.isRead ? 'font-extrabold text-[#111827]' : 'font-bold text-slate-800'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(notif.createdAt).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-1">{notif.message}</p>

                <div className="mt-2.5 flex items-center gap-3 text-[11px]">
                  <span className="font-semibold text-[#2563EB] hover:underline">
                    View Action →
                  </span>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => handleMarkSingleRead(e, notif._id)}
                      className="text-slate-400 hover:text-emerald-600 font-medium flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark as read</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
