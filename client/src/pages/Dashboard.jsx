import React from 'react';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  Users,
  Compass,
  Bell,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

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
    },
    {
      title: 'Roommate Finder',
      subtitle: 'Find verified flatmates and post campus vacancies with 0% brokerage.',
      badge: 'Zero Brokerage',
      icon: Users,
      path: '/roommates',
    },
    {
      title: 'Nearby PGs & Hostels',
      subtitle: 'Live geospatial map of verified hostels and apartments near campus.',
      badge: 'Live Geoapify',
      icon: Compass,
      path: '/pgs',
    },
    {
      title: 'Direct Messages',
      subtitle: 'Secure real-time chats with verified student buyers & flatmates.',
      badge: 'Encrypted',
      icon: MessageSquare,
      path: '/messages',
    },
    {
      title: 'Activity & Alerts',
      subtitle: 'Stay updated on item interests, status updates, and campus alerts.',
      badge: 'Real-time',
      icon: Bell,
      path: '/notifications',
    },
    {
      title: 'Student Identity',
      subtitle: 'Manage your verified profile, student badge, and campus credentials.',
      badge: '@vitapstudent.ac.in',
      icon: UserCheck,
      path: '/profile',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* ── 1. Futuristic Aurora Greeting Banner ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 sm:p-10 backdrop-blur-xl shadow-sm"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-bold uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified VIT-AP Student Hub
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground font-heading tracking-tight leading-tight">
              {getGreeting()},{' '}
              <span className="text-primary">
                {user?.name?.split(' ')[0] || 'Student'}
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              Welcome to your unified campus cockpit. Discover trusted flatmates, buy and sell second-hand gear, and navigate verified accommodations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="px-5 py-3.5 rounded-2xl bg-background border border-border/50 shadow-inner">
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Connected Account</div>
              <div className="text-sm font-mono font-bold text-accent mt-1">
                {user?.email || 'vitapstudent.ac.in'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Bento Quick Navigation Grid ── */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden" animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05 } }
        }}
      >
        {dashboardCards.map((card, idx) => (
          <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}>
            <Card
              onClick={() => navigate(card.path)}
              className="p-6 cursor-pointer flex flex-col justify-between space-y-5 group overflow-hidden relative bg-card/60 backdrop-blur-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-border/50 h-full"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="border border-border/50 bg-background text-muted-foreground">
                    {card.badge}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-foreground font-heading group-hover:text-primary transition-colors flex items-center gap-1.5 leading-snug">
                    <span>{card.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary mt-auto">
                <span>Open Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
