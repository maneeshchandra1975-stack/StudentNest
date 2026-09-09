import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Home,
  ShieldCheck,
  Users,
  ShoppingBag,
  Lock,
  Sparkles,
  Building2,
  CheckCircle2,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const { theme, toggleTheme } = useTheme();
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
      gradient: 'from-amber-500 to-orange-500',
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
    <div className="relative min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] flex flex-col justify-between overflow-x-hidden transition-colors duration-300">
      {/* ── Background Ambient Lights ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-20 px-6 py-4 border-b border-[var(--border-light)] bg-[var(--bg-card)]/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/25 group-hover:scale-105 transition-all">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-[var(--text-main)] tracking-tight font-heading">
              Student<span className="text-gradient-primary">Nest</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              1,420+ Verified Students Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] rounded-xl border border-transparent hover:border-[var(--border-light)] transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>@vitapstudent.ac.in Domain Authenticated</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* Left Brand Showcase Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-4"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Verified VIT-AP Campus Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-main)] leading-[1.15] font-heading tracking-tight">
                Find Housing, Flatmates <br />
                &amp; Second-Hand Gear{' '}
                <span className="text-gradient-primary">
                  In One Single Place
                </span>
              </h1>

              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-lg font-medium">
                Zero middleman brokerage. Peer-to-peer student trust. A dedicated platform accessible strictly with your university email.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] backdrop-blur-md shadow-xs">
                {highlights.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === idx
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)]'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="sn-card p-6 border-[var(--border-light)] space-y-4 relative overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-xs">
                        {React.createElement(highlights[activeTab].icon, { className: 'w-5 h-5' })}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
                          {highlights[activeTab].title}
                        </h3>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                          {highlights[activeTab].subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-light)] text-[var(--text-muted)] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      {highlights[activeTab].stat}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {highlights[activeTab].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Auth Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-light)] rounded-3xl shadow-xl p-7 sm:p-9 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

              <Outlet />
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-20 py-6 border-t border-[var(--border-light)] text-center text-xs text-[var(--text-muted)] backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} StudentNest. Exclusively engineered for VIT-AP University.</p>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
