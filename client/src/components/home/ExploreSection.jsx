import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Monitor, Home, Users } from 'lucide-react';
import { ScrollArea, ScrollBar } from '../ui/ScrollArea';
import Card from '../ui/Card';

export default function ExploreSection() {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Housing & Vacancies',
      desc: 'Find flats, PGs, and room vacancies near VIT-AP campus.',
      icon: Home,
      path: '/roommates',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      title: 'Textbooks & Notes',
      desc: 'Buy and sell course materials for your current semester.',
      icon: BookOpen,
      path: '/marketplace?category=Textbooks',
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Electronics & Gadgets',
      desc: 'Laptops, monitors, calculators, and accessories.',
      icon: Monitor,
      path: '/marketplace?category=Electronics',
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Roommate Finder',
      desc: 'Match with compatible students to share your rent.',
      icon: Users,
      path: '/roommates',
      color: 'bg-secondary/10 text-secondary',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10">
        <h2 className="text-3xl font-extrabold text-foreground font-heading tracking-tight">
          Explore StudentNest
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
          Everything you need for your campus life, verified and secure.
        </p>
      </div>

      <div className="pl-4 sm:pl-8 max-w-7xl mx-auto">
        <ScrollArea className="w-full whitespace-nowrap pb-6">
          <div className="flex w-max space-x-6 pr-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="w-[280px] sm:w-[320px] shrink-0"
              >
                <Card 
                  className="p-6 h-full bg-card hover:bg-muted/50 transition-all duration-300 cursor-pointer border-border group shadow-sm hover:shadow-md"
                  onClick={() => navigate(cat.path)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${cat.color}`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-normal line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                    Browse <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
    </section>
  );
}
