import ProductModel from "../models/product.model.js";
import SaleModel from "../models/sale.model.js";
import mongoose from "mongoose";

export default async function runABCAnalysis(storeId?: string) {
  let storeObjectId: mongoose.Types.ObjectId | null = null;
  if (storeId) {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      throw new Error(`Invalid storeId format: ${storeId}`);
    }
    storeObjectId = new mongoose.Types.ObjectId(storeId);
  }

  // OPTIONAL: restrict to one store
  const matchStage = storeObjectId ? { store: storeObjectId } : {};

  // Aggregate the sales per product
  const salesAgg = await SaleModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$product",
        totalSold: { $sum: "$quantity" },
      },
    },
  ]);

  if (salesAgg.length === 0) return;

  // Maps sales for quick lookup
  const salesMap = new Map<string, number>();
  for (const s of salesAgg) {
    salesMap.set(String(s._id), s.totalSold);
  }

  // Fetch products involved in sales (keep the same store scope)
  const productQuery: Record<string, unknown> = {
    _id: { $in: [...salesMap.keys()] },
  };
  if (storeObjectId) productQuery.store = storeObjectId;

  const products = await ProductModel.find(productQuery).lean();

  // Compute annual consumption value
  const enriched = products.map((p) => {
    const totalSold = salesMap.get(String(p._id)) || 0;
    const value = totalSold * p.price;

    return {
      _id: p._id,
      consumptionValue: value,
    };
  });

  // Sort descending by value
  enriched.sort((a, b) => b.consumptionValue - a.consumptionValue);

  // Cumulative percentage + classification
  const totalValue = enriched.reduce((sum, p) => sum + p.consumptionValue, 0);

  // Avoid division by zero; default everything to "C"
  if (totalValue === 0) {
    const bulkOps = enriched.map((p) => ({
      updateOne: {
        filter: { _id: p._id },
        update: {
          $set: {
            abcClass: "C" as const,
            annualConsumptionValue: 0,
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await ProductModel.bulkWrite(bulkOps);
    }
    return;
  }

  let cumulative = 0;
  const bulkOps = [];

  for (const p of enriched) {
    cumulative += p.consumptionValue;
    const ratio = cumulative / totalValue;

    let abcClass: "A" | "B" | "C";
    if (ratio <= 0.7) abcClass = "A";
    else if (ratio <= 0.9) abcClass = "B";
    else abcClass = "C";

    bulkOps.push({
      updateOne: {
        filter: { _id: p._id },
        update: {
          $set: {
            abcClass,
            annualConsumptionValue: p.consumptionValue,
          },
        },
      },
    });
  }

  // Bulk update products
  if (bulkOps.length > 0) {
    await ProductModel.bulkWrite(bulkOps);
  }
}
