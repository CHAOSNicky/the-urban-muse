import React, { useState, useEffect, useRef, useContext } from 'react';
import { LoginContext } from '../../Contexts/LoginContexts';
import { CartContext } from '../../Contexts/CartContext';
import API_BASE_URL from '../../Constants/CommonConst';
import { syncCartToBackend, markCartSynced, isCartAlreadySynced, fetchBackendCart } from '../../services/cartSyncService';

/**
 * LoginBlock — Inline Mini Auth Hub (Bento)
 *
 * When logged out: shows a tabbed Login/Signup OTP flow inside a glassmorphic Bento card.
 * When logged in:  collapses to a compact "checked in" confirmation.
 *
 * Props:
 * - isLoggedIn (boolean)
 */
export default function LoginBlock({ isLoggedIn }) {
    // ── Logged-in: Compact confirmation ──
    if (isLoggedIn) {
        return (
            <div className="bg-[#f3f4f5] rounded-[32px] p-5 animate-fadeIn">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="font-inter text-sm font-medium text-[#5b5a64]">You are checked in securely.</p>
                </div>
            </div>
        );
    }

    // ── Guest: Full Auth Hub ──
    return <AuthHub />;
}


// ═══════════════════════════════════════════════════════════════════════
// Internal component — keeps LoginBlock's export clean
// ═══════════════════════════════════════════════════════════════════════
function AuthHub() {
    const { verifyAuth, setName, setLogin } = useContext(LoginContext);
    const { replaceCart } = useContext(CartContext);

    // ── Tabs ──
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

    // ── Form state ──
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [fullName, setFullName] = useState('');

    // ── UI state ──
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [message, setMessage] = useState('');

    const liveRef = useRef(null);

    // ── Helpers ──
    const normalizeEmail = (val) => val.trim();
    const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);

    const announce = (text) => {
        setMessage(text);
        if (liveRef.current) {
            liveRef.current.textContent = '';
            setTimeout(() => (liveRef.current.textContent = text), 10);
        }
    };

    // ── Cooldown timer ──
    useEffect(() => {
        if (!cooldown) return;
        const t = setInterval(() => setCooldown(s => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    // ── Reset form when switching tabs ──
    const switchTab = (tab) => {
        setActiveTab(tab);
        setOtp('');
        setOtpSent(false);
        setMessage('');
    };

    // ── OTP Generation ──
    const handleSendOtp = async () => {
        const emailNorm = normalizeEmail(email);
        if (!isValidEmail(emailNorm)) {
            announce('❌ Please enter a valid email address.');
            return;
        }
        if (activeTab === 'signup' && !fullName.trim()) {
            announce('❌ Please enter your name.');
            return;
        }

        try {
            setOtpLoading(true);
            const res = await fetch(API_BASE_URL + '/auth/otp/generate', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailNorm }),
            });

            if (!res.ok) {
                announce('❌ Could not send OTP. Try again.');
            } else {
                announce('✅ OTP sent to your email!');
                setOtpSent(true);
                setCooldown(30);
            }
        } catch {
            announce('⚠️ Network error. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    // ── Login / Signup Submit ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailNorm = normalizeEmail(email);

        if (!isValidEmail(emailNorm)) {
            announce('❌ Please enter a valid email address.');
            return;
        }
        if (!otp || otp.length < 6) {
            announce('❌ Please enter the 6-digit OTP.');
            return;
        }

        try {
            setSubmitLoading(true);

            // Build payload — signup includes fullname
            const payload = { email: emailNorm, authCode: otp };
            if (activeTab === 'signup') {
                payload.fullname = fullName.trim();
            }

            const res = await fetch(API_BASE_URL + '/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                announce('⚠️ Verification failed. Check OTP and try again.');
                return;
            }

            const data = await res.json();
            announce('✅ Welcome!');

            // ── Update auth context ──
            setName(data.fullname ?? '');
            setLogin(true);
            await verifyAuth();

            // ── Cart sync (same pattern as Signin.jsx) ──
            if (!isCartAlreadySynced()) {
                const syncResult = await syncCartToBackend();
                if (syncResult.success) {
                    markCartSynced();
                }
            }

            const backendCart = await fetchBackendCart();
            if (backendCart.success) {
                replaceCart(backendCart.cart);
            }

            // CheckoutContainer's useEffect[login] will auto-fetch address
        } catch {
            announce('⚠️ Something went wrong. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    // ── Render ──
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-7 shadow-ambient flex flex-col gap-5">
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between">
                <h3 className="font-manrope text-base font-bold text-[#191c1d]">Account</h3>
                <div className="w-9 h-9 rounded-full bg-[#e3e1ef] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>

            {/* ─── Tab Switcher (Sliding Pill) ─── */}
            <div className="relative bg-[#e3e1ef] rounded-full p-1 flex">
                {/* Sliding pill background */}
                <div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-out"
                    style={{ transform: activeTab === 'signup' ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }}
                />
                <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className={`relative z-10 flex-1 py-2 text-sm font-semibold font-inter rounded-full transition-colors duration-200
                        ${activeTab === 'login' ? 'text-[#0040e0]' : 'text-[#5b5a64]'}
                    `}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => switchTab('signup')}
                    className={`relative z-10 flex-1 py-2 text-sm font-semibold font-inter rounded-full transition-colors duration-200
                        ${activeTab === 'signup' ? 'text-[#0040e0]' : 'text-[#5b5a64]'}
                    `}
                >
                    Sign Up
                </button>
            </div>

            {/* ─── Form ─── */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name (signup only) */}
                {activeTab === 'signup' && (
                    <div>
                        <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-neo"
                            placeholder="e.g. Alex Morgan"
                            autoComplete="name"
                        />
                    </div>
                )}

                {/* Email */}
                <div>
                    <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-neo"
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </div>

                {/* OTP Row */}
                {otpSent && (
                    <div className="animate-fadeIn">
                        <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                            One-Time Passcode
                        </label>
                        <input
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtp(v);
                            }}
                            onPaste={(e) => {
                                const v = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
                                if (v) { e.preventDefault(); setOtp(v); }
                            }}
                            className="input-neo text-center tracking-[0.35em] tabular-nums font-semibold text-lg"
                            placeholder="• • • • • •"
                        />
                        <p className="font-inter text-[10px] text-[#5b5a64]/60 mt-1.5">
                            Check your inbox (and spam). OTP expires quickly.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-1">
                    {!otpSent ? (
                        /* Step 1: Send OTP */
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading}
                            className="btn-primary-gradient text-sm py-3 disabled:opacity-50"
                        >
                            {otpLoading ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <Spinner /> Sending OTP…
                                </span>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    ) : (
                        /* Step 2: Verify + optional Resend */
                        <>
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="btn-primary-gradient text-sm py-3 disabled:opacity-50"
                            >
                                {submitLoading ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <Spinner /> Verifying…
                                    </span>
                                ) : (
                                    activeTab === 'signup' ? 'Create Account' : 'Login'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpLoading || cooldown > 0}
                                className="text-sm font-semibold font-inter text-[#0040e0] hover:text-[#003cd3] disabled:text-[#5b5a64]/40 transition-colors py-1"
                            >
                                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                            </button>
                        </>
                    )}
                </div>

                {/* Feedback */}
                <p
                    ref={liveRef}
                    aria-live="polite"
                    className={`min-h-[1.25rem] text-center text-sm transition-colors duration-300 ${
                        message.startsWith('✅') ? 'text-green-600'
                        : message.startsWith('❌') ? 'text-red-500'
                        : message.startsWith('⚠️') ? 'text-amber-500'
                        : 'text-[#5b5a64]'
                    }`}
                >
                    {message}
                </p>
            </form>
        </div>
    );
}


// ── Tiny inline spinner ──
function Spinner() {
    return (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
    );
}
