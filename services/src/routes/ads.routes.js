import express from "express";
import Ad from "../models/Ad.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";
import { routeCache, cacheMiddleware } from "../utils/cache.js";

const router = express.Router();

// GET ads by position/status (Public - 60s Cache)
router.get("/", cacheMiddleware(60, "ads"), async (req, res) => {
  try {
    const { position, status } = req.query;
    const filter = {};
    if (position) filter.position = position;
    if (status) filter.status = status;

    const ads = await Ad.find(filter).sort({ createdAt: -1 }).lean();

    // Track impression counts asynchronously in the background
    if (ads.length > 0) {
      Ad.updateMany(
        { _id: { $in: ads.map((a) => a._id) } },
        { $inc: { impressions: 1 } }
      ).catch(() => {});
    }

    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create Ad (Admin Only) - Automatically invalidates cache
router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    routeCache.invalidatePrefix("ads");
    res.status(201).json({ success: true, ad });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update ad or track click
router.put("/:id", (req, res, next) => {
  if (req.body && req.body.action === "click") {
    return next();
  }
  return requireAdminAuth(req, res, next);
}, async (req, res) => {
  try {
    const { action } = req.body;
    if (action === "click") {
      const ad = await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } }, { new: true });
      return res.json({ success: true, ad });
    }

    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ success: false, error: "Ad not found" });

    routeCache.invalidatePrefix("ads");
    res.json({ success: true, ad });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE ad (Admin Only) - Automatically invalidates cache
router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ success: false, error: "Ad not found" });

    routeCache.invalidatePrefix("ads");
    res.json({ success: true, message: "Ad deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
