import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import {
  Home,
  Users,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Mail,
  Calendar,
  CheckCircle,
  Bell,
  ChevronRight,
  Building2,
  Lock,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully.');
      navigate('/login');
    } catch (err) {
      toast.error('Logout completed.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight font-heading flex items-center gap-1">
                Campus<span className="text-emerald-400">Nest</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase tracking-widest">
                VIT-AP Student Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">{user?.name || 'Student'}</div>
                <div className="text-[10px] text-emerald-400 font-mono">@vitapstudent.ac.in</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Dashboard Content ─────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 opacity-10 pointer-events-none">
            <Building2 className="w-64 h-64 text-emerald-400" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Account Active</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{user?.name}</span>!
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Your account is verified with your VIT-AP student email. You have full access to search rooms, find compatible roommates, and exchange goods in the campus marketplace.
            </p>
          </div>
        </div>

        {/* Profile Details & Security Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Account Info */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <UserCheck className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white font-heading">Verified Student Details</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-300 pt-1">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-200">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-500">College Email:</span>
                <span className="font-mono text-emerald-400 font-semibold">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Institution:</span>
                <span className="font-bold text-slate-200">VIT-AP University</span>
              </div>
            </div>
          </div>

          {/* Card 2: Security */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white font-heading">Security Architecture</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-300 pt-1">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-500">Authentication:</span>
                <span className="font-semibold text-slate-200">JWT + OTP Email</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-500">Session Cookie:</span>
                <span className="text-emerald-400 font-semibold">httpOnly Refresh Token</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">User Role:</span>
                <span className="font-bold text-indigo-400 uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Status */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-teal-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white font-heading">System Roadmap</h3>
            </div>
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <span>Phase 3: Housing Marketplace</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20 font-bold">Next Phase</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
                <span>Phase 4: Student Marketplace</span>
                <span className="text-[10px] text-slate-500 font-semibold">Upcoming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Explorer */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Explore Marketplace Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Campus Housing & PGs',
                desc: 'Browse verified rooms, PGs, and apartments near VIT-AP. Direct student listings.',
                icon: Home,
                color: 'text-emerald-400',
                badge: 'Phase 3',
              },
              {
                title: 'Roommate Finder',
                desc: 'Find compatible roommates based on study habits, sleep schedules, and preferences.',
                icon: Users,
                color: 'text-indigo-400',
                badge: 'Phase 5',
              },
              {
                title: 'Student Marketplace',
                desc: 'Buy and sell textbooks, electronics, cycles, and lab tools directly with students.',
                icon: ShoppingBag,
                color: 'text-teal-400',
                badge: 'Phase 4',
              },
            ].map((module, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-slate-800 glass-card-hover space-y-4 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3.5 rounded-2xl bg-slate-950 border border-slate-800 ${module.color}`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {module.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span>{module.title}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {module.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
