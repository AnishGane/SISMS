import { Routes, Route } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import StaffRoutes from './StaffRoutes';
import AuthRoutes from './AuthRoutes';
import NotFound from '../pages/shared/NotFound';
import LandingPage from '../components/LandingPage';
import PublicRoute from '../middlewares/PublicRoutes';

const AppRoutes = () => (
  <Routes>
    <Route path="/auth/*" element={<AuthRoutes />} />
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="/staff/*" element={<StaffRoutes />} />
    <Route element={<PublicRoute />}>
      <Route path="/" element={<LandingPage />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
