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
      sessionStorage.removeItem('token');
      // Only redirect if not already on auth pages to avoid redirect loops
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/register', '/reset-password'];
      const isAuthPage = authPaths.some(p => currentPath.includes(p));
      if (!isAuthPage) {
        window.location.href = window.location.origin + window.location.pathname.split('/').slice(0, 2).join('/') + '/login';
      }
    }
    // Return structured error message if available
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(errorMessage);
  }
);

export default axiosClient;
