import express from "express";
import Article from "../models/Article.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

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

// GET all published articles with optional category/province filter (Public)
router.get("/", async (req, res) => {
  try {
    const { category, province, status, isFeatured, videoId, limit } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (category) {
      const cleanCategory = String(category).trim();
      if (
        cleanCategory === "खेलकुद" ||
        cleanCategory.toLowerCase() === "khelkud" ||
        cleanCategory.toLowerCase() === "sports"
      ) {
        filter.category = { $in: ["खेलकुद", "khelkud", "Sports", "sports"] };
      } else {
        filter.category = cleanCategory;
      }
    }

    if (province) {
      const cleanProvince = escapeRegex(String(province).replace(/\s*प्रदेश\s*$/, "").trim());
      filter.province = { $regex: new RegExp(`^${cleanProvince}(\\s*प्रदेश)?$`, "i") };
    }

    if (videoId) filter.videoId = String(videoId).trim();
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    let query = Article.find(filter).sort({ createdAt: -1 });
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        query = query.limit(Math.min(parsedLimit, 300));
      }
    }

    const articles = await query.lean();
    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single article by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create article (Admin Only)
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
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update article (Admin Only)
router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const cleanData = sanitizeArticlePayload(req.body);
    const article = await Article.findByIdAndUpdate(req.params.id, cleanData, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE article (Admin Only)
router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.json({ success: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
