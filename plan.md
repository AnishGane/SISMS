import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ThemeSelection from '../../components/ThemeSelection';
import { User, Store, Bell, Shield, Save, Pen, X, Trash2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/admin/ManageStaff/ConfirmModal';
import toast from 'react-hot-toast';
import ProfilePhotoSelector from '../../components/ui/ProfilePhotoSelector';
import type { ImageValue } from '../../types/staff';

const AdminSettings = () => {
  const [avatarPreview, setAvatarPreview] = useState<ImageValue>(null);
  const [form, setForm] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    storeName: '',
    storeAddress: '',
    storeCurrency: 'NPR',
    timezone: 'Asia/Kathmandu',
    isNotificationEnabled: false,
  });
  const { loading, setLoading, confirmConfig, setConfirmConfig } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const fetchUserSettingData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.SETTING.GET_SETTING);
      setLoading(false);
      setForm(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const fd = new FormData();

      // append text fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'avatar') {
          fd.append(key, String(value));
        }
      });

      // append avatar file if selected
      if (avatarPreview instanceof File) {
        fd.append('avatar', avatarPreview);
      }

      const res = await axiosInstance.put(API_PATHS.ADMIN.SETTING.UPDATE_SETTING(form._id), fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm(res.data.data);
      setAvatarPreview(null);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmConfig({
      title: 'Delete Staff',
      message: `Delete this account? This cannot be undone.`,
      confirmText: 'Delete',
      action: async () => {
        await axiosInstance.delete(API_PATHS.ADMIN.SETTING.DELETE_SETTING(form._id));
        setConfirmConfig(null);
        toast.success('Account deleted successfully');
      },
    });
  };

  useEffect(() => {
    fetchUserSettingData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <ConfirmModal
        open={!!confirmConfig}
        title={confirmConfig?.title || ''}
        message={confirmConfig?.message || ''}
        confirmText={confirmConfig?.confirmText}
        onCancel={() => setConfirmConfig(null)}
        onConfirm={confirmConfig?.action || (() => {})}
      />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Admin Settings</h1>
        <p className="text-sm text-gray-500">Manage your account, store and system preferences</p>
      </div>

      {/* Theme Settings */}
      <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Shield size={18} />
          <h2 className="font-medium">Appearance</h2>
        </div>
        <ThemeSelection />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Profile Settings */}
        <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <User size={18} />
            <h2 className="font-medium">Profile Information</h2>
          </div>
          <ProfilePhotoSelector
            image={avatarPreview ?? form.avatar}
            onChange={(image: ImageValue) => {
              setAvatarPreview(image);
            }}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              Name
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="name"
                value={form.name}
                readOnly={!isEditing}
                placeholder="Full Name"
                onChange={handleChange}
              />{' '}
            </div>
            <div className="flex flex-col">
              Email
              <input
                className="input input-bordered mt-1.5"
                name="email"
                value={form.email}
                placeholder="Email Address"
                readOnly={!isEditing}
                disabled
              />
            </div>
            <div className="flex flex-col">
              Contact Number
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="phone"
                value={form.phone}
                placeholder="Phone Number"
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
            P
          </div>
        </div>

        {/* Store Settings */}
        <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Store size={18} />
            <h2 className="font-medium">Store Settings</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              Store Name
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="storeName"
                placeholder="Store Name"
                readOnly={!isEditing}
                value={form.storeName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              Store Address
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="storeAddress"
                placeholder="Store Address"
                readOnly={!isEditing}
                value={form.storeAddress}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              Store Currency
              <select
                className="select select-bordered mt-1.5 outline-none"
                name="storeCurrency"
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="NPR">NPR (Rs)</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="flex flex-col">
              Timezone
              <select
                className="select select-bordered mt-1.5 outline-none"
                name="timezone"
                onChange={(e) => handleChange(e)}
                disabled={!isEditing}
              >
                <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Bell size={18} />
          <h2 className="font-medium">Notifications</h2>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            name="isNotificationEnabled"
            checked={form.isNotificationEnabled}
            onChange={handleChange}
          />
          <span className="text-sm">Enable low stock alerts</span>
        </label>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <Button title="Delete account" className="btn btn-error btn-outline" onClick={handleDelete}>
          <Trash2 size={18} />
          Delete Account
        </Button>

        {!isEditing ? (
          <Button title="Edit" className="btn btn-primary px-3" onClick={() => setIsEditing(true)}>
            <Pen size={18} />
            <span>Edit</span>
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Button
              title="Cancel"
              className="btn border-error border shadow-sm"
              onClick={() => {
                setIsEditing(false);
                setAvatarPreview(null);
                fetchUserSettingData();
              }}
            >
              <X size={18} />
              <span>Cancel</span>
            </Button>
            <Button title="Save" className="btn btn-success" onClick={handleUpdate}>
              <Save size={18} />
              <span>Save</span>
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

import { LucideTrash, LucideUpload, LucideUser } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export type ImageValue = string | File | null;

type Props = {
  image: ImageValue;
  onChange: (image: ImageValue) => void;
};

const ProfilePhotoSelector: React.FC<Props> = ({ image, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    if (typeof image === 'string') {
      setPreviewUrl(image);
      return;
    }

    const preview = URL.createObjectURL(image);
    setPreviewUrl(preview);

    return () => URL.revokeObjectURL(preview);
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="mb-6 flex justify-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="bg-base-300 relative flex size-20 items-center justify-center rounded-full">
          <LucideUser className="text-base-content size-9" />
          <button
            type="button"
            title="Upload profile photo"
            className="bg-success absolute -right-1 -bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full text-white"
            onClick={() => inputRef.current?.click()}
          >
            <LucideUpload size={18} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={previewUrl} className="size-20 rounded-full object-cover" />
          <button
            type="button"
            title="Remove profile photo"
            className="bg-error absolute -right-1 -bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full text-white"
            onClick={handleRemove}
          >
            <LucideTrash size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;

import { Request, Response } from "express";
import { getUserModelByRole, uploadToCloudinary } from "../../utils/helper.js";

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
    const file = req.file;

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

    let avatarUrl: string | undefined;
    const updates: Record<string, any> = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (file) {
      avatarUrl = await uploadToCloudinary(file);
    }

    if (avatarUrl) {
      updates.avatar = avatarUrl;
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

import express from "express";
import {
  deleteUser,
  getUserDetails,
  updateUserDetails,
} from "../../controller/shared/setting.controller";
import upload from "../../middlewares/multer";
import { auth } from "../../middlewares/auth.middleware";

const settingRoutes = express.Router();

settingRoutes.get("/user",auth, getUserDetails);
settingRoutes.put("/:id",auth, upload.single("avatar"), updateUserDetails);
settingRoutes.delete("/:id",auth, deleteUser);

export default settingRoutes;

export const uploadToCloudinary = (
  file: Express.Multer.File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file buffer exists
    if (!file.buffer) {
      return reject(
        new Error("File buffer is missing. Ensure multer uses memoryStorage.")
      );
    }

    // Validate Cloudinary is configured
    if (
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_SECRET_KEY
    ) {
      return reject(
        new Error("Cloudinary credentials are missing. Check your .env file.")
      );
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "SISMS",
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (err, result) => {
        if (err) {
          console.error("Cloudinary upload error details:", {
            message: err.message,
            http_code: err.http_code,
            name: err.name,
          });
          return reject(new Error(`Cloudinary upload failed: ${err.message}`));
        }
        if (!result?.secure_url) {
          return reject(new Error("No secure URL returned from Cloudinary"));
        }
        console.log("Image uploaded successfully:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    try {
      streamifier.createReadStream(file.buffer).pipe(stream);
    } catch (pipeError: any) {
      console.error("Error piping file to Cloudinary:", pipeError);
      reject(new Error(`Failed to process image: ${pipeError.message}`));
    }
  });
};