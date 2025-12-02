import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../layouts/AuthLayout";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // for icons
import { API_PATHS } from "../../utils/apiPath";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const { navigate, location } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  // detect admin or staff based on URL
  const role = location.pathname.includes("admin") ? "admin" : "staff";

  const handleReset = async () => {
    if (newPassword.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("passwordResetToken");
    if (!token) {
      toast.error("Missing verification token. Restart the forgot password process.");
      navigate(`/auth/${role}/forgot-password`);
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        API_PATHS.AUTH.RESET_PASSWORD.replace(':role', role),
        { token, newPassword }
      );

      toast.success(res.data.message);

      localStorage.removeItem("passwordResetToken");

      navigate(`/auth/${role}/login`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="p-6">
        <h2 className="text-2xl font-medium text-center mb-6">Reset Password</h2>

        {/* NEW PASSWORD */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-neutral-400 outline-none rounded-md focus:ring focus:ring-purple-300 text-sm"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4 relative">
          <input
            type="password"
            value={confirm}
            placeholder="Confirm new password"
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 border border-neutral-400 outline-none rounded-md focus:ring focus:ring-purple-300 text-sm"
            required
          />
        </div>

        {/* RESET BUTTON */}
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-2 mt-2 rounded text-white cursor-pointer font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "btn-linear"
          }`}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
