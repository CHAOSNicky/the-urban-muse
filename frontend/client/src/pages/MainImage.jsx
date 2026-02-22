import React, { useState, useEffect, useContext, useRef } from 'react';
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import promoImage from '../assets/photo-1567401893414-76b7b1e5a7a5.jpeg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginContext } from '../Contexts/LoginContexts'

function MainImage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { name, login, logout, role } = useContext(LoginContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Close the mobile menu when route changes
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const menuRef = useRef(null); // reference to wrapper element

  // 1) Close dropdown if user clicks outside it, and close on Escape
  useEffect(() => {
    function handleDocMouse(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleDocKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocMouse);
    document.addEventListener('keydown', handleDocKey);
    return () => {
      document.removeEventListener('mousedown', handleDocMouse);
      document.removeEventListener('keydown', handleDocKey);
    };
  }, []);

  // 2) Close dropdown if screen becomes smaller than lg (1024px)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => {
      if (!e.matches) setOpen(false); // if viewport < 1024px, close
    };

    handler(mql);
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, []);



  return (
    <div className="relative">
      {/* Header (overlayed on image). On mobile it’s slightly shorter */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="h-14 sm:h-[60px] px-4 sm:px-6 bg-[#edeaf5]/90 backdrop-blur supports-[backdrop-filter]:bg-[#edeaf5]/40">
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
                <div className="pl-1 sm:pl-2 text-xl sm:text-2xl font-semibold tracking-wide cursor-pointer ">
                  THE URBAN MUSE
                </div>
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

            {/* Right: actions (icons on mobile, full on desktop)
                NOTE: attach menuRef to the wrapper that contains the user button AND the dropdown
            */}
            <div className="ml-auto flex items-center gap-4 sm:gap-6" ref={menuRef}>
              <div className="relative"> {/* make this relative so absolute dropdown is positioned correctly */}
                <button
                  onClick={() => {
                    if (!login) {
                      navigate('/login');
                    } else {
                      setOpen(prev => !prev);
                    }
                  }}
                  className="p-1 rounded-md text-black"
                >
                  <UserIcon className="h-6 w-6 hidden lg:block" />
                </button>

                {/* Render dropdown only when open and only on lg+ (Tailwind classes hide it automatically on small screens) */}
                {open && (
                  <div className="
                                  hidden lg:block absolute left-1/2 -translate-x-1/2 mt-3 w-40
                                  bg-black/60          /* let header show through */
                                  
                                  border border-white/70   /* subtle edge to distinguish it */
                                  rounded-xl shadow-lg z-50
                                  transition-all duration-200 ease-out
                              ">
                    {login ? (
                      <div className="text-sm sm:text-base px-4 py-2 ">
                        {role === "ADMIN" && (
                          <Link to="/admin" onClick={() => setOpen(false)} className="block text-white/70 text-sm sm:text-base px-4 py-2 mb-1
                            hover:backdrop-blur-md
                            border border-transparent
                            rounded-lg">
                            ADMIN
                          </Link>
                        )}
                        <button onClick={() => { logout(); setOpen(false); }} className="w-full text-white text-sm sm:text-base px-4 py-2 my-1
                          hover:backdrop-blur-md
                          border border-transparent
                          rounded-lg">
                          LOGOUT
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setOpen(false)} className="block text-white/70 text-sm sm:text-base px-4 py-2
                        hover:backdrop-blur-md
                        border border-transparent
                        rounded-lg">
                        LOGIN / SIGNUP
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <button className="p-1 text-black" aria-label="Search">
                <MagnifyingGlassIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
              <button className="p-1 text-black" aria-label="Cart">
                <ShoppingCartIcon className="h-6 w-6 sm:h-7 sm:w-7" />
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
            {login ? (<div className="py-2 flex items-center gap-2">
              <button onClick={logout} className="w-5 h-5" > LOGOUT </button>
            </div>)
              : <Link to="/login" className="py-2 flex items-center gap-2">
                <button className="" > LOGIN / SIGNUP </button>
              </Link>}
            {role === "ADMIN" && <Link to="/admin" className="py-2">ADMIN</Link>}
          </div>
        </div>
      </div>

      {/* Hero image (responsive height + crop) */}
      <div className="
        relative overflow-hidden
        h-[70vh] min-h-[360px]
        sm:h-[64vh]
        md:h-[70vh]
        lg:h-[650px]
      ">
        <img
          src={promoImage}
          alt="Promotional Banner"
          className="
            w-full h-full object-cover
            object-center
            lg:object-[0%_50%]
            transition-transform duration-[1000ms] ease-out animate-zoomOut
          "
        />
      </div>
    </div>
  );
}

export default MainImage;
