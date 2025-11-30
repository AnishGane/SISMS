import StaffModel from "../../models/staff.model.js";
import bcrypt from "bcrypt";
import validator from "validator";

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, avatar } = req.body;

    // Validate fields
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create staff and assign them to admin’s store
    const staff = await StaffModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      store: req.user._id, // admin's ID = store ID
    });

    // Remove password before sending response
    const staffObj = staff.toObject();
    delete staffObj.password;

    res.status(201).json({
      message: "Staff created successfully",
      staff: staffObj,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    // Find staff linked to the admin’s store
    const staff = await StaffModel.find({ store: req.user._id }).select(
      "-password"
    );

    res.json({
      message: "Staff fetched successfully",
      staff,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deactivateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;

    // Deactivate staff
    const updatedStaff = await StaffModel.findByIdAndUpdate(
      staffId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      message: "Staff account deactivated",
      staff: updatedStaff,
    });
  } catch (error) {
    console.error("Error deactivating staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
