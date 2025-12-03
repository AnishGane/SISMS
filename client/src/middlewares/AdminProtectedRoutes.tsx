import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/auth/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoutes;
