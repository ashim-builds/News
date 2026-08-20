import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, OTP code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin || !admin.resetOtp) {
      return NextResponse.json(
        { success: false, message: "Reset OTP not found or expired. Please request a new password reset." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(admin.resetOtpExpires)) {
      admin.resetOtp = null;
      admin.resetOtpExpires = null;
      await admin.save();
      return NextResponse.json(
        { success: false, message: "Reset OTP has expired. Please request a new password reset." },
        { status: 400 }
      );
    }

    if (admin.resetOtp !== otp.trim()) {
      return NextResponse.json(
        { success: false, message: "Incorrect OTP code. Please check your email." },
        { status: 400 }
      );
    }

    // Hash new password and save in MongoDB database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetOtp = null;
    admin.resetOtpExpires = null;
    await admin.save();

    console.log(`[MONGODB PASSWORD RESET SUCCESS] Admin password for ${normalizedEmail} updated in MongoDB database!`);

    return NextResponse.json({
      success: true,
      message: "Password reset successful! Your new password has been saved to the database.",
    });
  } catch (error) {
    console.error("[RESET PASSWORD ERROR]", error);
    return NextResponse.json(
      { success: false, message: `Password reset error: ${error.message}` },
      { status: 500 }
    );
  }
}
