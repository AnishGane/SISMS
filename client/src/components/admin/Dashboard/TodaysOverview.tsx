import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';

interface OverviewData {
  totalSales: number;
  ordersCount: number;
  itemsSold: number;
  activeStaff: number;
}

const TodaysOverview = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD.GET_TODAYS_OVERVIEW);
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to load today's overview");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <div className="p-4">Loading todays overview...</div>;
  }

  if (!data) return null;

  return (
    <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <OverviewCard title="Today's Sales" value={`₹ ${data.totalSales}`} />
      <OverviewCard title="Orders Today" value={data.ordersCount} />
      <OverviewCard title="Items Sold" value={data.itemsSold} />
      <OverviewCard title="Active Staff" value={data.activeStaff} />
    </div>
  );
};

const OverviewCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-1 text-2xl font-semibold">{value}</p>
  </div>
);

export default TodaysOverview;
