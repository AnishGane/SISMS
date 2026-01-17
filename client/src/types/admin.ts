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
  storeCurrency: string;
  stockCategoryData: StockCategory[];
  confirmConfig: ConfirmConfig | null;

  setConfirmConfig: React.Dispatch<React.SetStateAction<ConfirmConfig | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setStoreCurrency: React.Dispatch<React.SetStateAction<string>>;
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

export interface RecentActivityData {
  recentProducts: Array<{ _id: string; name: string; category: string; createdAt: string }>;
  recentStockUpdates: Array<{ _id: string; name: string; stock: number; updatedAt: string }>;
  recentSales: Array<{ _id: string; invoiceNo: string; total: number; createdAt: string }>;
  recentStaff: Array<{
    _id: string;
    name: string;
    role: string;
    createdAt: string;
    avatar?: string;
  }>;
}

export type ObjectId = string;

export interface StaffRef {
  _id: ObjectId;
  name?: string;
}

export interface Sale {
  _id?: ObjectId; // may not exist (embedded doc)
  orderId?: ObjectId;
  productId: ObjectId;
  productName: string;
  category?: string;

  qty: number;
  price: number;
  discount?: number;
  tax?: number;
  total: number;

  soldBy?: ObjectId | StaffRef;
  store: ObjectId;

  date: string; // ISO string from API
  isReturned?: boolean;
  returnDate?: string;
  returnReason?: string;
}
