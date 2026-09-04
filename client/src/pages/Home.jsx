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
    <div className="space-y-12 py-6">
      {/* 1. Hero Banner */}
      <div className="sn-card relative overflow-hidden bg-gradient-to-br from-[#2563EB] to-indigo-700 text-white p-8 md:p-12 text-center space-y-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading leading-tight tracking-tight">
            The Exclusive Network for <br />
            <span className="text-emerald-300">VIT-AP Students</span>
          </h1>
          <p className="text-sm md:text-base text-blue-100 font-medium max-w-xl mx-auto leading-relaxed">
            Discover verified flatmates, buy and sell textbooks, and connect securely using your official university identity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/housing')}
              className="!bg-white !text-[#2563EB] hover:!bg-slate-50 border-none shadow-xl"
            >
              Explore Housing
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/marketplace')}
              className="!bg-indigo-900/40 !text-white !border-indigo-400 hover:!bg-indigo-900/60 backdrop-blur-md"
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Verified Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        {[
          {
            title: 'Verified Student Identity',
            desc: 'Every user is authenticated using their official @vitapstudent.ac.in university domain.',
            icon: ShieldCheck,
          },
          {
            title: 'Zero Brokerage Fees',
            desc: 'Direct peer-to-peer student transactions with zero broker commission or hidden fees.',
            icon: Building2,
          },
          {
            title: 'Safe Campus Marketplace',
            desc: 'Buy and sell textbooks, bicycles, and electronics safely with fellow batchmates.',
            icon: ShoppingBag,
          },
        ].map((feature, idx) => (
          <div key={idx} className="sn-card p-6 space-y-3 border-[#E2E8F0] bg-[var(--bg-card)]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100">
              <feature.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-main)] font-heading">{feature.title}</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* 3. Featured Campus Housing Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] font-heading">
              Featured Housing & PGs
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Verified accommodations and room vacancies posted by students.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/housing')}
            className="hidden sm:inline-flex"
          >
            View All Housing <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {housingLoading ? (
          <div className="text-sm text-slate-500 py-10 text-center">Loading housing options...</div>
        ) : topHousing.length === 0 ? (
          <div className="text-sm text-slate-500 py-10 text-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)]">No housing listings found. Be the first to post!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topHousing.map((post) => (
              <Card key={post._id} hover className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">{post.roomType}</span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">{post.vacancy} Vacancy</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-main)] font-heading leading-tight">{post.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {post.location}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-light)] flex justify-between items-center">
                  <div>
                    <div className="text-sm text-[var(--text-muted)]">Rent Share</div>
                    <div className="text-lg font-bold text-[#2563EB]">₹{post.rentShare.toLocaleString()} <span className="text-xs font-normal text-[var(--text-muted)]">/ mo</span></div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/housing')}>
                    View Post
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 4. Student Marketplace Preview Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] font-heading">
              Student Marketplace Essentials
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Buy and sell pre-loved textbooks, cycles, and monitors directly from batchmates.
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
          <div className="text-sm text-slate-500 py-10 text-center">Loading marketplace...</div>
        ) : topMarketplace.length === 0 ? (
          <div className="text-sm text-slate-500 py-10 text-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)]">No items for sale yet. Be the first to sell!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topMarketplace.map((item) => (
              <Card key={item._id} hover className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-[var(--bg-body)]">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[var(--bg-card)]/90 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 border border-[var(--border-light)]">
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
                  <div className="text-lg font-extrabold text-[#2563EB] font-heading">₹{item.price.toLocaleString()}</div>
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
