import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/shared/LandingPage';

const RootRedirect = () => {
  const { isAuthenticated, authLoading, user } = useAuth();

  if (authLoading) return null;

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === 'staff') {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return null;
};

export default RootRedirect;
