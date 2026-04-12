import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Contexts/CartContext';
import { LoginContext } from '../../Contexts/LoginContexts';
import { fetchAddress, updateAddress } from '../../services/profileService';

// Import UI Blocks
import LoginBlock from './LoginBlock';
import AddressBlock from './AddressBlock';
import OrderSummaryBlock from './OrderSummaryBlock';
import PaymentBlock from './PaymentBlock';
import ConfirmOrderSection from './ConfirmOrderSection';

const LOW_STOCK_THRESHOLD = 3;

export default function CheckoutContainer() {
    const location = useLocation();
    const navigate = useNavigate();

    // Contexts
    const { login } = useContext(LoginContext);
    const { cartItems } = useContext(CartContext);

    // Local State
    const [address, setAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('card');

    // ── Auto-fetch address when user is logged in ──
    const loadAddress = useCallback(async () => {
        setAddressLoading(true);
        try {
            const result = await fetchAddress();
            if (result.success && result.data) {
                setAddress(result.data);
            }
        } catch (err) {
            console.error('[Checkout] Address fetch failed:', err);
        } finally {
            setAddressLoading(false);
        }
    }, []);

    useEffect(() => {
        if (login) {
            loadAddress();
        }
    }, [login, loadAddress]);

    // 1. FLOW DETECTION & 2. DATA SOURCE SEPARATION
    const pv = location.state?.productVariant;
    const hasBuyNowTrigger = !!pv;

    const isValidBuyNowPayload = hasBuyNowTrigger && !!(pv.varientId || pv.variantId) && pv.price !== undefined;
    const isInvalidBuyNowPayload = hasBuyNowTrigger && !isValidBuyNowPayload;
    const isBuyNowFlow = hasBuyNowTrigger && isValidBuyNowPayload;

    const flowType = isBuyNowFlow ? 'buy_now' : 'cart';

    const rawItems = isInvalidBuyNowPayload ? [] : (isBuyNowFlow ? [pv] : cartItems);

    // Normalize and compute stock ONCE
    const unifiedItems = useMemo(() => {
        const itemMap = new Map();

        (rawItems || []).forEach(item => {
            const varientId = item.varientId || item.variantId;
            const size = item.size || 'N/A';
            let identityKey = `${varientId}_${size}`;

            const requestedQty = Number(item.quantity) || 1;
            const availableQuantity = item.availableStock !== undefined ? Number(item.availableStock) : 10;

            if (itemMap.has(identityKey)) {
                const existing = itemMap.get(identityKey);
                if (existing.price === item.price && existing.name === item.name && existing.image === item.image) {
                    existing.requestedQty += requestedQty;
                } else if (existing.price !== item.price) {
                    identityKey = `${identityKey}_${item.price}`;
                    itemMap.set(identityKey, {
                        varientId, size, requestedQty, price: item.price, name: item.name, image: item.image, availableQuantity
                    });
                } else {
                    identityKey = `${identityKey}_${item.price}_${item.name}`;
                    itemMap.set(identityKey, {
                        varientId, size, requestedQty, price: item.price, name: item.name, image: item.image, availableQuantity
                    });
                }
            } else {
                itemMap.set(identityKey, {
                    varientId, size, requestedQty, price: item.price, name: item.name, image: item.image, availableQuantity
                });
            }
        });

        return Array.from(itemMap.values()).map(obj => {
            let stockStatus = 'in_stock';
            if (obj.availableQuantity === 0 || obj.requestedQty > obj.availableQuantity) {
                stockStatus = 'out_of_stock';
            } else if (obj.availableQuantity <= LOW_STOCK_THRESHOLD) {
                stockStatus = 'low_stock';
            }

            const displayQty = Math.max(0, Math.min(obj.requestedQty, obj.availableQuantity));
            const isQuantityAdjusted = obj.requestedQty > obj.availableQuantity;

            return {
                varientId: obj.varientId,
                size: obj.size,
                requestedQuantity: obj.requestedQty,
                quantity: displayQty,
                isQuantityAdjusted,
                price: obj.price || 0,
                name: obj.name || 'Product',
                image: obj.image || '',
                availableQuantity: obj.availableQuantity,
                stockStatus,
            };
        });
    }, [rawItems]);

    // 4. CENTRALIZE VALIDATION LOGIC
    const hasOutOfStock = unifiedItems.some(item => item.requestedQuantity > item.availableQuantity || item.availableQuantity === 0);
    const isGuestBlocked = !login;
    const isAddressMissing = address === null;
    const isCartEmpty = unifiedItems.length === 0;
    const isConfirmDisabled = hasOutOfStock || isGuestBlocked || isAddressMissing || isCartEmpty;

    // ── Save address to backend ──
    const handleAddressSave = useCallback(async (newAddress) => {
        setIsSavingAddress(true);
        try {
            const result = await updateAddress(newAddress);
            if (result.success) {
                // Use the data the server echoes back; fall back to what we sent
                setAddress(result.data ?? newAddress);
            } else {
                console.error('[Checkout] Address update failed:', result.error);
            }
        } catch (err) {
            console.error('[Checkout] Address update error:', err);
        } finally {
            setIsSavingAddress(false);
        }
    }, []);

    // Handlers
    const handleConfirmOrder = () => {
        if (isConfirmDisabled) return;
        console.log("Order Confirmed!", { unifiedItems, address, selectedPayment });
    };

    // ── Invalid Payload Guard ──
    if (isInvalidBuyNowPayload) {
        return (
            <div className="min-h-screen bg-[#f3f4f5] flex flex-col items-center justify-center p-8">
                <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-ambient text-center flex flex-col items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.694 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="font-manrope text-2xl font-bold text-[#191c1d]">Oops!</h2>
                    <p className="font-inter text-[#5b5a64]">This product is no longer available.</p>
                    <button onClick={() => navigate('/')} className="btn-primary-gradient text-sm px-8 py-3">
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    // ── Empty Cart Guard ──
    if (isCartEmpty && !isBuyNowFlow) {
        return (
            <div className="min-h-screen bg-[#f3f4f5] flex flex-col items-center justify-center p-8">
                <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-ambient text-center flex flex-col items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#e3e1ef] flex items-center justify-center">
                        <svg className="w-7 h-7 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="font-manrope text-2xl font-bold text-[#191c1d]">Your Cart is Empty</h2>
                    <p className="font-inter text-[#5b5a64]">Add some items and come back!</p>
                    <button onClick={() => navigate('/')} className="btn-primary-gradient text-sm px-8 py-3">
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    // ── BENTO GRID LAYOUT ──
    return (
        <div className="min-h-screen bg-[#f3f4f5] font-inter pb-40 pt-10 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Back Button & Page Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white rounded-full shadow-ambient flex items-center justify-center text-[#191c1d] hover:bg-gray-50 transition-colors"
                        aria-label="Go back"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="font-manrope text-3xl sm:text-4xl font-bold text-[#191c1d] tracking-tight">
                        Checkout
                    </h1>
                </div>

                {/* ─── The Bento Grid ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* ─── LEFT: Main Column (8 cols) ─── */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Inline Auth / Logged-in Confirmation */}
                        <LoginBlock isLoggedIn={login} />

                        {/* Address Block */}
                        <AddressBlock
                            address={address}
                            onAddressChange={handleAddressSave}
                            isSaving={isSavingAddress}
                            isLoggedIn={login}
                        />

                        {/* Payment Block */}
                        <PaymentBlock
                            selectedMethod={selectedPayment}
                            onSelectMethod={(method) => setSelectedPayment(method)}
                        />
                    </div>

                    {/* ─── RIGHT: Sticky Sidebar (4 cols) ─── */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-8">
                            <OrderSummaryBlock
                                items={unifiedItems}
                                flowType={flowType}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating CTA */}
            <ConfirmOrderSection
                isDisabled={isConfirmDisabled}
                onConfirm={handleConfirmOrder}
            />
        </div>
    );
}
