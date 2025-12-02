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
}