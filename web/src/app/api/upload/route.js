import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "zvslkhdj",
  api_key: process.env.CLOUDINARY_API_KEY || "995259544325756",
  api_secret: process.env.CLOUDINARY_API_SECRET || "pP6JXyTkMKt8mLVcdOLSvVg7Q2g",
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image file provided for upload" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "smartsanchar_news",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    console.log(`[CLOUDINARY UPLOAD SUCCESS] URL: ${uploadResult.secure_url}`);

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("[CLOUDINARY UPLOAD ERROR]", error);
    return NextResponse.json(
      { success: false, message: `Cloudinary upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}
