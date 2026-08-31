"use client";

import { useEffect } from "react";

export default function SecurityProvider({ children }) {
  useEffect(() => {
    // Disable right click (except on mobile devices to allow long-press paste/copy)
    const handleContextMenu = (e) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) return;
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
