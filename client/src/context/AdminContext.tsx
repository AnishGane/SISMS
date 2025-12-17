import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export interface DashboardData {
  staffCount: number;
  productCount: number;
  lowStockCount: number;
  totalRevenue: number;
  monthlySales: number;
}

interface StockCategory {
  category: string;
  stock: number;
}

interface AdminContextType {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  avatarUrl: string;
  stockCategoryData: StockCategory[];
  fetchDashboardData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [stockCategoryData, setStockCategoryData] = useState<StockCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const avatarUrl = JSON.parse(localStorage.getItem('user') || '{}').avatar;

  // To fetch dashboard data for Summary cards
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD.GET_CARDS_DATA);
      //   console.log('Dashboard Data:', response);
      setDashboardData(response.data.data);
    } catch (err: any) {
      //   console.error('Fetch Error:', err);
      setError(err?.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStockCategoryData = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD.GET_STOCK_BY_CATEGORY);
      setStockCategoryData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchStockCategoryData();
  }, []);

  return (
    <AdminContext.Provider
      value={{ dashboardData, stockCategoryData, avatarUrl, loading, error, fetchDashboardData }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook for consuming context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
