import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoommatePosts } from '../redux/slices/roommateSlice';
import { fetchMarketplaceItems } from '../redux/slices/marketplaceSlice';

import HeroSection from '../components/home/HeroSection';
import TrustSection from '../components/home/TrustSection';
import ExploreSection from '../components/home/ExploreSection';
import FeaturedListings from '../components/home/FeaturedListings';
import CTASection from '../components/home/CTASection';

export default function Home() {
  const dispatch = useDispatch();

  const { posts: housingPosts, isLoading: housingLoading } = useSelector((state) => state.roommate);
  const { items: marketplaceItems, isLoading: marketplaceLoading } = useSelector((state) => state.marketplace);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch only a few items to show on the homepage
    dispatch(fetchRoommatePosts({}));
    dispatch(fetchMarketplaceItems({}));
  }, [dispatch]);

  const topHousing = housingPosts.slice(0, 3);
  const topMarketplace = marketplaceItems.slice(0, 3);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <HeroSection />
      <ExploreSection />
      <FeaturedListings 
        housingLoading={housingLoading} 
        topHousing={topHousing} 
        marketplaceLoading={marketplaceLoading} 
        topMarketplace={topMarketplace} 
      />
      <TrustSection />
      <CTASection isAuthenticated={isAuthenticated} />
    </div>
  );
}
