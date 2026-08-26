import "../config/env.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

async function seedAdmin() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartsanchar";
    console.log("Connecting to MongoDB:", uri);
    await mongoose.connect(uri);

    const email = "admin@smartsanchar.com";
    const rawPassword = "Smartsanchar@001!";

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    let admin = await Admin.findOne({ email });
    if (admin) {
      admin.password = hashedPassword;
      admin.otp = null;
      admin.otpExpires = null;
      await admin.save();
      console.log(`✅ Admin password reset successfully!`);
    } else {
      admin = await Admin.create({
        email,
        password: hashedPassword,
      });
      console.log(`✅ New Admin created successfully!`);
    }

    console.log(`-----------------------------------`);
    console.log(`Admin Credentials:`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${rawPassword}`);
    console.log(`-----------------------------------`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed Admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
