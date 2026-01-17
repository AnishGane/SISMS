import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPath';
import Heading from '../../Heading';

interface MonthlySales {
  month: string;
  sales: number;
}

export default function MonthlySalesChart() {
  const [chartData, setChartData] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const res = await axiosInstance(API_PATHS.ADMIN.DASHBOARD.GET_MONTHLY_SALES_CHART);
      setChartData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error('Failed to load monthly sales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading chart…</p>;
  }

  return (
    <div className="bg-base-200/50 ring-base-300 relative mt-10 h-[420px] w-full rounded-xl p-4 shadow-md ring-1">
      <Heading text1="Monthly Sales" text2="Get a quick overview of your monthly sales" />
      {chartData.length === 0 ? (
        <p className="absolute top-1/2 left-1/2 text-sm text-gray-500">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #eee',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
