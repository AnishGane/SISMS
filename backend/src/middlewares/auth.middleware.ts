import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AdminModel from "../models/admin.model.js";
import StaffModel from "../models/staff.model.js";

// Extend Express Request type to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

// Define JWT payload interface
interface JwtPayload {
  id: string;
  role: "admin" | "staff";
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return res.status(401).json({ message: "Token verification failed" });
    }

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    let user;
    if (decoded.role === "admin") {
      user = await AdminModel.findById(decoded.id).select("-password");
    } else if (decoded.role === "staff") {
      user = await StaffModel.findById(decoded.id).select("-password");
    } else {
      return res.status(401).json({ message: "Invalid user role" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach logged-in user
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
