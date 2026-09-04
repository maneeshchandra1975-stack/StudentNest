import React, { useEffect, useState } from 'react';
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
  Loader2
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';
import api from '../services/api';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [marketRes, roomRes] = await Promise.all([
          api.get(`/marketplace?seller=${user._id}`),
          api.get(`/roommates?author=${user._id}`)
        ]);
        
        const marketItems = (marketRes.data.data || []).map(item => ({
          _id: item._id,
          title: item.title,
          priceOrRent: `₹${item.price}`,
          type: 'Marketplace',
          status: item.status
        }));
        
        const roomItems = (roomRes.data.data || []).map(item => ({
          _id: item._id,
          title: item.title,
          priceOrRent: `₹${item.rentShare} / month`,
          type: 'Roommate',
          status: item.status
        }));
        
        setMyListings([...marketItems, ...roomItems]);
      } catch (e) {
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyListings();
  }, [user]);

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      {/* ── Profile Header Card ─────────────────────────────── */}
      <div className="sn-card p-6 sm:p-8 space-y-6 bg-[var(--bg-card)]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-blue-100 text-[#2563EB] font-extrabold flex items-center justify-center text-2xl shrink-0 shadow-xs border border-blue-200">
            {user?.name?.charAt(0).toUpperCase() || 'M'}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-[var(--text-main)] font-heading">
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
              Student at VIT-AP University. Active member of Campus Housing &amp; Marketplace Network.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#2563EB]" /> Inavolu, Amaravati
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Listings & Details Tabs ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Credentials */}
        <div className="sn-card p-6 space-y-4 bg-[var(--bg-card)]">
          <h3 className="text-base font-bold text-[var(--text-main)] font-heading">Campus Status</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Domain Authenticated
              </div>
              <p className="text-[11px] text-emerald-700">
                Verified via official university email address `@vitapstudent.ac.in`.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              icon={Settings}
              onClick={() => toast.info('Account settings panel coming soon')}
            >
              Account Settings
            </Button>
          </div>
        </div>

        {/* User Listings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Active Listings */}
          <div className="sn-card p-6 space-y-4 bg-[var(--bg-card)]">
            <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
              My Active Listings ({myListings.filter(item => item.status === 'Available').length})
            </h3>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center p-8 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : myListings.filter(item => item.status === 'Available').length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-[var(--bg-body)] rounded-xl border border-slate-100">
                  You don't have any active listings.
                </div>
              ) : (
                myListings.filter(item => item.status === 'Available').map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)]/80 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2563EB]">
                          {item.type}
                        </span>
                        <Badge variant="active" label={item.status} />
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-main)]">{item.title}</h4>
                      <div className="text-xs font-bold text-[#2563EB]">{item.priceOrRent}</div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => toast.info('Listing edits coming soon')}>
                      Manage
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sold / Completed Listings */}
          <div className="sn-card p-6 space-y-4 bg-[var(--bg-card)] opacity-90">
            <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
              My Sold / Completed Listings ({myListings.filter(item => item.status !== 'Available').length})
            </h3>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center p-8 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : myListings.filter(item => item.status !== 'Available').length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-[var(--bg-body)] rounded-xl border border-slate-100">
                  You haven't sold anything yet.
                </div>
              ) : (
                myListings.filter(item => item.status !== 'Available').map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--bg-body)] border border-slate-200 bg-slate-50 flex items-center justify-between grayscale-[20%]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2563EB]">
                          {item.type}
                        </span>
                        <Badge variant="inactive" label={item.status} />
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-main)] line-through text-slate-500">{item.title}</h4>
                      <div className="text-xs font-bold text-slate-400">{item.priceOrRent}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
