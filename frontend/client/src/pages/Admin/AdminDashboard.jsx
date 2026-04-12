import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContexts";

// ─── Shared Admin Shell ──────────────────────────────────────────────────────
function AdminShell({ children }) {
    const navigate = useNavigate();
    const navItems = [
        { label: "Dashboard", to: "/admin/dashboard", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
        { label: "Products", to: "/admin/products", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
        { label: "Categories", to: "/admin/categories", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
        { label: "Orders", to: "/admin/orders", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { label: "Settings", to: "/admin/settings", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> },
    ];
    const currentPath = window.location.pathname;
    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#0e1011] border-r border-white/[0.06] px-4 py-6 gap-2">
                <div className="flex items-center gap-2.5 px-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0040e0] to-[#2e5bff] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-manrope font-bold text-white text-sm tracking-wide">The Digital Atelier</span>
                </div>
                <p className="font-inter text-[10px] uppercase tracking-widest text-white/30 px-3 mb-1">Navigation</p>
                {navItems.map((item) => (
                    <Link key={item.to} to={item.to}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-inter text-sm transition-colors ${currentPath === item.to ? "bg-white/[0.08] text-white" : "text-white/50 hover:text-white hover:bg-white/[0.05]"}`}
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>{item.icon}</svg>
                        {item.label}
                    </Link>
                ))}
                <div className="mt-auto">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-inter text-sm text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Storefront
                    </Link>
                </div>
            </aside>
            {/* Main */}
            <main className="flex-1 min-w-0 overflow-auto">{children}</main>
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, deltaPos, icon, accent }) {
    return (
        <div className={`bg-[#191c1d] rounded-2xl p-5 shadow-ambient-lg overflow-hidden relative group hover:bg-[#1e2122] transition-colors duration-300`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-60 ${accent}`} />
            <div className="relative flex items-start justify-between mb-4">
                <p className="font-inter text-xs font-medium text-white/40 uppercase tracking-wider">{label}</p>
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#2e5bff]">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                </div>
            </div>
            <p className="relative font-manrope text-3xl font-bold text-white tracking-tight mb-2">{value}</p>
            <span className={`inline-flex items-center gap-1 font-inter text-xs font-medium px-2 py-0.5 rounded-full ${deltaPos ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={deltaPos ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
                {delta}
            </span>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
const stats = [
    { label: "Total Revenue", value: "$48,290", delta: "12.4% vs last month", deltaPos: true, accent: "bg-[#0040e0]/20", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: "Total Orders", value: "1,284", delta: "8.1% vs last month", deltaPos: true, accent: "bg-purple-600/15", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { label: "Active Products", value: "128", delta: "3 new this week", deltaPos: true, accent: "bg-cyan-600/10", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
    { label: "Total Users", value: "6,741", delta: "2.3% vs last month", deltaPos: false, accent: "bg-amber-500/10", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
];

const recentActivity = [
    { id: "#ORD-8821", customer: "Charlotte M.", action: "Placed a new order", amount: "$312.00", time: "2 min ago", status: "new" },
    { id: "#ORD-8820", customer: "James K.", action: "Order shipped", amount: "$89.50", time: "14 min ago", status: "shipped" },
    { id: "#ORD-8819", customer: "Priya S.", action: "Payment confirmed", amount: "$540.00", time: "1 hr ago", status: "paid" },
    { id: "#ORD-8818", customer: "Luca R.", action: "Order delivered", amount: "$175.00", time: "3 hr ago", status: "delivered" },
    { id: "#ORD-8817", customer: "Sofia T.", action: "Order cancelled", amount: "$220.00", time: "5 hr ago", status: "cancelled" },
    { id: "#ORD-8816", customer: "Anya B.", action: "Placed a new order", amount: "$98.00", time: "7 hr ago", status: "new" },
];

const statusStyles = {
    new: "bg-[#2e5bff]/15 text-[#7090ff]",
    shipped: "bg-amber-500/15 text-amber-400",
    paid: "bg-emerald-500/15 text-emerald-400",
    delivered: "bg-cyan-500/15 text-cyan-400",
    cancelled: "bg-red-500/15 text-red-400",
};

const topProducts = [
    { name: "Classic Linen Shirt", category: "Shirts", sold: 142, revenue: "$9,088" },
    { name: "Heritage Slim Trouser", category: "Trousers", sold: 118, revenue: "$8,260" },
    { name: "Relaxed Cotton Tee", category: "T-Shirts", sold: 211, revenue: "$6,541" },
    { name: "Weekend Linen Box Set", category: "Full Sets", sold: 64, revenue: "$5,760" },
];

export default function AdminDashboard() {
    const { login, role, loading } = useContext(LoginContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && (!login || role !== "ADMIN")) navigate("/");
    }, [login, role, loading, navigate]);

    if (loading || !login || role !== "ADMIN") return null;

    return (
        <AdminShell>
            <div className="px-6 md:px-10 py-8 space-y-8 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-manrope text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                        <p className="font-inter text-sm text-white/40 mt-1">The Digital Atelier — Live Overview</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                        <span className="font-inter text-xs text-white/40">Live · Updated just now</span>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>

                {/* Bento Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Recent Activity Feed — spans 2 cols */}
                    <div className="lg:col-span-2 bg-[#191c1d] rounded-3xl p-6 shadow-ambient-lg">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-manrope text-base font-bold text-white">Recent Activity</h2>
                            <Link to="/admin/orders" className="font-inter text-xs text-[#2e5bff] hover:text-white transition-colors">View all →</Link>
                        </div>
                        <div className="space-y-1">
                            {recentActivity.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 text-[#2e5bff]">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-inter text-sm font-medium text-white/80 truncate">{item.customer}</p>
                                        <p className="font-inter text-xs text-white/40 truncate">{item.action} · {item.id}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-manrope text-sm font-semibold text-white">{item.amount}</p>
                                        <span className={`inline-block font-inter text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5 ${statusStyles[item.status]}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="font-inter text-[10px] text-white/30 shrink-0 hidden sm:block">{item.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Metrics Panel */}
                    <div className="bg-[#191c1d] rounded-3xl p-6 shadow-ambient-lg flex flex-col gap-4">
                        <h2 className="font-manrope text-base font-bold text-white">Quick Metrics</h2>
                        {[
                            { label: "Conversion Rate", value: "3.8%", bar: 38 },
                            { label: "Avg. Order Value", value: "$37.60", bar: 62 },
                            { label: "Return Rate", value: "1.2%", bar: 12 },
                            { label: "Pending Fulfilment", value: "48 orders", bar: 48 },
                        ].map((m) => (
                            <div key={m.label}>
                                <div className="flex justify-between mb-1.5">
                                    <span className="font-inter text-xs text-white/50">{m.label}</span>
                                    <span className="font-inter text-xs font-semibold text-white">{m.value}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#0040e0] to-[#2e5bff]"
                                        style={{ width: `${m.bar}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-auto pt-4 border-t border-white/[0.06]">
                            <p className="font-inter text-xs text-white/30 mb-3">Inventory Health</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[{ l: "In Stock", v: "104", c: "text-emerald-400" }, { l: "Low Stock", v: "18", c: "text-amber-400" }, { l: "Out", v: "6", c: "text-red-400" }].map((s) => (
                                    <div key={s.l} className="bg-white/[0.04] rounded-xl p-3 text-center">
                                        <p className={`font-manrope text-lg font-bold ${s.c}`}>{s.v}</p>
                                        <p className="font-inter text-[10px] text-white/40 mt-0.5">{s.l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="bg-[#191c1d] rounded-3xl p-6 shadow-ambient-lg overflow-x-auto">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-manrope text-base font-bold text-white">Top Performing Products</h2>
                        <Link to="/admin/products" className="font-inter text-xs text-[#2e5bff] hover:text-white transition-colors">View all →</Link>
                    </div>
                    <table className="w-full min-w-[480px]">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {["Product", "Category", "Units Sold", "Revenue"].map((h) => (
                                    <th key={h} className="text-left pb-3 font-inter text-xs text-white/30 font-medium uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {topProducts.map((p, i) => (
                                <tr key={p.name} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="py-3.5 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <span className="font-inter text-sm text-white/80">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 pr-4 font-inter text-xs text-white/40">{p.category}</td>
                                    <td className="py-3.5 pr-4 font-inter text-sm text-white/70">{p.sold}</td>
                                    <td className="py-3.5 font-manrope text-sm font-semibold text-white">{p.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
