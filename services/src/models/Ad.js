import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      enum: ["header", "sidebar", "content"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Disabled"],
      default: "Active",
    },
    clicks: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ad || mongoose.model("Ad", adSchema);
