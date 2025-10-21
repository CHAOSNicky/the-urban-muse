import React, { useEffect, useRef } from "react";
import trendingcategoryimage1 from "../assets/IMG_7329.PNG";
import trendingcategoryimage2 from "../assets/IMG_7330.PNG";
import trendingcategoryimage3 from "../assets/IMG_7331.PNG";
import trendingcategoryimage4 from "../assets/IMG_7332.PNG";
import trendingcategoryimage5 from "../assets/IMG_7334.PNG";
import '../trendingcategory.css';

const cards = [
  { img: trendingcategoryimage1, label: "NEW ARRIVALS" },
  { img: trendingcategoryimage2, label: "QURIKY SETS" },
  { img: trendingcategoryimage3, label: "CLASSIC SOLID SETS" },
  { img: trendingcategoryimage4, label: "T-SHIRT SETS" },
  { img: trendingcategoryimage5, label: "FULL SLEEVE SETS" },
];

export default function TrendingCategory() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Intersection Observer to add .in-view when card enters viewport (for reveal)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { root: containerRef.current, threshold: 0.3 }
    );

    const items = containerRef.current?.querySelectorAll(".reveal-item");
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#edeaf5] py-12">
      <h2 className="text-4xl text-center font-medium font-sans mb-8">
        TRENDING CATEGORIES
      </h2>

      {/* SCROLLABLE WRAPPER: horizontal scroll on small screens, static grid on md+ */}
      <div
        ref={containerRef}
        className="
          px-6
          overflow-x-auto md:overflow-visible
          scrollbar-hide
          smooth-scroll
          snap-x snap-mandatory
          /* allow edge peek */
        "
        aria-label="Trending categories"
      >
        {/* Inner flex: on small screens cards are inline (no wrap) and snap; on md+ we use justify-between and wrap into 5 equal columns */}
        <div
          className="
            inline-flex md:grid md:grid-cols-5 md:gap-x-10 md:justify-between
            gap-4 items-start
            px-6 py-2
          "
          // Ensure items don't wrap on small screens
        >
          {cards.map((c, i) => (
            <article
              key={i}
              className={`
                reveal-item snap-start flex-shrink-0
                w-64 md:w-auto
                md:mx-0
                bg-transparent
                flex flex-col items-center cursor-pointer
              `}
              role="button"
              tabIndex={0}
              aria-label={c.label}
            >
              <div className="w-full aspect-[3/4] relative overflow-hidden rounded-lg">
                <img
                  src={c.img}
                  alt={c.label}
                  className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <p className="mt-3 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold">
                {c.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}







// import React from 'react';
// import trendingcategoryimage1 from '../assets/IMG_7329.PNG';
// import trendingcategoryimage2 from '../assets/IMG_7330.PNG';
// import trendingcategoryimage3 from '../assets/IMG_7331.PNG';
// import trendingcategoryimage4 from '../assets/IMG_7332.PNG';
// import trendingcategoryimage5 from '../assets/IMG_7334.PNG';
// import '../trendingcategory.css';

// function TrendingCategory() {
//   return (
//     <div className="bg-[#edeaf5] py-12">
//       <h2 className="text-4xl text-center font-medium font-sans mb-11">
//         TRENDING CATEGORIES
//       </h2>

//       <div className="flex justify-between gap-x-10 mx-10">
//         {/* Card 1 */}
//         <div className="w-1/5 flex flex-col items-center cursor-pointer">
//           <div className="w-full aspect-[3/4] relative overflow-hidden">
//             <img
//               className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
//               src={trendingcategoryimage1}
//               alt="trendingcategoryimage1"
//             />
//           </div>
//           <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
//             NEW ARRIVALS
//           </p>
//         </div>

//         {/* Card 2 */}
//         <div className="w-1/5 flex flex-col items-center cursor-pointer">
//           <div className="w-full aspect-[3/4] relative overflow-hidden">
//             <img
//               className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
//               src={trendingcategoryimage2}
//               alt="trendingcategoryimage2"
//             />
//           </div>
//           <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
//             QURIKY SETS
//           </p>
//         </div>

//         {/* Card 3 */}
//         <div className="w-1/5 flex flex-col items-center cursor-pointer">
//           <div className="w-full aspect-[3/4] relative overflow-hidden">
//             <img
//               className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
//               src={trendingcategoryimage3}
//               alt="trendingcategoryimage3"
//             />
//           </div>
//           <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
//             CLASSIC SOLID SETS
//           </p>
//         </div>

//         {/* Card 4 */}
//         <div className="w-1/5 flex flex-col items-center cursor-pointer">
//           <div className="w-full aspect-[3/4] relative overflow-hidden">
//             <img
//               className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
//               src={trendingcategoryimage4}
//               alt="trendingcategoryimage4"
//             />
//           </div>
//           <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
//             T-SHIRT SETS
//           </p>
//         </div>

//         {/* Card 5 */}
//         <div className="w-1/5 flex flex-col items-center cursor-pointer">
//           <div className="w-full aspect-[3/4] relative overflow-hidden">
//             <img
//               className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
//               src={trendingcategoryimage1}
//               alt="trendingcategoryimage5"
//             />
//           </div>
//           <p className="mt-2 text-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
//             FULL SLEEVE SETS
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TrendingCategory;

