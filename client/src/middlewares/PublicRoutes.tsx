// src/middlewares/PublicRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  role?: "admin" | "staff" | "any";
};

const PublicRoute: React.FC<Props> = ({ role = "any" }) => {
  const token = localStorage.getItem("token");

  const storedRole =
    localStorage.getItem("role") ||
    (localStorage.getItem("username") ? "admin" :
      localStorage.getItem("staff_username") ? "staff" : null);

  if (token) {
    const target =
      storedRole === "admin" ? "/admin/dashboard" :
      storedRole === "staff" ? "/staff/dashboard" :
      "/"; 

    return <Navigate to={target} replace />;
  }

  // no token -> allow access to login/register pages
  return <Outlet />;
};

export default PublicRoute;
