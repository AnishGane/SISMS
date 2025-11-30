// models/stockAdjustment.model.js
import mongoose from "mongoose";

const StockAdjustmentSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qtyChange: { type: Number, required: true }, // positive or negative
    reason: {
      type: String,
      enum: ["damage", "expiry", "stolen", "manual", "correction"],
      default: "manual",
    },
    note: { type: String },
    adjustedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "adjustedByModel",
    },
    adjustedByModel: { type: String, enum: ["Admin", "Staff"], required: true },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const StockAdjustmentModel =
  mongoose.models.StockAdjustment ||
  mongoose.model("StockAdjustment", StockAdjustmentSchema);

export default StockAdjustmentModel;
