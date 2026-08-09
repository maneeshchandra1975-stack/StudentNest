import React from 'react';
import { useSelector } from 'react-redux';
import {
  Building2,
  ShoppingBag,
  MessageSquare,
  Bookmark,
  ShieldCheck,
  Plus,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const activityData = [
  { day: 'Mon', views: 12, inquiries: 2 },
  { day: 'Tue', views: 19, inquiries: 4 },
  { day: 'Wed', views: 15, inquiries: 3 },
  { day: 'Thu', views: 24, inquiries: 6 },
  { day: 'Fri', views: 18, inquiries: 2 },
  { day: 'Sat', views: 32, inquiries: 8 },
  { day: 'Sun', views: 22, inquiries: 5 },
];

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 py-2">
      {/* ── 1. Workspace Header ─────────────────────────────── */}
      <div className="sn-card p-6 sm:p-8 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>✓ Verified Student</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-heading">
              {getGreeting()}, {user?.name || 'Maneesh'}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Here's what's happening around your VIT-AP campus workspace today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('/housing')}>
              Post New Listing
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2. Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Saved Housing',
            value: '3 Items',
            desc: 'Saved for review',
            icon: Bookmark,
            color: 'bg-blue-50 text-[#2563EB]',
            path: '/housing',
          },
          {
            title: 'Active Listings',
            value: '2 Listings',
            desc: '1 Housing · 1 Book',
            icon: Building2,
            color: 'bg-emerald-50 text-emerald-600',
            path: '/housing',
          },
          {
            title: 'Messages & Inquiries',
            value: '4 Unread',
            desc: 'From interested students',
            icon: MessageSquare,
            color: 'bg-amber-50 text-amber-600',
            path: '/messages',
          },
          {
            title: 'Marketplace Wishlist',
            value: '5 Saved',
            desc: 'Textbooks & Gear',
            icon: ShoppingBag,
            color: 'bg-indigo-50 text-indigo-600',
            path: '/marketplace',
          },
        ].map((card, idx) => (
          <Card key={idx} hover onClick={() => navigate(card.path)} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl border border-slate-100 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>

            <div>
              <div className="text-2xl font-extrabold text-[#111827] font-heading">{card.value}</div>
              <div className="text-xs font-semibold text-[#111827] mt-0.5">{card.title}</div>
              <div className="text-[11px] text-[#64748B]">{card.desc}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── 3. Chart & Activity Grid ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Listing Engagement Analytics */}
        <div className="lg:col-span-8 sn-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827] font-heading">
                Listing Views &amp; Inquiries
              </h3>
              <p className="text-xs text-[#64748B]">Weekly engagement on your posted items.</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" /> +18% this week
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#111827',
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2.5} fill="url(#viewsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-4 sn-card p-6 space-y-4">
          <h3 className="text-base font-bold text-[#111827] font-heading">Recent Campus Activity</h3>
          
          <div className="space-y-3">
            {[
              { title: 'Inquiry received for 2BHK Flat', time: '10 mins ago', desc: 'Arjun P. asked about rent terms' },
              { title: 'Saved CLRS Algorithms Book', time: '2 hours ago', desc: 'Added to your wishlist' },
              { title: 'Identity Verified', time: '1 day ago', desc: 'Email domain @vitapstudent.ac.in confirmed' },
            ].map((act, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">{act.title}</span>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
                <p className="text-xs text-[#64748B]">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
