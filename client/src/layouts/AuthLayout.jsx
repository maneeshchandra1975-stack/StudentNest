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
    <div className="relative min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] flex flex-col justify-between overflow-x-hidden transition-colors duration-300">
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

      {/* ── Background Grids & Ambient Lights ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Header ── */}
      <header className="relative z-20 px-6 py-5 border-b border-[var(--border-light)] bg-[var(--bg-card)]/50 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight font-heading">
              Student<span className="text-[#2563EB]">Nest</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-[var(--text-muted)]">
            <span>1,420+ Verified Students Active</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>@vitapstudent.ac.in Only</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="relative z-10 container mx-auto px-4 py-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Brand Showcase Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-4"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Official VIT-AP Student Network</span>
              </div>

              <h1 className="text-4xl font-extrabold text-[var(--text-main)] leading-tight font-heading">
                Find Housing, Roommates <br />
                &amp; Marketplace Items{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  In One Verified Place
                </span>
              </h1>

              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-lg">
                No middleman brokerage. No unverified listings. A single platform accessible strictly with your college email.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] backdrop-blur-md shadow-sm">
                {highlights.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeTab === idx
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-800/50'
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
                  transition={{ duration: 0.3 }}
                  className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-light)] space-y-4 relative overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-tr ${highlights[activeTab].gradient} text-white`}>
                        {React.createElement(highlights[activeTab].icon, { className: 'w-5 h-5' })}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
                          {highlights[activeTab].title}
                        </h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {highlights[activeTab].subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[var(--bg-body)] border border-[var(--border-light)] text-[var(--text-muted)] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-light)] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/90 p-7 sm:p-9 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <Outlet />
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-20 py-6 border-t border-[var(--border-light)] text-center text-xs text-[var(--text-muted)]">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CampusNest. Built specifically for VIT-AP University.</p>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Support Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
