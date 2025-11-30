// models/supplier.model.js
import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    contactPerson: { type: String },
    notes: { type: String },

    // list of product references (optional)
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const SupplierModel =
  mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);

export default SupplierModel;
