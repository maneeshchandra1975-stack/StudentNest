import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function CTASection({ isAuthenticated }) {
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-primary text-primary-foreground rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-6 relative z-10">
            Join the Campus Network
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto relative z-10 font-medium">
            StudentNest is exclusively for VIT-AP students. Connect, buy, sell, and find housing with the people you study with.
          </p>
          
          <div className="relative z-10">
            {!isAuthenticated ? (
              <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="rounded-full bg-background text-foreground hover:bg-background/90 px-8 text-base font-bold shadow-sm">
                Create Free Account
              </Button>
            ) : (
              <Button size="lg" variant="secondary" onClick={() => navigate('/dashboard')} className="rounded-full bg-background text-foreground hover:bg-background/90 px-8 text-base font-bold shadow-sm">
                Go to Dashboard
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
