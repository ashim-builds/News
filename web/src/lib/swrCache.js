"use client";

import { useState, useEffect, useRef } from "react";

const memoryStore = new Map();

/**
 * Storage accessor with fallback to in-memory Map
 */
const storage = {
  get: (key) => {
    try {
      if (typeof window === "undefined") return null;
      const raw = sessionStorage.getItem(`swr:${key}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem(`swr:${key}`);
        return null;
      }
      return parsed.data;
    } catch {
      return memoryStore.get(key) || null;
    }
  },

  set: (key, data, ttlSeconds = 60) => {
    try {
      const payload = {
        data,
        expiresAt: Date.now() + ttlSeconds * 1000,
      };
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`swr:${key}`, JSON.stringify(payload));
      }
      memoryStore.set(key, data);
    } catch {
      memoryStore.set(key, data);
    }
  },

  remove: (key) => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`swr:${key}`);
      }
      memoryStore.delete(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};

/**
 * React Hook for Instant (0ms) Data Hydration via Stale-While-Revalidate
 * @param {string} cacheKey - Unique key for the query
 * @param {Function} fetcher - Async fetcher function returning data
 * @param {Object} options - { ttl: 60, enabled: true }
 */
export function useSWRData(cacheKey, fetcher, options = {}) {
  const { ttl = 60, enabled = true } = options;

  // Initialize immediately from cache for 0ms render
  const initialCache = enabled && cacheKey ? storage.get(cacheKey) : null;
  const [data, setData] = useState(initialCache);
  const [isLoading, setIsLoading] = useState(!initialCache && enabled);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!enabled || !cacheKey) return;

    let isMounted = true;

    // Check storage synchronously
    const cached = storage.get(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
    }

    // Silently revalidate in background
    fetcherRef
      .current()
      .then((freshData) => {
        if (!isMounted) return;
        storage.set(cacheKey, freshData, ttl);
        setData(freshData);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn(`[SWR] Background revalidation failed for ${cacheKey}:`, err);
        // Only set error if we don't have stale cached data to show
        if (!cached) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cacheKey, enabled, ttl]);

  return { data, isLoading, error, mutate: (newData) => {
    storage.set(cacheKey, newData, ttl);
    setData(newData);
  }};
}

export default storage;
