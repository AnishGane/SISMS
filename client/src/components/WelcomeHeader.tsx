import { getInitials } from '../utils/getInitials';

type WelcomeHeaderProps = {
  text: string;
  subText: string;
  avatarUrl?: string;
};

const WelcomeHeader = ({ text, subText, avatarUrl }: WelcomeHeaderProps) => {
  const username = JSON.parse(localStorage.getItem('user') || '{}').name;
  return (
    <div className="text-base-content bg-base-200/50 flex w-full items-center justify-between rounded-md p-4 shadow-sm">
      <div className="flex flex-col">
        <p className="text-2xl font-medium">{text}</p>
        <p className="text-secondary text-sm">{subText}</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col">
          <p className="text-right font-medium">Welcome, {username}</p>
          <p className="text-secondary text-sm">Hope you are having a good day!</p>
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
