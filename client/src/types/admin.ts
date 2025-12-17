export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText: string;
  action: () => Promise<void>;
}

export interface AdminContextType {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  avatarUrl: string;

  confirmConfig: ConfirmConfig | null;

  setConfirmConfig: React.Dispatch<React.SetStateAction<ConfirmConfig | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  stockCategoryData: StockCategory[];
  fetchDashboardData: () => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DashboardData {
  staffCount: number;
  productCount: number;
  lowStockCount: number;
  totalRevenue: number;
  monthlySales: number;
}

export interface StockCategory {
  category: string;
  stock: number;
}
