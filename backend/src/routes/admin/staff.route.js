import express from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

import {
  createStaff,
  getAllStaff,
  deactivateStaff,
} from "../../controller/admin/staff.controller.js";

const staffRoutes = express.Router();

// Create staff
staffRoutes.post("/create", auth, allowRoles("admin"), createStaff);

// Get all staff under the admin
staffRoutes.get("/", auth, allowRoles("admin"), getAllStaff);

// Deactivate staff
staffRoutes.patch(
  "/:id/deactivate",
  auth,
  allowRoles("admin"),
  deactivateStaff
);

export default staffRoutes;
