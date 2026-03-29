import React, { useContext, useEffect, useState } from 'react';
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CartContext } from '../Contexts/CartContext';

// --- Sub-components to keep main component clean ---

const QuantityStepper = ({ quantity, onUpdate }) => {
    const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

    const handleUpdate = (newQuantity) => {
        if (isUpdatingQuantity) return;
        setIsUpdatingQuantity(true);
        onUpdate(newQuantity);
        setTimeout(() => {
            setIsUpdatingQuantity(false);
        }, 1000);
    };

    return (
        <div className={`flex items-center border border-gray-200 rounded-md overflow-hidden bg-white transition-all duration-200 ${isUpdatingQuantity ? 'opacity-60 pointer-events-none' : ''}`}>
            <button
                onClick={() => handleUpdate(quantity - 1)}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1 || isUpdatingQuantity}
                aria-label="Decrease quantity"
            >
                <MinusIcon className="h-4 w-4" />
            </button>
            <div className="w-10 text-black text-center text-sm font-medium">
                {quantity}
            </div>
            <button
                onClick={() => handleUpdate(quantity + 1)}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdatingQuantity}
                aria-label="Increase quantity"
            >
                <PlusIcon className="h-4 w-4" />
            </button>
        </div>
    );
};

const RewardProgressBar = ({ currentTotal }) => {
    const freeShippingThreshold = 999;
    const freeGiftThreshold = 4999;

    // Calculate progress percentage based on the max threshold
    const maxProgress = Math.min((currentTotal / freeGiftThreshold) * 100, 100);

    const hasFreeShipping = currentTotal >= freeShippingThreshold;
    const hasFreeGift = currentTotal >= freeGiftThreshold;

    return (
        <div className="w-full bg-gray-800 text-white py-3 sm:py-4 px-4 sm:px-6 flex flex-col items-center">
            <div className="text-sm sm:text-md font-medium mb-6 sm:mb-10">Best reward unlocked</div>

            <div className="relative w-full max-w-sm mb-6">
                {/* Background track */}
                <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 bg-gray-700 rounded-full"></div>
                {/* Active progress */}
                <div
                    className="absolute top-1/2 left-0 h-2 -translate-y-1/2 bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${maxProgress}%` }}
                ></div>

                {/* Shipping Node */}
                <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${(freeShippingThreshold / freeGiftThreshold) * 100}%` }}>
                    <div className="absolute -top-6 whitespace-nowrap bg-[#222] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Free Shipping
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-black z-10 transition-colors ${hasFreeShipping ? 'bg-black text-white' : 'bg-[#333]'}`}>
                        {hasFreeShipping && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <div className="absolute -bottom-6 bg-black text-xs px-2 py-0.5 rounded-full border border-gray-600">
                        ₹999
                    </div>
                </div>

                {/* Gift Node */}
                <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ right: '0%' }}>
                    <div className="absolute -top-8 whitespace-nowrap bg-[#222] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Free Gift Worth ₹999
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-black z-10 transition-colors ${hasFreeGift ? 'bg-black text-white' : 'bg-[#333]'}`}>
                        {hasFreeGift && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <div className="absolute -bottom-6 bg-black text-xs px-2 py-0.5 rounded-full border border-gray-600">
                        ₹4,999
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Cart Drawer Component ---

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, syncQuantityWithBackend, removeFromCart, cartError, setCartError, canCheckout } = useContext(CartContext);
    const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

    useEffect(() => {
        if (isCartOpen) {
            console.log("CartDrawer Diagnosics -> render cartItems:", cartItems.map(i => ({ name: i.name, qty: i.quantity, isOverStock: i.isOverStock, availableStock: i.availableStock })));
            console.log("CartDrawer Diagnosics -> canCheckout:", canCheckout);
        }
    }, [isCartOpen, cartItems, canCheckout]);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    // Auto-clear error after 3 seconds
    useEffect(() => {
        if (cartError) {
            const timer = setTimeout(() => setCartError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [cartError, setCartError]);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <>
            {/* Backdrop Overlay */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                    onClick={() => setIsCartOpen(false)}
                />
            )}

            {/* Slide-out Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] lg:w-[30vw] sm:min-w-[320px] sm:max-w-[500px] bg-[#f3e8ff] z-50 transform transition-transform duration-400 ease-[cubic-bezier(0.46,0.01,0.32,1)] flex flex-col shadow-[-14px_8px_14.4px_0_rgba(0,0,0,0.35)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* 1. Header Area */}
                <div className="flex-shrink-0 bg-[#f3e8ff] z-10 relative">
                    {/* Error Banner Overlay */}
                    {cartError && (
                        <div className="absolute top-16 left-0 right-0 z-20 mx-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-xs shadow-lg animate-fade-in-down">
                            {cartError}
                        </div>
                    )}
                    <div className="flex items-center justify-between px-3 py-3 sm:p-4 bg-white/50 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-medium text-black tracking-wide">Your Cart</h2>
                            {totalItems > 0 && (
                                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 sm:p-1 hover:bg-black/5 rounded-full transition-colors"
                            aria-label="Close cart"
                        >
                            <XMarkIcon className="w-6 h-6 text-black" />
                        </button>
                    </div>

                    {/* Alert Banner */}
                    <div className="bg-purple-500 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-widest py-2 text-center flex items-center justify-center gap-2">
                        <span className="text-[10px]">✦</span>
                        COD OPTION AVAILABLE UPTO ₹3000/-
                        <span className="text-[10px]">✦</span>
                    </div>

                    {/* Progress Bar */}
                    <RewardProgressBar currentTotal={totalPrice} />
                </div>

                {/* 2. Scrollable Cart Items Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-3 sm:p-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center px-4">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 sm:gap-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-3 sm:gap-4 p-2 sm:p-3 bg-[#f3e8ff] rounded-lg relative group">
                                    {/* Product Image with Badge */}
                                    <div className="relative w-20 h-24 sm:w-28 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={`${S3_BASE_URL}${item.image}`} alt={item.name} className="w-full h-full object-cover object-top" />
                                        <div className="absolute -top-2 -right-2 bg-white border border-gray-200 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm z-10">
                                            {item.quantity}
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col py-1 min-w-0">
                                        <div className="flex justify-between items-start pr-6">
                                            <h3 className="text-sm sm:text-base font-medium text-black leading-tight pr-2 truncate max-w-[70%]">{item.name}</h3>
                                        </div>

                                        <div className="flex flex-col mt-1 gap-1">
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-transparent text-xs">{item.size}</span>
                                            </div>
                                            {item.isOverStock && (
                                                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs transition-all duration-200 ease-out animate-fade-in-down mb-2 break-words leading-tight">
                                                    <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                                                    <span>Only {item.availableStock} items available in stock</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-2 sm:mt-3">
                                            <div className="text-sm sm:text-base text-black font-medium">₹{item.price.toLocaleString('en-IN')}</div>
                                            <QuantityStepper
                                                quantity={item.quantity}
                                                onUpdate={(newQ) => syncQuantityWithBackend(item.id, item.variantId, item.size, newQ)}
                                            />
                                        </div>

                                        {/* Remove Button - Top Right absolute relative to item */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute top-2 right-2 p-2 sm:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Footer Area */}
                {cartItems.length > 0 && (
                    <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-3 sm:p-4 sticky bottom-0 z-20">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-col">
                                <span className="text-lg sm:text-xl font-bold text-black">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                <span className="text-[10px] sm:text-xs text-gray-500">Inclusive of all taxes</span>
                            </div>

                            <div className="flex flex-col flex-1 pl-3 sm:pl-4 items-end">
                                {!canCheckout && (
                                    <p className="text-[10px] sm:text-xs text-red-500 mb-1 text-center w-full font-medium leading-tight">
                                        Adjust quantities to stock
                                    </p>
                                )}
                                <button
                                    disabled={!canCheckout}
                                    aria-label="Proceed to checkout"
                                    className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3.5 sm:py-3 px-2 sm:px-6 rounded-md flex items-center justify-center gap-1 sm:gap-2 transition-colors tracking-widest text-xs sm:text-sm shadow-sm"
                                >
                                    CHECKOUT
                                    <div className="hidden sm:flex items-center gap-1 ml-1 bg-white rounded-full px-1.5 py-0.5 scale-90">
                                        <div className="w-3 sm:w-4 h-3 sm:h-4 bg-blue-500 rounded-full"></div>
                                        <div className="w-3 sm:w-4 h-3 sm:h-4 bg-purple-600 rounded-full -ml-2"></div>
                                        <div className="w-3 sm:w-4 h-3 sm:h-4 bg-cyan-400 rounded-full -ml-2"></div>
                                    </div>
                                    <span>{`>`}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
