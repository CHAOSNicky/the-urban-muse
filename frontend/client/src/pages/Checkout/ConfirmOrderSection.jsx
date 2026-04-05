import React from 'react';

/**
 * ConfirmOrderSection — Glassmorphic Floating CTA (Bento)
 *
 * Props:
 * - isDisabled (boolean)
 * - onConfirm (function)
 */
export default function ConfirmOrderSection({ isDisabled, onConfirm }) {
    return (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 lg:p-6 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-center lg:justify-end">
                <div className="
                    bg-white/80 backdrop-blur-xl p-4 rounded-[24px]
                    pointer-events-auto shadow-ambient-lg
                    w-full sm:w-auto
                ">
                    <button
                        onClick={onConfirm}
                        disabled={isDisabled}
                        className={`
                            w-full sm:w-[320px] font-inter font-semibold text-base px-8 py-4
                            rounded-full transition-all duration-300
                            ${isDisabled
                                ? 'bg-[#e3e1ef] text-[#5b5a64] cursor-not-allowed shadow-none'
                                : 'btn-primary-gradient shadow-[0_4px_24px_rgba(0,64,224,0.35)]'
                            }
                        `}
                    >
                        Complete Purchase
                    </button>
                </div>
            </div>
        </div>
    );
}
