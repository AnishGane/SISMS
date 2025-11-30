// models/staff.model.js
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: "staff" },

    // assigned store (Admin)
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    // contact/profile
    phone: { type: String, required: true },
    avatar: { type: String, default: "" },

    // permissions (future-proof)
    permissions: { type: [String], default: [] },

    // active/soft-delete
    isActive: { type: Boolean, default: true },

    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const StaffModel =
  mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
export default StaffModel;
