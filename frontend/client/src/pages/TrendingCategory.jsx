import React from 'react';
import trendingcategoryimage1 from '../assets/IMG_7329.PNG';
import trendingcategoryimage2 from '../assets/IMG_7330.PNG';
import trendingcategoryimage3 from '../assets/IMG_7331.PNG';
import trendingcategoryimage4 from '../assets/IMG_7332.PNG';
import trendingcategoryimage5 from '../assets/IMG_7334.PNG';

function TrendingCategory() {
  return (
    <div className="bg-[#edeaf5] py-12">
      <h2 className="text-4xl text-center font-medium font-sans mb-11">
        TRENDING CATEGORIES
      </h2>

      <div className="flex justify-between gap-x-10 mx-10">
        {/* Card 1 */}
        <div className="w-1/5 flex flex-col items-center cursor-pointer">
          <div className="w-full aspect-[3/4] relative overflow-hidden">
            <img
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
              src={trendingcategoryimage1}
              alt="trendingcategoryimage1"
            />
          </div>
          <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            NEW ARRIVALS
          </p>
        </div>

        {/* Card 2 */}
        <div className="w-1/5 flex flex-col items-center cursor-pointer">
          <div className="w-full aspect-[3/4] relative overflow-hidden">
            <img
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
              src={trendingcategoryimage2}
              alt="trendingcategoryimage2"
            />
          </div>
          <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            QURIKY SETS
          </p>
        </div>

        {/* Card 3 */}
        <div className="w-1/5 flex flex-col items-center cursor-pointer">
          <div className="w-full aspect-[3/4] relative overflow-hidden">
            <img
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
              src={trendingcategoryimage3}
              alt="trendingcategoryimage3"
            />
          </div>
          <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            CLASSIC SOLID SETS
          </p>
        </div>

        {/* Card 4 */}
        <div className="w-1/5 flex flex-col items-center cursor-pointer">
          <div className="w-full aspect-[3/4] relative overflow-hidden">
            <img
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
              src={trendingcategoryimage4}
              alt="trendingcategoryimage4"
            />
          </div>
          <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            T-SHIRT SETS
          </p>
        </div>

        {/* Card 5 */}
        <div className="w-1/5 flex flex-col items-center cursor-pointer">
          <div className="w-full aspect-[3/4] relative overflow-hidden">
            <img
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
              src={trendingcategoryimage1}
              alt="trendingcategoryimage5"
            />
          </div>
          <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            FULL SLEEVE SETS
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrendingCategory;

