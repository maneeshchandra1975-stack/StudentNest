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
      toast.error('Logout error.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ── Top Navigation Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Home className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">
                Campus<span className="text-emerald-400">Nest</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase tracking-widest">
                VIT-AP Student Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-sm uppercase">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">{user?.name || 'Student'}</div>
                <div className="text-[10px] text-slate-400 capitalize">{user?.role || 'Student'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body ─────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800/80 p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Account Verified &amp; Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="text-emerald-400">{user?.name}</span>!
            </h1>

            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              You are logged in with your verified VIT-AP student email. Explore campus rooms, discover compatible roommates, or browse the student marketplace.
            </p>
          </div>
        </div>

        {/* Student Profile Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <UserCheck className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-white">Verified Account</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-200">{user?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-emerald-400">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">University:</span>
                <span className="font-semibold text-slate-200">VIT-AP University</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-white">Security Status</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Auth Method:</span>
                <span className="font-semibold text-slate-200">JWT + OTP Email</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Token Status:</span>
                <span className="text-emerald-400 font-semibold">Active Session</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Access Role:</span>
                <span className="font-semibold text-indigo-400 capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3 text-teal-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-white">Platform Modules</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <span>Phase 3: Housing Marketplace</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">Next Up</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <span>Phase 4: Marketplace</span>
                <span className="text-[10px] text-slate-500">Upcoming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Shortcuts Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Marketplace Modules</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Campus Housing & PGs',
                desc: 'Find verified rooms, hostels & apartments near VIT-AP.',
                icon: Home,
                color: 'text-emerald-400',
                badge: 'Phase 3',
              },
              {
                title: 'Roommate Finder',
                desc: 'Find compatible roommates based on study habits & sleep routine.',
                icon: Users,
                color: 'text-indigo-400',
                badge: 'Phase 5',
              },
              {
                title: 'Student Marketplace',
                desc: 'Buy & sell second-hand textbooks, electronics, and cycles.',
                icon: ShoppingBag,
                color: 'text-teal-400',
                badge: 'Phase 4',
              },
            ].map((module, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 ${module.color}`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {module.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span>{module.title}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
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
