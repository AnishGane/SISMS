import { ArrowRight } from 'lucide-react';

const Badge = () => {
  return (
    <div className="text-primary-content ring-neutral-content mx-auto flex w-fit items-center gap-4 rounded-md p-1 pr-2 text-sm ring">
      <div className="ring-neutral-content flex items-center gap-1.5 rounded-sm px-1.5 py-1 text-[10px] ring">
        <span className="bg-success size-1.5 animate-pulse rounded-full"></span>
        <p className="text-success">Explore now</p>
      </div>
      <div className="flex items-center gap-1 text-neutral-500">
        <p className="text-xs">Check out the admin dashboard</p>
        <ArrowRight size={16} />
      </div>
    </div>
  );
};

export default Badge;
