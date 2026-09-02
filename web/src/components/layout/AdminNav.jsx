"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShieldCheck, X } from "lucide-react";

import { isAdminLoggedIn as checkAdminAuth } from "@/lib/auth";

export default function AdminNav({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (typeof window !== "undefined" && window.location.pathname.includes("/search")) {
      router.push("/search");
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-xs sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger (Mobile) & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="md:hidden flex items-center justify-center p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
        </div>

        {/* Center: Home Page Style Search Bar with Global Clear (X) Button */}
        <div className="flex-1 max-w-md lg:max-w-lg mx-2 sm:mx-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full h-10 border border-gray-300 rounded-full overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खोज्नुहोस्..."
              className="flex-1 h-full px-4 bg-transparent text-[14px] text-gray-900 outline-none placeholder-gray-500"
            />

            {/* Clear (X) Button - Removes Search Filter Globally */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors mr-1 cursor-pointer"
                title="Clear search filter globally"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              className="flex items-center justify-center h-full px-5 bg-gray-50 border-l border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer"
              title="Search"
            >
              <Search size={18} className="text-gray-600" />
            </button>
          </form>
        </div>

        {/* Right: Admin Icon & Label */}
        <div className="flex items-center gap-3 shrink-0">
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
