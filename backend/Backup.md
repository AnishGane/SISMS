// cron/inventory.cron.ts

```
import cron from "node-cron";
import Product from "../models/product.model";
import {
  calculateAvgDailySales,
  calculateReorderPoint,
  calculateStockoutDate,
  calculateRecommendedReorderQty,
} from "../services/inventory.service";

cron.schedule("0 0 * * *", async () => {
  console.log("Running inventory analytics cron...");

  const products = await Product.find();

  for (const product of products) {
    product.avgDailySales = calculateAvgDailySales(product);
    product.reorderLevel = calculateReorderPoint(product);
    product.predictedStockoutDate = calculateStockoutDate(product);
    product.recommendedReorderQty = calculateRecommendedReorderQty(product);

    await product.save();
  }

  console.log("Inventory analytics updated.");
});
```

// services/inventory.service.ts

```
import type { ProductDocument } from "../models/product.model.d.js";
export const calculateAvgDailySales = (product: ProductDocument) => {
  if (!product.salesHistory || product.salesHistory.length === 0) return 0;

  const sortedSales = [...product.salesHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = new Date(sortedSales[0].date);
  const last = new Date(sortedSales[sortedSales.length - 1].date);

  const diffDays = Math.max(
    1,
    Math.ceil((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
  );

  const totalQty = sortedSales.reduce((sum, sale) => sum + sale.qty, 0);

  return totalQty / diffDays;
};

export const calculateReorderPoint = (product: ProductDocument) => {
  const daily = product.avgDailySales || 1;
  const lead = product.leadTimeDays || 7;
  return Math.ceil(daily * lead);
};

export const calculateStockoutDate = (product: ProductDocument) => {
  const daily = product.avgDailySales || 0;
  if (daily === 0) return null;

  const daysLeft = product.stock / daily;
  const predictedDate = new Date();
  predictedDate.setDate(predictedDate.getDate() + Math.ceil(daysLeft));

  return predictedDate;
};

export const calculateRecommendedReorderQty = (product: ProductDocument) => {
  const reorderPoint = calculateReorderPoint(product);
  return reorderPoint * 2;
};

```

// utils/calcInventory.ts

```
// Economic Order Quantity (EOQ / ROQ)
export function calculateReorderQuantity(dailyDemand: number, orderingCost = 50, holdingCost = 10) {
    // EOQ = sqrt((2DS)/H)
    const annualDemand = dailyDemand * 365;

    return Math.round(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost));
  }

  // Reorder Point (ROP)
  // ROP = (avg daily sales × lead time days) + safety stock
  export function calculateReorderPoint(avgDailySales: number, leadTimeDays: number, safetyStock = 5) {
    return Math.ceil(avgDailySales * leadTimeDays + safetyStock);
  }

  // Predict stockout date
  export function predictStockoutDate(stock: number, avgDailySales: number) {
    if (avgDailySales <= 0) return null;

    const daysLeft = stock / avgDailySales;
    const stockoutDate = new Date();
    stockoutDate.setDate(stockoutDate.getDate() + daysLeft);

    return stockoutDate;
  }

```

// In app.ts
import "./cron/inventory.cron.js";

// components/admin/Dashboard/InventorySights.tsx

```

interface ProductInsights {
  avgDailySales?: number;
  reorderLevel?: number;
  predictedStockoutDate?: string | Date | null;
  recommendedReorderQty?: number;
}

interface InventoryInsightsProps {
  product: ProductInsights;
}

export default function InventoryInsights({ product }: InventoryInsightsProps) {
  return (
    <div className="space-y-2 rounded-lg border bg-white p-4 shadow-sm">
      <p>
        <b>Average Daily Sales:</b>{' '}
        {product.avgDailySales !== undefined ? product.avgDailySales.toFixed(2) : 'N/A'}
      </p>

      <p>
        <b>Reorder Point:</b> {product.reorderLevel !== undefined ? product.reorderLevel : 'N/A'}
      </p>

      <p>
        <b>Predicted Stockout Date:</b>{' '}
        {product.predictedStockoutDate
          ? new Date(product.predictedStockoutDate).toLocaleDateString()
          : 'Not enough data'}
      </p>

      <p>
        <b>Recommended Reorder Qty:</b>{' '}
        {product.recommendedReorderQty !== undefined ? product.recommendedReorderQty : 'N/A'}
      </p>
    </div>
  );
}

```

// components/admin/Dashboard/LowStockWidget.tsx

```
interface ProductItem {
  _id: string;
  name: string;
  stock: number;
}

interface LowStockWidgetProps {
  items: ProductItem[];
}

export default function LowStockWidget({ items }: LowStockWidgetProps) {
  return (
    <div className="rounded border bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-semibold">Low Stock Products</h2>

      {items.length === 0 && <p className="text-sm text-gray-500">All stock levels are healthy.</p>}

      {items.map((p) => (
        <div key={p._id} className="flex justify-between border-b py-2">
          <span>{p.name}</span>
          <span className="text-red-500">{p.stock} left</span>
        </div>
      ))}
    </div>
  );
}

```
