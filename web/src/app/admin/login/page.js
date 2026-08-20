"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  ArrowLeft,
  RotateCcw,
  Key,
} from "lucide-react";
import AdminNav from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";

function AdminLoginForm() {
  const searchParams = useSearchParams();

  // Step 1: Login, Step 2: 2FA OTP, Step 3: Request Forgot Password, Step 4: Reset Password
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if already logged in
    try {
      const session = localStorage.getItem("smart_admin_session");
      if (session && searchParams.get("mode") !== "reset") {
        const parsed = JSON.parse(session);
        if (parsed?.loggedIn) {
          window.location.href = "/admin/dashboard";
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Always start with fresh empty form on mount
    queueMicrotask(() => {
      setFormData({ email: "", password: "" });
      if (searchParams.get("mode") === "reset") {
        setStep(4);
        if (searchParams.get("email")) {
          setFormData((prev) => ({ ...prev, email: searchParams.get("email") }));
        }
      }
    });
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // STEP 1: Submit Login Credentials -> API /api/admin/send-otp
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
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setStep(2);
        setSuccessMessage(`Credentials verified! 2-Step OTP code sent to ${formData.email}`);
      } else {
        setErrorMessage(data.message || "Authentication failed. Please check credentials.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Failed to connect to authentication server.");
    }
  };

  // STEP 2: Submit 2FA Login OTP -> API /api/admin/verify-otp
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!otp || otp.trim().length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        // Persist session across page refreshes
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "smart_admin_session",
            JSON.stringify({ loggedIn: true, email: formData.email, loginTime: Date.now() })
          );
          window.dispatchEvent(new Event("storage"));
        }

        setSuccessMessage("Authentication Successful! Redirecting to Admin Dashboard...");
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/admin/dashboard";
          }
        }, 800);
      } else {
        setErrorMessage(data.message || "Invalid OTP code.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Failed to verify OTP.");
    }
  };

  // STEP 3: Request Forgot Password OTP -> API /api/admin/forgot-password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email) {
      setErrorMessage("Please enter your admin email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setStep(4);
        setSuccessMessage(`Password reset code has been sent via Nodemailer to ${formData.email}`);
      } else {
        setErrorMessage(data.message || "Email address not found.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Failed to send reset email.");
    }
  };

  // STEP 4: Submit Reset Password & New Password -> API /api/admin/reset-password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!resetOtp || resetOtp.trim().length !== 6) {
      setErrorMessage("Please enter the 6-digit reset OTP code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: resetOtp.trim(),
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setStep(1);
        setFormData({ email: "", password: "" });
        setSuccessMessage("Password reset successful! You can now log in with your new password.");
      } else {
        setErrorMessage(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Error updating password.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Section Heading */}
      <div className="flex items-center gap-3 border-b-2 border-red-600 pb-3 mb-8">
        <div className="w-2 h-7 bg-red-600 rounded-sm"></div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          {step === 1 && "Admin Portal"}
          {step === 2 && "2-Step Verification"}
          {step === 3 && "Forgot Password"}
          {step === 4 && "Set New Password"}
        </h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {/* Header Icon & Title */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            {step === 1 && <ShieldAlert size={26} />}
            {step === 2 && <KeyRound size={26} />}
            {step === 3 && <Mail size={26} />}
            {step === 4 && <Key size={26} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === 1 && "Administrator Sign In"}
              {step === 2 && "Email 2FA Verification"}
              {step === 3 && "Reset Admin Password"}
              {step === 4 && "Create New Password"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === 1 && "Enter your official credentials to access the system"}
              {step === 2 && `Enter the 6-digit OTP code sent to ${formData.email}`}
              {step === 3 && "Enter your registered email to receive a password reset code"}
              {step === 4 && `Enter the reset code sent to ${formData.email} and your new password`}
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

        {/* STEP 1: LOGIN FORM */}
        {step === 1 && (
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

            <div className="flex items-center justify-end text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
        )}

        {/* STEP 2: 2FA OTP VERIFICATION FORM */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                6-Digit Security OTP Code <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-lg text-center font-mono tracking-[8px] font-bold text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </button>

              <button
                type="button"
                onClick={handleCredentialsSubmit}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={13} />
                <span>Resend OTP Code</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Verify OTP & Complete Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: FORGOT PASSWORD REQUEST FORM */}
        {step === 3 && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Admin Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Mail size={18} />
                  <span>Send Password Reset OTP Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: RESET PASSWORD FORM */}
        {step === 4 && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                6-Digit Reset OTP Code <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  maxLength="6"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-lg text-center font-mono tracking-[8px] font-bold text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                New Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex="-1"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Confirm New Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Cancel & Back to Sign In</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Key size={18} />
                  <span>Update & Reset Password</span>
                </>
              )}
            </button>
          </form>
        )}
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
