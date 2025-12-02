import React from "react";
interface OTPEmailProps {
  otp: string;
  role: string;
  expiryMinutes: number;
}

export default function OTPEmail({ otp, role, expiryMinutes }: OTPEmailProps) {
  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h2>Password Reset Code</h2>
      <p>
        Use this OTP to reset your {role} account password. It expires in{" "}
        {expiryMinutes} minutes.
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 10,
          background: "#eee",
          borderRadius: 6,
          fontSize: 28,
          fontWeight: "bold",
          letterSpacing: 4,
          textAlign: "center",
        }}
      >
        {otp}
      </div>
    </div>
  );
}
