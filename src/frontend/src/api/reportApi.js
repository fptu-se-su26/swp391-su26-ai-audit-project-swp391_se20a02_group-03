import axiosClient from './axiosClient';

// Khiếu nại / báo cáo người chơi. Backend: ReportController (/api/reports).
export const reportApi = {
  // Khách gửi khiếu nại
  createReport: (data) => axiosClient.post('/reports', data),

  // Khiếu nại của chính mình
  getMyReports: () => axiosClient.get('/reports/my-reports'),

  // (Admin/Staff) Toàn bộ khiếu nại, lọc theo status (Pending/Investigating/Resolved/Rejected)
  getAll: (status = '') => axiosClient.get('/reports', { params: status ? { status } : {} }),

  // (Admin/Staff) Xử lý khiếu nại
  resolve: (id, data) => axiosClient.put(`/reports/${id}/resolve`, data),
};

export default reportApi;
