import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import API_BASE_URL from "../Constants/CommonConst";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [cartError, setCartError] = useState(null);
    const [canCheckout, setCanCheckout] = useState(true);

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

    const addToCart = useCallback((item) => {
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
            // Add unique ID for the key
            return [...prev, { ...item, isOverStock: false, availableStock: undefined, id: generateUUID() }];
            // return [...prev, { ...item, isOverStock: false, availableStock: undefined, id: crypto.randomUUID() }];
        });

        // Force the drawer open
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const debounceTimers = useRef({});

    const syncQuantityWithBackend = useCallback((id, variantId, size, newQuantity) => {
        if (newQuantity < 1) return;

        // Optimistic UI update immediately
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
        setCartError(null);

        if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);

        debounceTimers.current[id] = setTimeout(async () => {
            try {
                console.log("Stock validation payload:", {
                    variantId,
                    size: size.toUpperCase(),
                    quantity: newQuantity
                });

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
                console.log("Stock API response:", data);

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
    }, []);

    return (
        <CartContext.Provider value={{
            isCartOpen, setIsCartOpen, cartItems, addToCart, removeFromCart,
            syncQuantityWithBackend, isChecking, cartError, setCartError, canCheckout
        }}>
            {children}
        </CartContext.Provider>
    );
}