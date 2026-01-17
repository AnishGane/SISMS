import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false; // default expanded
  });

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const saved = localStorage.getItem('admin_sidebar_collapsed');

    // Only auto-collapse if user has NEVER toggled
    if (saved === null) {
      setCollapsed(mediaQuery.matches);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('admin_sidebar_collapsed');
      if (saved === null) {
        setCollapsed(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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
