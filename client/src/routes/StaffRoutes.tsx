import { Routes, Route } from "react-router-dom";
import StaffProtectedRoutes from "../middlewares/StaffProtectedRoutes";
import StaffDashboard from "../pages/staff/StaffDashboard";

const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffProtectedRoutes />}>
        <Route path="dashboard" element={<StaffDashboard />} />
        {/* <Route path="orders" element={<StaffOrders />} /> */}
      </Route>
    </Routes>
  );
};

export default StaffRoutes;
