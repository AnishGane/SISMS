import ProductModel from "../models/product.model";
import NotificationModel from "../models/notification.model";
import mongoose from "mongoose";

type AlertLevel = "CRITICAL" | "LOW";

export async function runDailyStockCheck() {
  const products = await ProductModel.find().lean();

  for (const p of products) {
    const daily = p.avgDailySales || 0.1;
    const leadTime = p.leadTimeDays || 3;

    const leadTimeDemand = daily * leadTime;
    const safetyStock = leadTimeDemand * 0.25;

    const reorderPoint = Math.ceil(leadTimeDemand + safetyStock);

    let level: AlertLevel | null = null;

    if (p.stock <= reorderPoint) level = "CRITICAL";
    else if (p.stock <= reorderPoint * 1.2) level = "LOW";

    if (!level) continue;

    // Avoid duplicate notifications (same product + level)
    const alreadyExists = await NotificationModel.findOneAndUpdate(
      {
        store: new mongoose.Types.ObjectId(p.store),
        "meta.productId": p._id,
        type: "low_stock",
        isRead: false,
      },
      {
        $set: {
          message: `${p.name} may run out very soon`,
          meta: {
            productId: p._id,
            level, // LOW | CRITICAL (can change safely)
            stock: p.stock,
            reorderPoint: p.reorderLevel || reorderPoint,
          },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (alreadyExists) continue;

    await NotificationModel.create({
      user: p.store, // admin
      userModel: "Admin",
      store: p.store,
      type: "low_stock",
      message:
        level === "CRITICAL"
          ? `Critical stock: ${p.name} may run out very soon`
          : `Low stock warning: ${p.name}`,
      meta: {
        productId: p._id,
        level,
        stock: p.stock,
        reorderPoint,
      },
    });
  }

  console.log("✅ Daily stock check completed");
}
