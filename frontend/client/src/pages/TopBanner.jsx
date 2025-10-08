import React from 'react';
import './TopBanner.css';
import MainImage from './MainImage';

function TopBanner() {
  return (
    <div className="relative">
      {/* 🔴 Top Scrolling Banner */}
      <div className="bg-rose-300/70 overflow-hidden whitespace-nowrap py-2 relative z-20">
        <div className="scrolling-text flex">
          <div className="animate-marquee flex items-center gap-8 font-medium tracking-wide text-black">
            {[...Array(10)].map((_, i) => (
              <span key={i}>📦 FREE DELIVERY ON ALL PREPAID ORDERS | COD AVAILABLE &nbsp;</span>
            ))}
          </div>
          <div
            className="animate-marquee flex items-center gap-8 font-medium tracking-wide text-black"
            aria-hidden="true"
          >
            {[...Array(10)].map((_, i) => (
              <span key={`duplicate-${i}`}>&nbsp;📦 FREE DELIVERY ON ALL PREPAID ORDERS | COD AVAILABLE </span>
            ))}
          </div>
        </div>
      </div>

      {/* 🖼️ Image Container (constrained zoom-out) */}
      <MainImage />

      {/* 🔴 Bottom Scrolling Banner */}
      <div className="bg-rose-300/70 overflow-hidden whitespace-nowrap py-2 relative z-20">
        <div className="scrolling-text flex">
          <div className="animate-marquee1 flex items-center gap-8 font-medium tracking-wide text-black">
            {[...Array(10)].map((_, i) => (
              <span key={i}>NEW COLLECTIONS JUST RELEASED | SHOP NOW &nbsp;</span>
            ))}
          </div>
          <div
            className="animate-marquee1 flex items-center gap-8 font-medium tracking-wide text-black"
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
