import React from 'react';
import NearbyPGs from './NearbyPGs';

export default function NearbyPGsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] font-heading">Nearby PGs & Hostels</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Discover verified living spaces directly outside the college campus.</p>
      </div>
      <NearbyPGs />
    </div>
  );
}
