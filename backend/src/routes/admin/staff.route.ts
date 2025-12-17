import express from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

import {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  toggleStatus,
} from "../../controller/admin/staff.controller.js";
import upload from "../../middlewares/multer.js";

const staffRoutes = express.Router();

// Create staff
staffRoutes.post("/add-staff", auth, allowRoles("admin"), upload.single("avatar"), createStaff);

// Get all staff under the admin
staffRoutes.get("/", auth, allowRoles("admin"), getAllStaff);

// Deactivate staff
staffRoutes.patch("/:id/toggle-status", auth, allowRoles("admin"), toggleStatus);

// Update staff
staffRoutes.put("/:id", auth, allowRoles("admin"), upload.single("avatar"), updateStaff);

// Delete staff
staffRoutes.delete("/:id", auth, allowRoles("admin"), deleteStaff);

export default staffRoutes;
