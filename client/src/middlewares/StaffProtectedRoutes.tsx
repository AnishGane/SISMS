import { Navigate, Outlet } from "react-router-dom";

const StaffProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "staff") {
    return <Navigate to="/auth/staff/login" replace />;
  }

  return <Outlet />;
};

export default StaffProtectedRoutes;
