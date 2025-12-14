import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} role="admin" />

      {/* Main Content */}
      <div className={`${collapsed ? 'ml-16' : 'ml-64'} flex-1 p-6 transition-all duration-200`}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
