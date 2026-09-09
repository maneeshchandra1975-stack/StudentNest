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
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* ── Profile Header Card ─────────────────────────────── */}
      <div className="sn-card p-6 sm:p-8 bg-[var(--bg-card)] border-[var(--border-light)] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-orange-500/5 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          {/* Avatar with Radiant Gradient */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white font-black flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-orange-500/25 border-2 border-white/20">
            {user?.name?.charAt(0).toUpperCase() || 'M'}
          </div>

          <div className="space-y-2.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] font-heading">
                  {user?.name || 'Maneesh Chandra'}
                </h1>
                <div className="text-xs text-[var(--text-muted)] flex items-center justify-center sm:justify-start gap-1.5 mt-1 font-mono">
                  <Mail className="w-3.5 h-3.5 text-orange-500" />
                  {user?.email || 'maneesh@vitapstudent.ac.in'}
                </div>
              </div>

              <Badge variant="verified" className="shadow-xs" />
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xl">
              Verified Scholar at VIT-AP University. Active contributor to the campus peer-to-peer network.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-[var(--text-muted)] font-medium">
              <span className="flex items-center gap-1.5 font-semibold text-[var(--text-main)]">
                <MapPin className="w-4 h-4 text-orange-500" /> Inavolu, Amaravati
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[var(--text-main)]">
                <GraduationCap className="w-4 h-4 text-amber-500" /> VIT-AP Campus
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Listings & Details Tabs ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Credentials */}
        <div className="sn-card p-6 space-y-4 bg-[var(--bg-card)] border-[var(--border-light)] h-fit shadow-sm">
          <h3 className="text-base font-bold text-[var(--text-main)] font-heading">Campus Status</h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Domain Authenticated
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                Secured via official student identity email domain <code className="font-mono text-[10px] bg-emerald-500/20 px-1 py-0.5 rounded">@vitapstudent.ac.in</code>.
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
          <div className="sn-card p-6 space-y-4 bg-[var(--bg-card)] border-[var(--border-light)] shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
                My Active Listings ({myListings.filter(item => item.status === 'Available').length})
              </h3>
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">Live on campus</span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center p-8 text-[var(--text-muted)]">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : myListings.filter(item => item.status === 'Available').length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-light)]">
                  You don't have any active listings yet.
                </div>
              ) : (
                myListings.filter(item => item.status === 'Available').map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--bg-card-subtle)]/70 border border-[var(--border-light)] flex items-center justify-between hover:border-[var(--border-hover)] transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                          {item.type}
                        </span>
                        <Badge variant="active" label={item.status} />
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-main)]">{item.title}</h4>
                      <div className="text-xs font-black text-gradient-primary">{item.priceOrRent}</div>
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
          <div className="sn-card p-6 space-y-4 bg-[var(--bg-card)] border-[var(--border-light)] shadow-sm">
            <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
              My Sold / Completed Listings ({myListings.filter(item => item.status !== 'Available').length})
            </h3>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center p-8 text-[var(--text-muted)]">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : myListings.filter(item => item.status !== 'Available').length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-light)]">
                  You haven't marked any listings as sold or completed yet.
                </div>
              ) : (
                myListings.filter(item => item.status !== 'Available').map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[var(--bg-card-subtle)]/40 border border-[var(--border-light)] flex items-center justify-between opacity-80"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20">
                          {item.type}
                        </span>
                        <Badge variant="inactive" label={item.status} />
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-main)] line-through text-[var(--text-muted)]">{item.title}</h4>
                      <div className="text-xs font-bold text-[var(--text-muted)]">{item.priceOrRent}</div>
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
