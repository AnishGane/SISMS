import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import {Link} from "react-router-dom";
import { API_PATHS } from "../../utils/apiPath";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {navigate, location, loading, setLoading, error, setError} = useAuth();

  // Detect admin or staff page:
  const role = location.pathname.includes("admin") ? "admin" : "staff";

  useEffect(()=>{
    if(error){
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  },[error])

  const handleSendOTP = async () => {
    if (!email) return toast.error("Email is required");
    setLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD.replace(':role', role), {
        email,
      });

      toast.success(res.data.message);

      navigate(`/auth/${role}/verify-otp?email=${email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="p-8">
        <h2 className="text-2xl font-medium text-center mb-1">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6 tracking-wide">
          Enter your email to receive an OTP
        </p>

        <input
          type="email"
          className="w-full border border-gray-400 focus:ring focus:ring-purple-300 outline-none rounded-md px-4 py-3 text-sm"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

        <button
          disabled={loading}
          onClick={handleSendOTP}
          className="w-full mt-6 btn-linear text-white cursor-pointer py-2 outline-none rounded-md font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <p className="text-xs text-gray-600  text-center mt-6">Go Back to {" "}
        <Link to={`/auth/${role}/login`} className="text-blue-600 hover:underline">
          Login
        </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
