import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Heart,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import {
  fetchNotifications,
  markAsReadApi,
  markAllAsReadApi,
} from '../redux/slices/notificationSlice';
import { toast } from 'sonner';
import { cn } from '../utils/cn';

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
        return <Heart className="w-5 h-5 text-destructive" />;
      case 'INTEREST_ACCEPTED':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'INTEREST_REJECTED':
      case 'INTEREST_CANCELLED':
        return <XCircle className="w-5 h-5 text-warning" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto px-4">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-8 backdrop-blur-xl shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase shadow-sm">
              <Bell className="w-3.5 h-3.5" />
              <span>Real-Time Activity Alerts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-heading tracking-tight">
              Student <span className="text-primary">Notifications</span>
            </h1>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="rounded-xl font-bold text-xs py-2 shadow-sm border-border/50 bg-background hover:bg-muted"
            >
              <CheckCheck className="w-4 h-4 mr-2 text-primary" />
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>
      </motion.div>

      {/* ── Filter Tabs ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              filter === 'all'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              filter === 'unread'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-medium hidden sm:block pr-3">
          Click any alert to jump directly to the listing or chat.
        </div>
      </motion.div>

      {/* ── Feed List ── */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-5 flex items-start gap-4 border-border/50">
                <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/4 mt-4" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-16 text-center space-y-4 bg-card/40 border-border/50 border-dashed rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 text-muted-foreground mx-auto flex items-center justify-center border border-border/50 shadow-sm">
                <Bell className="w-8 h-8 opacity-50" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-foreground font-heading">
                  {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  When students express interest in your items or send you direct chat requests, live notifications will appear here.
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
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
              {filteredNotifications.map((notif) => (
                <motion.div
                  key={notif._id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={cn(
                      "p-5 flex items-start gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md group relative overflow-hidden",
                      !notif.isRead
                        ? "border-l-4 border-l-primary bg-primary/[0.03] border-border/50"
                        : "border-border/50 bg-card/50"
                    )}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="p-3 rounded-2xl bg-background border border-border/60 shadow-sm shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-3">
                        <h4
                          className={cn(
                            "text-base font-heading truncate",
                            !notif.isRead ? "font-extrabold text-foreground" : "font-bold text-foreground/80"
                          )}
                        >
                          {notif.title}
                        </h4>
                        <span className="text-[11px] font-mono font-medium text-muted-foreground shrink-0">
                          {new Date(notif.createdAt).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 font-medium pr-4">
                        {notif.message}
                      </p>

                      <div className="mt-4 flex items-center gap-5 text-xs font-bold">
                        <span className="text-primary group-hover:underline flex items-center gap-1 transition-colors">
                          <span>View Details</span>
                          <span>&rarr;</span>
                        </span>
                        {!notif.isRead && (
                          <button
                            onClick={(e) => handleMarkSingleRead(e, notif._id)}
                            className="text-muted-foreground hover:text-success flex items-center gap-1.5 cursor-pointer transition-colors px-2 py-1 -ml-2 rounded-md hover:bg-success/10"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark as read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
