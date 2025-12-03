import WelcomeHeader from '../../components/WelcomeHeader';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <WelcomeHeader text="Admin Dashboard" subText="Welcome to the admin dashboard anish" />
    </AdminLayout>
  );
};

export default AdminDashboard;
