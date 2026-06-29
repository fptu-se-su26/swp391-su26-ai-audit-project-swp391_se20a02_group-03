import axiosClient from './axiosClient';

export const equipmentApi = {
  // Lấy danh sách thiết bị
  getAll: () => axiosClient.get('/equipment'),

  // Lấy chi tiết thiết bị
  getById: (id) => axiosClient.get(`/equipment/${id}`),

  // Mua thiết bị
  buy: (data) => axiosClient.post('/equipment/buy', data),

  // Dashboard stats
  getDashboard: () => axiosClient.get('/equipment/dashboard'),

  // Staff cho thuê / trả tại quầy
  getRentals: (status) => axiosClient.get('/equipment/rentals', { params: status ? { status } : {} }),
  rentAtCounter: (data) => axiosClient.post('/equipment/rent', data),
  returnRental: (detailId, data) => axiosClient.post(`/equipment/rentals/${detailId}/return`, data),
};
