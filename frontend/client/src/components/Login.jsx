import React, { useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import { Link } from 'react-router-dom';

export default function Login() {
  const [active, setActive] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1117] relative overflow-hidden px-4">
      {/* Back arrow */}
      <div className="fixed top-7 left-7 z-50">
        <Link
          to="/"
          aria-label="Go To MainPage"
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      </div>

      {/* Ambient glow blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] animate-float" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[120px] animate-float-delayed" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-blue-600/[0.07] blur-[100px] animate-float" />

      <div className="w-full max-w-md z-10">
        {/* Tab switcher */}
        <div
          className="relative flex w-full rounded-2xl glass-card p-1.5"
          role="tablist"
          aria-label="Auth tabs"
        >
          {/* Sliding pill */}
          <div
            className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${active === "login" ? "translate-x-0" : "translate-x-[calc(100%+6px)]"
              }`}
            aria-hidden="true"
          />

          {/* Tab buttons */}
          <button
            type="button"
            role="tab"
            aria-selected={active === "login"}
            onClick={() => setActive("login")}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${active === "login"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
              }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={active === "signup"}
            onClick={() => setActive("signup")}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${active === "signup"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
              }`}
          >
            SIGNUP
          </button>
        </div>

        {/* Form card */}
        <div className="glass-card mt-6 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
            {active === "login" ? "Welcome Back 👋" : "Create Your Account 🚀"}
          </h2>

          {/* Fade-animate forms; min-h prevents layout shift */}
          <div className="relative min-h-[280px]">
            {active === "login" && (
              <div key="login" className="animate-fadeIn">
                <Signin />
              </div>
            )}
            {active === "signup" && (
              <div key="signup" className="animate-fadeIn">
                <Signup />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
