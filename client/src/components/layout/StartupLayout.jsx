import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

export default function StartupLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[var(--bg-body)] text-[var(--text-main)]">
      <Toaster position="top-right" richColors closeButton />
      <HeaderNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
