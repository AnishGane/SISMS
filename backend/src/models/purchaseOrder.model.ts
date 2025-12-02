// models/purchaseOrder.model.js
import mongoose from "mongoose";

const PurchaseItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: { type: Number, required: true },
    cost: { type: Number, required: true }, // cost per unit
  },
  { _id: false }
);

const PurchaseOrderSchema = new mongoose.Schema(
  {
    poNo: { type: String, unique: true, sparse: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    products: { type: [PurchaseItemSchema], default: [] },
    status: {
      type: String,
      enum: ["ordered", "received", "cancelled"],
      default: "ordered",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    receivedAt: { type: Date },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

const PurchaseOrderModel =
  mongoose.models.PurchaseOrder ||
  mongoose.model("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrderModel;
