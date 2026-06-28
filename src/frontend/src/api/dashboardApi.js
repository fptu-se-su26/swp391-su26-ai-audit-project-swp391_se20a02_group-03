import axiosClient from './axiosClient';

// Số liệu tổng quan Admin. Backend: DashboardController (/api/dashboard).
export const dashboardApi = {
  getStats: () => axiosClient.get('/dashboard/stats'),
};

export default dashboardApi;
