import React, { useState, useEffect, useCallback } from "react";
import { fetchOrders } from "../../services/profileService";

const STATUS_STYLES = {
    Delivered: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
    },
    Processing: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        dot: "bg-blue-500",
    },
    Shipped: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
    },
};

export default function OrderHistoryPreview() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        const result = await fetchOrders(3);
        if (result.success && result.data) {
            setOrders(result.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // ── Skeleton loader ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-white rounded-[32px] p-7 shadow-ambient h-full">
                <div className="w-32 h-5 bg-[#edeeef] rounded-full animate-pulse mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#edeeef] animate-pulse" />
                                <div className="space-y-2">
                                    <div className="w-28 h-3 bg-[#edeeef] rounded-full animate-pulse" />
                                    <div className="w-20 h-3 bg-[#edeeef] rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div className="w-16 h-6 bg-[#edeeef] rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-7 shadow-ambient h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-manrope text-base font-bold text-[#191c1d]">Recent Orders</h3>
                <button className="font-inter text-sm font-medium text-[#0040e0] hover:text-[#2e5bff] transition-colors duration-200">
                    View History
                </button>
            </div>

            {/* Order rows — no divider lines, just spacing */}
            <div className="flex-1 space-y-3">
                {orders.length === 0 ? (
                    <div className="bg-[#f3f4f5] rounded-2xl p-5 text-center">
                        <p className="font-inter text-[#5b5a64] text-sm">
                            No orders yet — time to shop! 🛍️
                        </p>
                    </div>
                ) : (
                    orders.map((order, idx) => {
                        const style = STATUS_STYLES[order.status] || STATUS_STYLES.Processing;
                        // Generate a product name from the order for visual richness
                        const productNames = ["Cerulean Drift Sculpture", "Prism Light Panel", "Muse Canvas Print"];
                        const productName = productNames[idx % productNames.length];
                        return (
                            <div
                                key={order.orderId || idx}
                                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0
                                           hover:bg-[#f3f4f5] -mx-3 px-3 rounded-2xl transition-colors duration-200 cursor-default"
                            >
                                {/* Product image placeholder */}
                                <div className="w-11 h-11 rounded-full bg-[#edeeef] flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#5b5a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>

                                {/* Product name + Order ID */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-inter text-sm font-semibold text-[#191c1d] truncate">
                                        {productName}
                                    </p>
                                    <p className="font-inter text-xs text-[#5b5a64] mt-0.5">
                                        Order {order.orderId}
                                    </p>
                                </div>

                                {/* Status chip */}
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-inter uppercase tracking-wider ${style.bg} ${style.text} flex-shrink-0`}
                                >
                                    {order.status === "Shipped" ? "In Transit" : order.status}
                                </span>

                                {/* Amount */}
                                <p className="font-manrope text-sm font-bold text-[#191c1d] flex-shrink-0 tabular-nums">
                                    ${order.amount?.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
}

/** Format ISO date string to a readable format */
function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
}
