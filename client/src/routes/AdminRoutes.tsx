import { Routes, Route } from 'react-router-dom';
import AdminProtectedRoutes from '../middlewares/AdminProtectedRoutes';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import ManageStaff from '../pages/admin/ManageStaff';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminSettings from '../pages/admin/AdminSettings';
import { AdminProvider } from '../context/AdminContext';

const AdminRoutes = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route element={<AdminProtectedRoutes />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="staffs" element={<ManageStaff />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
};

export default AdminRoutes;
