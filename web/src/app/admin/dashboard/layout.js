"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import AdminNav from "@/components/layout/AdminNav";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { isAdminLoggedIn, clearAdminSession, authFetch } from "@/lib/auth";

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      // First quick check: if no login cookie at all, immediately redirect
      if (!isAdminLoggedIn()) {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
          clearAdminSession();
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname || "/admin/dashboard")}`);
        }
        return;
      }

      try {
        // Authenticate directly with server using secure HttpOnly cookie
        const res = await authFetch("/api/admin/verify");
        const data = await res.json();

        if (isMounted) {
          if (res.ok && data.success && data.valid) {
            setIsAuthorized(true);
            setIsChecking(false);
          } else {
            clearAdminSession();
            setIsAuthorized(false);
            setIsChecking(false);
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname || "/admin/dashboard")}`);
          }
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        if (isMounted) {
          clearAdminSession();
          setIsAuthorized(false);
          setIsChecking(false);
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname || "/admin/dashboard")}`);
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // Loading state while verifying credentials
  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white font-sans">
        <div className="w-full max-w-sm bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center animate-in fade-in duration-300">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Lock size={28} className="animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 border-2 border-slate-800">
              <Loader2 size={14} className="animate-spin text-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2 tracking-wide">
            सुरक्षा प्रमाणीकरण
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            प्रशासक पहुँच प्रमाणीकरण गरिँदैछ...
            <br />
            <span className="text-[11px] text-slate-500">Verifying administrator authorization credentials</span>
          </p>

          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full w-2/3 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard layout once authorized
  return (
    <div className="bg-gray-50 h-screen flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <AdminNav />

      {/* Main Layout Container with Sidebar and Content */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar Container */}
        <div className="hidden md:block w-64 h-full overflow-y-auto shrink-0 bg-white border-r border-gray-200">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto px-4 sm:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
