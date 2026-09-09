import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

export default function StartupLayout() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[var(--bg-body)] text-[var(--text-main)] overflow-x-hidden selection:bg-orange-500/20 selection:text-orange-600 dark:selection:text-orange-400">
      {/* ── Ambient Background Glow Effects ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 dark:bg-amber-600/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-orange-500/10 dark:bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full bg-rose-500/10 dark:bg-rose-600/15 blur-3xl" />
      </div>

      <Toaster position="top-right" richColors closeButton />
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderNavbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
