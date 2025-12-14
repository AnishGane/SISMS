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

export const toggleStatus = async (req: AuthRequest, res: Response) => {
  try {
    const staffId = req.params.id;

    const staff = await StaffModel.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.isActive = !staff.isActive;
    await staff.save();

    const sanitizedStaff = staff.toObject();
    delete sanitizedStaff.password;

    res.json({
      message: staff.isActive
        ? "Staff account activated"
        : "Staff account deactivated",
      staff: sanitizedStaff,
    });
  } catch (error: any) {
    console.error("Error toggling staff status:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staffId = req.params.id;
    const { name, email, password, phone, avatar, isActive } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized (missing user)" });
    }

    // Check if staff exists and belongs to admin's store
    const existingStaff = await StaffModel.findById(staffId);
    if (!existingStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (existingStaff.store.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own staff" });
    }

    // Prepare update object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) {
      if (phone && !validator.isMobilePhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
      updateData.phone = phone;
    }
    if (avatar !== undefined) {
      if (avatar && !validator.isURL(avatar)) {
        return res.status(400).json({ message: "Invalid avatar URL" });
      }
      updateData.avatar = avatar;
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle email update
    if (email !== undefined && email !== existingStaff.email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if email already exists (excluding current staff)
      const emailExists = await StaffModel.findOne({
        email,
        _id: { $ne: staffId },
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }

    // Handle password update
    if (password !== undefined) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update staff
    const updated = await StaffModel.findByIdAndUpdate(staffId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      message: "Staff updated successfully",
      staff: updated,
    });
  } catch (error: any) {
    console.error("Error updating staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staffId = req.params.id;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized (missing user)" });
    }

    // Check if staff exists and belongs to admin's store
    const staff = await StaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staff.store.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own staff" });
    }

    // Delete staff
    await StaffModel.findByIdAndDelete(staffId);

    res.json({
      message: "Staff deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
