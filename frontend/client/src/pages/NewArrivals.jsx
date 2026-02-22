import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

import trendingcategoryimage1 from '../assets/IMG_7352.PNG';
import trendingcategoryimage2 from '../assets/IMG_7353.PNG';
import trendingcategoryimage3 from '../assets/IMG_7354.PNG';
import trendingcategoryimage4 from '../assets/IMG_7355.PNG';
import trendingcategoryimage5 from '../assets/IMG_7356.PNG';
import trendingcategoryimage6 from '../assets/IMG_7357.PNG';
import trendingcategoryimage7 from '../assets/IMG_7358.PNG';
import trendingcategoryimage8 from '../assets/IMG_7359.PNG';
import trendingcategoryimage9 from '../assets/IMG_7360.PNG';
import trendingcategoryimage10 from '../assets/IMG_7361.PNG';
import trendingcategoryimage11 from '../assets/IMG_7362.PNG';
import trendingcategoryimage12 from '../assets/IMG_7363.PNG';
import trendingcategoryimage13 from '../assets/IMG_7364.PNG';
import trendingcategoryimage14 from '../assets/IMG_7365.PNG';
import trendingcategoryimage15 from '../assets/IMG_7366.PNG';
import trendingcategoryimage16 from '../assets/IMG_7367.PNG';

// Now using 2 images per card
const trendingCategories = [
  { img1: trendingcategoryimage1, img2: trendingcategoryimage2, name: 'NEW ARRIVALS', name1: 'Rs. 1,199' },
  { img1: trendingcategoryimage3, img2: trendingcategoryimage4, name: 'QUIRKY SETS', name1: 'Rs. 799' },
  { img1: trendingcategoryimage5, img2: trendingcategoryimage6, name: 'CLASSIC SOLID SETS', name1: 'Rs. 999' },
  { img1: trendingcategoryimage7, img2: trendingcategoryimage8, name: 'T-SHIRT SETS', name1: 'Rs. 1,699' },
  { img1: trendingcategoryimage9, img2: trendingcategoryimage10, name: 'FULL SLEEVE SETS', name1: 'Rs. 1,099' },
  { img1: trendingcategoryimage11, img2: trendingcategoryimage12, name: 'SUMMER SPECIALS', name1: 'Rs. 699' },
  { img1: trendingcategoryimage13, img2: trendingcategoryimage14, name: 'KIDS COLLECTION', name1: 'Rs. 899' },
  { img1: trendingcategoryimage15, img2: trendingcategoryimage16, name: 'MOMMY & ME', name1: 'Rs. 999' },
];

function NewArrivals() {
  return (
    <div className="bg-[#edeaf5] py-12">

      <h2 className="text-4xl text-center text-black font-medium font-sans mb-11">🎉 NEW ARRIVALS</h2>

      <div className=" text-black grid grid-cols-2 md:grid-cols-4 gap-6 px-8">
        {trendingCategories.map((item, index) => (
          <div
            key={index}
            className="bg-[#edeaf5] overflow-hidden flex flex-col relative"

          >
            {/* Image swap on hover */}
            <div className="h-[85%] relative w-full overflow-hidden group">
              {/* Cart Button */}
              <div className="absolute bottom-3 right-3 z-10 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <button className="bg-white flex items-center rounded w-10 hover:w-32 overflow-hidden transition-all duration-500 ease-in-out group/cart px-2 py-1 shadow-md">
                  <ShoppingCartIcon className="h-6 w-6 text-black flex-shrink-0" />
                  <span className="ml-2 whitespace-nowrap text-sm text-black opacity-0 translate-x-4 group-hover/cart:opacity-100 group-hover/cart:translate-x-0 transition-all duration-500 ease-in-out">
                    QUICK BUY
                  </span>
                </button>
              </div>

              {/* Sliding Images */}
              <div className="flex w-[200%] h-full transition-transform duration-500 group-hover:-translate-x-1/2">
                <img src={item.img1} alt="img1" className="w-1/2 h-full object-cover" />
                <img src={item.img2} alt="img2" className="w-1/2 h-full object-cover" />
              </div>
            </div>



            {/* Label section */}
            <div className="h-[8%] flex sm:items-end md:items-end justify-center pt-4 sm:pt-0">
              <p className="text-center text-xs sm:text-sm md:text-base font-semibold">
                {item.name}
              </p>
            </div>
            <div className="h-[7%] flex items-center justify-center pb-2">
              <p className="text-center font-light text-xs sm:text-sm md:text-base">
                {item.name1}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewArrivals;



