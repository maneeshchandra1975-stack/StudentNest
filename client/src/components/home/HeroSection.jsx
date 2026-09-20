import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left: Text & CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-tight">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Verified Campus Network</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading leading-[1.1] tracking-tight text-foreground">
            The exclusive <br className="hidden sm:block" />
            <span className="text-primary">student marketplace</span> <br className="hidden sm:block" />
            and housing network.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Find compatible flatmates, explore verified PGs, and safely buy or sell textbooks with your official university identity.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default" size="lg" onClick={() => navigate('/roommates')} className="rounded-full shadow-sm">
              Explore Housing
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/marketplace')} className="rounded-full bg-background hover:bg-muted">
              Browse Marketplace <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="pt-4 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <Avatar key={i} className="w-10 h-10 border-2 border-background shadow-sm">
                  <AvatarImage src={`https://i.pravatar.cc/100?img=${i+10}`} />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              <span className="text-foreground font-bold">1,400+</span> students joined
            </div>
          </div>
        </motion.div>

        {/* Right: UI Composition */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="relative lg:h-[500px] flex justify-center lg:justify-end items-center"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative w-full max-w-md">
            {/* Mock Card 1 */}
            <Card className="absolute -top-12 -left-8 md:-left-16 w-64 p-4 shadow-xl z-20 rotate-[-4deg] bg-card/90 backdrop-blur-md border-border">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">Shared Room</Badge>
                <div className="text-success font-bold text-[10px] uppercase tracking-wider bg-success/10 px-2 py-0.5 rounded-md">2 Vacancies</div>
              </div>
              <h4 className="font-bold font-heading text-sm mb-1">Sunrise Apartments, 3BHK</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                <MapPin className="w-3 h-3" /> 2km from Campus
              </p>
              <div className="font-black text-primary text-lg">₹6,500 <span className="text-[10px] font-normal text-muted-foreground">/ mo</span></div>
            </Card>

            {/* Mock Card 2 */}
            <Card className="relative z-10 w-full p-0 overflow-hidden shadow-2xl border-border/60">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" alt="Marketplace item" className="w-full h-48 object-cover" />
              <div className="p-5 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="border-0">Electronics</Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Like New</span>
                </div>
                <h4 className="font-bold font-heading text-lg mb-1">Sony WH-1000XM4 Headphones</h4>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px]">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-muted-foreground">Verified Seller</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-success ml-auto" />
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
