// models/notification.model.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, refPath: "userModel" }, // admin or staff
    userModel: { type: String, enum: ["Admin", "Staff"], required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["low_stock", "order", "system", "reminder"],
      default: "system",
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  {
    timestamps: true,
  }
);

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
