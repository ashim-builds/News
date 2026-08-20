"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Video,
  Megaphone,
  Settings,
  LogOut,
} from "lucide-react";

const SIDEBAR_NAV = [
  { id: "dashboard", label: "मुख्य नियन्त्रण (Dashboard)", href: "/admin/dashboard", icon: LayoutDashboard },
  { id: "overview", label: "समाचार व्यवस्थापन (Articles)", href: "/admin/dashboard/news", icon: Newspaper },
  { id: "videos", label: "भिडियो ग्यालरी (Videos)", href: "/admin/dashboard/videos", icon: Video },
  { id: "ads", label: "विज्ञापन व्यवस्थापन (Ads)", href: "/admin/dashboard/ads", icon: Megaphone },
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  const pathname = usePathname();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("smart_admin_session");
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/admin/login";
    }
  };

  const isTabActive = (item) => {
    if (activeTab) return activeTab === item.id;
    if (item.href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-64 bg-white min-h-full flex flex-col justify-between p-4 border-r border-gray-200">
      <div>
        {/* Navigation Links */}
        <nav className="space-y-1 mt-2">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const active = isTabActive(item);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className={active ? "text-white" : "text-gray-500"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Settings & Logout */}
      <div className="pt-4 mt-6 border-t border-gray-100 space-y-1">
        <Link
          href="/admin/dashboard?tab=settings"
          onClick={() => onTabChange && onTabChange("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-red-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings size={18} className={activeTab === "settings" ? "text-white" : "text-gray-500"} />
          <span>प्रणाली सेटिङ (Settings)</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>लगआउट (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
