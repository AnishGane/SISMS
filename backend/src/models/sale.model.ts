// models/sale.model.js
import mongoose from "mongoose";

/**
 * Exporting SaleSchema (not a model) — used as subdocument in Product.salesHistory
 */

const SaleSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true }, // snapshot
    category: { type: String },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }, // unit price at sale
    total: { type: Number, required: true },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    date: { type: Date, default: Date.now },

    // tax & discount at item level
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },

    // return/refund support
    isReturned: { type: Boolean, default: false },
    returnDate: { type: Date },
    returnReason: { type: String },

    // invoice snapshot
    // invoiceNo: { type: String },
  },
  { _id: false } // used as subdocument in product or order; avoid extra _id unless needed
);

export default SaleSchema;
