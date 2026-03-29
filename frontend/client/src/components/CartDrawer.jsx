import React, { useContext, useEffect, useState } from 'react';
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CartContext, normalizeImageUrl } from '../Contexts/CartContext';

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

    const maxProgress = Math.min((currentTotal / freeGiftThreshold) * 100, 100);
    const hasFreeShipping = currentTotal >= freeShippingThreshold;
    const hasFreeGift = currentTotal >= freeGiftThreshold;

    return (
        <div className="relative w-full overflow-hidden bg-gray-800 text-white py-3 sm:py-4 px-3 sm:px-4 flex flex-col items-center">
            <div className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 tracking-wide text-gray-100">Best reward unlocked</div>

            <div className="relative w-full max-w-full flex flex-col gap-2">
                {/* Labels Top */}
                <div className="flex justify-between items-center w-full gap-2">
                    <span className="whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#222] px-2 py-0.5 rounded text-gray-200">Free Shipping</span>
                    <span className="whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#222] px-2 py-0.5 rounded text-gray-200">Free Gift</span>
                </div>

                {/* Progress Bar Container */}
                <div className="relative w-full h-6 flex items-center">
                    {/* Background track */}
                    <div className="absolute left-0 w-full h-2 bg-gray-700 rounded-full z-0"></div>
                    {/* Active progress */}
                    <div
                        className="absolute left-0 h-2 bg-purple-400 rounded-full transition-all duration-500 ease-out z-0 shadow-[0_0_10px_rgba(192,132,252,0.5)]"
                        style={{ width: `${maxProgress}%` }}
                    ></div>

                     {/* Nodes */}
                     <div className="absolute left-0 w-full flex justify-between items-center z-10">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-black transition-colors ${hasFreeShipping ? 'bg-purple-500 text-white' : 'bg-[#333] text-gray-500'}`}>
                                {hasFreeShipping && (
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                          </div>
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-black transition-colors ${hasFreeGift ? 'bg-purple-500 text-white' : 'bg-[#333] text-gray-500'}`}>
                                {hasFreeGift && (
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                          </div>
                     </div>
                </div>

                {/* Milestones Bottom */}
                <div className="flex justify-between items-center w-full text-xs sm:text-sm font-medium">
                    <span className="text-gray-300">₹999</span>
                    <span className="text-gray-300">₹4,999</span>
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
                                <div key={item.id} className="flex gap-3 items-start justify-between p-2 sm:p-3 bg-white border border-purple-100 rounded-lg shadow-sm relative group w-full">
                                    {/* 1. Image */}
                                    <div className="relative w-20 h-24 object-cover flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200 shadow-inner">
                                        <img src={normalizeImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover object-top" />
                                        <div className="absolute -top-2 -right-2 bg-purple-600 border border-purple-800 text-white text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-sm z-10">
                                            {item.quantity}
                                        </div>
                                    </div>

                                    {/* 2. Content */}
                                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                                        <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1 overflow-hidden text-ellipsis line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                                            <span className="text-[11px] font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase tracking-wider border border-gray-200">
                                                {item.size}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-900 font-bold tracking-tight">
                                            ₹{item.price.toLocaleString('en-IN')}
                                        </div>

                                        {item.isOverStock && (
                                            <div className="mt-1 text-xs px-2 py-1.5 bg-red-50 border border-red-300 text-red-600 rounded-md w-full break-words">
                                                <div className="flex items-start gap-1.5 align-top">
                                                    <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                    <span className="font-medium">Only {item.availableStock} in stock</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Stepper */}
                                    <div className="flex-shrink-0 min-w-[90px] flex flex-col justify-between items-end h-24">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                        <QuantityStepper
                                            quantity={item.quantity}
                                            onUpdate={(newQ) => syncQuantityWithBackend(item.id, item.variantId, item.size, newQ)}
                                        />
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
