import { Routes, Route } from "react-router-dom";
import AdminProtectedRoutes from "../middlewares/AdminProtectedRoutes";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminProtectedRoutes />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* <Route path="staffs" element={<ManageStaff />} /> */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
