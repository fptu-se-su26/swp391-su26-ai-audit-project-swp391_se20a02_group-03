import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5138/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for API request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      const requestUrl = error.config?.url || '';
      const isProfileProbe = requestUrl.includes('/auth/me');
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/register', '/reset-password'];
      const isAuthPage = authPaths.some(p => currentPath.includes(p));
      // Không redirect khi chỉ probe profile (token hết hạn trên trang public như /gear/catalog)
      if (!isAuthPage && !isProfileProbe) {
        window.location.href = `${window.location.origin}${(import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')}/login`;
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
