import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    role: { type: String, enum: ["admin", "staff"], required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OTPModel = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
export default OTPModel;
