import WelcomeHeader from '../../components/WelcomeHeader';
import SummaryCards from '../../components/admin/Dashboard/SummaryCards';
import StockByCategoryChart from '../../components/admin/Dashboard/StockByCategoryChart';
import AdminLayout from '../../layouts/AdminLayout';
import MonthlySalesChart from '../../components/admin/Dashboard/MonthlySalesChart';
import TodaysOverview from '../../components/admin/Dashboard/TodaysOverview';
import RecentActivity from '../../components/admin/Dashboard/RecentActivity';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <WelcomeHeader role="admin" />

      <SummaryCards />

      <StockByCategoryChart />

      <RecentActivity />

      {/* <MonthlySalesChart /> */}

      {/* <TodaysOverview /> */}
    </AdminLayout>
  );
};

export default AdminDashboard;
