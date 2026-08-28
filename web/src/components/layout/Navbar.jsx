"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Home,
  MapPin,
  Newspaper,
  TrendingUp,
  AlertTriangle,
  Monitor,
  Users,
  Video,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

const PROVINCES = [
  { id: "koshi", name: "कोशी प्रदेश" },
  { id: "madhesh", name: "मधेश प्रदेश" },
  { id: "bagmati", name: "बागमती प्रदेश" },
  { id: "gandaki", name: "गण्डकी प्रदेश" },
  { id: "lumbini", name: "लुम्बिनी प्रदेश" },
  { id: "karnali", name: "कर्णाली प्रदेश" },
  { id: "sudurpashchim", name: "सुदूरपश्चिम प्रदेश" },
];

const NAV_ITEMS = [
  { label: "गृह", href: "/", icon: Home },
  {
    label: "प्रदेश समाचार",
    href: "/province/bagmati",
    icon: MapPin,
    dropdown: PROVINCES.map((p) => ({
      label: p.name,
      href: `/province/${p.id}`,
    })),
  },
  { label: "समाचार", href: "/samachar", icon: Newspaper },
  { label: "अर्थ / कृषि", href: "/artha", icon: TrendingUp },
  { label: "अपराध", href: "/apradh", icon: AlertTriangle },
  { label: "सूचना प्रविधि", href: "/it", icon: Monitor },
  { label: "समाज", href: "/samaj", icon: Users },
  { label: "भिडियो", href: "/videos", icon: Video },
];

function DropdownMenu({ items, visible, currentPath }) {
  if (!visible) return null;
  return (
    <div className="absolute top-full left-0 w-52 bg-white/98 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 mt-1">
      {items.map((sub) => {
        const isSubActive = currentPath === sub.href;
        return (
          <Link
            key={sub.href}
            href={sub.href}
            className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-all mx-1.5 rounded-xl ${
              isSubActive
                ? "bg-blue-50 text-blue-700 font-bold"
                : "text-gray-700 hover:bg-blue-50/60 hover:text-blue-600"
            }`}
          >
            <span>{sub.label}</span>
            {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
          </Link>
        );
      })}
    </div>
  );
}

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [provinceAccordionOpen, setProvinceAccordionOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const { unreadCount } = useNotifications();

  useEffect(() => {
    try {
      const session = localStorage.getItem("smart_admin_session");
      if (session) {
        const parsed = JSON.parse(session);
        queueMicrotask(() => setIsAdminLoggedIn(!!parsed?.loggedIn));
      }
    } catch {
      queueMicrotask(() => setIsAdminLoggedIn(false));
    }
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (searchParams?.get("q")) {
      router.push("/search");
    }
  };

  const handleMouseEnter = (label) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  return (
    <>
      <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Mobile hamburger & Compact Brand Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition cursor-pointer active:scale-95"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu size={22} />
            </button>

            {/* Mobile Logo thumbnail */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="h-9 w-auto flex items-center">
                <img
                  src="/logo.jpg"
                  alt="Smart Sanchar Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center flex-1 space-x-1 xl:space-x-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href)) ||
                    (item.dropdown &&
                      item.dropdown.some((sub) => pathname === sub.href));

              return (
                <div
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() =>
                    item.dropdown && handleMouseEnter(item.label)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-1.5 px-3 py-2 text-[12px] xl:text-[13px] rounded-xl transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-blue-50/90 text-blue-700 font-extrabold shadow-2xs"
                        : "text-gray-700 font-bold hover:bg-gray-100/80 hover:text-blue-600"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={`transition-colors ${
                        isActive
                          ? "text-blue-700"
                          : "text-gray-400 group-hover:text-blue-600"
                      }`}
                    />
                    <span>{item.label}</span>
                    {item.dropdown && (
                      <ChevronDown
                        size={13}
                        className={`opacity-70 ml-0.5 group-hover:rotate-180 transition-transform duration-250 ${
                          isActive ? "text-blue-700" : ""
                        }`}
                      />
                    )}
                  </Link>
                  {item.dropdown && (
                    <DropdownMenu
                      items={item.dropdown}
                      visible={openDropdown === item.label}
                      currentPath={pathname}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Actions: Search Box, Admin Button & Taaza Alert */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Desktop Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center w-60 xl:w-72 h-9 border border-gray-200/90 rounded-full overflow-hidden bg-gray-50/80 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="समाचार खोज्नुहोस्..."
                className="flex-1 h-full px-3.5 bg-transparent text-[13px] text-gray-900 outline-none placeholder-gray-400 font-medium"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-gray-400 hover:text-gray-700 transition-colors mr-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              <button
                type="submit"
                className="flex items-center justify-center h-full px-3.5 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                title="Search"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Mobile Search Button */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer active:scale-95"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Admin Dashboard Badge */}
            {isAdminLoggedIn && (
              <Link
                href="/admin/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 h-8.5 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200/80 text-[12px] font-bold rounded-xl transition shadow-2xs"
              >
                <ShieldCheck size={14} className="text-red-600" />
                <span>Admin</span>
              </Link>
            )}

            {/* Breaking News / Taaza Alert Button */}
            <Link
              href="/taja"
              className="flex items-center gap-1.5 px-3 h-8.5 bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold rounded-xl transition shadow-xs hover:scale-102 active:scale-98"
            >
              {unreadCount > 0 && (
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></span>
              )}
              <Bell size={14} className="text-yellow-300" />
              <span>ताजा अपडेट</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Drawer Slide-out */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="bg-white w-4/5 max-w-xs shrink-0 h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto rounded-r-3xl">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="h-10 w-auto flex items-center">
                  <img
                    src="/logo.jpg"
                    alt="Smart Sanchar Logo"
                    className="h-full w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href)) ||
                        (item.dropdown &&
                          item.dropdown.some((sub) => pathname === sub.href));

                  if (item.dropdown) {
                    return (
                      <div key={item.label} className="rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setProvinceAccordionOpen(!provinceAccordionOpen)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={16} className={isActive ? "text-blue-700" : "text-gray-400"} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              provinceAccordionOpen ? "rotate-180 text-blue-600" : "text-gray-400"
                            }`}
                          />
                        </button>

                        {provinceAccordionOpen && (
                          <div className="ml-5 my-1 flex flex-col gap-1 border-l-2 border-blue-100 pl-3">
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className={`text-xs py-1.5 px-2.5 rounded-xl font-semibold transition ${
                                  pathname === sub.href
                                    ? "text-blue-700 font-bold bg-blue-50"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-2xs"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-blue-700" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link
                href="/taja"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-2xl shadow-xs"
              >
                <Bell size={15} className="text-yellow-300" />
                <span>ताजा अपडेट</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs rounded-2xl border border-red-100 transition"
              >
                <ShieldCheck size={15} className="text-red-600" />
                <span>एडमिन लगइन (Admin)</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Mobile Search Popover Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-3.5 w-full max-w-md shadow-2xl flex items-center gap-2 border border-gray-200">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200/80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="समाचार खोज्नुहोस्..."
                className="flex-1 bg-transparent text-xs font-medium outline-none text-gray-900 placeholder-gray-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-gray-400 hover:text-gray-700 mr-1"
                >
                  <X size={15} />
                </button>
              )}
              <button type="submit" className="text-blue-600 p-1">
                <Search size={16} />
              </button>
            </form>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-14 bg-white border-b border-gray-200" />}>
      <NavbarContent />
    </Suspense>
  );
}
