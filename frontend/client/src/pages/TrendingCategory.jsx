import React, { useEffect, useRef, useState } from "react";
import "../trendingcategory.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../Constants/CommonConst";

export default function TrendingCategory({ variant = "default" }) {
  const containerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isCompact = variant === "compact";

  const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;


  // 1️⃣ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_BASE_URL + "/api/product/get/category", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        console.log(S3_BASE_URL);
        // 2️⃣ Map backend DTO → UI model
        const mapped = data.map((item) => ({
          id: item.categoryId,
          label: item.categoryName.toUpperCase(),
          imageUrl: `${S3_BASE_URL}${item.categoryImageObjectKey}`
        }));

        setCategories(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [S3_BASE_URL]);

  // 3️⃣ IntersectionObserver (unchanged logic)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { root: containerRef.current, threshold: 0.3 }
    );

    const items = containerRef.current.querySelectorAll(".reveal-item");
    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [categories]);

  if (loading) {
    return (
      <section className="bg-[#edeaf5] py-12 text-center">
        Loading trending categories…
      </section>
    );
  }

  return (
    <section className={`bg-[#edeaf5] ${isCompact ? "py-6" : "py-12"}`}>
      <h2 className={`text-center text-black font-medium mb-8 ${isCompact ? "text-2xl" : "text-4xl"
        }`}>
        TRENDING CATEGORIES 👇
      </h2>

      <div
        ref={containerRef}
        className="px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide text-black"
      >
        <div className={`flex ${isCompact ? "gap-6" : "gap-10"
          } px-6 py-2 pr-20 whitespace-nowrap`}>
          {categories.map((c) => (
            <article
              key={c.id}
              onClick={() => navigate(`/category/${c.label.toLowerCase()}`)}
              className={`reveal-item snap-start flex-none ${isCompact ? "w-40 md:w-48" : "w-64 md:w-72 lg:w-80"
                } inline-flex flex-col items-center cursor-pointer`}
            >
              <div className={`w-full aspect-[3/4] ${isCompact ? "m-2" : "m-5"
                } overflow-hidden rounded-3xl`}>
                <img
                  src={c.imageUrl}
                  alt={c.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-500 hover:scale-110"

                  onError={(e) => {
                    e.currentTarget.src = "/fallback.png";
                  }}
                />
              </div>

              <p className={`mt-3 text-center font-semibold ${isCompact ? "text-sm" : ""
                }`}>{c.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
