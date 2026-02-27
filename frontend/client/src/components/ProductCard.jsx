import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product }) {
    const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

    const keys = Array.isArray(product.productImageObjectKey)
        ? product.productImageObjectKey
        : [];

    const img1 = keys[0] ? `${S3_BASE_URL}${keys[0]}` : '/fallback.png';
    // If only one image, duplicate it so the slide container never shows empty space
    const img2 = keys[1] ? `${S3_BASE_URL}${keys[1]}` : img1;

    return (
        <div className="bg-[#edeaf5] overflow-hidden flex flex-col relative">

            {/* Image container + cart button */}
            <div className="h-[85%] relative w-full overflow-hidden group aspect-[3/4]">

                {/* Quick Buy button — matches NewArrivals exactly */}
                <div className="absolute bottom-3 right-3 z-10 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <button className="bg-white flex items-center rounded w-10 hover:w-32 overflow-hidden transition-all duration-500 ease-in-out group/cart px-2 py-1 shadow-md">
                        <ShoppingCartIcon className="h-6 w-6 text-black flex-shrink-0" />
                        <span className="ml-2 whitespace-nowrap text-sm text-black opacity-0 translate-x-4 group-hover/cart:opacity-100 group-hover/cart:translate-x-0 transition-all duration-500 ease-in-out">
                            QUICK BUY
                        </span>
                    </button>
                </div>

                {/* Sliding images — matches NewArrivals exactly */}
                <div className="flex w-[200%] h-full transition-transform duration-500 group-hover:-translate-x-1/2">
                    <img
                        src={img1}
                        alt={product.name}
                        className="w-1/2 h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/fallback.png'; }}
                    />
                    <img
                        src={img2}
                        alt={`${product.name} alt`}
                        className="w-1/2 h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/fallback.png'; }}
                    />
                </div>
            </div>

            {/* Name */}
            <div className="h-[8%] flex sm:items-end md:items-end justify-center pt-4 sm:pt-0">
                <p className="text-center text-xs sm:text-sm md:text-base font-semibold">
                    {product.name}
                </p>
            </div>

            {/* Price / description */}
            <div className="h-[7%] flex items-center justify-center pb-2">
                <p className="text-center font-light text-xs sm:text-sm md:text-base">
                    {product.description || ''}
                </p>
            </div>

        </div>
    );
}
