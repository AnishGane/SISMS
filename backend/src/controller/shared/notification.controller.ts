import mongoose from "mongoose";
import NotificationModel from "../../models/notification.model.js";
import { Request, Response } from "express";
import { getUserModelByRole } from "../../utils/helper.js";

interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: "admin" | "staff";
    store?: string;
  };
}

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userModel = getUserModelByRole(req.user?.role);
    const user = await userModel.findById(req.user._id).select("isNotificationEnabled");

    if (!user.isNotificationEnabled) {
      return res.status(403).json({
        success: false,
        message: "Please enable notifications first",
        notifications: [],
      });
    }

    const storeId = new mongoose.Types.ObjectId(req.user.store ?? req.user._id);

    const notifications = await NotificationModel.find({ store: storeId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (err) {
    console.error("Get Notifications Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await NotificationModel.findByIdAndUpdate(id, { isRead: true });

    return res.json({ success: true });
  } catch (err) {
    console.error("Mark Read Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;

    await NotificationModel.updateMany({ store: storeId }, { isRead: true });

    return res.json({ success: true });
  } catch (err) {
    console.error("Mark All Read Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const unreadCount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const storeId = req.user.store || req.user._id;

    const count = await NotificationModel.countDocuments({
      store: storeId,
      isRead: false,
    });

    return res.json({ count });
  } catch (err) {
    console.error("Unread Count Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
