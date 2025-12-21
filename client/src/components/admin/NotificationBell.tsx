import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const { unreadCount, fetchAll, loading, markRead, markAllRead, notifications } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = async () => {
    setOpen((o) => !o);
    await fetchAll();
  };

  useEffect(() => {
    fetchAll(); // ✅ FETCH DATA
  }, []);

  return (
    <div className="relative">
      <button onClick={toggle} className="relative cursor-pointer">
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-red-600 px-1 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown loading={loading} notifications={notifications} markRead={markRead} markAllRead={markAllRead}  />}
    </div>
  );
};

export default NotificationBell;
