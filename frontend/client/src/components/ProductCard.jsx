import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

    const keys = Array.isArray(product.productImageObjectKey)
        ? product.productImageObjectKey
        : [];

    const img1 = keys[0] ? `${S3_BASE_URL}${keys[0]}` : '/fallback.png';
    // If only one image, duplicate it so the slide container never shows empty space
    const img2 = keys[1] ? `${S3_BASE_URL}${keys[1]}` : img1;

    const handleCardClick = () => {
        navigate(`/product/${product.productId}`);
    };

    const handleQuickBuy = (e) => {
        e.stopPropagation();
        // TODO: Quick buy logic
    };

    return (
        <div
            className="bg-[#edeaf5] overflow-hidden flex flex-col relative cursor-pointer"
            onClick={handleCardClick}
        >

            {/* Image container + cart button */}
            <div className="aspect-[4/5] md:aspect-[3/4] md:h-[85%] relative w-full overflow-hidden group rounded-lg">

                {/* Quick Buy button — matches NewArrivals exactly */}
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 z-10 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <button
                        onClick={handleQuickBuy}
                        className="bg-white flex items-center rounded w-8 md:w-10 hover:w-28 md:hover:w-32 overflow-hidden transition-all duration-500 ease-in-out group/cart px-1 md:px-2 py-1 shadow-md"
                    >
                        <ShoppingCartIcon className="h-4 w-4 md:h-6 md:w-6 text-black flex-shrink-0" />
                        <span className="ml-1 md:ml-2 whitespace-nowrap text-[10px] md:text-sm text-black opacity-0 translate-x-4 group-hover/cart:opacity-100 group-hover/cart:translate-x-0 transition-all duration-500 ease-in-out">
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
            <div className="h-[8%] flex items-end justify-center pt-3 md:pt-4">
                <p className="text-center text-[10px] sm:text-sm md:text-base font-semibold">
                    {product.name}
                </p>
            </div>

            {/* Price / description */}
            <div className="h-[7%] flex items-center justify-center pb-1 md:pb-2">
                <p className="text-center font-light text-[9px] sm:text-sm md:text-base">
                    {product.description || ''}
                </p>
            </div>

        </div>
    );
}
