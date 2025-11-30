import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../../models/admin.model.js";
import StaffModel from "../../models/staff.model.js";
import validator from "validator";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check admin exists
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // JWT Token
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
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
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: error.message });
  }
};

export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check staff exists
    const staff = await StaffModel.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: "Staff account not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (!staff.store) {
      return res
        .status(500)
        .json({ message: "Staff is not assigned to any store" });
    }

    // 💡 IMPORTANT:
    // Staff belongs to a store, so include store ID inside token

    const token = jwt.sign(
      {
        id: staff._id,
        role: "staff",
        store: staff.store, // each staff belongs to admin/store
      },
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
  } catch (error) {
    console.error("Error logging in staff:", error);
    res.status(500).json({ message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, storeName, storeAddress, avatar, phone } =
      req.body;

    if (!name || !email || !password || !storeName || !storeAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (phone && !validator.isMobilePhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    if (avatar && !validator.isURL(avatar)) {
      return res.status(400).json({ message: "Invalid avatar URL" });
    }

    // Check if email already exists
    const exists = await AdminModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already used" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await AdminModel.create({
      name,
      email,
      password: hashedPassword,
      storeName,
      storeAddress,
      avatar,
      phone,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: error.message });
  }
};
