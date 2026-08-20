import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";

// PUT /api/articles/[id] - Update an existing article in MongoDB
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const updatedArticle = await Article.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    console.log(`[ARTICLE UPDATED IN MONGODB] ID: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("[UPDATE ARTICLE ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete an article from MongoDB
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    console.log(`[ARTICLE DELETED FROM MONGODB] ID: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE ARTICLE ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}
