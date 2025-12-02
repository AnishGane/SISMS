import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import { API_PATHS } from "../../utils/apiPath";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const {navigate, location} = useAuth();

    // extract email from query
    const params = new URLSearchParams(location.search);
    const email = params.get("email") || "";

    const handleVerifyClick = async () => {
      const otpStr = otp.join("");
      if (otpStr.length !== 4) return toast.error("Enter the OTP");
      try {
        // detect admin/staff from URL
        const role = location.pathname.includes("admin") ? "admin" : "staff";
        const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP.replace(':role', role), { email, otp: otpStr });
        const { token } = res.data;
        localStorage.setItem("passwordResetToken", token);
        navigate(`/auth/${role}/reset-password?email=${encodeURIComponent(email)}`);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Verification failed");
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
    <AuthLayout>
      <div className="p-8 abcd">
        <h2 className="text-2xl font-medium text-center mb-1">One More Step!</h2>
        <div className="text-center text-gray-500 text-sm mb-6">
          {email ? (<p>
            Enter the verification code sent to <span className="font-medium text-purple-600">{email}.</span>
          </p>) : (
            <p>No email provided.</p>
          )}
        </div>

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
              className="w-12 h-12 text-center text-xl rounded-md border border-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 outline-none"
            />
          ))}
        </div>

        <button
          className="w-full mt-8 btn-linear text-white cursor-pointer py-2 outline-none  hover:bg-blue-700 transition" onClick={handleVerifyClick}
        >
          Verify OTP
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive the code?{" "}
          <span className="text-blue-600 font-medium cursor-pointer">Resend</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
