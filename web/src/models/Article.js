import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "समाचार",
    },
    province: {
      type: String,
      default: "",
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoId: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "स्मार्ट सञ्चार संवाददाता",
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);
