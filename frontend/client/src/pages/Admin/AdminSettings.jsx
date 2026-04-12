import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContexts";

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ id, checked, onChange, label, description }) {
    return (
        <div className="flex items-start justify-between gap-4 py-4">
            <div className="flex-1 min-w-0">
                <label htmlFor={id} className="font-inter text-sm font-medium text-white/80 cursor-pointer">{label}</label>
                {description && <p className="font-inter text-xs text-white/40 mt-0.5">{description}</p>}
            </div>
            <button
                id={id}
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-[#2e5bff]" : "bg-white/[0.10]"}`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
                />
            </button>
        </div>
    );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function FormField({ label, id, type = "text", placeholder, defaultValue, hint }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block font-inter text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>
            {type === "textarea" ? (
                <textarea
                    id={id}
                    rows={3}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl font-inter text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#2e5bff]/60 focus:bg-white/[0.08] transition-all resize-none"
                />
            ) : type === "select" ? (
                <select
                    id={id}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl font-inter text-sm text-white focus:outline-none focus:border-[#2e5bff]/60 transition-colors appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1rem" }}
                >
                    {placeholder}
                </select>
            ) : (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl font-inter text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#2e5bff]/60 focus:bg-white/[0.08] transition-all"
                />
            )}
            {hint && <p className="font-inter text-[11px] text-white/30">{hint}</p>}
        </div>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SettingsCard({ title, description, icon, children }) {
    return (
        <div className="bg-[#191c1d] rounded-3xl shadow-ambient-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 text-[#2e5bff]">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                </div>
                <div>
                    <h2 className="font-manrope text-sm font-bold text-white">{title}</h2>
                    {description && <p className="font-inter text-xs text-white/40 mt-0.5">{description}</p>}
                </div>
            </div>
            <div className="px-6 py-5">{children}</div>
        </div>
    );
}

export default function AdminSettings() {
    const { login, role, loading } = useContext(LoginContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState({
        newOrders: true,
        lowStock: true,
        newUsers: false,
        weeklyReport: true,
        promotionalUpdates: false,
    });

    const [saved, setSaved] = useState(false);

    React.useEffect(() => {
        if (!loading && (!login || role !== "ADMIN")) navigate("/");
    }, [login, role, loading, navigate]);

    if (loading || !login || role !== "ADMIN") return null;

    const toggle = (key) => setNotifications((n) => ({ ...n, [key]: !n[key] }));

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-black px-6 md:px-10 py-8 space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/admin/dashboard" className="font-inter text-xs text-white/30 hover:text-white/60 transition-colors">Dashboard</Link>
                        <span className="text-white/20">/</span>
                        <span className="font-inter text-xs text-white/60">Settings</span>
                    </div>
                    <h1 className="font-manrope text-2xl md:text-3xl font-bold text-white tracking-tight">Admin Settings</h1>
                    <p className="font-inter text-sm text-white/40 mt-0.5">Manage your store configuration and preferences.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Store Details */}
                <SettingsCard
                    title="Store Details"
                    description="Public information shown on receipts and your storefront."
                    icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField id="store-name" label="Store Name" placeholder="The Urban Muse" defaultValue="The Urban Muse" />
                        <FormField id="store-email" label="Support Email" type="email" placeholder="hello@theurbanmuse.co" defaultValue="hello@theurbanmuse.co" />
                        <FormField id="store-phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
                        <FormField
                            id="store-currency"
                            label="Default Currency"
                            type="select"
                            defaultValue="usd"
                            placeholder={<>
                                <option value="usd">USD – US Dollar</option>
                                <option value="eur">EUR – Euro</option>
                                <option value="gbp">GBP – British Pound</option>
                                <option value="inr">INR – Indian Rupee</option>
                            </>}
                        />
                        <div className="md:col-span-2">
                            <FormField id="store-desc" label="Store Tagline" type="textarea" placeholder="A short description visible on your homepage..." defaultValue="Elevated essentials for the modern wardrobe." />
                        </div>
                        <div className="md:col-span-2">
                            <FormField id="store-address" label="Business Address" placeholder="123 Fashion Ave, New York, NY 10001" />
                        </div>
                    </div>
                </SettingsCard>

                {/* System Notifications */}
                <SettingsCard
                    title="System Notifications"
                    description="Control which alerts are sent to your admin email."
                    icon={<path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
                >
                    <div className="divide-y divide-white/[0.05]">
                        <ToggleSwitch id="notif-orders" checked={notifications.newOrders} onChange={() => toggle("newOrders")} label="New Order Alerts" description="Get notified instantly when a customer places an order." />
                        <ToggleSwitch id="notif-low-stock" checked={notifications.lowStock} onChange={() => toggle("lowStock")} label="Low Stock Warnings" description="Receive alerts when a product's stock falls below 10 units." />
                        <ToggleSwitch id="notif-users" checked={notifications.newUsers} onChange={() => toggle("newUsers")} label="New User Registrations" description="Email digest of new accounts created each day." />
                        <ToggleSwitch id="notif-weekly" checked={notifications.weeklyReport} onChange={() => toggle("weeklyReport")} label="Weekly Performance Report" description="A summary of revenue, orders, and traffic every Monday." />
                        <ToggleSwitch id="notif-promo" checked={notifications.promotionalUpdates} onChange={() => toggle("promotionalUpdates")} label="Promotional Update Tips" description="Suggestions from us on running effective promotions." />
                    </div>
                </SettingsCard>

                {/* SEO & Advanced */}
                <SettingsCard
                    title="SEO & Metadata"
                    description="Improve discoverability of your storefront."
                    icon={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                >
                    <div className="space-y-4">
                        <FormField id="seo-title" label="Page Title" placeholder="The Urban Muse – Elevated Essentials" defaultValue="The Urban Muse – Elevated Essentials" hint="Recommended: 50–60 characters" />
                        <FormField id="seo-desc" label="Meta Description" type="textarea" placeholder="Discover premium clothing and lifestyle essentials..." defaultValue="Discover premium clothing and lifestyle essentials from The Urban Muse." hint="Recommended: 120–160 characters" />
                    </div>
                </SettingsCard>

                {/* Danger Zone */}
                <SettingsCard
                    title="Danger Zone"
                    description="Irreversible actions. Proceed with caution."
                    icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
                >
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-inter text-sm font-medium hover:bg-red-500/20 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear All Orders
                        </button>
                        <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-inter text-sm font-medium hover:bg-red-500/20 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Disable Storefront
                        </button>
                    </div>
                </SettingsCard>

                {/* Save Bar */}
                <div className="sticky bottom-4 z-20">
                    <div className="bg-[#191c1d]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-6 py-4 flex items-center justify-between shadow-ambient-lg">
                        <p className="font-inter text-sm text-white/50">
                            {saved ? (
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Settings saved successfully!
                                </span>
                            ) : "Unsaved changes will be lost."}
                        </p>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => navigate("/admin/dashboard")} className="px-4 py-2 font-inter text-sm text-white/50 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-gradient-to-r from-[#0040e0] to-[#2e5bff] text-white font-inter text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-ambient"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
