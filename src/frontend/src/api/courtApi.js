import axiosClient from './axiosClient';

// Quản lý sân + bảng giá. Backend: CourtController (/api/courts).
export const courtApi = {
  // Danh sách sân (phân trang + lọc).
  getAll: ({ pageNumber = 1, pageSize = 50, searchTerm = '', status = '' } = {}) =>
    axiosClient.get('/courts', { params: { pageNumber, pageSize, searchTerm, status } }),

  getById: (id) => axiosClient.get(`/courts/${id}`),

  // CRUD (Admin).
  create: (data) => axiosClient.post('/courts', data),
  update: (id, data) => axiosClient.put(`/courts/${id}`, data),
  remove: (id) => axiosClient.delete(`/courts/${id}`),

  // Bảng giá theo sân.
  getPricingRules: (id) => axiosClient.get(`/courts/${id}/pricing-rules`),
  createPricingRule: (id, data) => axiosClient.post(`/courts/${id}/pricing-rules`, data),
  deletePricingRule: (id, ruleId) => axiosClient.delete(`/courts/${id}/pricing-rules/${ruleId}`),
};

export default courtApi;
