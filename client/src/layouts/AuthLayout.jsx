import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ShieldCheck,
  Users,
  ShoppingBag,
  Lock,
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();

  const highlights = [
    {
      title: 'Verified Student Housing',
      subtitle: 'Zero Brokerage & Verified PGs',
      desc: 'Browse rooms and apartments near VIT-AP. Filter by distance, rent, Wi-Fi, and AC amenities.',
      icon: Home,
      stat: '450+ Verified Listings',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      title: 'Smart Roommate Finder',
      subtitle: 'Compatibility Matching',
      desc: 'Connect with students sharing similar sleep routines, study habits, and cleanliness preferences.',
      icon: Users,
      stat: '98% Compatibility Rate',
      gradient: 'from-indigo-500 to-cyan-400',
    },
    {
      title: 'Campus Marketplace',
      subtitle: 'Buy & Sell Second-Hand Items',
      desc: 'Exchange textbooks, lab equipment, cycles, and electronics directly with fellow students.',
      icon: ShoppingBag,
      stat: 'Instant Student Chat',
      gradient: 'from-teal-400 to-emerald-500',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* ── Toast Container ───────────────────────────────────── */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            borderRadius: '16px',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
          },
        }}
      />

      {/* ── Background Grids & Ambient Lights ────────────────── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[25rem] h-[25rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="relative z-20 container mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-heading flex items-center gap-1">
              Campus<span className="text-emerald-400">Nest</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400/90 block">
              VIT-AP University Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>1,420+ Verified Students Active</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>@vitapstudent.ac.in Only</span>
          </div>
        </div>
      </header>

      {/* ── Main Layout ───────────────────────────────────────── */}
      <main className="relative z-10 container mx-auto px-4 py-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Brand Showcase Section (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-4"
          >
            {/* Header Badge */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Official VIT-AP Student Network</span>
              </div>

              <h1 className="text-4xl font-extrabold text-white leading-tight font-heading">
                Find Housing, Roommates <br />
                &amp; Marketplace Items{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  In One Verified Place
                </span>
              </h1>

              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                No middleman brokerage. No unverified listings. A single platform accessible strictly with your college email.
              </p>
            </div>

            {/* Interactive Module Selector Tabs */}
            <div className="space-y-4">
              <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                {highlights.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeTab === idx
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Active Tab Preview Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-tr ${highlights[activeTab].gradient} text-slate-950`}>
                        {React.createElement(highlights[activeTab].icon, { className: 'w-5 h-5' })}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-heading">
                          {highlights[activeTab].title}
                        </h3>
                        <p className="text-xs text-emerald-400 font-medium">
                          {highlights[activeTab].subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      {highlights[activeTab].stat}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {highlights[activeTab].desc}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Direct Chat</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero Spam</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Trust Bar */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Protected by 256-bit JWT Session Encryption &amp; OTP Verification</span>
            </div>
          </motion.div>

          {/* Right Auth Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl shadow-black/90 backdrop-blur-2xl p-7 sm:p-9 relative overflow-hidden">
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <Outlet />
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="relative z-20 py-6 border-t border-slate-900/80 text-center text-xs text-slate-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CampusNest. Built specifically for VIT-AP University.</p>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-emerald-400 transition-colors">Support Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
