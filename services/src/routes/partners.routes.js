import express from "express";
import Partner from "../models/Partner.js";
import { requireAdminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all partners (Public)
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: partners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create partner (Admin Only)
router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const partner = await Partner.create(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update partner (Admin Only)
router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!partner) return res.status(404).json({ success: false, error: "Partner not found" });
    res.json({ success: true, data: partner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE partner (Admin Only)
router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ success: false, error: "Partner not found" });
    res.json({ success: true, message: "Partner deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
