"use client";

import { useState, useEffect } from "react";

// Shared global state and subscriber listeners across all component instances
let globalArticles = [];
let globalUnreadIds = [];
let listeners = [];

const notifyListeners = () => {
  listeners.forEach((listener) => {
    listener({
      articles: globalArticles,
      unreadIds: globalUnreadIds,
    });
  });
};

export const useNotifications = () => {
  const [state, setState] = useState({
    articles: globalArticles,
    unreadIds: globalUnreadIds,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add current component set state to listeners
    listeners.push(setState);

    async function fetchLatestNews() {
      try {
        const res = await fetch("/api/articles?status=Published&limit=20");
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          globalArticles = data.articles;

          // Get read IDs from localStorage
          let storedRead = [];
          try {
            storedRead = JSON.parse(localStorage.getItem("smart_read_article_ids") || "[]");
          } catch {}

          globalUnreadIds = data.articles
            .map((a) => a._id)
            .filter((id) => !storedRead.includes(id));

          notifyListeners();
        }
      } catch (err) {
        console.error("Error fetching latest updates for notifications:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestNews();

    // Listen for custom event or storage updates
    const handleSync = () => {
      let storedRead = [];
      try {
        storedRead = JSON.parse(localStorage.getItem("smart_read_article_ids") || "[]");
      } catch {}
      globalUnreadIds = globalArticles
        .map((a) => a._id)
        .filter((id) => !storedRead.includes(id));
      notifyListeners();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("notifications_updated", handleSync);
      window.addEventListener("storage", handleSync);
    }

    // Poll every 15 seconds for real-time new article uploads
    const interval = setInterval(fetchLatestNews, 15000);

    return () => {
      listeners = listeners.filter((l) => l !== setState);
      if (typeof window !== "undefined") {
        window.removeEventListener("notifications_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      }
      clearInterval(interval);
    };
  }, []);

  const markAsRead = (id) => {
    try {
      const storedRead = JSON.parse(localStorage.getItem("smart_read_article_ids") || "[]");
      if (!storedRead.includes(id)) {
        storedRead.push(id);
        localStorage.setItem("smart_read_article_ids", JSON.stringify(storedRead));
      }
    } catch {}

    globalUnreadIds = globalUnreadIds.filter((item) => item !== id);
    notifyListeners();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notifications_updated"));
    }
  };

  const markAllAsRead = () => {
    try {
      const allIds = globalArticles.map((a) => a._id);
      localStorage.setItem("smart_read_article_ids", JSON.stringify(allIds));
    } catch {}

    globalUnreadIds = [];
    notifyListeners();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notifications_updated"));
    }
  };

  return {
    articles: state.articles,
    unreadCount: state.unreadIds.length,
    unreadIds: state.unreadIds,
    markAsRead,
    markAllAsRead,
    isLoading,
  };
};
