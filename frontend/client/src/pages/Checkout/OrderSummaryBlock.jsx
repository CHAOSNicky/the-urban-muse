import React from 'react';
import { normalizeImageUrl } from '../../Contexts/CartContext';

/**
 * OrderSummaryBlock — Adaptive Sticky Sidebar (Bento)
 *
 * Props:
 * - items (array): Unified cart items with stock info
 * - flowType ('cart' | 'buy_now'): Determines rendering mode
 */
export default function OrderSummaryBlock({ items, flowType = 'cart' }) {

    // Empty fallback
    if (!items || items.length === 0) {
        return (
            <div className="bg-white rounded-[32px] p-7 shadow-ambient">
                <h3 className="font-manrope text-base font-bold text-[#191c1d] mb-4">Order Summary</h3>
                <div className="bg-[#f3f4f5] rounded-2xl p-5 text-center">
                    <p className="font-inter text-sm text-[#5b5a64]">No items selected.</p>
                </div>
            </div>
        );
    }

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const isBuyNow = flowType === 'buy_now' && items.length === 1;

    return (
        <div className="bg-white rounded-[32px] p-7 shadow-ambient flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-manrope text-base font-bold text-[#191c1d]">Order Summary</h3>
                <div className="w-9 h-9 rounded-full bg-[#e3e1ef] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
            </div>

            {/* ─── BUY NOW: Hero Focus ─── */}
            {isBuyNow ? (
                <BuyNowHero item={items[0]} />
            ) : (
                /* ─── CART: Item List ─── */
                <CartItemList items={items} />
            )}

            {/* ─── Totals ─── */}
            <div className="border-t border-[#e3e1ef] pt-4 mt-1 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-inter text-sm text-[#5b5a64]">Subtotal</span>
                    <span className="font-inter text-sm text-[#191c1d] font-medium">
                        ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-inter text-sm text-[#5b5a64]">Shipping</span>
                    <span className="font-inter text-sm text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-[#f3f4f5]">
                    <span className="font-inter text-sm text-[#5b5a64]">Total</span>
                    <span className="font-manrope text-2xl text-[#191c1d] font-bold">
                        ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* ─── Trust Footer ─── */}
            <div className="flex items-center justify-center gap-2 pt-2">
                <svg className="w-3.5 h-3.5 text-[#5b5a64]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="font-inter text-[10px] text-[#5b5a64]/50 tracking-wide">
                    256-bit SSL encrypted checkout
                </p>
            </div>
        </div>
    );
}

// ─── Sub-component: Buy Now Hero ────────────────────────────────────────────
function BuyNowHero({ item }) {
    const imageUrl = normalizeImageUrl(item.image);

    return (
        <div className="flex flex-col gap-4">
            {/* Hero Image — Gallery feel */}
            <div className="w-full h-48 bg-[#f3f4f5] rounded-2xl overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover object-top"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-[#c4c5d9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div>
                <h4 className="font-manrope text-xl font-bold text-[#191c1d] leading-tight mb-2">
                    {item.name}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] bg-[#f3f4f5] text-[#5b5a64] px-3 py-1 rounded-full">
                        Size {item.size}
                    </span>
                    <span className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] bg-[#f3f4f5] text-[#5b5a64] px-3 py-1 rounded-full">
                        Qty {item.quantity}
                    </span>
                    <StockBadge status={item.stockStatus} />
                </div>
            </div>

            {/* Price */}
            <div className="font-manrope text-2xl font-bold text-[#191c1d]">
                ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
        </div>
    );
}

// ─── Sub-component: Cart Item List ──────────────────────────────────────────
function CartItemList({ items }) {
    return (
        <div className="flex flex-col gap-3">
            {items.map((item, idx) => {
                const imageUrl = normalizeImageUrl(item.image);
                const isOutOfStock = item.stockStatus === 'out_of_stock';

                return (
                    <div
                        key={`${item.varientId}-${item.size}-${idx}`}
                        className={`
                            flex items-center gap-3 bg-[#f3f4f5] rounded-2xl p-3 transition-all
                            ${isOutOfStock ? 'opacity-50 grayscale' : ''}
                        `}
                    >
                        {/* Thumbnail */}
                        <div className="w-12 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                            {imageUrl ? (
                                <img src={imageUrl} alt={item.name} className="w-full h-full object-cover object-top" />
                            ) : (
                                <div className="w-full h-full bg-[#edeeef]" />
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <p className="font-inter text-sm font-semibold text-[#191c1d] truncate">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-[#5b5a64]">
                                    {item.size}
                                </span>
                                <span className="text-[#c4c5d9]">·</span>
                                <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-[#5b5a64]">
                                    Qty {item.quantity}
                                </span>
                                <StockBadge status={item.stockStatus} />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="font-manrope text-sm font-bold text-[#191c1d] flex-shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Sub-component: Stock Badge ─────────────────────────────────────────────
function StockBadge({ status }) {
    if (status === 'in_stock') {
        return (
            <span className="inline-flex items-center gap-1 text-[#0040e0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0040e0] animate-pulse-dot" />
                <span className="font-inter text-[9px] font-bold uppercase tracking-wider">In Stock</span>
            </span>
        );
    }
    if (status === 'low_stock') {
        return (
            <span className="font-inter text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Low Stock
            </span>
        );
    }
    if (status === 'out_of_stock') {
        return (
            <span className="font-inter text-[9px] font-bold uppercase tracking-wider text-[#5b5a64] bg-[#edeeef] px-2 py-0.5 rounded-full">
                Out of Stock
            </span>
        );
    }
    return null;
}
