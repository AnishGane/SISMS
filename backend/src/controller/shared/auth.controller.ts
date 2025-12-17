import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

import AdminModel from "../../models/admin.model.js";
import StaffModel from "../../models/staff.model.js";
import OTPModel from "../../models/otp.model.js";

import { generateOTP } from "../../utils/generateOTP.js";
import { sendOtpEmail } from "../../utils/emailSender.js";
import { getUserModelByRole, isValidRole, uploadToCloudinary } from "../../utils/helper.js";

const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN) || 15;
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const BCRYPT_SALT_ROUNDS = 10;

interface ResetTokenPayload extends jwt.JwtPayload {
  purpose: string;
  email: string;
  role: string;
}

// ADMIN LOGIN
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email) || !password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in .env");
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const adminObj = admin.toObject();
    delete adminObj.password;

    res.json({
      message: "Admin login successful",
      token,
      role: "admin",
      admin: adminObj,
    });
  } catch (error: any) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: error.message });
  }
};

// STAFF LOGIN
export const loginStaff = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email) || !password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const staff = await StaffModel.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: "Staff account not found" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in .env");
    }

    const token = jwt.sign(
      { id: staff._id, role: "staff", store: staff.store },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const staffObj = staff.toObject();
    delete staffObj.password;

    res.json({
      message: "Staff login successful",
      token,
      role: "staff",
      staff: staffObj,
    });
  } catch (error: any) {
    console.error("Error logging in staff:", error);
    res.status(500).json({ message: error.message });
  }
};

// REGISTER ADMIN
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, storeName, storeAddress, phone } = req.body;
    const file = req.file;

    if (!name || !email || !password || !storeName || !storeAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    let avatarUrl: string | undefined;

    if (file) {
      avatarUrl = await uploadToCloudinary(file);
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      name,
      email,
      password: hashed,
      storeName,
      storeAddress,
      phone,
      avatar: avatarUrl,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const role = req.params.role;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const User = getUserModelByRole(role);
    if (!User) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findOne({ email });

    // Security: do not leak existence
    if (!user) {
      return res
        .status(200)
        .json({ message: "An OTP has been sent to your email." });
    }

    const otpPlain = generateOTP(4);
    const otpHash = await bcrypt.hash(otpPlain, BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000);

    await OTPModel.updateMany(
      { email, role, used: false },
      { used: true }
    );

    await OTPModel.create({
      email,
      role,
      otpHash,
      expiresAt,
    });

    await sendOtpEmail({
      to: email,
      otp: otpPlain,
      role,
      expiryMinutes: OTP_EXPIRES_MIN,
    });

    return res.status(200).json({ message: "OTP has been sent to your email" });
  } catch (err) {
    console.error("forgotPassword err:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const role = req.params.role;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const otpDoc = await OTPModel.findOne({ email, role, used: false }).sort({
      createdAt: -1,
    });
    if (!otpDoc)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (otpDoc.expiresAt < new Date()) {
      otpDoc.used = true;
      await otpDoc.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    const match = await bcrypt.compare(String(otp), otpDoc.otpHash);
    if (!match) return res.status(400).json({ message: "Invalid OTP" });

    // mark used
    otpDoc.used = true;
    await otpDoc.save();

    // create one-time JWT for password reset (short expiry)
    const token = jwt.sign(
      { email, role, purpose: "password-reset" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ message: "OTP verified", token });
  } catch (err) {
    console.error("verifyOTP err:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Valid token and strong password required" });
    }

    let payload: ResetTokenPayload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (payload.purpose !== "password-reset") {
      return res.status(400).json({ message: "Invalid token purpose" });
    }

    const { email, role } = payload;

    if (!isValidRole(role)) {
      return res.status(400).json({ message: "Invalid role in token" });
    }

    const User = getUserModelByRole(role);
    if (!User) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword err:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

