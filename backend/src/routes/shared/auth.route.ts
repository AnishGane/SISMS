import express from "express";
import {
  loginAdmin,
  loginStaff,
  registerAdmin,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../../controller/shared/auth.controller.js";
import upload from "../../middlewares/multer.js";
import { auth } from "../../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/login-staff", loginStaff);
authRoutes.post("/login-admin", loginAdmin);
authRoutes.post("/register-admin", upload.single("avatar"), registerAdmin);

// POST /api/auth/:role/forgot-password
authRoutes.post("/:role/forgot-password", forgotPassword);

// POST /api/auth/:role/verify-otp
authRoutes.post("/:role/verify-otp", verifyOTP);

// POST /api/auth/:role/reset-password
authRoutes.post("/:role/reset-password", resetPassword);

authRoutes.get("/me", auth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default authRoutes;
