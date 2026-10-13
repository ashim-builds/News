import express from "express";
import Article from "../models/Article.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";
import { routeCache, cacheMiddleware } from "../utils/cache.js";

const router = express.Router();

// Helper to escape regex special characters
function escapeRegex(text) {
  return typeof text === "string" ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : "";
}

// Helper to sanitize article payload and prevent field injection
function sanitizeArticlePayload(body) {
  const sanitized = {};

  if (body.title !== undefined) {
    sanitized.title = String(body.title).trim();
  }
  if (body.slug !== undefined) {
    sanitized.slug = String(body.slug).trim();
  }
  if (body.category !== undefined) {
    sanitized.category = String(body.category).trim();
  }
  if (body.province !== undefined) {
    sanitized.province = String(body.province).trim();
  }
  if (body.summary !== undefined) {
    sanitized.summary = String(body.summary).trim();
  }
  if (body.content !== undefined) {
    sanitized.content = String(body.content);
  }
  if (body.imageUrl !== undefined) {
    sanitized.imageUrl = String(body.imageUrl).trim();
  }
  if (body.videoId !== undefined) {
    sanitized.videoId = String(body.videoId).trim();
  }
  if (body.author !== undefined) {
    sanitized.author = String(body.author).trim() || "स्मार्ट सञ्चार संवाददाता";
  }
  if (body.status !== undefined) {
    const validStatuses = ["Published", "Draft"];
    sanitized.status = validStatuses.includes(body.status) ? body.status : "Published";
  }
  if (body.isFeatured !== undefined) {
    sanitized.isFeatured = Boolean(body.isFeatured);
  }

  return sanitized;
}

// Helper to build search criteria across title, summary, content, category, author, province, videoId
function buildSearchFilter(queryText) {
  if (!queryText || typeof queryText !== "string") return null;
  const clean = queryText.trim();
  if (!clean) return null;

  const escaped = escapeRegex(clean);
  const regex = new RegExp(escaped, "i");
  const words = clean.split(/\s+/).filter((w) => w.length > 1);

  const searchConditions = [
    { title: regex },
    { summary: regex },
    { content: regex },
    { category: regex },
    { province: regex },
    { author: regex },
    { videoId: regex },
  ];

  if (words.length > 1) {
    words.forEach((w) => {
      const wRegex = new RegExp(escapeRegex(w), "i");
      searchConditions.push(
        { title: wRegex },
        { summary: wRegex },
        { category: wRegex }
      );
    });
  }

  return { $or: searchConditions };
}

// GET search endpoint for quick autocomplete & rich search (Public - 30s Cache)
router.get("/search", cacheMiddleware(30, "articles_search"), async (req, res) => {
  try {
    const { q, search, type, category, province, status, sort, page, limit } = req.query;
    const searchQuery = String(q || search || "").trim();

    const andConditions = [];
    if (status) {
      andConditions.push({ status: String(status).trim() });
    } else {
      andConditions.push({ status: "Published" });
    }

    if (category) {
      const cleanCategory = String(category).trim();
      if (
        cleanCategory === "खेलकुद" ||
        cleanCategory.toLowerCase() === "khelkud" ||
        cleanCategory.toLowerCase() === "sports"
      ) {
        andConditions.push({ category: { $in: ["खेलकुद", "khelkud", "Sports", "sports"] } });
      } else {
        andConditions.push({ category: cleanCategory });
      }
    }

    if (province) {
      const cleanProvince = escapeRegex(String(province).replace(/\s*प्रदेश\s*$/, "").trim());
      andConditions.push({ province: { $regex: new RegExp(`^${cleanProvince}(\\s*प्रदेश)?$`, "i") } });
    }

    if (searchQuery) {
      const searchCond = buildSearchFilter(searchQuery);
      if (searchCond) andConditions.push(searchCond);
    }

    const cleanType = String(type || "all").toLowerCase().trim();
    if (cleanType === "video" || cleanType === "videos") {
      andConditions.push({
        $or: [
          { videoId: { $exists: true, $ne: "" } },
          { category: "भिडियो ग्यालरी" },
        ],
      });
    } else if (cleanType === "news" || cleanType === "articles" || cleanType === "article") {
      andConditions.push({
        $or: [
          { videoId: { $in: ["", null] } },
          { category: { $ne: "भिडियो ग्यालरी" } },
        ],
      });
    }

    const finalFilter = andConditions.length > 1
      ? { $and: andConditions }
      : andConditions.length === 1
      ? andConditions[0]
      : {};

    let sortOption = { createdAt: -1 };
    if (sort === "views" || sort === "popular") {
      sortOption = { views: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || (searchQuery ? 30 : 20)));
    const skip = (p - 1) * l;

    const [articles, total] = await Promise.all([
      Article.find(finalFilter).sort(sortOption).skip(skip).limit(l).lean(),
      Article.countDocuments(finalFilter),
    ]);

    res.json({
      success: true,
      articles,
      total,
      page: p,
      totalPages: Math.ceil(total / l) || 1,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all published articles with optional category/province/search filter (Public - 60s Cache)
router.get("/", cacheMiddleware(60, "articles"), async (req, res) => {
  try {
    const { category, province, status, isFeatured, videoId, limit, q, search, type, sort, page } = req.query;
    const searchQuery = String(q || search || "").trim();
    const andConditions = [];

    if (status) andConditions.push({ status });

    if (category) {
      const cleanCategory = String(category).trim();
      if (
        cleanCategory === "खेलकुद" ||
        cleanCategory.toLowerCase() === "khelkud" ||
        cleanCategory.toLowerCase() === "sports"
      ) {
        andConditions.push({ category: { $in: ["खेलकुद", "khelkud", "Sports", "sports"] } });
      } else {
        andConditions.push({ category: cleanCategory });
      }
    }

    if (province) {
      const cleanProvince = escapeRegex(String(province).replace(/\s*प्रदेश\s*$/, "").trim());
      andConditions.push({ province: { $regex: new RegExp(`^${cleanProvince}(\\s*प्रदेश)?$`, "i") } });
    }

    if (videoId) andConditions.push({ videoId: String(videoId).trim() });
    if (isFeatured !== undefined) andConditions.push({ isFeatured: isFeatured === "true" });

    if (searchQuery) {
      const searchCond = buildSearchFilter(searchQuery);
      if (searchCond) andConditions.push(searchCond);
    }

    if (type) {
      const cleanType = String(type).toLowerCase().trim();
      if (cleanType === "video" || cleanType === "videos") {
        andConditions.push({
          $or: [
            { videoId: { $exists: true, $ne: "" } },
            { category: "भिडियो ग्यालरी" },
          ],
        });
      } else if (cleanType === "news" || cleanType === "articles" || cleanType === "article") {
        andConditions.push({
          $or: [
            { videoId: { $in: ["", null] } },
            { category: { $ne: "भिडियो ग्यालरी" } },
          ],
        });
      }
    }

    const finalFilter = andConditions.length > 1
      ? { $and: andConditions }
      : andConditions.length === 1
      ? andConditions[0]
      : {};

    let sortOption = { createdAt: -1 };
    if (sort === "views" || sort === "popular") {
      sortOption = { views: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    let query = Article.find(finalFilter).sort(sortOption);

    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    if (!isNaN(parsedPage) && parsedPage > 0) {
      const pageSize = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 20;
      const skip = (parsedPage - 1) * pageSize;
      const total = await Article.countDocuments(finalFilter);
      query = query.skip(skip).limit(pageSize);
      const articles = await query.lean();

      return res.json({
        success: true,
        articles,
        total,
        page: parsedPage,
        totalPages: Math.ceil(total / pageSize) || 1,
      });
    }

    if (parsedLimit && !isNaN(parsedLimit) && parsedLimit > 0) {
      query = query.limit(Math.min(parsedLimit, 300));
    }

    const articles = await query.lean();
    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single article by ID (Public - Cached with background view increment)
router.get("/:id", async (req, res) => {
  try {
    const cacheKey = `article_detail:${req.params.id}`;
    const cachedArticle = routeCache.get(cacheKey);

    // Asynchronously record views without blocking response or locking DB connection
    Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).catch(() => {});

    if (cachedArticle) {
      res.setHeader("X-Cache", "HIT");
      return res.json({ success: true, article: cachedArticle });
    }

    const article = await Article.findById(req.params.id).lean();
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });

    routeCache.set(cacheKey, article, 60);
    res.setHeader("X-Cache", "MISS");
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create article (Admin Only) - Automatically invalidates cache
router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const cleanData = sanitizeArticlePayload(req.body);
    if (!cleanData.title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }
    if (!cleanData.category) {
      cleanData.category = "समाचार";
    }

    const article = await Article.create(cleanData);
    routeCache.invalidatePrefix("article"); // Invalidate articles list & detail caches
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update article (Admin Only) - Automatically invalidates cache
router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const cleanData = sanitizeArticlePayload(req.body);
    const article = await Article.findByIdAndUpdate(req.params.id, cleanData, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });

    routeCache.invalidatePrefix("article"); // Invalidate articles list & detail caches
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE article (Admin Only) - Automatically invalidates cache
router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });

    routeCache.invalidatePrefix("article"); // Invalidate articles list & detail caches
    res.json({ success: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
