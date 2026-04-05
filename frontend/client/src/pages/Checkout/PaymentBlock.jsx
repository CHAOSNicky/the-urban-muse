import React from 'react';

/**
 * PaymentBlock — Bento Payment Card
 *
 * Props:
 * - selectedMethod (string): 'card' | 'upi' | 'cod'
 * - onSelectMethod (function)
 */

const METHODS = [
    {
        id: 'card',
        label: 'Credit / Debit Card',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        ),
    },
    {
        id: 'upi',
        label: 'UPI',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
        ),
    },
    {
        id: 'cod',
        label: 'Cash on Delivery',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
    },
];

export default function PaymentBlock({ selectedMethod, onSelectMethod }) {
    return (
        <div className="bg-white rounded-[32px] p-7 shadow-ambient flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-manrope text-base font-bold text-[#191c1d]">Payment Method</h3>
                <div className="w-9 h-9 rounded-full bg-[#e3e1ef] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>

            {/* Method Options — Tonal Layering (No Borders) */}
            <div className="flex flex-col gap-3">
                {METHODS.map(method => {
                    const isSelected = selectedMethod === method.id;
                    return (
                        <button
                            key={method.id}
                            onClick={() => onSelectMethod(method.id)}
                            className={`
                                flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left
                                ${isSelected
                                    ? 'bg-[#0040e0]/[0.06] ring-2 ring-[#0040e0]/40 shadow-sm'
                                    : 'bg-[#f3f4f5] hover:bg-[#edeeef]'
                                }
                            `}
                        >
                            <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                                ${isSelected
                                    ? 'bg-[#0040e0] text-white'
                                    : 'bg-white text-[#5b5a64] shadow-sm'
                                }
                            `}>
                                {method.icon}
                            </div>
                            <span className={`font-inter text-sm font-semibold ${isSelected ? 'text-[#0040e0]' : 'text-[#191c1d]'}`}>
                                {method.label}
                            </span>

                            {/* Selection Dot */}
                            <div className="ml-auto">
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                    ${isSelected ? 'border-[#0040e0]' : 'border-[#c4c5d9]'}
                                `}>
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0040e0]" />}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
