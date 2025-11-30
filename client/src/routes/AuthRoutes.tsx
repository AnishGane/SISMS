import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import StaffLogin from "../pages/auth/StaffLogin";
import AdminRegister from "../pages/auth/AdminRegister";
import NotFound from "../pages/shared/NotFound";

const AuthRoutes = () => (
  <Routes>
    <Route>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="staff/login" element={<StaffLogin />} />
      <Route path="admin/register" element={<AdminRegister />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AuthRoutes;
