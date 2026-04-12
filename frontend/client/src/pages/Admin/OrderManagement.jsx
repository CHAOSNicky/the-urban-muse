import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContexts";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const ORDERS = [
    { id: "#ORD-8821", customer: "Charlotte Mercier", date: "Apr 11, 2026", total: "$312.00", status: "processing", items: 3 },
    { id: "#ORD-8820", customer: "James Kingsley", date: "Apr 11, 2026", total: "$89.50", status: "shipped", items: 1 },
    { id: "#ORD-8819", customer: "Priya Sharma", date: "Apr 10, 2026", total: "$540.00", status: "delivered", items: 4 },
    { id: "#ORD-8818", customer: "Luca Romano", date: "Apr 10, 2026", total: "$175.00", status: "delivered", items: 2 },
    { id: "#ORD-8817", customer: "Sofia Tanaka", date: "Apr 09, 2026", total: "$220.00", status: "cancelled", items: 3 },
    { id: "#ORD-8816", customer: "Anya Belova", date: "Apr 09, 2026", total: "$98.00", status: "processing", items: 1 },
    { id: "#ORD-8815", customer: "Marcus Webb", date: "Apr 08, 2026", total: "$430.00", status: "shipped", items: 5 },
    { id: "#ORD-8814", customer: "Isabelle Fontaine", date: "Apr 08, 2026", total: "$64.00", status: "delivered", items: 1 },
    { id: "#ORD-8813", customer: "Ravi Patel", date: "Apr 07, 2026", total: "$290.00", status: "delivered", items: 4 },
    { id: "#ORD-8812", customer: "Chloe Dubois", date: "Apr 07, 2026", total: "$158.00", status: "processing", items: 2 },
];

const statusConfig = {
    processing: { label: "Processing", classes: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
    shipped: { label: "Shipped", classes: "bg-[#2e5bff]/15 text-[#7090ff] border border-[#2e5bff]/20" },
    delivered: { label: "Delivered", classes: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
    cancelled: { label: "Cancelled", classes: "bg-red-500/15 text-red-400 border border-red-500/20" },
};

const statusDotColor = {
    processing: "bg-amber-400",
    shipped: "bg-[#7090ff]",
    delivered: "bg-emerald-400",
    cancelled: "bg-red-400",
};

export default function OrderManagement() {
    const { login, role, loading } = useContext(LoginContext);
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState("all");
    const [search, setSearch] = useState("");

    React.useEffect(() => {
        if (!loading && (!login || role !== "ADMIN")) navigate("/");
    }, [login, role, loading, navigate]);

    if (loading || !login || role !== "ADMIN") return null;

    const filtered = ORDERS.filter((o) => {
        const matchStatus = filterStatus === "all" || o.status === filterStatus;
        const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = ORDERS.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

    return (
        <div className="min-h-screen bg-black px-6 md:px-10 py-8 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/admin/dashboard" className="font-inter text-xs text-white/30 hover:text-white/60 transition-colors">Dashboard</Link>
                        <span className="text-white/20">/</span>
                        <span className="font-inter text-xs text-white/60">Orders</span>
                    </div>
                    <h1 className="font-manrope text-2xl md:text-3xl font-bold text-white tracking-tight">Order Management</h1>
                    <p className="font-inter text-sm text-white/40 mt-0.5">{ORDERS.length} total orders this month</p>
                </div>
                <button className="inline-flex items-center gap-2 self-start sm:self-auto bg-white/[0.06] hover:bg-white/[0.10] text-white font-inter text-sm font-medium px-4 py-2.5 rounded-xl border border-white/[0.08] transition-colors">
                    <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                </button>
            </div>

            {/* Status summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
                        className={`bg-[#191c1d] rounded-2xl p-4 shadow-ambient-lg text-left transition-all duration-200 ${filterStatus === key ? "ring-1 ring-[#2e5bff]/50" : "hover:bg-[#1e2122]"}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full ${statusDotColor[key]}`} />
                            <p className="font-inter text-xs text-white/40 uppercase tracking-wider">{cfg.label}</p>
                        </div>
                        <p className="font-manrope text-2xl font-bold text-white">{counts[key] || 0}</p>
                    </button>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="bg-[#191c1d] rounded-2xl p-4 shadow-ambient-lg flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl font-inter text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2e5bff]/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[{ k: "all", l: "All" }, ...Object.entries(statusConfig).map(([k, v]) => ({ k, l: v.label }))].map(({ k, l }) => (
                        <button
                            key={k}
                            onClick={() => setFilterStatus(k)}
                            className={`px-3 py-2 rounded-xl font-inter text-xs font-medium transition-colors ${filterStatus === k ? "bg-[#2e5bff] text-white" : "bg-white/[0.06] text-white/50 hover:bg-white/[0.10] hover:text-white"}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#191c1d] rounded-3xl shadow-ambient-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px]">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
                                    <th key={h} className={`px-5 py-4 font-inter text-xs text-white/30 font-medium uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {filtered.map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-5 py-4">
                                        <span className="font-inter text-sm font-mono text-[#7090ff] group-hover:text-[#2e5bff] transition-colors">{order.id}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0040e0]/30 to-[#2e5bff]/10 flex items-center justify-center shrink-0">
                                                <span className="font-inter text-[10px] font-bold text-[#7090ff]">
                                                    {order.customer.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-inter text-sm text-white/80">{order.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-inter text-xs text-white/40">{order.date}</td>
                                    <td className="px-5 py-4 font-inter text-sm text-white/60">{order.items}</td>
                                    <td className="px-5 py-4 font-manrope text-sm font-bold text-white">{order.total}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 font-inter text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[order.status].classes}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor[order.status]}`} />
                                            {statusConfig[order.status].label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button aria-label={`View ${order.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.06] hover:bg-[#2e5bff]/20 hover:text-[#2e5bff] text-white/40 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button aria-label={`More options ${order.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.10] text-white/40 hover:text-white transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <svg className="w-10 h-10 text-white/10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="font-inter text-sm text-white/30">No orders match your criteria.</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
                    <p className="font-inter text-xs text-white/30">Showing {filtered.length} of {ORDERS.length} orders</p>
                    <div className="flex gap-1">
                        {[1, 2, 3].map((p) => (
                            <button key={p} className={`w-8 h-8 rounded-lg font-inter text-xs transition-colors ${p === 1 ? "bg-[#2e5bff] text-white" : "bg-white/[0.06] text-white/40 hover:bg-white/[0.10]"}`}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
