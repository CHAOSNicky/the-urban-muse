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

      {/* SCROLLABLE WRAPPER: keep horizontal scroll on ALL screen sizes */}
      <div
        ref={containerRef}
        className="
          px-6
          overflow-x-auto overflow-y-hidden
          smooth-scroll
          snap-x snap-mandatory
          scrollbar-hide
        "
        aria-label="Trending categories"
      >
        {/* Inner flex: keep single horizontal row (no grid on md+) */}
        <div
          className="
            flex gap-1 items-start
            px-6 py-2 pr-20
            whitespace-nowrap
          "
        >
          {cards.map((c, i) => (
            <article
              key={i}
              className={`
                reveal-item snap-start flex-none
                w-64 sm:w-64 md:w-72 lg:w-80
                bg-transparent
                inline-flex flex-col items-center cursor-pointer
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
