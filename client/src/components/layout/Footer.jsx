import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card/70 border-t border-border/60 mt-20 text-sm text-muted-foreground backdrop-blur-xl shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4 md:col-span-2 pr-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/20">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-foreground font-heading tracking-tight">
              Campus<span className="text-primary">Nest</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            The trusted campus housing and peer-to-peer student marketplace platform built exclusively for verified university students.
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Official Student Network</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="font-bold text-foreground uppercase tracking-wider text-xs">Platform</div>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><Link to="/housing" className="hover:text-primary transition-colors inline-block">Campus Housing &amp; PGs</Link></li>
            <li><Link to="/marketplace" className="hover:text-primary transition-colors inline-block">Student Marketplace</Link></li>
            <li><Link to="/roommates" className="hover:text-primary transition-colors inline-block">Roommate Finder</Link></li>
            <li><Link to="/messages" className="hover:text-primary transition-colors inline-block">Secure Messages</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="font-bold text-foreground uppercase tracking-wider text-xs">Support</div>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><a href="#help" className="hover:text-primary transition-colors inline-block">Help &amp; FAQs</a></li>
            <li><a href="#rules" className="hover:text-primary transition-colors inline-block">Verification Rules</a></li>
            <li><a href="#privacy" className="hover:text-primary transition-colors inline-block">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-primary transition-colors inline-block">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs font-semibold text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-1">
        <span>&copy; {new Date().getFullYear()} CampusNest.</span>
        <span className="flex items-center gap-1">Crafted with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for students.</span>
      </div>
    </footer>
  );
}
