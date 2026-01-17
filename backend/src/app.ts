import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// middlewares
// import { errorHandler } from "./middlewares/error.middleware.js";

// shared routes

import authRoutes from "./routes/shared/auth.route.js";
import productRoutes from "./routes/shared/products.route.js";
// import orderRoutes from "./routes/shared/orders.routes.js";
// import searchRoutes from "./routes/shared/search.routes.js";

// admin routes
// import adminRoutes from "./routes/admin/admin.routes.js";
import staffRoutes from "./routes/admin/staff.route.js";
import dashboardRoute from "./routes/admin/dashboard.route.js";
import settingRoutes from "./routes/shared/setting.route.js";
import notificationRoutes from "./routes/shared/notifications.route.js";
import salesRoute from "./routes/admin/sales.route.js";
// import suppliersRoutes from "./routes/admin/suppliers.routes.js";
// import purchasesRoutes from "./routes/admin/purchases.routes.js";
// import analyticsRoutes from "./routes/admin/analytics.routes.js";

// staff routes (optional)
// import staffOrdersRoutes from "./routes/staff/staffOrders.routes.js";
// import staffSearchRoutes from "./routes/staff/staffSearch.routes.js";

const app = express();

// global middlewares
app.use(cors());
app.use(express.json());

// route registration
app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoute);

// shared
app.use("/api/products", productRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/notifications", notificationRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/search", searchRoutes);

// admin
// app.use("/api/admin", adminRoutes); // /profile, /store, /settings
app.use("/api/admin/sales", salesRoute);
app.use("/api/admin/staff", staffRoutes);
// app.use("/api/admin/suppliers", suppliersRoutes);
// app.use("/api/admin/purchases", purchasesRoutes);
// app.use("/api/admin/analytics", analyticsRoutes);

// staff
// app.use("/api/staff/orders", staffOrdersRoutes);
// app.use("/api/staff/search", staffSearchRoutes);

// global error handling (always last)
// app.use(errorHandler);

app.get("/api/health", (_, res) => {
  res.send("OK");
});

export default app;
