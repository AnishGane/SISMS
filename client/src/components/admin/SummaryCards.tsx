import { RefreshCcw, User2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Heading from '../Heading';
import Button from '../ui/Button';

const SummaryCards = () => {
  const { dashboardData, fetchDashboardData, loading, error } = useAdmin();

  if (loading) return <SummaryCardsSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8 bg-neutral-100/80 p-4">
      <div className="flex items-center justify-between">
        <Heading text1="Summary" text2="Get a quick overview" />
        <Button icon={<RefreshCcw size={18} />} variant="secondary" onClick={fetchDashboardData} />
      </div>

      <div className="mt-4 grid grid-cols-5 gap-4">
        <Card
          text="Staff"
          icon={<User2 size={22} className="text-white" />}
          value={dashboardData?.staffCount || 0}
        />

        <Card
          text="Products"
          icon={<User2 size={22} className="text-white" />}
          value={dashboardData?.productCount || 0}
        />
        <Card
          text="Low Stock"
          icon={<User2 size={22} className="text-white" />}
          value={dashboardData?.lowStockCount || 0}
        />
        <Card
          text="Revenue"
          icon={<User2 size={22} className="text-white" />}
          value={`$${dashboardData?.totalRevenue || 0}`}
        />
        <Card
          text="Monthly Sales"
          icon={<User2 size={22} className="text-white" />}
          value={`$${dashboardData?.monthlySales || 0}`}
        />
      </div>
    </div>
  );
};

const Card = ({
  text,
  value,
  icon,
}: {
  text: string;
  value: number | string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="rounded-md bg-white px-8 py-6 shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-500">{text}</h3>

        {icon && <div className="rounded-md bg-green-400 p-1">{icon}</div>}
      </div>
      <p className="mt-1 text-xl">{value}</p>
    </div>
  );
};

const SummaryCardsSkeleton = () => {
  return (
    <div className="mt-8 animate-pulse bg-neutral-100/80 p-4">
      {/* Header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-gray-300"></div>
        <div className="h-10 w-24 rounded bg-gray-300"></div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="rounded bg-white px-8 py-6 shadow">
            <div className="mb-3 h-5 w-28 rounded bg-gray-300"></div>
            <div className="h-7 w-20 rounded bg-gray-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
