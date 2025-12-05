import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export interface StockCategory {
  category: string;
  stock: number;
}

export const useStockByCategory = () => {
  const [data, setData] = useState<StockCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD.GET_STOCK_BY_CATEGORY);
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading };
};
