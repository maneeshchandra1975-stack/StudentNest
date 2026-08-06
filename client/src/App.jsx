/**
 * App.jsx — Root Application Component
 *
 * Responsibilities:
 *  - Wraps the app with global providers (Redux, Router, etc.)
 *  - Defines the top-level route structure
 *  - Acts as the single composition root
 *
 * Business pages live in /pages
 * Layout wrappers live in /layouts
 * Route config lives in /routes
 */

import React from 'react';

function App() {
  return (
    <div className="app-root">
      {/*
       * Router, Redux Provider, and global layouts
       * will be wired here in Phase 2 and beyond.
       */}
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            🏠 CampusNest
          </h1>
          <p className="text-slate-400 text-lg">
            Trusted Campus Housing &amp; Marketplace Platform
          </p>
          <span className="inline-block px-4 py-1.5 text-sm rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ✅ Foundation Ready — Phase 1 Complete
          </span>
        </div>
      </main>
    </div>
  );
}

export default App;
