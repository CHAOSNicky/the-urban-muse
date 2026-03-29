import React, { createContext, useState, useCallback, useRef, useEffect, useContext } from 'react';
import API_BASE_URL from "../Constants/CommonConst";
import { LoginContext } from './LoginContexts';
import { fetchBackendCart } from '../services/cartSyncService';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const { login } = useContext(LoginContext);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [cartError, setCartError] = useState(null);
    const [canCheckout, setCanCheckout] = useState(true);

    // Clear cart on logout (login: true → false)
    const prevLoginRef = useRef(login);
    useEffect(() => {
        if (prevLoginRef.current && !login) {
            setCartItems([]);
        }
        prevLoginRef.current = login;
    }, [login]);

    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedItems = localStorage.getItem('urban_muse_cart');
            if (savedItems) {
                const parsedItems = JSON.parse(savedItems);
                // Clean legacy localStorage items that might still have `varientId`
                return parsedItems.map(item => {
                    const cleanedVariantId = item.variantId || item.varientId;
                    const { varientId, ...cleanItem } = item; // Stripping varientId
                    return { ...cleanItem, variantId: cleanedVariantId };
                });
            }
            return [];
        } catch (error) {
            console.error('Failed to parse cart from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('urban_muse_cart', JSON.stringify(cartItems));
        // canCheckout is false if any item is marked as over stock
        const hasErrors = cartItems.some(item => item.isOverStock);
        const newCanCheckout = !hasErrors && !isChecking;
        setCanCheckout(newCanCheckout);
    }, [cartItems, isChecking]);

    // Drawer-Open Auto-Check
    useEffect(() => {
        if (!isCartOpen || cartItems.length === 0) return;
        let isMounted = true;

        const checkAllInitialStock = async () => {
            setIsChecking(true);
            try {
                const promises = cartItems.map(async (item) => {
                    console.log("Stock validation payload:", {
                        variantId: item.variantId,
                        size: item.size.toUpperCase(),
                        quantity: item.quantity
                    });

                    const response = await fetch(`${API_BASE_URL}/api/cart/check-stock`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            variantId: item.variantId,
                            size: item.size.toUpperCase(),
                            quantity: item.quantity
                        }),
                    });

                    const data = await response.json();
                    console.log("Stock API response:", data);
                    return { id: item.id, availableStock: data.availableStock };
                });

                const results = await Promise.all(promises);
                if (!isMounted) return;

                let hasErrors = false;
                setCartItems(prev => prev.map(item => {
                    const res = results.find(r => r.id === item.id);
                    if (res) {
                        const isOverStock = item.quantity > res.availableStock;
                        if (isOverStock) hasErrors = true;
                        return {
                            ...item,
                            isOverStock: isOverStock,
                            availableStock: res.availableStock
                        };
                    }
                    return item;
                }));

                if (hasErrors) setCartError("Some items in your cart exceed available stock.");
            } catch (error) {
                console.error("Auto-check failed", error);
            } finally {
                if (isMounted) setIsChecking(false);
            }
        };

        checkAllInitialStock();
        return () => { isMounted = false; };
    }, [isCartOpen]);

    const generateUUID = () => {
        // Check if crypto.randomUUID exists (only on HTTPS)
        if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        // Fallback for HTTP / Older Browsers
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    // Ref to read current cart without adding cartItems to useCallback deps
    const cartItemsRef = useRef(cartItems);
    useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

    // Helper: set backend cart items while preserving previous order
    const setCartItemsPreservingOrder = useCallback((newItems) => {
        setCartItems(prev => {
            const orderMap = {};
            prev.forEach((item, idx) => {
                orderMap[`${item.variantId}_${item.size}`] = idx;
            });

            const normalized = newItems.map(item => ({
                ...item,
                id: item.id || generateUUID(),
                isOverStock: item.isOverStock ?? false,
                availableStock: item.availableStock ?? undefined,
            }));

            normalized.sort((a, b) => {
                const aIdx = orderMap[`${a.variantId}_${a.size}`] ?? Infinity;
                const bIdx = orderMap[`${b.variantId}_${b.size}`] ?? Infinity;
                return aIdx - bIdx;
            });

            return normalized;
        });
    }, []);

    const isAddingRef = useRef(false);

    const addToCart = useCallback(async (item) => {
        if (login) {
            // Guard against concurrent calls
            if (isAddingRef.current) return;
            isAddingRef.current = true;

            try {
                // ── Logged-in: backend is source of truth ──
                const existing = cartItemsRef.current.find(i =>
                    i.variantId === item.variantId && i.size === item.size
                );
                const existingQty = existing ? Number(existing.quantity) : 0;
                const qtyToAdd = Number(item.quantity) - existingQty;

                if (qtyToAdd > 0) {
                    await fetch(`${API_BASE_URL}/api/cart/add/products`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            cartProdIdAndQuantity: { [item.variantId]: qtyToAdd }
                        }),
                    });
                }

                // Fetch backend cart and replace state
                const result = await fetchBackendCart();
                if (result.success) {
                    setCartItemsPreservingOrder(result.cart);
                }

                setIsCartOpen(true);
            } catch (err) {
                console.error("[Cart] Failed to add to backend cart:", err);
            } finally {
                isAddingRef.current = false;
            }
        } else {
            // ── Guest: local cart logic (unchanged) ──
            setCartItems(prev => {
                const targetVariantId = item.variantId;
                const existing = prev.find(i =>
                    i.variantId === targetVariantId &&
                    i.size === item.size
                );

                if (existing) {
                    return prev.map(i =>
                        i.variantId === targetVariantId &&
                            i.size === item.size
                            ? { ...i, quantity: item.quantity, isOverStock: false, availableStock: undefined }
                            : i
                    );
                }
                return [...prev, { ...item, isOverStock: false, availableStock: undefined, id: generateUUID() }];
            });

            setIsCartOpen(true);
        }
    }, [login]);

    // Replace entire cart with backend data (used after login sync)
    const replaceCart = useCallback((newItems) => {
        setCartItemsPreservingOrder(newItems);
    }, [setCartItemsPreservingOrder]);

    const removeFromCart = useCallback(async (id) => {
        if (login) {
            // ── Logged-in: sync removal to backend ──
            const item = cartItemsRef.current.find(i => i.id === id);
            // Optimistic local removal
            setCartItems(prev => prev.filter(i => i.id !== id));

            if (item?.variantId) {
                try {
                    await fetch(`${API_BASE_URL}/api/cart/remove`, {
                        method: "DELETE",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ variantId: item.variantId }),
                    });
                } catch (err) {
                    console.error("[Cart] Failed to remove from backend cart:", err);
                }
            }

            // Fetch backend cart to ensure consistency
            const result = await fetchBackendCart();
            if (result.success) {
                setCartItemsPreservingOrder(result.cart);
            }
        } else {
            // ── Guest: local removal (unchanged) ──
            setCartItems(prev => prev.filter(item => item.id !== id));
        }
    }, [login]);

    const debounceTimers = useRef({});

    const syncQuantityWithBackend = useCallback((id, variantId, size, newQuantity) => {
        if (newQuantity < 1) return;
        setCartError(null);

        if (login) {
            // ── Logged-in: backend-driven, NO optimistic update ──
            // Use variantId+size as debounce key (stable across fetches, unlike id/UUID)
            const debounceKey = `${variantId}_${size}`;
            if (debounceTimers.current[debounceKey]) clearTimeout(debounceTimers.current[debounceKey]);

            debounceTimers.current[debounceKey] = setTimeout(async () => {
                try {
                    await fetch(`${API_BASE_URL}/api/cart/update`, {
                        method: "PUT",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ variantId, quantity: newQuantity }),
                    });

                    const result = await fetchBackendCart();
                    if (result.success) {
                        setCartItemsPreservingOrder(result.cart);
                    }
                } catch (error) {
                    console.error("Background cart sync failed", error);
                }
            }, 300);
        } else {
            // ── Guest: optimistic update + stock validation (unchanged) ──
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));

            if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);

            debounceTimers.current[id] = setTimeout(async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/cart/check-stock`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            variantId,
                            size: size.toUpperCase(),
                            quantity: newQuantity
                        }),
                    });

                    const data = await response.json();

                    setCartItems(prev => prev.map(item => {
                        if (item.id === id) {
                            return {
                                ...item,
                                isOverStock: newQuantity > data.availableStock,
                                availableStock: data.availableStock
                            };
                        }
                        return item;
                    }));
                } catch (error) {
                    console.error("Background cart sync failed", error);
                }
            }, 300);
        }
    }, [login]);

    return (
        <CartContext.Provider value={{
            isCartOpen, setIsCartOpen, cartItems, addToCart, removeFromCart, replaceCart,
            syncQuantityWithBackend, isChecking, cartError, setCartError, canCheckout
        }}>
            {children}
        </CartContext.Provider>
    );
}