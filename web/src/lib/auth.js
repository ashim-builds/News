"use client";

// Runtime in-memory cache for token and admin details (never written to localStorage)
let inMemoryToken = null;
let inMemoryAdmin = null;

// Immediately purge legacy insecure localStorage session on module initialization
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("smart_admin_session");
  } catch (e) {
    // Ignore storage errors in restricted contexts
  }
}

/**
 * Check if the non-sensitive login indicator cookie is present
 */
function getLoggedInCookie() {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(/(?:^|;\s*)smart_admin_logged_in=([^;]+)/);
  return match && match[1] === "1";
}

/**
 * Get the current admin JWT token from memory (if set in current execution context).
 * Tokens are NEVER stored in localStorage to protect against XSS exfiltration.
 */
export function getAdminToken() {
  return inMemoryToken;
}

/**
 * Check if the admin is marked as logged in (based on non-sensitive cookie or in-memory state)
 */
export function isAdminLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(inMemoryToken || getLoggedInCookie());
}

/**
 * Set admin session in runtime memory and set non-sensitive indicator cookie.
 * SENSITIVE DATA AND JWT TOKENS ARE NEVER STORED IN LOCALSTORAGE.
 */
export function setAdminSession(token, adminData = {}) {
  if (typeof window === "undefined") return;

  try {
    // 1. Store token in memory only for current page runtime
    inMemoryToken = token || null;
    inMemoryAdmin = adminData || null;

    // 2. Ensure localStorage is clean of any token/session
    localStorage.removeItem("smart_admin_session");

    // 3. Set a lightweight, non-sensitive indicator cookie (contains NO token or credentials)
    // The actual authentication JWT is stored exclusively in the secure HttpOnly cookie.
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `smart_admin_logged_in=1; path=/; max-age=${maxAge}; SameSite=Lax`;

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("admin-auth-changed", {
        detail: { loggedIn: true, admin: adminData },
      })
    );
  } catch (err) {
    console.error("Error setting admin session:", err);
  }
}

/**
 * Clear admin session, memory cache, and cookies
 */
export function clearAdminSession() {
  if (typeof window === "undefined") return;

  try {
    inMemoryToken = null;
    inMemoryAdmin = null;

    // Purge any lingering storage
    localStorage.removeItem("smart_admin_session");

    // Clear indicator cookie
    document.cookie =
      "smart_admin_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("admin-auth-changed", { detail: null })
    );
  } catch (err) {
    console.error("Error clearing admin session:", err);
  }
}

/**
 * Fetch authenticated admin profile directly from server via secure HttpOnly cookie
 */
export async function fetchAdminProfile() {
  if (inMemoryAdmin?.email) {
    return inMemoryAdmin;
  }

  try {
    const res = await authFetch("/api/admin/verify");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.admin) {
        inMemoryAdmin = data.admin;
        return data.admin;
      }
    }
  } catch (err) {
    console.error("Error fetching admin profile:", err);
  }
  return null;
}

/**
 * Authenticated fetch helper that forwards HttpOnly cookies securely and handles session expiration
 */
export async function authFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});

  // If an in-memory token is available, include Bearer header for redundancy
  if (inMemoryToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${inMemoryToken}`);
  }

  const enhancedOptions = {
    ...options,
    headers,
    credentials: "include", // Essential: Transmits HttpOnly cookie securely
  };

  try {
    const res = await fetch(url, enhancedOptions);

    if (res.status === 401) {
      // Unauthorized or expired token
      clearAdminSession();
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin/dashboard")
      ) {
        window.location.href = `/admin/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`;
      }
    }

    return res;
  } catch (error) {
    console.error("authFetch error for:", url, error);
    throw error;
  }
}
