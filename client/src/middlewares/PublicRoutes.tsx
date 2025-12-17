// src/middlewares/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type Props = {
  role?: 'admin' | 'staff' | 'any';
};

const PublicRoute: React.FC<Props> = ({ role = 'any' }) => {
  const token = localStorage.getItem('token');

  if (token) {
    const target =
      role === 'admin' ? '/admin/dashboard' : role === 'staff' ? '/staff/dashboard' : '/';

    return <Navigate to={target} replace />;
  }

  // no token -> allow access to login/register pages
  return <Outlet />;
};

export default PublicRoute;
