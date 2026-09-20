import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Mail,
  GraduationCap,
  MapPin,
  Settings,
  Loader2,
  Package,
  ShoppingBag,
  Users
} from 'lucide-react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { toast } from 'sonner';
import api from '../services/api';
import { cn } from '../utils/cn';

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
          priceOrRent: `₹${item.price.toLocaleString()}`,
          type: 'Marketplace',
          status: item.status,
          icon: ShoppingBag
        }));
        
        const roomItems = (roomRes.data.data || []).map(item => ({
          _id: item._id,
          title: item.title,
          priceOrRent: `₹${item.rentShare.toLocaleString()} / mo`,
          type: 'Roommate',
          status: item.status,
          icon: Users
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

  const activeListings = myListings.filter(item => item.status === 'Available');
  const pastListings = myListings.filter(item => item.status !== 'Available');

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* ── Profile Header Card ─────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card border border-border/60 shadow-md relative overflow-hidden rounded-3xl">
          {/* Abstract Hero Background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="px-6 sm:px-10 pb-8 pt-16 relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-background shadow-lg text-4xl">
                <AvatarFallback className="bg-gradient-to-tr from-primary to-accent text-primary-foreground font-black">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm border border-border">
                <div className="bg-success text-success-foreground p-1.5 rounded-full">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-3 flex-1 mb-2">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-heading tracking-tight">
                  {user?.name || 'Student Name'}
                </h1>
                <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1 font-medium">
                  <Mail className="w-4 h-4 text-primary" />
                  {user?.email || 'student@vitapstudent.ac.in'}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-semibold text-foreground">
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full border border-border/50">
                  <MapPin className="w-4 h-4 text-accent" /> Inavolu, Amaravati
                </span>
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full border border-border/50">
                  <GraduationCap className="w-4 h-4 text-secondary" /> VIT-AP Campus
                </span>
              </div>
            </div>
            
            <div className="mb-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full bg-background/50 backdrop-blur-sm border-border shadow-sm font-bold"
                onClick={() => toast.info('Account settings coming soon')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Details & Listings ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Verification */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="p-6 border-border/60 shadow-sm">
            <h3 className="text-lg font-bold text-foreground font-heading mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Trust & Safety
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-success/10 border border-success/20 space-y-2">
                <div className="font-bold flex items-center gap-2 text-success">
                  <ShieldCheck className="w-4 h-4" /> Domain Authenticated
                </div>
                <p className="text-xs leading-relaxed text-success/80 font-medium">
                  Identity verified via official university domain <code className="font-mono bg-success/20 text-success px-1.5 py-0.5 rounded ml-1">@vitapstudent.ac.in</code>
                </p>
              </div>
              
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background border border-border shadow-sm flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{myListings.length} Total Listings</div>
                  <div className="text-xs text-muted-foreground font-medium">Lifetime contributions</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Listings */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Active Listings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
                Active Listings
                <Badge variant="default" className="ml-2 rounded-full px-2.5 shadow-sm text-xs">{activeListings.length}</Badge>
              </h3>
            </div>

            <Card className="border-border/60 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center h-32 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : activeListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20">
                  <Package className="w-10 h-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-bold text-foreground">No active listings</p>
                  <p className="text-xs text-muted-foreground mt-1">Items you post will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {activeListings.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-background border-border shadow-sm">
                              {item.type}
                            </Badge>
                            <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider bg-success text-success-foreground border-0 shadow-sm">
                              Available
                            </Badge>
                          </div>
                          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                          <div className="text-sm font-black text-foreground">{item.priceOrRent}</div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="rounded-full shadow-sm bg-background w-full sm:w-auto" onClick={() => toast.info('Manage listing coming soon')}>
                        Manage
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sold / Completed Listings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-bold text-foreground font-heading opacity-80">
                Past Listings
              </h3>
            </div>

            <Card className="border-border/60 shadow-sm overflow-hidden bg-muted/10">
              {loading ? (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : pastListings.length === 0 ? (
                <div className="p-8 text-center text-sm font-medium text-muted-foreground bg-muted/20">
                  No past listings yet.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {pastListings.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0 border border-border/50">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                              {item.type}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                              {item.status}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-bold text-muted-foreground line-through decoration-muted-foreground/40">{item.title}</h4>
                          <div className="text-sm font-bold text-muted-foreground">{item.priceOrRent}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
