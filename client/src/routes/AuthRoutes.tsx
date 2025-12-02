  import { Route, Routes } from "react-router-dom";
  import AdminLogin from "../pages/auth/AdminLogin";
  import StaffLogin from "../pages/auth/StaffLogin";
  import AdminRegister from "../pages/auth/AdminRegister";
  import NotFound from "../pages/shared/NotFound";
  import ForgotPassword from "../components/auth/ForgotPassword";
  import VerifyOTP from "../components/auth/VerifyOTP";
  import ResetPassword from "../components/auth/ResetPassword";

  const AuthRoutes = () => (
    <Routes>
      <Route>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="staff/login" element={<StaffLogin />} />
        <Route path="admin/register" element={<AdminRegister />} />

        <Route path="admin/forgot-password" element={<ForgotPassword />} />
        <Route path="staff/forgot-password" element={<ForgotPassword />} />
        <Route path="admin/verify-otp" element={<VerifyOTP />} />
        <Route path="staff/verify-otp" element={<VerifyOTP />} />
        <Route path="admin/reset-password" element={<ResetPassword />} />
        <Route path="staff/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );

  export default AuthRoutes;
