import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../Constants/CommonConst';

export default function SingleProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

    const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        let cancelled = false;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `${API_BASE_URL}/api/product/get/by-id/${productId}`,
                    { method: 'GET', credentials: 'include' }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch product (status ${res.status})`);
                }

                const data = await res.json();
                if (!cancelled) {
                    setProduct(data);
                    // Normalize variants for initial auto-select
                    const backendVariants = data.varientResponseList?.map((v) => ({
                        ...v,
                        size: v.size.toUpperCase(),
                    })) || [];

                    // Auto-select first variant with stock > 0 based on ALL_SIZES order
                    let firstInStockSize = '';

                    for (const size of ALL_SIZES) {
                        const variant = backendVariants.find((v) => v.size === size);
                        if (variant && variant.quantity > 0) {
                            firstInStockSize = size;
                            break;
                        }
                    }

                    if (firstInStockSize) {
                        setSelectedSize(firstInStockSize);
                    }
                }
            } catch (err) {
                console.error('SingleProductPage fetch error:', err);
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (productId) fetchProduct();

        return () => {
            cancelled = true;
        };
    }, [productId]);

    // Helpers
    const imageUrl = (objectKey) => `${S3_BASE_URL}${objectKey}`;

    const imageKeys = product?.productImageObjectKey ?? [];

    // Preload the first image as soon as product data arrives
    useEffect(() => {
        if (imageKeys.length === 0) return;
        const img = new Image();
        img.src = imageUrl(imageKeys[0]);
    }, [product?.productId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset fade when switching images
    const handleImageSelect = useCallback((idx) => {
        if (idx === selectedImageIndex) return;
        setImageLoaded(false);
        setSelectedImageIndex(idx);
    }, [selectedImageIndex]);

    const normalizedVariants = useMemo(() => {
        return product?.varientResponseList?.map((v) => ({
            ...v,
            size: v.size.toUpperCase(),
        })) || [];
    }, [product?.varientResponseList]);

    const selectedVariant = useMemo(() => {
        return normalizedVariants.find((v) => v.size === selectedSize) || null;
    }, [normalizedVariants, selectedSize]);

    const isAvailable = selectedVariant && selectedVariant.quantity > 0;

    const handleSizeSelect = (sizeStr) => {
        setSelectedSize(sizeStr);
        setQuantity(1);
    };

    const decrementQty = () => {
        setQuantity((q) => Math.max(1, q - 1));
    };

    const incrementQty = () => {
        setQuantity((q) => Math.min(100, q + 1));
    };

    const toggleAccordion = (section) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };

    // ── Loading ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-[#edeaf5] min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <p className="text-black text-lg">Loading product…</p>
                </div>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────
    if (error) {
        return (
            <div className="bg-[#edeaf5] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="underline text-black hover:text-black/70 transition-colors"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    // ── Not found ────────────────────────────────────────────
    if (!product) {
        return (
            <div className="bg-[#edeaf5] min-h-screen flex items-center justify-center">
                <p className="text-black text-lg">Product not found.</p>
            </div>
        );
    }

    // ── Main UI ──────────────────────────────────────────────
    return (
        <div className="bg-[#edeaf5] min-h-screen relative">

            {/* Back button */}
            {/* <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Go back"
            >
                <ArrowLeftIcon className="h-5 w-5 text-black" />
            </button> */}

            <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
                <div className="flex flex-col md:flex-row gap-10 md:gap-16">

                    {/* ─── Left: Image Gallery ─── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        {/* Main image */}
                        <div className="aspect-[3/4] w-full overflow-hidden bg-white relative">
                            {imageKeys.length > 0 ? (
                                <img
                                    key={imageKeys[selectedImageIndex]}
                                    src={imageUrl(imageKeys[selectedImageIndex])}
                                    alt={product.name}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        e.currentTarget.src = '/fallback.png';
                                        setImageLoaded(true);
                                    }}
                                    className={`w-full h-full object-contain transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-black/30 gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    <span className="text-sm">No image available</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {imageKeys.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {imageKeys.map((key, idx) => (
                                    <button
                                        key={key}
                                        onClick={() => handleImageSelect(idx)}
                                        className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border-2 transition-all duration-200 ${idx === selectedImageIndex
                                            ? 'border-black'
                                            : 'border-transparent hover:border-black/30'
                                            }`}
                                    >
                                        <img
                                            src={imageUrl(key)}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="w-full h-full object-contain bg-white"
                                            onError={(e) => { e.currentTarget.src = '/fallback.png'; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─── Right: Product Details ─── */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">

                        {/* Category */}
                        {product.categoryName && (
                            <p className="text-xs tracking-widest uppercase text-black/50">
                                {product.categoryName}
                            </p>
                        )}

                        {/* Name */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-black leading-tight">
                            {product.name}
                        </h1>

                        {/* Price */}
                        {selectedVariant && (
                            <p className="text-xl sm:text-2xl font-light text-black">
                                ₹{Number(selectedVariant.price).toLocaleString('en-IN')}
                            </p>
                        )}

                        {/* Availability Indicator */}
                        {selectedSize && (
                            <div className="flex items-center gap-2 mt-[-10px] text-sm">
                                {isAvailable ? (
                                    <>
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                        </span>
                                        <span className="text-black/70">Item is in stock</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                        </span>
                                        <span className="text-black/70">Stock is not available</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Limited Stock */}
                        <div className="flex items-center gap-2 text-sm text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-black/60">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                            </svg>
                            <span>Limited Stock</span>
                        </div>

                        {/* Free Shipping */}
                        <div className="flex items-center gap-2 text-sm text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-black/60">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span>Free shipping on prepaid orders</span>
                        </div>

                        {/* Divider */}
                        <hr className="border-black/10 my-1" />

                        {/* Size selector */}
                        <div>
                            <p className="text-xs tracking-widest uppercase text-black/50 mb-3">
                                Size
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {ALL_SIZES.map((sizeStr) => {
                                    const isSelected = selectedSize === sizeStr;

                                    return (
                                        <button
                                            key={sizeStr}
                                            onClick={() => handleSizeSelect(sizeStr)}
                                            className={`min-w-[3rem] px-4 py-2 text-sm border transition-all duration-200 ${isSelected
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-transparent text-black border-black/30 hover:border-black'
                                                }`}
                                        >
                                            {sizeStr}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity selector */}
                        <div>
                            <p className="text-xs tracking-widest uppercase text-black/50 mb-3">
                                Quantity
                            </p>
                            <div className="inline-flex items-center border border-black/20">
                                <button
                                    onClick={decrementQty}
                                    className="w-10 h-10 flex items-center justify-center text-black hover:bg-black/5 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="w-12 h-10 flex items-center justify-center text-sm font-medium text-black border-x border-black/20">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQty}
                                    className="w-10 h-10 flex items-center justify-center text-black hover:bg-black/5 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-2">
                            {/* Add to Cart */}
                            <button
                                disabled={!selectedVariant}
                                className="w-full py-3.5 text-sm tracking-widest uppercase font-medium transition-all duration-300 bg-black text-white hover:bg-black/85 disabled:bg-black/20 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>

                            {/* Buy Now */}
                            <button
                                disabled={!selectedVariant}
                                className="w-full py-3.5 text-sm tracking-widest uppercase font-medium transition-all duration-300 border border-black text-black bg-transparent hover:bg-black/5 disabled:border-black/20 disabled:text-black/20 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Accordions */}
                        <div className="mt-6 border-t border-black/10">

                            {/* DESCRIPTION */}
                            <div className="border-b border-black/10">
                                <button
                                    onClick={() => toggleAccordion('description')}
                                    className="w-full py-4 flex items-center justify-between text-left group"
                                >
                                    <span className="text-black/80 text-sm tracking-wider uppercase font-medium">Product Description</span>
                                    <PlusIcon className={`text-black/80 h-4 w-4 transition-transform duration-300 ${expandedSection === 'description' ? 'rotate-45' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'description' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-sm text-black/70 leading-relaxed">
                                        {product.description || 'No description available for this product.'}
                                    </p>
                                </div>
                            </div>

                            {/* SHIPPING & DELIVERY */}
                            <div className="border-b border-black/10">
                                <button
                                    onClick={() => toggleAccordion('shipping')}
                                    className="w-full py-4 flex items-center justify-between text-left group"
                                >
                                    <span className="text-black/80 text-sm tracking-wider uppercase font-medium">Shipping & Delivery</span>
                                    <PlusIcon className={`text-black/80 h-4 w-4 transition-transform duration-300 ${expandedSection === 'shipping' ? 'rotate-45' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'shipping' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                    <div className="text-sm text-black/70 space-y-2">
                                        <p>Orders placed before 12 PM are shipped the same day, while all other orders are shipped the next day.</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>Standard Delivery: Arrives within 5-7 days.</li>
                                            <li>Express Delivery: Arrives within 72 hours.</li>
                                        </ul>
                                        <p>Track your order easily with our shipping updates!</p>
                                    </div>
                                </div>
                            </div>

                            {/* EXCHANGES & RETURNS */}
                            <div className="border-b border-black/10">
                                <button
                                    onClick={() => toggleAccordion('returns')}
                                    className="w-full py-4 flex items-center justify-between text-left group"
                                >
                                    <span className="text-black/80 text-sm tracking-wider uppercase font-medium">Exchanges & Returns</span>
                                    <PlusIcon className={`text-black/80 h-4 w-4 transition-transform duration-300 ${expandedSection === 'returns' ? 'rotate-45' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'returns' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                    <p className=" text-sm text-black/70 leading-relaxed">
                                        We offer hassle-free returns and exchanges within 7 days of delivery for a small fee. To initiate a return or exchange, ensure the product is unworn, unwashed, and in its original packaging. For more details, visit our Return & Exchange Policy.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
