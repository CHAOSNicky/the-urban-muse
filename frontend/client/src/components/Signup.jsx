import React, { useEffect, useRef, useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds

  const liveRef = useRef(null);

  const normalizeEmail = (val) => val.trim();
  const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Announce helper (for screen readers + inline feedback)
  const announce = (text) => {
    setMessage(text);
    if (liveRef.current) {
      liveRef.current.textContent = "";
      setTimeout(() => (liveRef.current.textContent = text), 10);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailNorm = normalizeEmail(email);

    if (!name.trim()) {
      announce("❌ Please enter your full name.");
      return;
    }
    if (!isValidEmail(emailNorm)) {
      announce("❌ Please enter a valid email address.");
      return;
    }
    if (!otp || otp.length < 6) {
      announce("❌ Please enter the OTP sent to your email.");
      return;
    }

    setSubmitLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/signup",
        {
          method: "POST",
          credentials: "include",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({"fullName": name,
                                "email": emailNorm,
                                "authCode": otp}
          )
        }
      )

      if(!res.ok){
        try{
          const data = await res.JSON();
        }
        catch{  }
        announce("⚠️ Signup Failed");
        return;
      }

      announce("✅ Account created! Redirecting...");
    } catch (err) {
      console.error(err);
      announce("⚠️ Signup failed. Try again.");
    } finally {
      setSubmitLoading(false);
    }
  };


  async function otpCall() {
    try {
      const emailNorm = normalizeEmail(email);
      if (!isValidEmail(emailNorm)) {
        announce("❌ Please enter a valid email address first.");
        return;
      }
      setOtpLoading(true);

      const res = await fetch("http://localhost:8080/api/otp/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"fullName" : name,
                              "email": emailNorm }),
      });

      if (!res.ok) {
        announce("❌ OTP could not be generated.");
      } else {
        announce("✅ OTP sent to your email!");
        setCooldown(30); // 30s resend cooldown
      }
    } catch (e) {
      console.error(e);
      announce("⚠️ Something went wrong.");
    } finally {
      setOtpLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Name */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Name
        </h3>
        <div className="relative group">
          <label
            htmlFor="signup-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full name
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {/* user icon */}
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="opacity-70">
                <path
                  d="M12 12c2.7 0 4.5-2.2 4.5-5S14.7 2 12 2 7.5 4.2 7.5 7s1.8 5 4.5 5zm0 2c-3 0-9 1.5-9 4.5V22h18v-3.5c0-3-6-4.5-9-4.5z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500 transition shadow-sm"
              placeholder="John Doe"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Email */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Email
        </h3>
        <div className="relative group">
          <label
            htmlFor="signup-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {/* mail icon */}
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="opacity-70">
                <path
                  d="M4 6h16a1 1 0 0 1 .8 1.6l-8 10a1 1 0 0 1-1.6 0l-8-10A1 1 0 0 1 4 6Zm0 0l8 5 8-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500 transition shadow-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>

      {/* Section 3: OTP */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Verification
        </h3>
        <label htmlFor="signup-otp" className="block text-sm font-medium text-gray-700 mb-1">
          One-Time Passcode
        </label>
        <div className="flex items-stretch gap-2">
          <input
            id="signup-otp"
            inputMode="numeric"
            pattern="[0-9]*"
            value={otp}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6); // digits only, max 6
              setOtp(v);
            }}
            onPaste={(e) => {
              const v = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
              if (v) {
                e.preventDefault();
                setOtp(v);
              }
            }}
            className="flex-1 tracking-widest tabular-nums px-3 py-2 rounded-xl border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-500 transition shadow-sm text-center font-semibold"
            placeholder="••••••"
            aria-describedby="signup-otp-help"
          />
          <button
            type="button"
            onClick={otpCall}
            disabled={otpLoading || cooldown > 0}
            className={`px-4 py-2 rounded-xl font-semibold text-white shadow-sm transition
              ${otpLoading || cooldown > 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-neutral-700 to-neutral-800 hover:from-neutral-800 hover:to-neutral-900"
              }`}
          >
            {otpLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Sending
              </span>
            ) : cooldown > 0 ? (
              `Resend ${cooldown}s`
            ) : (
              "Get OTP"
            )}
          </button>
        </div>
        <p id="signup-otp-help" className="mt-1 text-xs text-gray-600">
          We’ll send a code to verify your email.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitLoading}
        className={`w-full rounded-xl py-2.5 font-semibold text-white shadow-md transition
          ${submitLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-neutral-700 to-neutral-800 hover:from-neutral-800 hover:to-neutral-900"
          }`}
      >
        {submitLoading ? (
          <span className="inline-flex items-center gap-2 justify-center">
            <Spinner /> Creating account…
          </span>
        ) : (
          "Sign up"
        )}
      </button>

      {/* Feedback (ARIA live) */}
      <p
        ref={liveRef}
        aria-live="polite"
        className={`min-h-[1.25rem] text-center text-sm mt-1
          ${message.startsWith("✅") ? "text-green-600" :
            message.startsWith("❌") ? "text-red-600" :
            "text-gray-600"}`}
      >
        {message}
      </p>
    </form>
  );
}

/* Tiny inline spinner—no extra deps */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}
