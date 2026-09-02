import express from "express";
import Article from "../models/Article.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all published articles with optional category/province filter (Public)
router.get("/", async (req, res) => {
  try {
    const { category, province, status, isFeatured, videoId, limit } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (province) {
      const cleanProvince = province.replace(/\s*प्रदेश\s*$/, "").trim();
      filter.province = { $regex: new RegExp(`^${cleanProvince}(\\s*प्रदेश)?$`, "i") };
    }

    if (videoId) filter.videoId = videoId;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    let query = Article.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit));

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
    const article = await Article.create(req.body);
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update article (Admin Only)
router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
