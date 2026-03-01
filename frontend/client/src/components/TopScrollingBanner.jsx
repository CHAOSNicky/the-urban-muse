import React from 'react';
import '../pages/TopBanner.css';

export default function TopScrollingBanner() {
    return (
        <div className="bg-black overflow-hidden whitespace-nowrap py-2 relative z-20">
            <div className="scrolling-text flex">
                <div className="animate-marquee flex items-center gap-8 font-medium tracking-wide text-white">
                    {[...Array(10)].map((_, i) => (
                        <span key={i}>📦 FREE DELIVERY ON ALL PREPAID ORDERS | COD AVAILABLE &nbsp;</span>
                    ))}
                </div>
                <div
                    className="animate-marquee flex items-center gap-8 font-medium tracking-wide text-white"
                    aria-hidden="true"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={`duplicate-${i}`}>&nbsp;📦 FREE DELIVERY ON ALL PREPAID ORDERS | COD AVAILABLE </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
