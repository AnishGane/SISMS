import { Request, Response } from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import StaffModel from "../../models/staff.model.js";

// Extend Request type to include user injected by auth middleware
interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
    email: string;
  };
}

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, phone, avatar } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email & password are required" });
    }

    if (avatar && !validator.isURL(avatar)) {
      return res.status(400).json({ message: "Invalid avatar URL" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (phone && !validator.isMobilePhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Check if staff email already exists
    const exists = await StaffModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized (missing user)" });
    }

    // Create staff linked to admin's store (admin id)
    const staff = await StaffModel.create({
      name,
      email,
      password: hashed,
      phone,
      avatar,
      store: req.user._id,
    });

    // Remove password before sending response
    const staffObj = staff.toObject();
    delete staffObj.password;

    res.status(201).json({
      message: "Staff created successfully",
      staff: staffObj,
    });
  } catch (error: any) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllStaff = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized (missing user)" });
    }

    const staff = await StaffModel.find({ store: req.user._id }).select(
      "-password"
    );

    res.json({
      message: "Staff fetched successfully",
      staff,
    });
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deactivateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staffId = req.params.id;

    const updated = await StaffModel.findByIdAndUpdate(
      staffId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      message: "Staff account deactivated",
      staff: updated,
    });
  } catch (error: any) {
    console.error("Error deactivating staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
