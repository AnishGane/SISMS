import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import type { Sale } from '../../types/admin';
import AdminLayout from '../../layouts/AdminLayout';

const AdminSalesHistory = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/api/admin/sales/sales-history');
        const data = res.data.data;
        setSalesData(data);
      } catch(error){
        console.log("Admin Sales Error: " + error);
      }finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  if (loading) return <p>Loading sales…</p>;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl">Sales History</h1>
        <p className="text-[13px] text-gray-500">Checkout your sales history</p>
        {salesData.length === 0 && <p>No sales found.</p>}
        <div className="grid grid-cols-1 gap-4">
          {salesData.map((sale, idx) => {
            const soldByName =
              typeof sale.soldBy === 'object'
                ? (sale.soldBy.name ?? 'Unknown')
                : (sale.soldBy ?? 'Unknown');

            return (
              <div
                key={sale._id ?? `${sale.productId}-${idx}`}
                className="bg-base-100 rounded-lg border p-4"
              >
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{sale.productName}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(sale.date).toLocaleString()}
                  </span>
                </div>

                {/* Identifiers */}
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Product ID:</strong>{' '}
                    <span className="font-mono break-all">{sale.productId}</span>
                  </p>

                  {sale.orderId && (
                    <p>
                      <strong>Order ID:</strong>{' '}
                      <span className="font-mono break-all">{sale.orderId}</span>
                    </p>
                  )}

                  {sale.category && (
                    <p>
                      <strong>Category:</strong> {sale.category}
                    </p>
                  )}
                </div>

                {/* Sale details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <strong>Qty:</strong> {sale.qty}
                  </p>
                  <p>
                    <strong>Unit Price:</strong> {sale.price}
                  </p>

                  {sale.discount !== undefined && (
                    <p>
                      <strong>Discount:</strong> {sale.discount}
                    </p>
                  )}

                  {sale.tax !== undefined && (
                    <p>
                      <strong>Tax:</strong> {sale.tax}
                    </p>
                  )}

                  <p className="col-span-2">
                    <strong>Total:</strong> <span className="font-semibold">{sale.total}</span>
                  </p>
                </div>

                {/* Staff & status */}
                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <strong>Sold By:</strong> {soldByName}
                  </p>

                  {sale.isReturned && (
                    <div className="mt-2 rounded bg-red-50 p-2 text-red-600">
                      <p>
                        <strong>Status:</strong> Returned
                      </p>

                      {sale.returnDate && (
                        <p>
                          <strong>Return Date:</strong>{' '}
                          {new Date(sale.returnDate).toLocaleDateString()}
                        </p>
                      )}

                      {sale.returnReason && (
                        <p>
                          <strong>Reason:</strong> {sale.returnReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSalesHistory;
