import React from 'react';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  Building2,
  ShoppingBag,
  MessageSquare,
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

  return (
    <div className="space-y-8 py-2">
      {/* 1. Workspace Header */}
      <div className="sn-card p-6 sm:p-8 bg-[var(--bg-card)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>✓ Verified Student</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-heading">
              {getGreeting()}, {user?.name || 'Student'}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Welcome to your centralized student hub. Access marketplace, housing, and your messages here.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => navigate('/marketplace')} className="sn-card p-6 cursor-pointer hover:border-[#2563EB]/50 transition-colors group">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">Marketplace</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">Buy and sell items securely on campus.</p>
        </div>

        <div onClick={() => navigate('/housing')} className="sn-card p-6 cursor-pointer hover:border-indigo-500/50 transition-colors group">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">Housing Hub</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">Find roommates and discover nearby PGs.</p>
        </div>

        <div onClick={() => navigate('/messages')} className="sn-card p-6 cursor-pointer hover:border-emerald-500/50 transition-colors group">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">Messages</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">Chat with interested buyers and potential roommates.</p>
        </div>
      </div>
    </div>
  );
}
