"use client";

/**
 * Get the current admin JWT token from localStorage or cookies
 */
export function getAdminToken() {
  if (typeof window === "undefined") return null;

  try {
    // 1. Try from localStorage session
    const sessionStr = localStorage.getItem("smart_admin_session");
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      if (parsed?.token) return parsed.token;
    }

    // 2. Try from document.cookie
    const match = document.cookie.match(/(?:^|;\s*)smart_admin_token=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch (err) {
    console.error("Error reading admin token:", err);
  }

  return null;
}

/**
 * Check if the admin is marked as logged in
 */
export function isAdminLoggedIn() {
  if (typeof window === "undefined") return false;
  return !!getAdminToken();
}

/**
 * Set admin session in localStorage and cookie
 */
export function setAdminSession(token, adminData = {}) {
  if (typeof window === "undefined") return;

  try {
    const sessionObj = {
      loggedIn: true,
      token,
      email: adminData.email || "",
      role: adminData.role || "admin",
      loginTime: Date.now(),
    };

    localStorage.setItem("smart_admin_session", JSON.stringify(sessionObj));

    // Also set document cookie for Edge middleware & SSR access (7 days)
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `smart_admin_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("admin-auth-changed", { detail: sessionObj }));
  } catch (err) {
    console.error("Error setting admin session:", err);
  }
}

/**
 * Clear admin session and cookies
 */
export function clearAdminSession() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("smart_admin_session");
    document.cookie = "smart_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("admin-auth-changed", { detail: null }));
  } catch (err) {
    console.error("Error clearing admin session:", err);
  }
}

/**
 * Authenticated fetch helper that adds Authorization header and handles session expiration
 */
export async function authFetch(url, options = {}) {
  const token = getAdminToken();

  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const enhancedOptions = {
    ...options,
    headers,
    credentials: "include", // Ensure cookies are forwarded through rewrites
  };

  try {
    const res = await fetch(url, enhancedOptions);

    if (res.status === 401) {
      // Unauthorized or expired token
      clearAdminSession();
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin/dashboard")) {
        window.location.href = `/admin/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }

    return res;
  } catch (error) {
    console.error("authFetch error for:", url, error);
    throw error;
  }
}
