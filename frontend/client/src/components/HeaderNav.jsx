import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginContext } from '../Contexts/LoginContexts';
import { CartContext } from '../Contexts/CartContext';

export default function HeaderNav({ overlay = true }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { name, login } = useContext(LoginContext);
    const { setIsCartOpen, cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    // Close the mobile menu when route changes
    useEffect(() => setMobileOpen(false), [location.pathname]);

    return (
        <div className={overlay ? 'absolute inset-x-0 top-0 z-20' : 'relative z-20'}>
            <div className={`h-14 sm:h-[60px] px-4 sm:px-6 ${overlay ? 'bg-[#edeaf5]/90 backdrop-blur supports-[backdrop-filter]:bg-[#edeaf5]/40' : 'bg-[#edeaf5]'}`}>
                <div className="h-full flex items-center">
                    {/* Left: Brand + Mobile hamburger */}
                    <div className="flex items-center gap-3 text-black">
                        <button
                            className="lg:hidden p-2 -ml-2 rounded-xl focus:outline-none focus:ring"
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                            onClick={() => setMobileOpen(o => !o)}
                        >
                            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                        <div className="flex-col">
                            <Link to="/" className="block pl-1 sm:pl-2 text-xl sm:text-2xl font-semibold tracking-wide cursor-pointer hover:text-black/80 transition-colors">
                                THE URBAN MUSE
                            </Link>
                            <div className="pl-1 sm:pl-2 text-sm sm:text-md tracking-wide">
                                Welcome {name}
                            </div>
                        </div>
                    </div>

                    {/* Center: Desktop links */}
                    <nav className="hidden lg:flex flex-1 items-center justify-center gap-10 text-base text-black">
                        <Link to="/new" className="">NEW ARRIVALS</Link>
                        <Link to="/contact" className="">CONTACT</Link>
                        <Link to="/about" className="">ABOUT</Link>
                    </nav>

                    {/* Right: actions */}
                    <div className="ml-auto flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-1 rounded-md text-black"
                            aria-label="Profile"
                        >
                            <UserIcon className="h-6 w-6 hidden lg:block" />
                        </button>

                        <button className="p-1 text-black" aria-label="Search">
                            <MagnifyingGlassIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </button>
                        <button onClick={() => setIsCartOpen(true)} className="p-1 text-black relative" aria-label="Cart">
                            <ShoppingCartIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gray-100 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-gray-300">
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile slide-down menu */}
            <div
                id="mobile-nav"
                className={`lg:hidden origin-top overflow-hidden transition-[max-height] duration-300 ease-out bg-[#edeaf5]/95 backdrop-blur text-black
        ${mobileOpen ? 'max-h-64' : 'max-h-0'}`}
            >
                <div className="px-4 py-3 flex flex-col gap-2 text-base">
                    <Link to="/new" className="py-2">NEW ARRIVALS</Link>
                    <Link to="/contact" className="py-2">CONTACT</Link>
                    <Link to="/about" className="py-2">ABOUT</Link>
                    {login ? (
                        <Link to="/profile" className="py-2">PROFILE</Link>
                    ) : (
                        <Link to="/profile" className="py-2 flex items-center gap-2">
                            <button className="" > LOGIN / SIGNUP </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
