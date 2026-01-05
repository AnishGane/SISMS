import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";

import {
  getAdminDashboardData,
  getStockByCategory,
  getMonthlySalesChart,
  // getLowStockNotifications,
  getRecentActivity,
  getTodaysOverview,
} from "../../controller/admin/dashboard.controller.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const dashboardRoute = Router();

// ✔ Dashboard Cards (staffCount, productCount, sales, revenue, low stock)
dashboardRoute.get("/cards", auth, allowRoles("admin"), getAdminDashboardData);

// ✔ Stock Insights → BarChart (stock by category)
dashboardRoute.get(
  "/stock-by-category",
  auth,
  allowRoles("admin"),
  getStockByCategory
);

// ✔ Monthly Sales → LineChart (orders grouped by month)
dashboardRoute.get(
  "/monthly-sales",
  auth,
  allowRoles("admin"),
  getMonthlySalesChart
);

// ✔ Low Stock Alerts (AI reorder algorithm)
// dashboardRoute.get(
//   "/low-stock",
//   auth,
//   allowRoles("admin"),
//   getLowStockNotifications
// );

dashboardRoute.get(
  "/todaysOverview",
  auth,
  allowRoles("admin"),
  getTodaysOverview
);
// ✔ Recent Activities (products, stocks, sales, staff)
dashboardRoute.get(
  "/recent-activity",
  auth,
  allowRoles("admin"),
  getRecentActivity
);

export default dashboardRoute;
