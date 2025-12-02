// models/order.model.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true },
    category: { type: String },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }, // unit price at order time
    total: { type: Number, required: true }, // qty * price
    description: { type: String },
    sku: { type: String },
    barcode: { type: String },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true, sparse: true }, // optional but helpful
    items: { type: [OrderItemSchema], default: [] },

    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },

    customerName: { type: String },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // staff who created sale
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refunded"],
      default: "completed",
    },

    // payment details
    paymentType: {
      type: String,
      enum: ["cash", "card", "esewa", "khalti", "other"],
      default: "cash",
    },
    paidAmount: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default OrderModel;
