import jwt from "jsonwebtoken";
import AdminModel from "../models/admin.model.js";
import StaffModel from "../models/staff.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Determine if token belongs to admin or staff
    let user;
    if (decoded.role === "admin") {
      user = await AdminModel.findById(decoded.id);
    } else {
      user = await StaffModel.findById(decoded.id);
    }

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach logged in user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
