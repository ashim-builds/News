"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";

import { isAdminLoggedIn as checkAdminAuth } from "@/lib/auth";

export default function AdminNav({ onMenuClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(checkAdminAuth());
    };

    updateAuth();
    window.addEventListener("storage", updateAuth);
    window.addEventListener("admin-auth-changed", updateAuth);

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("admin-auth-changed", updateAuth);
    };
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-xs sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger (Mobile), Logo & Admin Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="md:hidden flex items-center justify-center p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          )}
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 sm:h-12 flex items-center justify-center shrink-0">
              <img
                src="/logo.jpg"
                alt="Smart Sanchar Logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200/80">
            एडमिन प्यानल
          </span>
        </div>

        {/* Right: Visit Website & Admin Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="text-xs font-bold text-gray-600 hover:text-red-600 transition-colors hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            वेबसाइट हेर्नुहोस् →
          </Link>

          <Link
            href={isLoggedIn ? "/admin/dashboard" : "/admin/login"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-800 font-semibold text-sm cursor-pointer"
            title={isLoggedIn ? "Admin Dashboard" : "Admin Login"}
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700">
              {isLoggedIn ? <ShieldCheck size={18} className="text-red-600" /> : <User size={18} />}
            </div>
            <span className="hidden sm:inline text-gray-900 font-bold">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
