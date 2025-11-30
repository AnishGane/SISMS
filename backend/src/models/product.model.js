// models/product.model.js
import mongoose from "mongoose";
import SaleSchema from "./sale.model.js";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    sku: { type: String, unique: true, sparse: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },

    // pricing
    price: { type: Number, required: true }, // retail price
    cost: { type: Number, required: true }, // purchase cost
    unit: { type: String, default: "pcs" }, // unit of measure

    // inventory
    stock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 }, // when to reorder
    leadTimeDays: { type: Number, default: 7 },

    // location & supplier
    location: { type: String }, // e.g., Rack A2
    supplier: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
      name: String,
      phone: String,
      email: String,
    },

    // sales history snapshot array (embedded small history)
    salesHistory: { type: [SaleSchema], default: [] },

    // analytics metadata
    avgDailySales: { type: Number, default: 0 },
    lastReorderDate: { type: Date },

    // store (owner)
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    // soft-delete
    isActive: { type: Boolean, default: true },

    // flexible metadata for extensions
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Useful index for searching
ProductSchema.index({ name: "text", category: "text", description: "text" });

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default ProductModel;
