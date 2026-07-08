import axios from 'axios';
import { clearAuthStorage, getAuthToken } from '../utils/authStorage';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5138/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for API request
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for API response
axiosClient.interceptors.response.use(
  (response) => {
    // Return response.data (the backend envelope: { statusCode, data, message })
    // All consumers should access .data for the payload, .message for errors
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized globally — clear tokens AND redirect to login
    if (error.response && error.response.status === 401) {
      clearAuthStorage();
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      const requestUrl = error.config?.url || '';
      const isProfileProbe = requestUrl.includes('/auth/me');
      const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
      const currentPath = window.location.pathname;
      // Chỉ redirect khi đang đứng trong khu vực bắt buộc đăng nhập —
      // khách xem trang public (/, /about, /gear/catalog…) chỉ bị xoá token, không bị đá về /login
      const protectedPrefixes = [
        '/admin', '/owner', '/elite', '/dashboard', '/apex', '/customer',
        '/gear/cart', '/matches/create', '/complete-profile',
        '/mobile/dashboard', '/mobile/wallet', '/mobile/profile', '/mobile/booking', '/mobile/scanner',
      ];
      const needsAuth = protectedPrefixes.some(p => currentPath.startsWith(`${base}${p}`));
      if (needsAuth && !isProfileProbe) {
        window.location.href = `${window.location.origin}${base}/login`;
      }
    }
    // Return structured error message if available
    const errorMessage = error.response?.data?.message
      || (error.message === 'Network Error' ? 'Không kết nối được máy chủ. Kiểm tra backend đang chạy.' : error.message)
      || 'Đã xảy ra lỗi không mong muốn';
    return Promise.reject(errorMessage);
  }
);

export default axiosClient;
