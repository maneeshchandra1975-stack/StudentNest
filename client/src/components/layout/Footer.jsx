import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-card)]/70 border-t border-[var(--border-light)] mt-20 text-xs text-[var(--text-muted)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3.5 md:col-span-2 pr-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-sm shadow-orange-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-[var(--text-main)] font-heading">
              Student<span className="text-gradient-primary">Nest</span>
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
            The trusted campus housing and peer-to-peer student marketplace platform built exclusively for verified VIT-AP University students.
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Official VIT-AP Student Network</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">Platform</div>
          <ul className="space-y-2 text-xs">
            <li><Link to="/housing" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Campus Housing &amp; PGs</Link></li>
            <li><Link to="/marketplace" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Student Marketplace</Link></li>
            <li><Link to="/messages" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Messages &amp; Chat</Link></li>
            <li><Link to="/dashboard" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Student Dashboard</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <div className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">Campus Support</div>
          <ul className="space-y-2 text-xs">
            <li><a href="#help" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Help &amp; FAQs</a></li>
            <li><a href="#rules" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Campus Verification Rules</a></li>
            <li><a href="#privacy" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border-light)] py-6 text-center text-[11px] text-[var(--text-muted)]">
        &copy; {new Date().getFullYear()} StudentNest. Exclusively engineered for VIT-AP University.
      </div>
    </footer>
  );
}
