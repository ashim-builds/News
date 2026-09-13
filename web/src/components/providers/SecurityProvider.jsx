"use client";

import { useEffect } from "react";

export default function SecurityProvider({ children }) {
  useEffect(() => {
    // Helper to determine if current device or interaction is touch/mobile
    const isTouchOrMobile = (e) => {
      // 1. If event was triggered by touch or pen, always treat as touch
      if (e && (e.pointerType === "touch" || e.pointerType === "pen")) {
        return true;
      }

      if (typeof window === "undefined") return false;

      // 2. Hardware touch capabilities (Android, iPhone, iPad, tablets, touchscreens)
      if (
        (typeof navigator !== "undefined" && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) ||
        "ontouchstart" in window
      ) {
        return true;
      }

      // 3. Media queries for coarse pointers (standard for phones & tablets)
      try {
        if (
          window.matchMedia("(pointer: coarse)").matches ||
          window.matchMedia("(hover: none)").matches
        ) {
          return true;
        }
      } catch (err) {
        // Ignore media query error on older browsers
      }

      // 4. iPadOS desktop user-agent check (Apple reports MacIntel for iPadOS 13+)
      if (typeof navigator !== "undefined") {
        if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
          return true;
        }
        if (navigator.userAgentData?.mobile) {
          return true;
        }
        const ua = navigator.userAgent || "";
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle/i.test(ua)) {
          return true;
        }
      }

      // 5. Mobile/tablet screen size fallback
      if (typeof window !== "undefined" && window.innerWidth <= 1024) {
        return true;
      }

      return false;
    };

    // Disable right click (except on mobile/touch devices, inputs, or active text selection to allow copy/paste)
    const handleContextMenu = (e) => {
      // 1. ALWAYS allow inside input, textarea, and editable elements (so copy/paste/cut always works)
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          Boolean(target.closest("input, textarea, [contenteditable='true'], [contenteditable='']")))
      ) {
        return;
      }

      // 2. ALWAYS allow on mobile phones, tablets, and touch interactions (so native Copy/Paste/Share callout shows)
      if (isTouchOrMobile(e)) {
        return;
      }

      // 3. ALWAYS allow if user has highlighted text on screen (so they can right-click copy)
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        return;
      }

      // Prevent right-click context menu on desktop empty/static spaces
      e.preventDefault();
    };

    // Disable common developer shortcut keys
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+J (Windows) or Cmd+Option+J (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+C (Windows) or Cmd+Option+C (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
      }

      // Ctrl+U (Windows) or Cmd+U (Mac) - View Source
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
        e.preventDefault();
      }

      // Ctrl+S (Windows) or Cmd+S (Mac) - Save Page
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}
