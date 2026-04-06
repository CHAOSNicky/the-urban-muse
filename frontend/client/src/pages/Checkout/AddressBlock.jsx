import React, { useState, useEffect } from 'react';

/**
 * AddressBlock — Visual clone of Profile AddressManager (Bento)
 *
 * Props:
 * - address (object | null)
 * - onAddressChange (function)
 */
export default function AddressBlock({ address, onAddressChange }) {
    const [editing, setEditing] = useState(!address);
    const [form, setForm] = useState({
        fullName: address?.fullName || '',
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        zip: address?.zip || '',
    });

    useEffect(() => {
        if (address) {
            setForm({
                fullName: address.fullName || '',
                street: address.street || '',
                city: address.city || '',
                state: address.state || '',
                zip: address.zip || '',
            });
            setEditing(false);
        }
    }, [address]);

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = () => {
        onAddressChange({ ...form });
        setEditing(false);
    };

    return (
        <div className="bg-white rounded-[32px] p-7 shadow-ambient flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-manrope text-base font-bold text-[#191c1d]">Shipping Address</h3>
                <div className="w-9 h-9 rounded-full bg-[#e3e1ef] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#0040e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            {editing ? (
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={form.fullName}
                            onChange={handleChange('fullName')}
                            className="input-neo"
                            placeholder="e.g. Julianne Graham"
                        />
                    </div>
                    <div>
                        <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                            Street Address
                        </label>
                        <input
                            type="text"
                            value={form.street}
                            onChange={handleChange('street')}
                            className="input-neo"
                            placeholder="128 Market St, Suite 400"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                                City
                            </label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={handleChange('city')}
                                className="input-neo"
                                placeholder="City"
                            />
                        </div>
                        <div>
                            <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                                State
                            </label>
                            <input
                                type="text"
                                value={form.state}
                                onChange={handleChange('state')}
                                className="input-neo"
                                placeholder="ST"
                            />
                        </div>
                        <div>
                            <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                                ZIP
                            </label>
                            <input
                                type="text"
                                value={form.zip}
                                onChange={handleChange('zip')}
                                className="input-neo"
                                placeholder="00000"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={handleSave}
                            className="btn-primary-gradient flex-1 text-sm"
                        >
                            Confirm Address
                        </button>
                        {address && (
                            <button
                                onClick={() => {
                                    setForm({
                                        fullName: address.fullName || '',
                                        street: address.street || '',
                                        city: address.city || '',
                                        state: address.state || '',
                                        zip: address.zip || '',
                                    });
                                    setEditing(false);
                                }}
                                className="flex-1 text-sm font-semibold font-inter text-[#191c1d] bg-[#e3e1ef] hover:bg-[#d5d3e2] rounded-full px-6 py-3 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col">
                    {address ? (
                        <>
                            {/* Labeled Fields — matching Profile AddressManager */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">Name</p>
                                    <p className="font-inter text-sm text-[#191c1d]">{address.fullName}</p>
                                </div>
                                <div>
                                    <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">Street</p>
                                    <p className="font-inter text-sm text-[#191c1d]">{address.street}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">City</p>
                                        <p className="font-inter text-sm text-[#191c1d]">{address.city}</p>
                                    </div>
                                    <div>
                                        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">State</p>
                                        <p className="font-inter text-sm text-[#191c1d]">{address.state}</p>
                                    </div>
                                    <div>
                                        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">ZIP</p>
                                        <p className="font-inter text-sm text-[#191c1d]">{address.zip}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-primary-gradient w-full text-sm"
                            >
                                Update Details
                            </button>
                        </>
                    ) : (
                        <div className="bg-[#f3f4f5] rounded-2xl p-5 text-center">
                            <p className="font-inter text-[#5b5a64] text-sm">
                                No address saved yet
                            </p>
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-primary-gradient text-sm mt-3 px-5 py-2"
                            >
                                Add Address
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
