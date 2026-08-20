import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin || !admin.otp) {
      return NextResponse.json(
        { success: false, message: "OTP not found. Please request a new OTP code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(admin.otpExpires)) {
      admin.otp = null;
      admin.otpExpires = null;
      await admin.save();
      return NextResponse.json(
        { success: false, message: "OTP code has expired. Please request a new OTP code." },
        { status: 400 }
      );
    }

    if (admin.otp !== otp.trim()) {
      return NextResponse.json(
        { success: false, message: "Incorrect OTP code. Please check your email and try again." },
        { status: 400 }
      );
    }

    // OTP verified successfully - clear OTP from MongoDB
    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Admin authentication verified successfully!",
    });
  } catch (error) {
    console.error("[VERIFY OTP ERROR]", error);
    return NextResponse.json(
      { success: false, message: `OTP verification error: ${error.message}` },
      { status: 500 }
    );
  }
}
