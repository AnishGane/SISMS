import axios from 'axios';
import { BASE_URL } from './apiPath';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error globally
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to Login Page
        window.location.href = '/login';
      } else if (error.response.status === 500) {
        alert('500 says: ' + error.response.data.message);
      }
    } else if (error.code === 'ECONNABORTED') {
      alert('Request timed out. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;