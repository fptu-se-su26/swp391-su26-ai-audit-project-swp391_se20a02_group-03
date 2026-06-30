import axiosClient from './axiosClient';

// Số liệu tổng quan Dashboard. Backend: DashboardController (/api/dashboard).
export const dashboardApi = {
  getStats: () => axiosClient.get('/dashboard/stats'),
  getEliteStats: () => axiosClient.get('/dashboard/elite-stats'),
  getSchedule: (date, sport) => axiosClient.get('/dashboard/schedule', { params: { date, sport } }),
  getStaffOverview: () => axiosClient.get('/dashboard/staff-overview'),
};

export default dashboardApi;
