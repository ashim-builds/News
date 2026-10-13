/**
 * Lightweight Zero-Dependency In-Memory LRU Cache with TTL
 * Designed specifically for low-RAM CloudLinux LVE environments.
 */
class MemoryCache {
  constructor(maxEntries = 180) {
    this.maxEntries = maxEntries;
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh LRU order (delete & re-insert)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key, value, ttlSeconds = 60) {
    // Evict oldest entry if at capacity (LRU)
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix (e.g., 'articles:', 'ads:')
   */
  invalidatePrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const routeCache = new MemoryCache(200);

/**
 * Express middleware to cache GET route responses
 * @param {number} ttlSeconds - Time-to-live in seconds
 * @param {string} prefix - Key prefix for easy invalidation (e.g., 'articles')
 */
export const cacheMiddleware = (ttlSeconds = 60, prefix = "route") => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `${prefix}:${req.originalUrl || req.url}`;
    const cachedData = routeCache.get(cacheKey);

    if (cachedData) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cachedData);
    }

    // Intercept res.json to store response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        routeCache.set(cacheKey, body, ttlSeconds);
      }
      res.setHeader("X-Cache", "MISS");
      return originalJson(body);
    };

    next();
  };
};

export default routeCache;
