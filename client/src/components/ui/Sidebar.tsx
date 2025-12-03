import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PackageSearch,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ role = 'admin' }) => {
  const [collapsed, setCollapsed] = useState(false);

  const adminMenu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Products', icon: <PackageSearch size={20} />, path: '/admin/products' },
    { name: 'Staffs', icon: <Users size={20} />, path: '/admin/staffs' },
    { name: 'Manage Orders', icon: <ClipboardList size={20} />, path: '/admin/orders' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  const staffMenu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/staff' },
    { name: 'Billing', icon: <ClipboardList size={20} />, path: '/staff/billing' },
    { name: 'Inventory', icon: <PackageSearch size={20} />, path: '/staff/inventory' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/staff/settings' },
  ];

  const menu = role === 'admin' ? adminMenu : staffMenu;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} `}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-4">
        {!collapsed && <h1 className="text-xl font-semibold tracking-wide">SISMS</h1>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer rounded p-1 transition hover:bg-gray-700"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <div className="mt-5">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `mx-2 my-1 flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 transition-colors duration-200 ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'} `
            }
          >
            <span>{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}

        {/* Logout */}
        <button
          className={`mx-2 my-6 flex w-[calc(100%-1rem)] cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-gray-300 transition hover:bg-red-500 hover:text-white`}
          onClick={() => {
            localStorage.clear();
            window.location.href = role === 'admin' ? '/auth/admin/login' : '/auth/staff/login';
          }}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
