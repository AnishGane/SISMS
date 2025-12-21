import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userModel",
      required: true,
    },
    userModel: {
      type: String,
      enum: ["Admin", "Staff"],
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    type: {
      type: String,
      enum: ["low_stock", "order", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    meta: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      level: {
        type: String,
        enum: ["CRITICAL", "LOW"],
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      reorderPoint: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true}
);

const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
export default NotificationModel;
