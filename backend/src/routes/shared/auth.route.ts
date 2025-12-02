import express from "express";
import {
  loginAdmin,
  loginStaff,
  registerAdmin,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../../controller/shared/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/login-staff", loginStaff);
authRoutes.post("/login-admin", loginAdmin);
authRoutes.post("/register-admin", registerAdmin);

// POST /auth/:role/forgot-password
authRoutes.post("/:role/forgot-password", forgotPassword);

// POST /auth/:role/verify-otp
authRoutes.post("/:role/verify-otp", verifyOTP);

// POST /auth/:role/reset-password
authRoutes.post("/:role/reset-password", resetPassword);

export default authRoutes;
