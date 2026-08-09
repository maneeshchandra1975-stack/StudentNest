import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

export default function StartupLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <Toaster position="top-right" richColors closeButton />
      <HeaderNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
