import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  Package2,
  RefreshCcw,
  Users,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import Heading from '../../Heading';
import Button from '../../ui/Button';
import type { JSX } from 'react';

const SummaryCards = () => {
  const { dashboardData, fetchDashboardData, loading, error } = useAdmin();

  if (loading) return <SummaryCardsSkeleton />;
  if (error) return <p className="text-error font-medium">{error}</p>;

  return (
    <div className="bg-base-200/50 mt-8 rounded-xl p-4 shadow">
      <div className="flex items-center justify-between">
        <Heading text1="Summary" text2="Get a quick overview" />
        <Button
          title="Refresh"
          icon={<RefreshCcw size={17} />}
          className="rounded-full bg-neutral/50"
          onClick={fetchDashboardData}
        />
      </div>

      <div className="mt-4 mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card
          text="Staff"
          icon={<Users size={22} className="text-primary-content" />}
          value={dashboardData?.staffCount || 0}
          bg="bg-primary"
        />

        <Card
          text="Products"
          icon={<Package2 size={22} className="text-primary-content" />}
          value={dashboardData?.productCount || 0}
          bg="bg-secondary"
        />

        <Card
          text="Low Stock"
          icon={<AlertTriangle size={22} className="text-primary-content" />}
          value={dashboardData?.lowStockCount || 0}
          bg="bg-error"
        />

        <Card
          text="Revenue"
          icon={<BadgeDollarSign size={22} className="text-primary-content" />}
          value={`$ ${dashboardData?.totalRevenue || 0}`}
          bg="bg-success"
        />

        <Card
          text="Monthly Sales"
          icon={<BarChart3 size={22} className="text-primary-content" />}
          value={`$ ${dashboardData?.monthlySales || 0}`}
          bg="bg-warning"
        />
      </div>
    </div>
  );
};

// Card Component
const Card = ({
  text,
  value,
  icon,
  bg,
}: {
  text: string;
  value: string | number;
  icon?: JSX.Element;
  bg: string;
}) => {
  return (
    <div className="bg-base-100 border-base-300 rounded-xl border px-6 py-6 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-base-content/60 text-lg font-medium">{text}</h3>

        {icon && <div className={`rounded-lg p-2 text-white ${bg}`}>{icon}</div>}
      </div>
      <p className="text-2xl tracking-tight">{value}</p>
    </div>
  );
};

// Skeleton Loader
const SummaryCardsSkeleton = () => {
  return (
    <div className="bg-base-300 mt-8 animate-pulse rounded-xl p-4">
      {/* Header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-base-100 h-5 w-32 rounded"></div>
          <div className="bg-base-100 h-5 w-40 rounded"></div>
        </div>
        <div className="bg-base-100 size-10 rounded"></div>
      </div>

      {/* Cards skeleton */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="bg-base-100 rounded-xl px-6 py-6 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <div className="bg-base-200 h-5 w-28 rounded"></div>
              <div className="bg-base-200 size-8 rounded"></div>
            </div>
            <div className="bg-base-200 h-6 w-20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
