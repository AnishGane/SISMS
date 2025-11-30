import express from "express";
import {
  loginAdmin,
  loginStaff,
  registerAdmin,
} from "../../controller/shared/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/login-staff", loginStaff);
authRoutes.post("/login-admin", loginAdmin);
authRoutes.post("/register-admin", registerAdmin);

export default authRoutes;
