import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // detect admin or staff based on URL
  const role = location.pathname.includes("admin") ? "admin" : "staff";

  const handleReset = async () => {
    if (newPassword.trim().length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("passwordResetToken");
    if (!token) {
      alert("Missing verification token. Please restart forgot password process.");
      navigate(`/auth/${role}/forgot-password`);
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `/api/auth/${role}/reset-password`,
        { token, newPassword }
      );

      alert(res.data.message);

      // cleanup
      localStorage.removeItem("passwordResetToken");

      navigate(`/auth/${role}/login`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            placeholder="Confirm new password"
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-2 mt-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
