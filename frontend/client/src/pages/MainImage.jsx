import React from 'react';
import HeaderNav from '../components/HeaderNav';
import ScrollSequenceHero from '../components/ScrollSequenceHero';
import TopScrollingBanner from '../components/TopScrollingBanner';

function MainImage({ section, parentRef }) {
  // If no section specified, render full stack (legacy support)
  if (!section) {
    return (
      <div className="relative w-full">
        <div className="relative w-full z-[100]">
          <TopScrollingBanner />
          <HeaderNav />
        </div>
        <div className="relative z-10 w-full">
          <ScrollSequenceHero />
        </div>
      </div>
    );
  }

  // Unitary Slide segments
  if (section === 'header') {
    return (
      <div className="relative w-full z-[100]">
        <TopScrollingBanner />
        <HeaderNav />
      </div>
    );
  }

  if (section === 'hero') {
    return (
      <div className="relative z-10 w-full h-full">
        <ScrollSequenceHero externalRef={parentRef} />
      </div>
    );
  }

  return null;
}

export default MainImage;
