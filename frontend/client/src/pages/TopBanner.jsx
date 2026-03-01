import React from 'react';
import './TopBanner.css';
import MainImage from './MainImage';
import TopScrollingBanner from '../components/TopScrollingBanner';

function TopBanner() {
  return (
    <div className="relative">
      {/* Top Scrolling Banner */}
      <TopScrollingBanner />

      {/* 🖼️ Image Container (constrained zoom-out) */}
      <MainImage />

      {/* Bottom Scrolling Banner */}
      <div className="bg-black overflow-hidden whitespace-nowrap py-2 relative z-20">
        <div className="scrolling-text flex">
          <div className="animate-marquee1 flex items-center gap-8 font-medium tracking-wide text-white">
            {[...Array(10)].map((_, i) => (
              <span key={i}>NEW COLLECTIONS JUST RELEASED | SHOP NOW &nbsp;</span>
            ))}
          </div>
          <div
            className="animate-marquee1 flex items-center gap-8 font-medium tracking-wide text-white"
            aria-hidden="true"
          >
            {[...Array(10)].map((_, i) => (
              <span key={`duplicate-${i}`}>&nbsp;NEW COLLECTIONS JUST RELEASED | SHOP NOW</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBanner;
