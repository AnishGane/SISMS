import express from "express";
import { getAdminSalesHistory } from "../../controller/shared/sale.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const salesRoute = express.Router();

salesRoute.get(
  "/sales-history",
  auth,
  allowRoles("admin"),
  getAdminSalesHistory
);

export default salesRoute;
