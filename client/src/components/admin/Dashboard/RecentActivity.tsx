import { useEffect, useState, type JSX } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import Heading from '../../Heading';
import { HandCoins, Package, UserRound, Warehouse } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import type { RecentActivityData } from '../../../types/admin';

type TabType = 'products' | 'stock' | 'sales' | 'staff';

const RecentActivity = () => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [data, setData] = useState<RecentActivityData | null>(null);
  const { loading, setLoading, error, setError } = useAdmin();

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD.GET_RECENT_ACTIVITY);
        setData(res.data.data);
      } catch (err) {
        console.log('Error in fetching recent activity:', err);
        setError('Failed to load recent activity. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  if (loading)
    return (
      <div className="bg-base-200/50 mt-8 animate-pulse rounded-xl p-6 shadow-md">
        <div className="bg-base-300 mb-4 h-8 w-1/3 rounded"></div>
        <div className="bg-base-300 h-64 rounded"></div>
      </div>
    );
  if (error)
    return (
      <div className="bg-base-200/50 mt-8 rounded-xl p-6 shadow-md">
        <p className="text-error text-center">{error}</p>
      </div>
    );
  if (!data) return null;

  return (
    <div className="bg-base-200/50 mt-8 rounded-xl p-6 shadow-md">
      <Heading text1="Recent Activity" text2="Get a quick overview of recent activity" />

      <ActivityTabs active={activeTab} setActive={setActiveTab} />

      <div className="mt-4 space-y-3">
        {activeTab === 'products' &&
          (data.recentProducts.length > 0 ? (
            data.recentProducts.map((item: any) => (
              <ActivityItem
                key={item._id}
                title={item.name}
                subtitle={item.category}
                date={item.createdAt}
                icon={<Package />}
              />
            ))
          ) : (
            <p className="text-center text-lg font-medium text-neutral-500">
              No recent products found
            </p>
          ))}

        {activeTab === 'stock' &&
          (data.recentStockUpdates.length > 0 ? (
            data.recentStockUpdates.map((item: any) => (
              <ActivityItem
                key={item._id}
                title={item.name}
                subtitle={`Stock: ${item.stock}`}
                date={item.updatedAt}
                icon={<Warehouse size={18} />}
              />
            ))
          ) : (
            <p className="text-center text-lg font-medium text-neutral-500">
              No recent stock updates found
            </p>
          ))}

        {activeTab === 'sales' &&
          (data.recentSales.length > 0 ? (
            data.recentSales.map((item: any) => (
              <ActivityItem
                key={item._id}
                title={`Invoice #${item.invoiceNo}`}
                subtitle={`₹ ${item.total}`}
                date={item.createdAt}
                icon={<HandCoins />}
              />
            ))
          ) : (
            <div className="flex min-h-60 items-center justify-center text-lg font-medium text-neutral-500">
              <p>No recent sales found</p>
            </div>
          ))}

        {activeTab === 'staff' &&
          (data.recentStaff.length > 0 ? (
            data.recentStaff.map((item: any) => (
              <ActivityItem
                key={item._id}
                title={item.name}
                subtitle={item.role}
                date={item.createdAt}
                icon={
                  item.avatar ? (
                    <img src={item.avatar} alt="staff avatar" className="size-8 rounded-full" />
                  ) : (
                    <UserRound />
                  )
                }
              />
            ))
          ) : (
            <p className="text-center text-lg font-medium text-neutral-500">
              No recent staff found
            </p>
          ))}
      </div>
    </div>
  );
};

const tabs = [
  { key: 'products', label: 'Products' },
  { key: 'stock', label: 'Stock' },
  { key: 'sales', label: 'Sales' },
  { key: 'staff', label: 'Staff' },
];

const ActivityTabs = ({
  active,
  setActive,
}: {
  active: TabType;
  setActive: (tab: TabType) => void;
}) => (
  <div className="mt-4 flex gap-4">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActive(tab.key as TabType)}
        className={`cursor-pointer pb-0.5 text-sm ${
          active === tab.key
            ? 'text-base-content border-b-2 border-neutral-300 font-medium'
            : 'text-base-content/80'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const ActivityItem = ({
  title,
  subtitle,
  date,
  icon,
}: {
  title: string;
  subtitle: string;
  date: string;
  icon: JSX.Element;
}) => (
  <div className="border-base-300 flex items-center gap-3 border-b pb-2">
    <div className="bg-base-300 rounded-full p-2 text-xl">{icon}</div>

    <div className="flex-1">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>

    <p className="text-xs text-gray-400">{new Date(date).toLocaleDateString()}</p>
  </div>
);

export default RecentActivity;
