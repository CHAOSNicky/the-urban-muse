import React from 'react';

/**
 * LoginBlock — Glassmorphic Guest Card (Bento)
 *
 * Props:
 * - isLoggedIn (boolean)
 * - onLogin (function)
 */
export default function LoginBlock({ isLoggedIn, onLogin }) {
    if (isLoggedIn) {
        return (
            <div className="bg-[#f3f4f5] rounded-[32px] p-6">
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

    return (
        <div className="bg-white rounded-[32px] p-7 shadow-ambient flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-manrope text-base font-bold text-[#191c1d]">Account</h3>
                <div className="w-9 h-9 rounded-full bg-[#e3e1ef] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>

            <p className="font-inter text-sm text-[#5b5a64] -mt-2">
                Checkout faster. Save your details for next time.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    placeholder="Email Address"
                    className="input-neo flex-1"
                />
                <button
                    onClick={onLogin}
                    className="btn-primary-gradient text-sm px-6 py-3"
                >
                    Continue
                </button>
            </div>

            {/* Guest Note */}
            <p className="font-inter text-[11px] text-[#5b5a64]/70 text-center">
                Or continue as a guest — no account required
            </p>
        </div>
    );
}
