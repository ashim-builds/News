import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    
    // Strict DB Query - No hardcoded fallback strings in code
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Secure bcrypt password verification against MongoDB
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Generate 6-digit OTP and save directly to MongoDB document
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = generatedOtp;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    // Configure Nodemailer transporter from environment variables
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/"/g, "").trim() : "";

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: user,
        pass: pass,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #dc2626;">
          <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 0;">Smart Sanchar</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Administrator Authentication Portal</p>
        </div>
        
        <div style="padding: 24px 0;">
          <h3 style="color: #0f172a; font-size: 18px; margin-top: 0;">Verification Code</h3>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            Your official OTP security code for Admin Login access is below. Please enter this code on the verification page:
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #dc2626; font-family: monospace;">
              ${generatedOtp}
            </span>
          </div>

          <p style="color: #64748b; font-size: 12px; margin: 0;">
            ⏳ This code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.
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
      subject: `🔐 Smart Sanchar Admin Verification Code: ${generatedOtp}`,
      html: htmlContent,
    });

    console.log(`[DB VERIFIED OTP SENT] Email: ${admin.email}`);

    return NextResponse.json({
      success: true,
      message: `OTP verification code successfully sent to ${admin.email}`,
    });
  } catch (error) {
    console.error("[SEND OTP ERROR]", error);
    return NextResponse.json(
      { success: false, message: `Failed to send OTP email: ${error.message}` },
      { status: 500 }
    );
  }
}
