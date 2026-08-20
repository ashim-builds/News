import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Support incrementing clicks/impressions or updating details
    if (body.action === "click") {
      const updatedAd = await Ad.findByIdAndUpdate(
        id,
        { $inc: { clicks: 1 } },
        { returnDocument: "after" }
      );
      return NextResponse.json({ success: true, ad: updatedAd });
    }

    if (body.action === "impression") {
      const updatedAd = await Ad.findByIdAndUpdate(
        id,
        { $inc: { impressions: 1 } },
        { returnDocument: "after" }
      );
      return NextResponse.json({ success: true, ad: updatedAd });
    }

    const updatedAd = await Ad.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });

    if (!updatedAd) {
      return NextResponse.json(
        { success: false, message: "Ad not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ad: updatedAd,
      message: "Ad updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/ads/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update ad" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await Ad.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Ad not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/ads/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete ad" },
      { status: 500 }
    );
  }
}
