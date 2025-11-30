import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import StaffRoutes from "./StaffRoutes";
import AuthRoutes from "./AuthRoutes";
import NotFound from "../pages/shared/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/auth/*" element={<AuthRoutes />} />
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="/staff/*" element={<StaffRoutes />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
