import type { Notification } from '../../hooks/useNotifications';

type Props = {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  loading: boolean;
};

const NotificationDropdown = ({ notifications, markRead, markAllRead, loading }: Props) => {
  if (loading) {
    return <div className="absolute right-0 mt-2 w-80 bg-white p-4 shadow-lg">Loading...</div>;
  }

  return (
    <div className="absolute right-0 mt-1 max-h-96 w-80 overflow-y-auto rounded-md bg-neutral-100 p-3 text-black shadow-lg">
      {notifications.length === 0 && <p className="p-4 text-gray-500">No notifications</p>}

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-medium">All Notification</h3>
        <div className="group">
          <p className="cursor-pointer text-xs" onClick={() => markAllRead()}>
            Mark all read
          </p>
          <hr className="h-px w-0 transition-all duration-200 group-hover:w-full" />
        </div>
      </div>
      {notifications.map((n) => (
        <div
          key={n._id}
          className={`mb-1.5 cursor-pointer rounded-md p-2 transition-all duration-200 ${n.isRead ? '' : 'bg-neutral-300'}`}
          onClick={() => markRead(n._id)}
        >
          <span
            className={`${n.meta?.level === 'CRITICAL' ? 'bg-red-500/85' : 'bg-orange-500/85'} rounded-full px-1.5 py-1 text-[10px] font-extrabold tracking-wide shadow-sm`}
          >
            {n.meta?.level}
          </span>
          <p className="mt-1 text-sm text-black">{n.message}</p>

          {n.meta && (
            <p className="mt-1 text-xs text-black">
              Stock: {n.meta.stock} | ROP: {n.meta.reorderPoint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationDropdown;
