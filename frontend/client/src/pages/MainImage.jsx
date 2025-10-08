import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import promoImage from '../assets/IMG_7315.JPG';

function MainImage() {


  
  return (
    <div>
      <div className="relative overflow-hidden z-10" style={{ maxHeight: '750px' }}>
        
        {/* 🔲 Header Bar Overlay (80px) */}
        <div className="absolute top-0 left-0 w-full h-[80px] z-20 group">
          {/* Background Slide Layer */}
          <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-[-1]"></div>

          {/* Icon Content (still visible even when background is hidden) */}
          <div className="dashboard-container relative flex justify-between items-center h-full px-4 text-black text-3xl font-medium">
            {/* Left: Hamburger */}
            <div className="hamburger-logo pl-2 text-3xl cursor-pointer">☰</div>

            {/* Center: Brand Logo */}
            <div className="brand-logo absolute left-1/2 transform -translate-x-1/2 font-luxury text-5xl cursor-pointer">URBAN MUSE</div>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-10 pr-2 text-3xl">
                 <div className="search-logo cursor-pointer"><MagnifyingGlassIcon className="h-8 w-8 text-black" /></div>
                 <div className="cart-logo cursor-pointer"><ShoppingCartIcon className="h-8 w-8 text-black" /></div>
            </div>
          </div>
        </div>

        {/* 🖼️ Image */}
        <img
          src={promoImage}
          alt="Promotional Banner"
          className="w-full object-cover object-[50%_100%] transition-transform duration-[1000ms] ease-out animate-zoomOut"
        />
      </div>
    </div>
  );
}

export default MainImage;




//  import promoImage from '../assets/IMG_7315.JPG';
 
 
//  function MainImage(){

//     return(
//         <div>
//                {/* 🖼️ Image Container (constrained zoom-out) */}
//              <div className="relative overflow-hidden z-10" style={{ maxHeight: '750px' }}>
//                 <div>

//                 </div>

//                 <img
//                     src={promoImage}
//                     alt="Promotional Banner"
//                     className="w-full object-cover transition-transform duration-[1000ms] ease-out animate-zoomOut"
//                 />
//             </div> 
//         </div>   
//     )
// }   
 

// export default MainImage;
 

