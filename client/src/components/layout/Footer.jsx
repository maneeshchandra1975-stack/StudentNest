import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] mt-16 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2 pr-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-lg font-extrabold text-[#111827] font-heading">
              Student<span className="text-[#2563EB]">Nest</span>
            </span>
          </div>

          <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
            The trusted campus housing and second-hand marketplace platform built exclusively for verified VIT-AP University students.
          </p>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>✓ Verified Student Network</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-bold text-[#111827] uppercase tracking-wider text-[11px]">Platform</div>
          <ul className="space-y-1.5 text-xs">
            <li><Link to="/housing" className="hover:text-[#2563EB] transition-colors">Campus Housing &amp; PGs</Link></li>
            <li><Link to="/marketplace" className="hover:text-[#2563EB] transition-colors">Student Marketplace</Link></li>
            <li><Link to="/messages" className="hover:text-[#2563EB] transition-colors">Messages &amp; Chat</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#2563EB] transition-colors">Student Dashboard</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-bold text-[#111827] uppercase tracking-wider text-[11px]">Support</div>
          <ul className="space-y-1.5 text-xs">
            <li><a href="#help" className="hover:text-[#2563EB] transition-colors">Help &amp; FAQs</a></li>
            <li><a href="#rules" className="hover:text-[#2563EB] transition-colors">Campus Verification Rules</a></li>
            <li><a href="#privacy" className="hover:text-[#2563EB] transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-[#2563EB] transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-[11px] text-slate-400">
        © 2026 StudentNest. Dedicated campus platform for VIT-AP University.
      </div>
    </footer>
  );
}
