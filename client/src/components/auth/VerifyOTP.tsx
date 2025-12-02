import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const location = useLocation();

    // extract email from query
    const params = new URLSearchParams(location.search);
    const email = params.get("email") || "";

    const handleVerifyClick = async () => {
      const otpStr = otp.join("");
      if (otpStr.length !== 4) return alert("Enter full OTP");
      try {
        // detect admin/staff from URL as you did earlier
        const role = location.pathname.includes("admin") ? "admin" : "staff";
        const res = await axiosInstance.post(`/api/auth/${role}/verify-otp`, { email, otp: otpStr });
        const { token } = res.data;
        // store token (temporarily) e.g. in memory or localStorage and then navigate to reset page
        localStorage.setItem("passwordResetToken", token);
        navigate(`/auth/${role}/reset-password?email=${encodeURIComponent(email)}`);
      } catch (err: any) {
        alert(err.response?.data?.message || "Verification failed");
      }
    };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-2">Verify OTP</h2>
        <p className="text-gray-500 text-center mb-6">
          Enter the 4-digit code sent to your email
        </p>

        {/* OTP Input Boxes */}
        <div className="flex items-center justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          className="w-full mt-8 bg-blue-600 text-white py-2 rounded-lg font-medium
                     hover:bg-blue-700 transition"
                     onClick={handleVerifyClick}
        >
          Verify OTP
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive the code?{" "}
          <span className="text-blue-600 font-medium cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
