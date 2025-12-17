import WelcomeHeader from '../../components/WelcomeHeader';
import SummaryCards from '../../components/admin/Dashboard/SummaryCards';
import StockByCategoryChart from '../../components/admin/Dashboard/StockByCategoryChart';
import AdminLayout from '../../layouts/AdminLayout';
import MonthlySalesChart from '../../components/admin/Dashboard/MonthlySalesChart';
import { useAdmin } from '../../context/AdminContext';

const AdminDashboard = () => {
  const { avatarUrl } = useAdmin();
  return (
    <AdminLayout>
      <WelcomeHeader
        avatarUrl={avatarUrl}
        text="Admin Dashboard"
        subText="Welcome to the admin dashboard"
      />

      <SummaryCards />

      <StockByCategoryChart />

      <MonthlySalesChart />
    </AdminLayout>
  );
};

export default AdminDashboard;
