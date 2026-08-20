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
    label: "प्रदेश पाना",
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
    <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
      {items.map((sub) => {
        const isSubActive = currentPath === sub.href;
        return (
          <Link
            key={sub.href}
            href={sub.href}
            className={`block px-4 py-2 text-xs font-semibold transition-colors ${
              isSubActive
                ? "bg-blue-50 text-blue-700 font-bold"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {sub.label}
          </Link>
        );
      })}
    </div>
  );
}

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(searchParams.get("q") || "");
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
    if (searchParams.get("q")) {
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
    }, 200);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={22} />
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center flex-1 space-x-0.5 xl:space-x-2">
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
                    className={`group relative flex items-center gap-1 px-1.5 xl:px-2.5 h-14 text-[11px] lg:text-[12px] xl:text-[13px] transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-blue-700 font-extrabold"
                        : "text-gray-700 font-bold hover:text-blue-700"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={`transition-colors hidden xl:block ${
                        isActive
                          ? "text-blue-700"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    />
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown
                        size={14}
                        className={`opacity-70 ml-0.5 group-hover:rotate-180 transition-transform duration-300 ${
                          isActive ? "text-blue-700" : ""
                        }`}
                      />
                    )}
                    {/* Bottom hover indicator - ONLY visible when cursor hovers */}
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full transform scale-x-0 origin-center transition-transform duration-300 ease-out group-hover:scale-x-100" />
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

          {/* Right Action Buttons & Search Box with Clear Button */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Desktop Search Box with Clear (X) Button */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center w-64 xl:w-88 h-10 border border-gray-300 rounded-full overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोज्नुहोस्..."
                className="flex-1 h-full px-4 bg-transparent text-[14px] text-gray-900 outline-none placeholder-gray-500"
              />

              {/* CLEAR (X) BUTTON - REMOVES SEARCH FILTER GLOBALLY */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors mr-1 cursor-pointer"
                  title="Clear search filter"
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

            {/* Mobile Search Icon */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search size={18} />
            </button>

            {isAdminLoggedIn && (
              <Link
                href="/admin/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 h-9 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 text-[13px] font-bold rounded-lg transition shadow-sm"
              >
                <ShieldCheck size={15} className="text-red-600" />
                <span>Admin</span>
              </Link>
            )}

            {/* Breaking / Taaza Button */}
            <Link
              href="/taja"
              className="hidden lg:flex relative items-center gap-1.5 px-3 h-9 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 text-[13px] font-bold rounded-lg transition shadow-sm"
            >
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
              <Bell size={15} />
              <span>ताजा अपडेट</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                    <img src="/logo.jpg" alt="Smart Sanchar Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-extrabold text-base text-gray-900">स्मार्ट सञ्चार</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
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
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={18} className={isActive ? "text-blue-700" : "text-gray-500"} />
                        <span>{item.label}</span>
                      </Link>

                      {item.dropdown && (
                        <div className="ml-8 my-1 flex flex-col gap-1 border-l-2 border-gray-100 pl-3">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={`text-xs py-1.5 px-2 rounded font-semibold ${
                                pathname === sub.href
                                  ? "text-blue-700 font-bold bg-blue-50/60"
                                  : "text-gray-600 hover:text-blue-600"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/taja"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl shadow-xs"
              >
                <Bell size={16} />
                <span>ताजा अपडेट</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md shadow-2xl flex items-center gap-2 border border-gray-200">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोज्नुहोस्..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-900"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-gray-400 hover:text-gray-600 mr-2"
                >
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="text-gray-600">
                <Search size={18} />
              </button>
            </form>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-14 bg-white border-b border-gray-200" />}>
      <SearchBarContent />
    </Suspense>
  );
}
