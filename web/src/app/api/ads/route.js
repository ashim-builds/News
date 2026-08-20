import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const status = searchParams.get("status");

    const query = {};
    if (position) query.position = position;
    if (status) query.status = status;

    const ads = await Ad.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, ads });
  } catch (error) {
    console.error("GET /api/ads error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch ads" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, imageUrl, linkUrl, position, status } = body;

    if (!title || !imageUrl || !position) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const newAd = await Ad.create({
      title,
      imageUrl,
      linkUrl: linkUrl || "",
      position,
      status: status || "Active",
    });

    return NextResponse.json(
      { success: true, ad: newAd, message: "Ad created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/ads error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create ad" },
      { status: 500 }
    );
  }
}
