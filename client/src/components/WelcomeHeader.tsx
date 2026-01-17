import { useAdmin } from '../context/AdminContext';
import { getInitials } from '../utils/getInitials';
import NotificationBell from './admin/NotificationBell';

const WelcomeHeader = ({ role }: { role: string }) => {
  const { avatarUrl } = useAdmin();
  const username = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}').name || 'User';
    } catch {
      return 'User';
    }
  })();
  return (
    <div className="text-base-content bg-base-200/50 flex w-full items-center justify-between rounded-md p-4 shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-3">
          <p className="text-2xl font-medium">Dashboard</p>
          <span className="ring-secondary rounded-full px-2 py-0.5 text-[10px] ring-1">{role}</span>
        </div>
        <p className="text-sm text-neutral-400">Welcome to your dashboard</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col">
          <div className="flex justify-center gap-2">
            <NotificationBell />
            <p className="text-right font-medium">Welcome, {username}</p>
          </div>
          <p className="-mt-1 text-sm text-neutral-500/70">Hope you are having a good day!</p>
        </div>
        <div className="bg-base-100 text-base-content ring-base-content flex size-10 items-center justify-center overflow-hidden rounded-full ring-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User avatar" className="h-full w-full object-cover" />
          ) : (
            getInitials(username || '')
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
