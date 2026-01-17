// src/routes/AuthRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/auth/AdminLogin';
import StaffLogin from '../pages/auth/StaffLogin';
import AdminRegister from '../pages/auth/AdminRegister';
import NotFound from '../pages/shared/NotFound';
import ForgotPassword from '../components/auth/ForgotPassword';
import VerifyOTP from '../components/auth/VerifyOTP';
import ResetPassword from '../components/auth/ResetPassword';
import PublicRoute from '../middlewares/PublicRoutes';

const AuthRoutes = () => (
  <Routes>
    {/* Admin public pages — if logged in, PublicRoute will redirect to /admin/dashboard */}
    <Route element={<PublicRoute role="admin" />}>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/register" element={<AdminRegister />} />
      <Route path="admin/forgot-password" element={<ForgotPassword />} />
      <Route path="admin/verify-otp" element={<VerifyOTP />} />
      <Route path="admin/reset-password" element={<ResetPassword />} />
    </Route>

    {/* Staff public pages — if logged in, PublicRoute will redirect to /staff/dashboard */}
    <Route element={<PublicRoute role='staff' />}>
      <Route path="staff/login" element={<StaffLogin />} />
      <Route path="staff/forgot-password" element={<ForgotPassword />} />
      <Route path="staff/verify-otp" element={<VerifyOTP />} />
      <Route path="staff/reset-password" element={<ResetPassword />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AuthRoutes;
