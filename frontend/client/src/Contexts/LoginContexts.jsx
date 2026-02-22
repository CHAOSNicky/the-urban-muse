import { useState, useEffect, createContext, useCallback } from "react";

export const LoginContext = createContext();

export function LoginProvider({ children }) {
    const [login, setLogin] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Verify auth against the server (cookie-based) ──────────────
    const verifyAuth = useCallback(async () => {
        try {
            const res = await fetch("/auth/me", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setLogin(true);
                setName(data.fullname ?? "");
                setRole(data.role ?? null);
            } else {
                setLogin(false);
                setName("");
                setRole(null);
            }
        } catch {
            // Network error — assume not authenticated
            setLogin(false);
            setName("");
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Check auth once on mount ────────────────────────────────────
    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    // ── Re-check when the tab regains focus (catches cookie deletion) ─
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                verifyAuth();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibility);
    }, [verifyAuth]);

    // ── Centralized logout ──────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            const res = await fetch(
                "/auth/logout",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (res.ok) {
                setLogin(false);
                setName("");
                setRole(null);
            } else {
                console.log("Logout failed");
            }

        } catch (err) {
            console.error("Logout error:", err);
        }
    }, []);


    return (
        <LoginContext.Provider
            value={{ name, setName, role, setRole, login, setLogin, loading, logout }}
        >
            {children}
        </LoginContext.Provider>
    );
}
