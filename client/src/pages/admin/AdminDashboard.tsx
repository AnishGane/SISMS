import WelcomeHeader from '../../components/WelcomeHeader';
import SummaryCards from '../../components/admin/SummaryCards';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <WelcomeHeader text="Admin Dashboard" subText="Welcome to the admin dashboard" />

      <SummaryCards />
    </AdminLayout>
  );
};

export default AdminDashboard;
