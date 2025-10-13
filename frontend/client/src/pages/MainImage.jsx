import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import promoImage from '../assets/photo-1567401893414-76b7b1e5a7a5.jpeg';
import { Link, useLocation } from 'react-router-dom';

function MainImage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu when route changes
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="relative">
      {/* Header (overlayed on image). On mobile it’s slightly shorter */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="h-14 sm:h-[60px] px-4 sm:px-6 bg-[#edeaf5]/90 backdrop-blur supports-[backdrop-filter]:bg-[#edeaf5]/70">
          <div className="h-full flex items-center">
            {/* Left: Brand + Mobile hamburger */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 -ml-2 rounded-xl focus:outline-none focus:ring"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen(o => !o)}
              >
                {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
              <div className="pl-1 sm:pl-2 text-xl sm:text-2xl font-semibold tracking-wide cursor-pointer">
                THE URBAN MUSE
              </div>
            </div>

            {/* Center: Desktop links */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-10 text-base">
              <Link to="/new" className="hover:underline underline-offset-4">NEW ARRIVALS</Link>
              <Link to="/contact" className="hover:underline underline-offset-4">CONTACT</Link>
              <Link to="/about" className="hover:underline underline-offset-4">ABOUT</Link>
            </nav>

            {/* Right: actions (icons on mobile, full on desktop) */}
            <div className="ml-auto flex items-center gap-4 sm:gap-6">
              <Link to="/Login" aria-label="Go To Login" className="hidden md:block text-sm sm:text-base">
                LOGIN / SIGNUP
              </Link>
              <button className="p-1" aria-label="Search">
                <MagnifyingGlassIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
              <button className="p-1" aria-label="Cart">
                <ShoppingCartIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <div
          id="mobile-nav"
          className={`lg:hidden origin-top overflow-hidden transition-[max-height] duration-300 ease-out bg-[#edeaf5]/95 backdrop-blur
          ${mobileOpen ? 'max-h-64' : 'max-h-0'}`}
        >
          <div className="px-4 py-3 flex flex-col gap-2 text-base">
            <Link to="/new" className="py-2">NEW ARRIVALS</Link>
            <Link to="/contact" className="py-2">CONTACT</Link>
            <Link to="/about" className="py-2">ABOUT</Link>
            <Link to="/Login" className="py-2 flex items-center gap-2">
              <UserIcon className="w-5 h-5" /> LOGIN / SIGNUP
            </Link>
          </div>
        </div>
      </div>

      {/* Hero image (responsive height + crop) */}
      <div className="
        relative overflow-hidden
        h-[58vh] min-h-[360px]
        sm:h-[64vh]
        md:h-[70vh]
        lg:h-[600px]
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






// import React from 'react';
// import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
// import promoImage from '../assets/photo-1567401893414-76b7b1e5a7a5.jpeg';
// import { Link } from 'react-router-dom';

// function MainImage() {


//   return (
//     <div>
//       <div className="relative overflow-hidden max-h-[620px] h-[620px]">
        
//         {/* 🔲 Header Bar Overlay (80px) */}
//         <div className="absolute top-0 left-0 w-full h-[60px] z-20">
//           {/* Icon Content (still visible even when background is hidden) */}
//           <div className="px-5 relative bg-[#edeaf5] flex items-center h-full text-black text-3xl font-medium">

//             {/* Center: Brand Logo */}
//             <div className="pl-5 flex-1 brand-logo text-black text-3xl cursor-pointer">THE URBAN MUSE</div>

//             <div className="flex flex-1 text-base items-center justify-between px-40">
//               <div>NEW ARRIVALS</div>
//               <div>CONTACT</div>
//               <div>ABOUT</div>
//             </div>

//             {/* Right: Search + Cart */}
//             <div className="flex flex-1 justify-end items-center gap-10 pr-6 text-lg">
//                  <Link to="/Login" aria-label="Go To Login">
//                         <div className="text-black">LOGIN / SIGNUP</div>
//                  </Link>
//                  <div className="search-logo cursor-pointer"><MagnifyingGlassIcon className="h-8 w-8 text-black" /></div>
//                  <div className="cart-logo cursor-pointer"><ShoppingCartIcon className="h-8 w-8 text-black" /></div>
//             </div>
//           </div>
//           </div>

//         {/* 🖼️ Image */}
//         <img
//           src={promoImage}
//           alt="Promotional Banner"
//           className="w-full h-full object-cover object-[0%_50%] transition-transform duration-[1000ms] ease-out animate-zoomOut"
//         />
//       </div>
//     </div>
//   );
// }

// export default MainImage;

