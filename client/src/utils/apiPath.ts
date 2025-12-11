export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN_ADMIN: '/api/auth/login-admin',
    REGISTER_ADMIN: '/api/auth/register-admin',
    LOGIN_STAFF: '/api/auth/login-staff',
    FORGOT_PASSWORD: '/api/auth/:role/forgot-password',
    VERIFY_OTP: '/api/auth/:role/verify-otp',
    RESET_PASSWORD: '/api/auth/:role/reset-password',
  },
  ADMIN: {
    DASHBOARD: {
      GET_CARDS_DATA: '/api/admin/dashboard/cards',
      GET_STOCK_BY_CATEGORY: '/api/admin/dashboard/stock-by-category',
      GET_MONTHLY_SALES_CHART: '/api/admin/dashboard/monthly-sales',
      GET_LOW_STOCK_ALERTS: '/api/admin/dashboard/low-stock',
      GET_RECENT_ACTIVITY: '/api/admin/dashboard/recent-activity',
    },
    PRODUCT: {
      GET_PRODUCTS: '/api/products',
      CREATE_PRODUCT: '/api/products/add-product',
      SEARCH_PRODUCTS: '/api/products/search',
      GET_EACH_PRODUCT(id: string) {
        return `/api/products/${id}`;
      },
    },
  },
};
