import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

export default function StartupLayout() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans transition-colors duration-300 bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* ── Ambient Background Glow Effects ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <Toaster position="top-right" richColors closeButton theme="system" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderNavbar />
        <main className="flex-1 w-full flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
