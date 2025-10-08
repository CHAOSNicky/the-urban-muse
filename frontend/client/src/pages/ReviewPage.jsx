import { DivideIcon } from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid';
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

const scrollingItems = [
  { img: trendingcategoryimage1, text: "Style One" },
  { img: trendingcategoryimage2, text: "Look Two" },
  { img: trendingcategoryimage3, text: "Fit Three" },
  { img: trendingcategoryimage4, text: "Trend Four" },
  { img: trendingcategoryimage5, text: "Design Five" },
  { img: trendingcategoryimage6, text: "Urban Six" },
  { img: trendingcategoryimage7, text: "Fresh Seven" },
  { img: trendingcategoryimage8, text: "Modern Eight" },
  { img: trendingcategoryimage9, text: "Classic Nine" },
  { img: trendingcategoryimage10, text: "Chic Ten" },
  { img: trendingcategoryimage11, text: "Cool Eleven" },
  { img: trendingcategoryimage12, text: "Bold Twelve" },
];

import React from 'react'

function ReviewPage(){


    return(
    <div className="bg-[#ceacc4]">

        {/* {OuterDiv} */}
        <div>

            {/* {UpperPart} */}
            <div className='pt-10'> 

                {/* {heartemoji} */}
                <div className='flex justify-center mb-8'>
                    <div className='bg-white inline-block p-2 rounded-full relative'>
                        <HeartIcon className="h-10 w-10 text-[#ceacc4] relative top-0.5" />
                    </div>
                </div>

                {/* {para1} */}
                <div className='flex justify-center mb-8'>
                    <p className='text-4xl text-white'>Wear it. Review it. Love it.</p>
                </div>

                {/* {para2} */}
                <div className='flex justify-center w-full px-8 mb-8'>
                    <div className='w-6/6 md:w-3/6'>
                        <p className='text-white text-lg text-center font-light'>Tag your photos with @urbanmuse on Instagram and you might just see yourself on our website — because your style deserves the spotlight.</p>
                    </div>
                </div>
                
            </div>

            {/* {imagecards} */}
            <div className="overflow-hidden bg-[#ceacc4] py-6">
                <div
                    className="flex whitespace-nowrap"
                    style={{
                    animation: 'scrolling 30s linear infinite',
                    }}
                >
                    {/* Duplicate to fake infinite scroll */}
                    {[...scrollingItems, ...scrollingItems].map((item, index) => (
                    <div
                        key={index}
                        className="flex-none px-4"
                    >
                        <div className="bg-white border-x-[25px] border-t-[25px] border-white rounded shadow">
                            <img
                                src={item.img}
                                alt={item.text}
                                className="w-full h-96 object-cover"
                            />
                            <div className="text-center py-2 text-sm font-medium text-black">
                                {item.text}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Inline style for animation */}
                <style>
                    {`
                    @keyframes scrolling {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                    `}
                </style>
            </div>


        </div>
    </div>
)
}


export default ReviewPage;