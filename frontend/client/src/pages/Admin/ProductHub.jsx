import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContexts";


// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_PRODUCTS = [
    { id: 1, name: "Classic Linen Shirt", category: "Shirts", price: "$64.00", stock: 42, status: "in_stock" },
    { id: 2, name: "Heritage Slim Trouser", category: "Trousers", price: "$70.00", stock: 18, status: "low_stock" },
    { id: 3, name: "Relaxed Cotton Tee", category: "T-Shirts", price: "$31.00", stock: 95, status: "in_stock" },
    { id: 4, name: "Weekend Linen Box Set", category: "Full Sets", price: "$90.00", stock: 0, status: "out_of_stock" },
    { id: 5, name: "Everyday Oxford Shirt", category: "Shirts", price: "$58.00", stock: 27, status: "in_stock" },
    { id: 6, name: "Tailored Chino Pant", category: "Trousers", price: "$68.00", stock: 5, status: "low_stock" },
    { id: 7, name: "Graphic Art Tee", category: "T-Shirts", price: "$29.00", stock: 76, status: "in_stock" },
    { id: 8, name: "Formal Dress Shirt", category: "Shirts", price: "$74.00", stock: 0, status: "out_of_stock" },
    { id: 9, name: "Comfort Fit Boxer Set", category: "Boxers", price: "$38.00", stock: 112, status: "in_stock" },
    { id: 10, name: "Premium Linen Set", category: "Full Sets", price: "$110.00", stock: 8, status: "low_stock" },
];

const stockPill = {
    in_stock: "bg-emerald-500/15 text-emerald-400",
    low_stock: "bg-amber-500/15 text-amber-400",
    out_of_stock: "bg-red-500/15 text-red-400",
};
const stockLabel = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
};

// ─── Placeholder product image ─────────────────────────────────────────────
function ProductThumb() {
    return (
        <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    );
}

export default function ProductHub() {
    const { login, role, loading } = useContext(LoginContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    React.useEffect(() => {
        if (!loading && (!login || role !== "ADMIN")) navigate("/");
    }, [login, role, loading, navigate]);

    if (loading || !login || role !== "ADMIN") return null;

    const filtered = DUMMY_PRODUCTS.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || p.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="min-h-screen bg-black">
            <div className="px-6 md:px-10 py-8 space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link to="/admin/dashboard" className="font-inter text-xs text-white/30 hover:text-white/60 transition-colors">Dashboard</Link>
                            <span className="text-white/20">/</span>
                            <span className="font-inter text-xs text-white/60">Products</span>
                        </div>
                        <h1 className="font-manrope text-2xl md:text-3xl font-bold text-white tracking-tight">Product Hub</h1>
                        <p className="font-inter text-sm text-white/40 mt-0.5">Active Inventory · {DUMMY_PRODUCTS.length} Items</p>
                    </div>
                    <Link to="/admin"
                        className="inline-flex items-center gap-2 self-start sm:self-auto bg-gradient-to-r from-[#0040e0] to-[#2e5bff] text-white font-inter text-sm font-medium px-5 py-2.5 rounded-xl shadow-ambient hover:opacity-90 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-[#191c1d] rounded-2xl p-4 shadow-ambient-lg flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl font-inter text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2e5bff]/50 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["all", "in_stock", "low_stock", "out_of_stock"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-2 rounded-xl font-inter text-xs font-medium transition-colors ${filter === f ? "bg-[#2e5bff] text-white" : "bg-white/[0.06] text-white/50 hover:bg-white/[0.10] hover:text-white"}`}
                            >
                                {f === "all" ? "All" : stockLabel[f]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#191c1d] rounded-3xl shadow-ambient-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                                        <th key={h} className={`px-5 py-4 font-inter text-xs text-white/30 font-medium uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <ProductThumb />
                                                <span className="font-inter text-sm font-medium text-white/80 group-hover:text-white transition-colors">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-inter text-xs text-white/40">{product.category}</td>
                                        <td className="px-5 py-4 font-manrope text-sm font-semibold text-white">{product.price}</td>
                                        <td className="px-5 py-4 font-inter text-sm text-white/60">{product.stock}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 font-inter text-xs font-medium px-2.5 py-1 rounded-full ${stockPill[product.status]}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.status === "in_stock" ? "bg-emerald-400" : product.status === "low_stock" ? "bg-amber-400" : "bg-red-400"}`} />
                                                {stockLabel[product.status]}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    aria-label={`Edit ${product.name}`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.06] hover:bg-[#2e5bff]/20 hover:text-[#2e5bff] text-white/40 transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    aria-label={`Delete ${product.name}`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-white/40 transition-colors"
                                                >
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
                        {filtered.length === 0 && (
                            <div className="py-16 text-center">
                                <svg className="w-10 h-10 text-white/10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-inter text-sm text-white/30">No products match your search.</p>
                            </div>
                        )}
                    </div>
                    {/* Pagination footer */}
                    <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
                        <p className="font-inter text-xs text-white/30">Showing 1–{filtered.length} of {filtered.length} results</p>
                        <div className="flex gap-1">
                            {[1, 2, 3].map((p) => (
                                <button key={p} className={`w-8 h-8 rounded-lg font-inter text-xs transition-colors ${p === 1 ? "bg-[#2e5bff] text-white" : "bg-white/[0.06] text-white/40 hover:bg-white/[0.10]"}`}>{p}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
