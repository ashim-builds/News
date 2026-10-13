"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function PageLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const isNavigatingRef = useRef(false);

  // Complete and reset loading state when route actually changes
  useEffect(() => {
    if (!isNavigatingRef.current) return;
    isNavigatingRef.current = false;

    const timer1 = setTimeout(() => {
      setProgress(100);
    }, 0);

    const timer2 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname, searchParams]);

  // Handle click on internal links
  useEffect(() => {
    let intervalId = null;

    const handleAnchorClick = (e) => {
      // Find the closest anchor tag
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Skip non-HTTP links, external links, anchor links, or new tab links
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        href.startsWith("javascript:") ||
        target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal link
      const isInternal =
        href.startsWith("/") ||
        href.startsWith(window.location.origin);

      if (!isInternal) return;

      // Check if clicking current URL
      const targetUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search &&
        targetUrl.hash !== ""
      ) {
        return; // In-page anchor jump
      }

      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search
      ) {
        return; // Same page
      }

      // Start visible loading animation immediately!
      isNavigatingRef.current = true;
      setLoading(true);
      setProgress(25);

      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(intervalId);
            return 85;
          }
          return prev + 15;
        });
      }, 200);
    };

    // Auto-timeout failsafe (if navigation cancelled or errored)
    let safetyTimeout = null;
    if (loading) {
      safetyTimeout = setTimeout(() => {
        isNavigatingRef.current = false;
        setLoading(false);
        setProgress(0);
        if (intervalId) clearInterval(intervalId);
      }, 8000);
    }

    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (intervalId) clearInterval(intervalId);
      if (safetyTimeout) clearTimeout(safetyTimeout);
    };
  }, [loading, pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <>
      {/* Top High-Visibility Glowing Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-blue-600 to-red-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(220,38,38,0.8),0_0_6px_rgba(37,99,235,0.8)]"
          style={{
            width: `${progress}%`,
            opacity: progress === 100 ? 0 : 1,
            transition: progress === 100 ? "width 0.15s ease-out, opacity 0.25s ease-in 0.1s" : "width 0.3s ease-out",
          }}
        />
      </div>

      {/* Floating Center/Top Glassmorphic Loading Indicator Pill */}
      {loading && progress < 100 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-950/90 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold tracking-wide">
            <Loader2 size={16} className="animate-spin text-red-500" />
            <span className="text-white">लोड हुँदैछ...</span>
          </div>
        </div>
      )}
    </>
  );
}

export default function PageLoadingIndicator() {
  return (
    <Suspense fallback={null}>
      <PageLoadingBar />
    </Suspense>
  );
}
