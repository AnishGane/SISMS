// models/admin.model.js
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },

    // store details
    storeName: { type: String, required: true },
    storeAddress: { type: String, required: true },

    // contact & profile
    phone: { type: String, required: true },
    avatar: { type: String, default: "" },

    // store settings
    storeCurrency: { type: String, default: "NPR" },
    timezone: { type: String, default: "Asia/Kathmandu" },
    lowStockAlert: { type: Boolean, default: true },

    // audit / soft-delete
    isActive: { type: Boolean, default: true },

    // optional metadata
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const AdminModel =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default AdminModel;
