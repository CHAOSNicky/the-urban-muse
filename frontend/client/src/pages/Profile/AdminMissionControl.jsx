import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchAdminStats } from "../../services/profileService";

export default function AdminMissionControl() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = useCallback(async () => {
        setLoading(true);
        const result = await fetchAdminStats();
        if (result.success && result.data) {
            setStats(result.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // ── Skeleton loader (dark theme) ────────────────────────────────
    if (loading) {
        return (
            <div className="bg-[#191c1d] rounded-3xl p-8 shadow-ambient-lg">
                <div className="w-40 h-5 bg-white/10 rounded-full animate-pulse mb-8" />
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="w-16 h-3 bg-white/10 rounded-full animate-pulse" />
                            <div className="w-24 h-8 bg-white/10 rounded-xl animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const statBlocks = [
        {
            label: "Total Users",
            value: stats?.totalUsers,
            format: (v) => formatCompact(v),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            label: "Total Orders",
            value: stats?.totalOrders,
            format: (v) => formatCompact(v),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            label: "Revenue",
            value: stats?.revenue,
            format: (v) => `$${formatCompact(v)}`,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-[#191c1d] rounded-3xl p-8 shadow-ambient-lg overflow-hidden relative">
            {/* Decorative gradient accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0040e0]/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#2e5bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-manrope text-lg font-bold text-white">Mission Control</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                            <span className="font-inter text-xs text-white/50">Live Dashboard</span>
                        </div>
                    </div>
                </div>

                <Link
                    to="/admin"
                    className="btn-primary-gradient text-sm px-5 py-2.5 relative z-10"
                >
                    Go to Dashboard
                </Link>
            </div>

            {/* Stat blocks */}
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statBlocks.map((stat, idx) => (
                    <div
                        key={stat.label}
                        className="bg-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.10] transition-colors duration-300 group"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-white/40 group-hover:text-[#2e5bff] transition-colors duration-300">
                                {stat.icon}
                            </span>
                            <p className="font-inter text-xs font-medium text-white/40 uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                        <p className="font-manrope text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            {stat.format(stat.value)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Format large numbers into compact readable strings */
function formatCompact(num) {
    if (num == null) return "–";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    return num.toLocaleString();
}
