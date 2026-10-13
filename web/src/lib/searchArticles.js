import { connectDB } from "./db.js";
import Article from "../models/Article.js";
import { API_BASE } from "./api.js";

function escapeRegex(text) {
  return typeof text === "string" ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : "";
}

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

/**
 * Searches articles dynamically with dual-strategy:
 * 1. Tries Express backend API
 * 2. Seamlessly falls back to direct MongoDB connection if backend is offline or starting
 */
export async function searchArticles({
  q = "",
  type = "all",
  category = "",
  province = "",
  status = "Published",
  sort = "latest",
  page = 1,
  limit = 30,
} = {}) {
  const searchQuery = String(q || "").trim();

  // Try API first if available
  try {
    const urlParams = new URLSearchParams();
    if (searchQuery) urlParams.set("q", searchQuery);
    if (type && type !== "all") urlParams.set("type", type);
    if (category) urlParams.set("category", category);
    if (province) urlParams.set("province", province);
    if (status) urlParams.set("status", status);
    if (sort) urlParams.set("sort", sort);
    if (page) urlParams.set("page", String(page));
    if (limit) urlParams.set("limit", String(limit));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE}/api/articles?${urlParams.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        // Also fetch total counts for tabs if not provided
        const allArticles = data.articles.map(normalizeDoc);
        const newsCount = allArticles.filter((a) => !a.isVideo).length;
        const videoCount = allArticles.filter((a) => a.isVideo).length;

        return {
          success: true,
          articles: allArticles,
          total: data.total || allArticles.length,
          page: data.page || page,
          totalPages: data.totalPages || Math.ceil((data.total || allArticles.length) / limit) || 1,
          counts: {
            all: data.total || allArticles.length,
            news: newsCount,
            videos: videoCount,
          },
        };
      }
    }
  } catch (apiErr) {
    // Backend offline or slow, proceed to direct MongoDB fallback
  }

  // Fallback directly to MongoDB
  try {
    await connectDB();

    const andConditions = [];
    if (status) {
      andConditions.push({ status });
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
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 30));
    const skip = (p - 1) * l;

    const [rawArticles, total] = await Promise.all([
      Article.find(finalFilter).sort(sortOption).skip(skip).limit(l).lean(),
      Article.countDocuments(finalFilter),
    ]);

    const articles = rawArticles.map(normalizeDoc);

    // Get separate tab counts
    const baseConditionsWithoutType = andConditions.filter((c) => {
      if (c.$or) {
        const hasVideoKey = c.$or.some((item) => "videoId" in item);
        if (hasVideoKey && (cleanType === "video" || cleanType === "videos" || cleanType === "news" || cleanType === "articles")) {
          return false;
        }
      }
      return true;
    });

    const baseFilter = baseConditionsWithoutType.length > 1
      ? { $and: baseConditionsWithoutType }
      : baseConditionsWithoutType.length === 1
      ? baseConditionsWithoutType[0]
      : {};

    const [allCount, videoCount] = await Promise.all([
      Article.countDocuments(baseFilter),
      Article.countDocuments({
        $and: [
          baseFilter,
          {
            $or: [
              { videoId: { $exists: true, $ne: "" } },
              { category: "भिडियो ग्यालरी" },
            ],
          },
        ],
      }),
    ]);

    const newsCount = Math.max(0, allCount - videoCount);

    return {
      success: true,
      articles,
      total,
      page: p,
      totalPages: Math.ceil(total / l) || 1,
      counts: {
        all: allCount,
        news: newsCount,
        videos: videoCount,
      },
    };
  } catch (dbErr) {
    console.error("Direct MongoDB search error:", dbErr.message);
    return {
      success: false,
      articles: [],
      total: 0,
      page: 1,
      totalPages: 1,
      counts: { all: 0, news: 0, videos: 0 },
      error: dbErr.message,
    };
  }
}

function normalizeDoc(doc) {
  const isVideo = Boolean(
    (doc.videoId && String(doc.videoId).trim() !== "") ||
    doc.category === "भिडियो ग्यालरी"
  );

  return {
    _id: String(doc._id || ""),
    title: doc.title || "",
    summary: doc.summary || "",
    content: doc.content || "",
    category: doc.category || "समाचार",
    province: doc.province || "",
    imageUrl: doc.imageUrl || "",
    videoId: doc.videoId ? String(doc.videoId).trim() : "",
    author: doc.author || "स्मार्ट सञ्चार संवाददाता",
    views: typeof doc.views === "number" ? doc.views : 0,
    status: doc.status || "Published",
    isFeatured: Boolean(doc.isFeatured),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
    isVideo,
  };
}
