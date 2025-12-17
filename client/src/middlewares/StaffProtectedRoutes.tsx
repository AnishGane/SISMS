import { Navigate, Outlet } from "react-router-dom";

const StaffProtectedRoutes = () => {
  const token = localStorage.getItem("token");
 const role = JSON.parse(localStorage.getItem('user') || '{}')?.role;

  if (!token || role !== "staff") {
    return <Navigate to="/auth/staff/login" replace />;
  }

  return <Outlet />;
};

export default StaffProtectedRoutes;
