import Sidebar from '../components/ui/Sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
