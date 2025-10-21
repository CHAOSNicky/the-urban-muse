import React, { useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import { Link } from 'react-router-dom';

export default function Login({setName}) {
  const [active, setActive] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-50 to-white relative overflow-hidden">
      <div className="fixed top-7 left-7 z-50 cursor-pointer hover:opacity-80 text-gray-700">
        <Link to="/" aria-label="Go To MainPage">
          <svg
            width="35"
            height="35"
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

      {/* Decorative background blur circles (soft, light) */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-neutral-300 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-neutral-200 rounded-full blur-3xl opacity-30 animate-pulse" />

      <div className="w-full max-w-md z-10">
        {/* Tab switcher */}
        <div
          className="relative flex w-full rounded-2xl bg-white/80 backdrop-blur p-1 shadow-md border border-gray-200"
          role="tablist"
          aria-label="Auth tabs"
        >
          {/* Sliding pill */}
          <div
            className={`absolute inset-y-1 left-1 w-1/2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-400 shadow transform transition-transform duration-500 ease-in-out ${
              active === "login" ? "translate-x-0" : "translate-x-full"
            }`}
            aria-hidden="true"
          />

          {/* Buttons */}
          <button
            type="button"
            role="tab"
            aria-selected={active === "login"}
            onClick={() => setActive("login")}
            className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-xl transition-colors duration-300 ${
              active === "login"
                ? "text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={active === "signup"}
            onClick={() => setActive("signup")}
            className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-xl transition-colors duration-300 ${
              active === "signup"
                ? "text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            SIGNUP
          </button>
        </div>

        {/* Form container */}
        <div className="bg-white/90 backdrop-blur mt-6 rounded-2xl shadow-xl p-8 border border-gray-200 transition-transform transform hover:scale-[1.02] duration-300">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {active === "login" ? "Welcome Back 👋" : "Create Your Account 🚀"}
          </h2>
          <div
            className={`transition-opacity duration-500 ${
              active === "login" ? "opacity-100" : "opacity-0 absolute"
            }`}
          >
            {active === "login" && <Signin setName={setName} />}
          </div>
          <div
            className={`transition-opacity duration-500 ${
              active === "signup" ? "opacity-100" : "opacity-0 absolute"
            }`}
          >
            {active === "signup" && <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
}
