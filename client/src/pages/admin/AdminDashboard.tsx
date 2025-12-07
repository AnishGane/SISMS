import WelcomeHeader from '../../components/WelcomeHeader';
import SummaryCards from '../../components/admin/Dashboard/SummaryCards';
import StockByCategoryChart from '../../components/admin/Dashboard/StockByCategoryChart';
import AdminLayout from '../../layouts/AdminLayout';
import MonthlySalesChart from '../../components/admin/Dashboard/MonthlySalesChart';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <WelcomeHeader text="Admin Dashboard" subText="Welcome to the admin dashboard" />

      <SummaryCards />

      <StockByCategoryChart />

      <MonthlySalesChart />
    </AdminLayout>
  );
};

export default AdminDashboard;
