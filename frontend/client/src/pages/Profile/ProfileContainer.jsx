import React, { useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContexts";
import { Link } from "react-router-dom";
import AddressManager from "./AddressManager";
import OrderHistoryPreview from "./OrderHistoryPreview";
import AdminMissionControl from "./AdminMissionControl";

export default function ProfileContainer() {
    const { name, role, logout } = useContext(LoginContext);

    // Generate avatar initials from name
    const initials = name
        ? name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "?";

    return (
        <>
            {/* ── 3-Column Bento Grid ──────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ─── Top-Left: User Profile Card (like Julianne Graham) ─── */}
                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-ambient animate-slide-up">
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0040e0] to-[#2e5bff] flex items-center justify-center shadow-lg">
                                    <span className="text-white font-manrope text-xl font-bold tracking-wide">
                                        {initials}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-[2.5px] ring-white" />
                            </div>

                            {/* Name & Role */}
                            <div>
                                <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
                                    {name || "User"}
                                </h2>
                                <p className="font-inter text-sm text-[#0040e0] font-medium mt-0.5">
                                    {role === "ADMIN" ? "Admin Curator" : "Gold Curator Member"}
                                </p>
                            </div>
                        </div>

                        {/* Edit profile button */}
                        <button className="w-9 h-9 rounded-full bg-[#f3f4f5] hover:bg-[#edeeef] flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                            <svg className="w-4 h-4 text-[#5b5a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>

                    {/* Stats row (Joined + Curations) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#f3f4f5] rounded-2xl px-5 py-4">
                            <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">
                                Joined
                            </p>
                            <p className="font-manrope text-lg font-bold text-[#191c1d]">
                                Oct 2023
                            </p>
                        </div>
                        <div className="bg-[#f3f4f5] rounded-2xl px-5 py-4">
                            <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">
                                Curations
                            </p>
                            <p className="font-manrope text-lg font-bold text-[#191c1d]">
                                24 Items
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── Top-Right: Shipping Address Card ─────────────── */}
                <div className="animate-slide-up-1">
                    <AddressManager />
                </div>

                {/* ─── Bottom-Left: Recent Orders (spans 2 cols) ────── */}
                <div className="lg:col-span-2 animate-slide-up-2">
                    <OrderHistoryPreview />
                </div>

                {/* ─── Bottom-Right: Security & Privacy + Logout ────── */}
                <div className="flex flex-col gap-5 animate-slide-up-3">
                    {/* Security & Privacy Card */}
                    <div className="bg-white rounded-[32px] p-7 shadow-ambient flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-[#e3e1ef] flex items-center justify-center mb-5">
                            <svg className="w-5 h-5 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="font-manrope text-base font-bold text-[#191c1d] mb-2">
                            Security & Privacy
                        </h3>
                        <p className="font-inter text-xs text-[#5b5a64] leading-relaxed mb-4">
                            Manage your passwords, two-factor authentication and data preferences.
                        </p>
                        <Link
                            to="#"
                            className="font-inter text-sm font-medium text-[#0040e0] hover:text-[#2e5bff] transition-colors duration-200 inline-flex items-center gap-1"
                        >
                            Review Settings
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="bg-white rounded-[32px] px-7 py-4 shadow-ambient flex items-center justify-center gap-2
                                   text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-inter text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>

                {/* ─── Admin Mission Control (conditional, full-width) ── */}
                {role === "ADMIN" && (
                    <div className="lg:col-span-3 animate-slide-up-3">
                        <AdminMissionControl />
                    </div>
                )}
            </div>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <p className="font-manrope text-sm font-semibold text-[#191c1d]">Urban Muse</p>
                    <p className="font-inter text-xs text-[#5b5a64]">© 2024 Urban Muse Digital Curation</p>
                </div>
                <div className="flex flex-wrap gap-6 font-inter text-xs text-[#5b5a64]">
                    <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Privacy Policy</span>
                    <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Terms of Service</span>
                    <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Shipping Info</span>
                    <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Contact Support</span>
                </div>
            </footer>
        </>
    );
}
