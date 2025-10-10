import React, { useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";

export default function Login() {
  const [active, setActive] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-200 relative overflow-hidden">
      {/* Decorative background blur circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="w-full max-w-md z-10">
        {/* Tab switcher */}
        <div
          className="relative flex w-full rounded-2xl bg-white/40 backdrop-blur-xl p-1 shadow-lg border border-white/30"
          role="tablist"
          aria-label="Auth tabs"
        >
          {/* Sliding pill */}
          <div
            className={`absolute inset-y-1 left-1 w-1/2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform transition-transform duration-500 ease-in-out ${
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
        <div className="bg-white/60 backdrop-blur-xl mt-6 rounded-2xl shadow-2xl p-8 border border-white/30 transition-transform transform hover:scale-[1.02] duration-300">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {active === "login" ? "Welcome Back 👋" : "Create Your Account 🚀"}
          </h2>
          <div
            className={`transition-opacity duration-500 ${
              active === "login" ? "opacity-100" : "opacity-0 absolute"
            }`}
          >
            {active === "login" && <Signin />}
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
