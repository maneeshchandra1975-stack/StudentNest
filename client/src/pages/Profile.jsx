import React from 'react';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  User,
  Mail,
  GraduationCap,
  Building2,
  Star,
  MapPin,
  Calendar,
  Settings,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      {/* ── Profile Header Card ─────────────────────────────── */}
      <div className="sn-card p-6 sm:p-8 space-y-6 bg-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-blue-100 text-[#2563EB] font-extrabold flex items-center justify-center text-2xl shrink-0 shadow-xs border border-blue-200">
            {user?.name?.charAt(0) || 'M'}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-[#111827] font-heading">
                  {user?.name || 'Maneesh Chandra'}
                </h1>
                <div className="text-xs text-[#64748B] flex items-center justify-center sm:justify-start gap-1 mt-0.5 font-mono">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email || 'maneesh@vitapstudent.ac.in'}
                </div>
              </div>

              <Badge variant="verified" />
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Computer Science &amp; Engineering Student at VIT-AP University. Active member of Campus Housing &amp; Marketplace Network.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" /> CSE Batch 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#2563EB]" /> Inavolu, Amaravati
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 Student Rating (12 Reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Listings & Details Tabs ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Credentials */}
        <div className="sn-card p-6 space-y-4 bg-white">
          <h3 className="text-base font-bold text-[#111827] font-heading">Campus Status</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Domain Authenticated
              </div>
              <p className="text-[11px] text-emerald-700">
                Verified via official university email address `@vitapstudent.ac.in`.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[#64748B] text-[11px]">Member Since</div>
              <div className="font-bold text-[#111827]">August 2026</div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              icon={Settings}
              onClick={() => toast.info('Account settings panel')}
            >
              Account Settings
            </Button>
          </div>
        </div>

        {/* User Active Listings */}
        <div className="md:col-span-2 sn-card p-6 space-y-4 bg-white">
          <h3 className="text-base font-bold text-[#111827] font-heading">
            My Active Listings (2)
          </h3>

          <div className="space-y-3">
            {[
              {
                title: '3BHK Flatmates Wanted (CSE Senior Flat)',
                rent: '₹7,200 / month',
                type: 'Housing',
                status: 'active',
              },
              {
                title: 'CLRS Introduction to Algorithms (3rd Ed.)',
                rent: '₹650',
                type: 'Marketplace',
                status: 'active',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2563EB]">
                      {item.type}
                    </span>
                    <Badge variant="active" />
                  </div>
                  <h4 className="text-xs font-bold text-[#111827]">{item.title}</h4>
                  <div className="text-xs font-bold text-[#2563EB]">{item.rent}</div>
                </div>

                <Button variant="ghost" size="sm" onClick={() => toast.info('Edit listing')}>
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
