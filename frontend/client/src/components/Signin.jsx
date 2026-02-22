import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../Contexts/LoginContexts';

export default function Signin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const liveRef = useRef(null);
  const navigate = useNavigate();

  const normalizeEmail = (val) => val.trim();
  const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);

  const { setName } = useContext(LoginContext);
  const { setLogin } = useContext(LoginContext);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

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
    if (!isValidEmail(emailNorm)) {
      announce("❌ Please enter a valid email address.");
      return;
    }
    if (!otp || otp.length < 6) {
      announce("❌ Please enter the 6-digit OTP sent to your email.");
      return;
    }

    try {
      setSubmitLoading(true);

      const res = await fetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm, authCode: otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.log(data.message);
        announce("⚠️ Login failed. Try again.");
        return;
      }

      const data = await res.json();
      console.log(data.message);
      announce("✅ Logged in successfully.");
      setName(data.fullname);
      setLogin(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      announce("⚠️ Login failed. Try again.");
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

      const res = await fetch("/auth/otp/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm }),
      });

      if (!res.ok) {
        announce("❌ OTP could not be generated.");
      } else {
        announce("✅ OTP sent to your email!");
        setCooldown(30);
      }
    } catch (e) {
      console.error(e);
      announce("⚠️ Something went wrong.");
    } finally {
      setOtpLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-400 mb-1.5"
        >
          Email address
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="opacity-70"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="22,6 12,13 2,6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-dark pl-10"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* OTP */}
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-400 mb-1.5"
        >
          One-Time Passcode
        </label>
        <div className="flex items-stretch gap-2">
          <input
            id="otp"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(v);
            }}
            onPaste={(e) => {
              const v = (e.clipboardData.getData("text") || "")
                .replace(/\D/g, "")
                .slice(0, 6);
              if (v) {
                e.preventDefault();
                setOtp(v);
              }
            }}
            className="input-dark flex-1 tracking-[0.35em] tabular-nums text-center font-semibold text-lg"
            placeholder="• • • • • •"
            aria-describedby="otp-help"
          />
          <button
            type="button"
            onClick={otpCall}
            disabled={otpLoading || cooldown > 0}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${otpLoading || cooldown > 0
              ? "bg-white/[0.06] text-gray-600 cursor-not-allowed border border-white/[0.06]"
              : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
              }`}
          >
            {otpLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Sending
              </span>
            ) : cooldown > 0 ? (
              `Resend ${cooldown}s`
            ) : (
              "Get OTP"
            )}
          </button>
        </div>
        <p id="otp-help" className="mt-1.5 text-xs text-gray-600">
          Check your inbox (and spam folder). OTP expires quickly.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitLoading}
        className={`w-full rounded-xl py-3 font-semibold text-sm tracking-wide transition-all duration-300 ${submitLoading
          ? "bg-white/[0.06] text-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.98]"
          }`}
      >
        {submitLoading ? (
          <span className="inline-flex items-center gap-2 justify-center">
            <Spinner /> Logging in…
          </span>
        ) : (
          "Login"
        )}
      </button>

      {/* Feedback */}
      <p
        ref={liveRef}
        aria-live="polite"
        className={`min-h-[1.25rem] text-center text-sm mt-1 transition-colors duration-300 ${message.startsWith("✅")
          ? "text-emerald-400"
          : message.startsWith("❌")
            ? "text-red-400"
            : "text-amber-400"
          }`}
      >
        {message}
      </p>
    </form>
  );
}

/* Tiny inline spinner */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}
