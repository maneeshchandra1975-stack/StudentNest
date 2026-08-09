import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ShieldCheck, Home, Users, ShoppingBag, Lock, Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f172a',
            },
          },
        }}
      />

      {/* ── Background Glow & Grid FX ──────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header Navbar ──────────────────────────────────────── */}
      <header className="relative z-20 container mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Home className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Campus<span className="text-emerald-400">Nest</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-400 block font-semibold">
              VIT-AP Edition
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified College Network</span>
        </div>
      </header>

      {/* ── Main Content Grid ─────────────────────────────────── */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Brand Showcase Section (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:col-span-5 flex-col space-y-8 pr-4"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Exclusively for @vitapstudent.ac.in</span>
              </div>

              <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                Your Trusted <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Campus Housing
                </span>{" "}
                &amp; Marketplace
              </h1>

              <p className="text-slate-400 text-sm leading-relaxed">
                Connect with verified VIT-AP students. Find verified rooms, compatible roommates, and second-hand items safely.
              </p>
            </div>

            {/* Feature Cards Showcase */}
            <div className="space-y-3">
              {[
                {
                  icon: Home,
                  title: 'Verified Housing & PGs',
                  desc: 'No middleman fees. Direct student & owner listings.',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10 border-emerald-500/20',
                },
                {
                  icon: Users,
                  title: 'Roommate Finder',
                  desc: 'Match with students based on lifestyle habits.',
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-500/10 border-indigo-500/20',
                },
                {
                  icon: ShoppingBag,
                  title: 'Student Marketplace',
                  desc: 'Buy & sell textbooks, gadgets, and cycle fast.',
                  color: 'text-teal-400',
                  bg: 'bg-teal-500/10 border-teal-500/20',
                },
              ].map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-colors"
                >
                  <div className={`p-2.5 rounded-lg border ${feat.bg}`}>
                    <feat.icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{feat.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protected by OTP verification &amp; 256-bit encryption</span>
            </div>
          </motion.div>

          {/* Right Auth Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex justify-center"
          >
            <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden">
              {/* Subtle Card Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <Outlet />
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-20 py-6 border-t border-slate-900/80 text-center text-xs text-slate-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CampusNest. Built specifically for VIT-AP University.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-emerald-400 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
