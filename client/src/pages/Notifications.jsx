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
    } else if (notif.type === 'INTEREST_RECEIVED') {
      navigate('/messages?openRequests=true');
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
        return <MessageSquare className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">
              <Bell className="w-3.5 h-3.5 text-orange-500" />
              <span>Real-Time Activity Alerts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-heading tracking-tight">
              Student <span className="text-gradient-primary">Notifications</span>
            </h1>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCheck}
              onClick={handleMarkAllRead}
              className="!rounded-xl !text-xs !py-2 !px-3.5 shadow-xs"
            >
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="sn-card p-2 flex items-center justify-between gap-4 bg-[var(--bg-card)]/90 backdrop-blur-xl border-[var(--border-light)]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)]'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)]'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="text-xs text-[var(--text-muted)] font-medium hidden sm:block pr-3">
          Click any alert to jump directly to the listing or chat.
        </div>
      </div>

      {/* ── Feed List ── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-16 text-center text-xs text-[var(--text-muted)] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span>Retrieving live notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="sn-card p-12 text-center space-y-3 bg-[var(--bg-card)]">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center border border-orange-500/20 shadow-xs">
              <Bell className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-black text-[var(--text-main)] font-heading">
                {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                When students express interest in your items or send you direct chat requests, live notifications will appear here.
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`sn-card p-5 flex items-start gap-4 cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-md relative overflow-hidden ${
                !notif.isRead
                  ? 'border-l-4 border-l-orange-500 bg-orange-500/[0.04]'
                  : 'border-[var(--border-light)]'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-light)] shadow-2xs shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-heading ${
                      !notif.isRead ? 'font-black text-[var(--text-main)]' : 'font-bold text-[var(--text-main)] opacity-85'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0">
                    {new Date(notif.createdAt).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1 font-medium">
                  {notif.message}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                    <span>View Details</span>
                    <span>&rarr;</span>
                  </span>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => handleMarkSingleRead(e, notif._id)}
                      className="text-[var(--text-muted)] hover:text-emerald-500 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
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
