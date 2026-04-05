import React, { useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContexts";
import ProfileContainer from "./ProfileContainer";
import Login from "../../components/Login";

export default function ProfilePage() {
    const { login, loading } = useContext(LoginContext);

    // ── Loading skeleton ────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2 bg-[#edeeef] rounded-[32px] h-80 animate-pulse" />
                        <div className="space-y-5">
                            <div className="bg-[#edeeef] rounded-[32px] h-36 animate-pulse" />
                            <div className="bg-[#edeeef] rounded-[32px] h-36 animate-pulse" />
                        </div>
                        <div className="lg:col-span-3 bg-[#edeeef] rounded-[32px] h-28 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    // ── Guest state: Bento Grid with Hero + Login + Info cards ───────
    if (!login) {
        return (
            <div className="min-h-screen bg-[#f8f9fa]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* ── Main 2-Column Bento Grid ─────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

                        {/* ─── Left Column: Hero Text + Login Form ─── */}
                        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-ambient animate-slide-up flex flex-col">
                            {/* Hero Heading */}
                            <h1 className="font-manrope text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#191c1d] tracking-tight leading-tight mb-4">
                                Welcome to{" "}
                                <span className="text-[#0040e0]">The Urban Muse</span>
                            </h1>
                            <p className="font-inter text-[#5b5a64] text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                                Curate your personal collection and experience a refined shopping journey tailored to your unique aesthetic.
                            </p>

                            {/* Embedded Login Component */}
                            <div className="flex-1">
                                <LoginEmbedded />
                            </div>
                        </div>

                        {/* ─── Right Column: Stacked Info Cards ──────── */}
                        <div className="flex flex-col gap-5 animate-slide-up-1">
                            {/* Track Orders Card (Electric Blue) */}
                            <div className="bg-[#0040e0] rounded-[32px] p-7 flex flex-col justify-between flex-1 relative overflow-hidden">
                                {/* Decorative gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2e5bff]/40 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-16 sm:mb-20">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                        </svg>
                                    </div>
                                    <h3 className="font-manrope text-lg font-bold text-white mb-1.5">Track Orders</h3>
                                    <p className="font-inter text-white/70 text-xs leading-relaxed">
                                        Stay updated with real-time notifications on every curated piece coming your way.
                                    </p>
                                </div>
                            </div>

                            {/* Faster Checkout Card (White) */}
                            <div className="bg-white rounded-[32px] p-7 shadow-ambient flex flex-col justify-between flex-1">
                                <div className="w-10 h-10 rounded-2xl bg-[#e3e1ef] flex items-center justify-center mb-16 sm:mb-20">
                                    <svg className="w-5 h-5 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-manrope text-lg font-bold text-[#191c1d] mb-1.5">Faster Checkout</h3>
                                    <p className="font-inter text-[#5b5a64] text-xs leading-relaxed">
                                        Save your preferences and shipping details for a seamless, one-click curation process.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ─── Bottom Banner: Join the Urban Collective ──── */}
                        <div className="lg:col-span-2 bg-[#edeeef] rounded-[32px] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up-2">
                            <div>
                                <span className="inline-block font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#0040e0] bg-[#0040e0]/10 px-3 py-1 rounded-full mb-2">
                                    New Feature
                                </span>
                                <h3 className="font-manrope text-lg sm:text-xl font-bold text-[#191c1d]">
                                    Join the Urban Collective
                                </h3>
                                <p className="font-inter text-[#5b5a64] text-sm mt-1 max-w-lg">
                                    Members get exclusive early access to limited edition drops and private editorial content.
                                </p>
                            </div>
                            {/* Member avatars */}
                            <div className="flex items-center flex-shrink-0">
                                <div className="flex -space-x-2">
                                    {["bg-[#191c1d]", "bg-[#3a3a4a]", "bg-[#5b5a64]"].map((bg, i) => (
                                        <div key={i} className={`w-9 h-9 rounded-full ${bg} ring-2 ring-[#edeeef] flex items-center justify-center`}>
                                            <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                                <span className="ml-2 w-9 h-9 rounded-full bg-[#0040e0] ring-2 ring-[#edeeef] flex items-center justify-center text-white text-xs font-bold font-inter">
                                    +2k
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ──────────────────────────────────── */}
                    <footer className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="font-manrope text-sm font-semibold text-[#191c1d]">Urban Muse</p>
                        <div className="flex flex-wrap gap-6 font-inter text-xs text-[#5b5a64]">
                            <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Terms of Service</span>
                            <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Shipping Info</span>
                            <span className="hover:text-[#191c1d] transition-colors cursor-pointer">Contact Support</span>
                        </div>
                        <p className="font-inter text-xs text-[#5b5a64]">© 2024 Urban Muse Digital Curation</p>
                    </footer>
                </div>
            </div>
        );
    }

    // ── Authenticated state: Member Hub Bento Grid ───────────────────
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page header */}
                <div className="mb-8 animate-slide-up">
                    <h1 className="font-manrope text-3xl sm:text-4xl font-bold text-[#191c1d] tracking-tight">
                        Member Hub
                    </h1>
                    <p className="font-inter text-[#5b5a64] mt-1">
                        Welcome back, your curated digital workspace is ready.
                    </p>
                </div>

                <ProfileContainer />
            </div>
        </div>
    );
}

/**
 * Wraps the existing <Login /> component so it renders inline
 * (without the full-screen background and back arrow it normally has).
 */
function LoginEmbedded() {
    return (
        <div className="profile-login-embed">
            <style>{`
                .profile-login-embed > div {
                    min-height: auto !important;
                    background: transparent !important;
                    padding: 0 !important;
                }
                .profile-login-embed > div > .fixed {
                    display: none !important;
                }
                .profile-login-embed > div > .w-full {
                    max-width: 100% !important;
                }
                .profile-login-embed > div > .w-full > .relative.flex {
                    border-radius: 20px !important;
                }
                .profile-login-embed > div > .w-full > .bg-white {
                    border-radius: 20px !important;
                    box-shadow: none !important;
                    border: none !important;
                    background: #f3f4f5 !important;
                }
                .profile-login-embed > div > .w-full > p {
                    display: none !important;
                }
            `}</style>
            <Login />
        </div>
    );
}
