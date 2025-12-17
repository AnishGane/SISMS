import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CustomTooltip from '../../ui/CustomTooltip';
import Heading from '../../Heading';
import { useAdmin } from '../../../context/AdminContext';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#8B5CF6'];

export default function StockByCategoryChart() {
  const { stockCategoryData, loading } = useAdmin();

  if (loading) return <StockByCategorySkeleton />;

  return (
    <div className="bg-base-200/50 mt-10 space-y-4 rounded-xl p-6 shadow-md">
      <Heading text1="Summary" text2="Get a quick overview" />

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={stockCategoryData}
            margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={65} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="stock" radius={[0, 8, 8, 0]}>
              {stockCategoryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StockByCategorySkeleton() {
  return (
    <div className="bg-base-200 h-80 animate-pulse rounded-xl p-6 shadow">
      <div className="bg-base-300 mb-4 h-6 w-40 rounded"></div>
      <div className="bg-base-300 h-full w-full rounded"></div>
      <div className="bg-base-300 h-full w-full rounded"></div>
      <div className="bg-base-300 h-full w-full rounded"></div>
    </div>
  );
}
