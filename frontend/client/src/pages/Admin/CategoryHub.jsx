import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContexts";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 1, name: "T-Shirts", count: 38, color: "from-cyan-500/20 to-cyan-900/5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10M5 7l2-4m10 4l-2-4M5 7l-2 4h18l-2-4M5 7h14M5 11v9a1 1 0 001 1h12a1 1 0 001-1v-9" /> },
    { id: 2, name: "Shirts", count: 24, color: "from-indigo-500/20 to-indigo-900/5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 3l-5 4v3h4v11h14V10h4V7l-5-4-3 3c-1 .667-3 1-5 1s-4-.333-5-1L7 3z" /> },
    { id: 3, name: "Trousers", count: 19, color: "from-purple-500/20 to-purple-900/5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l-2 10 4 8 4-8V9m0 6l4 8 4-8-2-10M6 3h12" /> },
    { id: 4, name: "Boxers", count: 15, color: "from-amber-500/20 to-amber-900/5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14l1 6H4L5 4zm1 6v11h5V10m2 0v11h5V10" /> },
    { id: 5, name: "Full Sets", count: 11, color: "from-rose-500/20 to-rose-900/5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /> },
    { id: 6, name: "Accessories", count: 8, color: "from-emerald-500/20 to-emerald-900/5", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> },
];

function CategoryCard({ cat }) {
    return (
        <div className={`relative bg-[#191c1d] rounded-3xl p-6 shadow-ambient-lg overflow-hidden group hover:bg-[#1e2122] transition-all duration-300 cursor-pointer`}>
            {/* Gradient accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                        <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {cat.icon}
                        </svg>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                        <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
                <div className="mt-auto">
                    <h3 className="font-manrope text-lg font-bold text-white mb-1">{cat.name}</h3>
                    <p className="font-inter text-sm text-white/40">{cat.count} items</p>
                </div>
                {/* Bottom bar */}
                <div className="mt-4 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/20 rounded-full"
                        style={{ width: `${(cat.count / 40) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function CategoryHub() {
    const { login, role, loading } = useContext(LoginContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && (!login || role !== "ADMIN")) navigate("/");
    }, [login, role, loading, navigate]);

    if (loading || !login || role !== "ADMIN") return null;

    const totalItems = CATEGORIES.reduce((s, c) => s + c.count, 0);

    return (
        <div className="min-h-screen bg-black px-6 md:px-10 py-8 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/admin/dashboard" className="font-inter text-xs text-white/30 hover:text-white/60 transition-colors">Dashboard</Link>
                        <span className="text-white/20">/</span>
                        <span className="font-inter text-xs text-white/60">Categories</span>
                    </div>
                    <h1 className="font-manrope text-2xl md:text-3xl font-bold text-white tracking-tight">Category Hub</h1>
                    <p className="font-inter text-sm text-white/40 mt-0.5">{CATEGORIES.length} categories · {totalItems} total items</p>
                </div>
                <Link to="/admin"
                    className="inline-flex items-center gap-2 self-start sm:self-auto bg-gradient-to-r from-[#0040e0] to-[#2e5bff] text-white font-inter text-sm font-medium px-5 py-2.5 rounded-xl shadow-ambient hover:opacity-90 transition-opacity"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </Link>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Categories", value: CATEGORIES.length },
                    { label: "Total SKUs", value: totalItems },
                    { label: "Largest Category", value: "T-Shirts" },
                ].map((s) => (
                    <div key={s.label} className="bg-[#191c1d] rounded-2xl p-4 shadow-ambient-lg">
                        <p className="font-inter text-xs text-white/30 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="font-manrope text-xl font-bold text-white">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => (
                    <CategoryCard key={cat.id} cat={cat} />
                ))}

                {/* Add New Category CTA Card */}
                <Link to="/admin"
                    className="bg-white/[0.03] border-2 border-dashed border-white/[0.10] rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.06] hover:border-[#2e5bff]/40 transition-all duration-300 group min-h-[180px]"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] group-hover:bg-[#2e5bff]/20 flex items-center justify-center transition-colors">
                        <svg className="w-6 h-6 text-white/30 group-hover:text-[#2e5bff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="font-inter text-sm text-white/30 group-hover:text-white/60 transition-colors">New Category</span>
                </Link>
            </div>

            {/* Table View */}
            <div className="bg-[#191c1d] rounded-3xl shadow-ambient-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-white/[0.06]">
                    <h2 className="font-manrope text-base font-bold text-white">Category Details</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px]">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {["Category", "SKU Count", "Share of Inventory", "Actions"].map((h) => (
                                    <th key={h} className={`px-6 py-3 font-inter text-xs text-white/30 font-medium uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {CATEGORIES.map((cat) => (
                                <tr key={cat.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
                                                <svg className="w-4.5 h-4.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{cat.icon}</svg>
                                            </div>
                                            <span className="font-inter text-sm text-white/80 group-hover:text-white transition-colors">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-manrope text-sm font-semibold text-white">{cat.count}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[120px]">
                                                <div className="h-full bg-gradient-to-r from-[#0040e0] to-[#2e5bff] rounded-full" style={{ width: `${(cat.count / totalItems) * 100}%` }} />
                                            </div>
                                            <span className="font-inter text-xs text-white/40">{((cat.count / totalItems) * 100).toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button aria-label={`Edit ${cat.name}`} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.06] hover:bg-[#2e5bff]/20 hover:text-[#2e5bff] text-white/40 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button aria-label={`Delete ${cat.name}`} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-white/40 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
