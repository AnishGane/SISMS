import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoutes = () => {
  const token = localStorage.getItem('token');
  const role = JSON.parse(localStorage.getItem('user') || '{}')?.role;
  if (!token || role !== 'admin') {
    return <Navigate to="/auth/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoutes;
