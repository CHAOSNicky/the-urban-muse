import { useState, useEffect, createContext, useCallback } from "react";
import API_BASE_URL from "../Constants/CommonConst";
import { clearCartSyncFlag } from "../services/cartSyncService";

export const LoginContext = createContext();

export function LoginProvider({ children }) {
    const [login, setLogin] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Verify auth against the server (cookie-based) ──────────────
    const verifyAuth = useCallback(async () => {
        try {
            const res = await fetch(API_BASE_URL + "/auth/me", {
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
            const res = await fetch(`${API_BASE_URL}/auth/logout`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (res.ok) {
                setLogin(false);
                setName("");
                setRole(null);
                // Allow next login to trigger a fresh cart sync
                clearCartSyncFlag();
            } else {
                console.log("Logout failed");
            }

        } catch (err) {
            console.error("Logout error:", err);
        }
    }, []);


    return (
        <LoginContext.Provider
            value={{ name, setName, role, setRole, login, setLogin, loading, logout, verifyAuth }}
        >
            {children}
        </LoginContext.Provider>
    );
}
