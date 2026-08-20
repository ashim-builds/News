import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    // Strict DB Query - Fetch admin user from MongoDB
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "No admin account found with that email address." },
        { status: 404 }
      );
    }

    // Generate 6-digit Reset OTP and save directly to MongoDB document
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOtp = resetOtp;
    admin.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await admin.save();

    // Configure Nodemailer transporter from environment
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/"/g, "").trim() : "";

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    const resetLink = `http://localhost:3000/admin/login?mode=reset&email=${encodeURIComponent(admin.email)}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #dc2626;">
          <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 0;">Smart Sanchar</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Admin Password Reset Service</p>
        </div>
        
        <div style="padding: 24px 0;">
          <h3 style="color: #0f172a; font-size: 18px; margin-top: 0;">Password Reset Request</h3>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            We received a request to reset your Smart Sanchar Admin password. Use the 6-digit verification code below to set a new password:
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #dc2626; font-family: monospace;">
              ${resetOtp}
            </span>
          </div>

          <p style="color: #475569; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
            Alternatively, click the link below to open the reset page directly:
          </p>
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
              Reset Admin Password
            </a>
          </div>

          <p style="color: #64748b; font-size: 12px; margin: 0;">
            ⏳ This reset code is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.
          </p>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
          © २०८३ Smart Sanchar. All rights reserved.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Smart Sanchar'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@smartsanchar.com'}>`,
      to: admin.email,
      subject: `🔑 Smart Sanchar Admin Password Reset Code: ${resetOtp}`,
      html: htmlContent,
    });

    console.log(`[DB FORGOT PASSWORD OTP SENT] Email: ${admin.email}`);

    return NextResponse.json({
      success: true,
      message: `Password reset OTP successfully sent to ${admin.email}`,
    });
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
    return NextResponse.json(
      { success: false, message: `Failed to send reset email: ${error.message}` },
      { status: 500 }
    );
  }
}
