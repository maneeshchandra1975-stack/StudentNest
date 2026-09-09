import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Building2,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

import { fetchRoommatePosts } from '../redux/slices/roommateSlice';
import { fetchMarketplaceItems } from '../redux/slices/marketplaceSlice';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { posts: housingPosts, isLoading: housingLoading } = useSelector((state) => state.roommate);
  const { items: marketplaceItems, isLoading: marketplaceLoading } = useSelector((state) => state.marketplace);

  useEffect(() => {
    // Fetch only a few items to show on the homepage
    dispatch(fetchRoommatePosts({}));
    dispatch(fetchMarketplaceItems({}));
  }, [dispatch]);

  const topHousing = housingPosts.slice(0, 3);
  const topMarketplace = marketplaceItems.slice(0, 3);

  return (
    <div className="space-y-16 py-4">
      {/* ── 1. Futuristic Aurora Hero Banner ───────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-b from-orange-950/20 via-[var(--bg-card)] to-[var(--bg-card)] p-8 sm:p-14 text-center backdrop-blur-2xl shadow-xl shadow-orange-500/5">
        {/* Background Radial Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-gradient-to-b from-amber-500/20 via-orange-500/15 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Official Verification Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-tight shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Exclusively for Verified VIT-AP Students</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading leading-[1.1] tracking-tight text-[var(--text-main)]">
            The High-Trust Campus Network for{' '}
            <span className="text-gradient-primary">VIT-AP</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed font-medium">
            Find compatible flatmates, explore verified PGs, and buy/sell textbooks &amp; campus gear safely using your official university identity.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/roommates')}
              className="shadow-xl shadow-orange-500/25"
            >
              Find Roommates &amp; PGs
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/marketplace')}
            >
              Browse Marketplace
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="pt-8 border-t border-[var(--border-light)] grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-gradient-primary font-heading">1,400+</div>
              <div className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5">Active Students</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gradient-emerald font-heading">₹0</div>
              <div className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5">Brokerage Fees</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-gradient-amber font-heading">100%</div>
              <div className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5">Domain Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Bento Grid Value Props ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Verified Student Identity',
            desc: 'Every student is securely authenticated with their official @vitapstudent.ac.in credentials. Zero imposters or scammers.',
            icon: ShieldCheck,
            color: 'from-emerald-500/20 to-teal-500/5 text-emerald-500 border-emerald-500/20',
          },
          {
            title: 'Zero Brokerage & Hassle',
            desc: 'Direct peer-to-peer flatmate matching and housing discovery with zero middleman commissions or surprise costs.',
            icon: Building2,
            color: 'from-amber-500/20 to-orange-500/5 text-amber-500 border-amber-500/20',
          },
          {
            title: 'Secure Campus Marketplace',
            desc: 'Buy and sell textbooks, electronics, cycles, and monitors hand-to-hand on campus with students you can trust.',
            icon: ShoppingBag,
            color: 'from-orange-500/20 to-rose-500/5 text-orange-500 border-orange-500/20',
          },
        ].map((feature, idx) => (
          <Card key={idx} hover className="p-7 flex flex-col justify-between space-y-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center border shadow-xs`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-main)] font-heading">{feature.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── 3. Featured Campus Housing Section ─────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] font-heading tracking-tight">
              Featured Housing &amp; Vacancies
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Recent verified accommodations and room vacancies posted by fellow students.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/roommates')}
            className="hidden sm:inline-flex"
          >
            Explore All Housing <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {housingLoading ? (
          <div className="text-sm text-[var(--text-muted)] py-12 text-center">Loading campus listings...</div>
        ) : topHousing.length === 0 ? (
          <div className="text-sm text-[var(--text-muted)] py-12 text-center sn-card">No housing listings found. Be the first to post!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topHousing.map((post) => (
              <Card key={post._id} hover className="p-6 flex flex-col justify-between space-y-4 border-[var(--border-light)]">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
                        {post.roomType}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                        {post.vacancy} Vacancy
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-main)] font-heading leading-snug line-clamp-1">{post.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span className="line-clamp-1">{post.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-light)] flex justify-between items-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Rent Share</div>
                    <div className="text-lg font-black text-gradient-primary">
                      ₹{post.rentShare.toLocaleString()} <span className="text-xs font-normal text-[var(--text-muted)]">/ mo</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/roommates')}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── 4. Student Marketplace Preview Section ────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] font-heading tracking-tight">
              Marketplace Essentials
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Textbooks, calculators, cycles, and electronics passed down directly between batches.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplace')}
            className="hidden sm:inline-flex"
          >
            Explore Marketplace <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {marketplaceLoading ? (
          <div className="text-sm text-[var(--text-muted)] py-12 text-center">Loading marketplace items...</div>
        ) : topMarketplace.length === 0 ? (
          <div className="text-sm text-[var(--text-muted)] py-12 text-center sn-card">No marketplace items listed yet. Be the first to post!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topMarketplace.map((item) => (
              <Card key={item._id} hover className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-[var(--bg-body)]">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[var(--bg-card)]/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-[var(--text-main)] border border-[var(--border-light)] shadow-xs">
                      {item.condition}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-[var(--text-main)] line-clamp-1 font-heading">
                      {item.title}
                    </h3>
                    <div className="text-xs text-[var(--text-muted)]">
                      Seller: <span className="font-semibold text-[var(--text-main)]">{item.seller?.name || 'Student'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-[var(--border-light)] mt-2">
                  <div className="text-lg font-black text-gradient-primary font-heading">₹{item.price.toLocaleString()}</div>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/marketplace')}>
                    Contact Seller
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
