import { Document } from "mongoose";

export interface SaleHistoryItem {
  date: string | Date;
  qty: number;
}

export interface SupplierInfo {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
  store?: string;
  metadata?: {
    rating?: number;
    priority?: string;
  };
}

export interface ProductDocument extends Document {
  name: string;
  sku?: string;
  category: string;
  description: string;
  image: string[];

  price: number;
  cost: number;
  unit: string;

  stock: number;
  reorderLevel: number;
  leadTimeDays: number;

  location?: string;
  supplier?: SupplierInfo;

  salesHistory: SaleHistoryItem[];

  avgDailySales: number;
  predictedStockoutDate?: Date;
  recommendedReorderQty?: number;

  store: string;
  isActive: boolean;

  abcClass?: "A" | "B" | "C";
  annualConsumptionValue?: number;

  metadata?: any;
}
