import React from 'react';
import promoImage from '../assets/photo-1567401893414-76b7b1e5a7a5.jpeg';
import HeaderNav from '../components/HeaderNav';

function MainImage() {
  return (
    <div className="relative">
      {/* Header (overlayed on image) */}
      <HeaderNav />

      {/* Hero image (responsive height + crop) */}
      <div className="
        relative overflow-hidden
        h-[70vh] min-h-[360px]
        sm:h-[64vh]
        md:h-[70vh]
        lg:h-[650px]
      ">
        <img
          src={promoImage}
          alt="Promotional Banner"
          className="
            w-full h-full object-cover
            object-center
            lg:object-[0%_50%]
            transition-transform duration-[1000ms] ease-out animate-zoomOut
          "
        />
      </div>
    </div>
  );
}

export default MainImage;
