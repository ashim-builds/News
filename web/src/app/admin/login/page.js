"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import AdminNav from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";
import { isAdminLoggedIn, setAdminSession } from "@/lib/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if already logged in
    if (isAdminLoggedIn()) {
      const redirectUrl = searchParams.get("redirect") || "/admin/dashboard";
      window.location.href = redirectUrl;
      return;
    }

    queueMicrotask(() => {
      setFormData({ email: "", password: "" });
    });
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Direct Credential Login
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.token) {
        // Save token and session
        setAdminSession(data.token, data.admin || { email: formData.email });

        setSuccessMessage("Authentication Successful! Redirecting to Admin Dashboard...");
        
        const redirectUrl = searchParams.get("redirect") || "/admin/dashboard";
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      } else {
        setErrorMessage(data.message || "Authentication failed. Please check credentials.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Failed to connect to authentication server.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Section Heading */}
      <div className="flex items-center gap-3 border-b-2 border-red-600 pb-3 mb-8">
        <div className="w-2 h-7 bg-red-600 rounded-sm"></div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Admin Portal
        </h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {/* Header Icon & Title */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <ShieldAlert size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Administrator Sign In
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter your official credentials to access the system
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-5" autoComplete="off" key="login-form">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Address <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                id="admin-login-email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="admin-login-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <AdminNav />

        <main className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-blue-900 font-bold">Admin Portal</span>
          </div>

          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <AdminLoginForm />
          </Suspense>
        </main>
      </div>

      <Footer />
    </div>
  );
}


