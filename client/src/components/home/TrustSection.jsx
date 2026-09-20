import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Building2, ShoppingBag } from 'lucide-react';
import Card from '../ui/Card';

export default function TrustSection() {
  const features = [
    {
      title: 'Verified Student Identity',
      desc: 'Every student is securely authenticated with their official @vitapstudent.ac.in credentials. Zero imposters or scammers.',
      icon: ShieldCheck,
    },
    {
      title: 'Zero Brokerage & Hassle',
      desc: 'Direct peer-to-peer flatmate matching and housing discovery with zero middleman commissions or surprise costs.',
      icon: Building2,
    },
    {
      title: 'Secure Campus Marketplace',
      desc: 'Buy and sell textbooks, electronics, cycles, and monitors hand-to-hand on campus with students you can trust.',
      icon: ShoppingBag,
    },
  ];

  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-8 h-full bg-background border-border/50 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground font-heading">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
