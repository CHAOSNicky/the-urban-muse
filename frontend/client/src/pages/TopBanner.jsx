import React from 'react';
import './TopBanner.css';
import MainImage from './MainImage';

function TopBanner() {
  const containerRef = React.useRef(null);

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full bg-[#edeaf5]">
      {/* 🚀 Unitary Sticky Slide */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Sequence Hero is now the full-screen background */}
        <div className="absolute inset-0 z-0">
          <MainImage section="hero" parentRef={containerRef} />
        </div>

        {/* Header Segment: Absolute overlay at the top */}
        <div className="absolute top-0 left-0 w-full z-20">
          <MainImage section="header" />
        </div>

        {/* Marquee Segment: Absolute overlay at the bottom */}
        <div className="absolute bottom-0 left-0 w-full z-20 bg-black/80 backdrop-blur-sm overflow-hidden whitespace-nowrap py-3">
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
    </div>
  );
}

export default TopBanner;
