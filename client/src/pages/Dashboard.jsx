import React from 'react';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  Building2,
  ShoppingBag,
  MessageSquare,
  Users,
  Compass,
  Bell,
  UserCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const dashboardCards = [
    {
      title: 'Campus Marketplace',
      subtitle: 'Buy & sell textbooks, lab kits, electronics & cycles directly.',
      badge: 'Peer-to-Peer',
      icon: ShoppingBag,
      path: '/marketplace',
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-orange-500/10 text-orange-500',
    },
    {
      title: 'Roommate Finder',
      subtitle: 'Find verified flatmates and post campus vacancies with 0% brokerage.',
      badge: 'Zero Brokerage',
      icon: Users,
      path: '/roommates',
      gradient: 'from-orange-500 to-rose-500',
      iconBg: 'bg-amber-500/10 text-amber-500',
    },
    {
      title: 'Nearby PGs & Hostels',
      subtitle: 'Live geospatial map of verified hostels and apartments near campus.',
      badge: 'Live Geoapify',
      icon: Compass,
      path: '/pgs',
      gradient: 'from-rose-500 to-orange-500',
      iconBg: 'bg-rose-500/10 text-rose-500',
    },
    {
      title: 'Direct Messages',
      subtitle: 'Secure real-time chats with verified student buyers & flatmates.',
      badge: 'Encrypted',
      icon: MessageSquare,
      path: '/messages',
      gradient: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Activity & Alerts',
      subtitle: 'Stay updated on item interests, status updates, and campus alerts.',
      badge: 'Real-time',
      icon: Bell,
      path: '/notifications',
      gradient: 'from-amber-500 to-rose-500',
      iconBg: 'bg-amber-500/10 text-amber-500',
    },
    {
      title: 'Student Identity',
      subtitle: 'Manage your verified profile, student badge, and campus credentials.',
      badge: '@vitapstudent.ac.in',
      icon: UserCheck,
      path: '/profile',
      gradient: 'from-orange-500 to-amber-500',
      iconBg: 'bg-orange-500/10 text-orange-500',
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* ── 1. Futuristic Aurora Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] p-6 sm:p-10 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-500/10 via-orange-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified VIT-AP Student Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] font-heading tracking-tight">
              {getGreeting()},{' '}
              <span className="text-gradient-primary">
                {user?.name?.split(' ')[0] || 'Student'}
              </span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-xl leading-relaxed font-medium">
              Welcome to your unified campus cockpit. Discover trusted flatmates, buy and sell second-hand gear, and navigate verified accommodations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="px-4 py-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-light)]">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Connected Account</div>
              <div className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                {user?.email || 'vitapstudent.ac.in'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Bento Quick Navigation Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className="sn-card sn-card-hover p-6 cursor-pointer flex flex-col justify-between space-y-4 group overflow-hidden relative"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-light)] text-[var(--text-muted)]">
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[var(--text-main)] font-heading group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>{card.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed font-normal">
                  {card.subtitle}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-light)] flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400">
              <span>Open Section</span>
              <span>&rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

