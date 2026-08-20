"use client";

import AdminNav from "@/components/layout/AdminNav";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 h-screen flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <AdminNav />

      {/* Main Layout Container with Sidebar and Content */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar Container */}
        <div className="hidden md:block w-64 h-full overflow-y-auto shrink-0 bg-white">
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
