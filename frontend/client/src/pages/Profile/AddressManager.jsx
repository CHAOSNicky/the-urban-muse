import React, { useState, useEffect, useCallback } from "react";
import { fetchAddress, updateAddress } from "../../services/profileService";

export default function AddressManager() {
    const [address, setAddress] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ street: "", city: "", state: "", zip: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ── Load address on mount ───────────────────────────────────────
    const loadAddress = useCallback(async () => {
        setLoading(true);
        const result = await fetchAddress();
        if (result.success && result.data) {
            setAddress(result.data);
            setForm(result.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadAddress();
    }, [loadAddress]);

    // ── Save handler ────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        const result = await updateAddress(form);
        if (result.success) {
            setAddress(result.data);
            setEditing(false);
        }
        setSaving(false);
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // ── Skeleton loader ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-white rounded-[32px] p-7 shadow-ambient h-full">
                <div className="w-32 h-5 bg-[#edeeef] rounded-full animate-pulse mb-6" />
                <div className="space-y-3">
                    <div className="w-full h-4 bg-[#edeeef] rounded-full animate-pulse" />
                    <div className="w-3/4 h-4 bg-[#edeeef] rounded-full animate-pulse" />
                    <div className="w-1/2 h-4 bg-[#edeeef] rounded-full animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-7 shadow-ambient h-full flex flex-col">
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
                <div className="flex-1 flex flex-col gap-4">
                    <div>
                        <label className="font-inter text-xs font-medium text-[#5b5a64] uppercase tracking-wider mb-1.5 block">
                            Street Address
                        </label>
                        <input
                            type="text"
                            value={form.street}
                            onChange={handleChange("street")}
                            className="input-neo"
                            placeholder="123 Main St"
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
                                onChange={handleChange("city")}
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
                                onChange={handleChange("state")}
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
                                onChange={handleChange("zip")}
                                className="input-neo"
                                placeholder="00000"
                            />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-auto pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary-gradient flex-1 text-sm disabled:opacity-50"
                        >
                            {saving ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving…
                                </span>
                            ) : (
                                "Save Address"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setForm(address ?? { street: "", city: "", state: "", zip: "" });
                                setEditing(false);
                            }}
                            className="flex-1 text-sm font-semibold font-inter text-[#191c1d] bg-[#e3e1ef] hover:bg-[#d5d3e2] rounded-full px-6 py-3 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    {address ? (
                        <>
                            {/* Labeled Fields — matching Stitch screenshot */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">Street</p>
                                    <p className="font-inter text-sm text-[#191c1d]">{address.street}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">City</p>
                                        <p className="font-inter text-sm text-[#191c1d]">{address.city}</p>
                                    </div>
                                    <div>
                                        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-[#5b5a64] mb-1">ZIP</p>
                                        <p className="font-inter text-sm text-[#191c1d]">{address.zip}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Update Details button — full width blue */}
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-primary-gradient w-full text-sm mt-auto"
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
