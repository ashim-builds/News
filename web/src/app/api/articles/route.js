import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";

// GET /api/articles - Fetch dynamic articles list from MongoDB
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const province = searchParams.get("province");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");

    const query = {};

    if (category && category !== "all" && category !== "overview") {
      query.category = new RegExp(category, "i");
    }

    if (province) {
      query.province = new RegExp(province, "i");
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { summary: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
      ];
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("[GET ARTICLES ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create a new article in MongoDB
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, category, province, summary, content, imageUrl, videoId, author, status, isFeatured } = body;

    if (!title || !category) {
      return NextResponse.json(
        { success: false, message: "Title and Category are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newArticle = await Article.create({
      title,
      category,
      province: province || "",
      summary: summary || "",
      content: content || "",
      imageUrl: imageUrl || "",
      videoId: videoId || "",
      author: author || "स्मार्ट सञ्चार संवाददाता",
      status: status || "Published",
      isFeatured: !!isFeatured,
      views: 0,
    });

    console.log(`[ARTICLE CREATED IN MONGODB] ID: ${newArticle._id} | Title: ${newArticle.title}`);

    return NextResponse.json(
      { success: true, message: "Article uploaded successfully to MongoDB", article: newArticle },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE ARTICLE ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create article" },
      { status: 500 }
    );
  }
}
