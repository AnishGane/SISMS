import { Request, Response } from "express";
import { getUserModelByRole } from "../../utils/helper.js";

interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: "admin" | "staff";
    store?: string;
  };
}

/**
 * GET logged-in user details (Admin or Staff)
 */
export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const UserModel = getUserModelByRole(req.user.role);

    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const user = await UserModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GET USER DETAILS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

/**
 * UPDATE logged-in user details
 * (Profile + store-related fields for admin)
 */
export const updateUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const UserModel = getUserModelByRole(req.user.role);

    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    /**
     * Whitelist fields (important for security)
     */
    const allowedFields =
      req.user.role === "admin"
        ? [
            "name",
            "phone",
            "avatar",
            "storeName",
            "storeAddress",
            "storeCurrency",
            "timezone",
            "lowStockAlert",
            "isNotificationEnabled",
          ]
        : ["name", "phone", "avatar"];

    const updates: Record<string, any> = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE USER DETAILS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user details",
    });
  }
};

/**
 * DELETE user account
 * - Admin → deletes own account (store shutdown scenario)
 * - Staff → usually deleted by admin (handled elsewhere)
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const UserModel = getUserModelByRole(req.user.role);

    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
