import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Detect admin or staff page:
  const role = location.pathname.includes("admin") ? "admin" : "staff";

  const handleSendOTP = async () => {
    if (!email) return alert("Email is required");
    setLoading(true);

    try {
      const res = await axiosInstance.post(`/api/auth/${role}/forgot-password`, {
        email,
      });

      alert(res.data.message);

      navigate(`/auth/${role}/verify-otp?email=${email}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6 tracking-wide">
          Enter your email to receive an OTP
        </p>

        <input
          type="email"
          className="w-full border border-gray-400 focus:border-neutral-600 outline-none rounded-md px-4 py-2 text-sm"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={handleSendOTP}
          className="w-full mt-6 cursor-pointer bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
