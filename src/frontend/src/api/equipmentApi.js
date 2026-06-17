import axiosClient from './axiosClient';

export const equipmentApi = {
  // Lấy danh sách thiết bị
  getAll: () => axiosClient.get('/equipment'),

  // Lấy chi tiết thiết bị
  getById: (id) => axiosClient.get(`/equipment/${id}`),

  // Thuê thiết bị
  rent: (data) => axiosClient.post('/equipment/rent', data),

  // Trả thiết bị
  return: (data) => axiosClient.post('/equipment/return', data),

  // Lấy lịch sử thuê của user
  getMyRentals: () => axiosClient.get('/equipment/my-rentals'),

  // Staff: danh sách đơn chờ kiểm định trả đồ
  getPendingReturns: () => axiosClient.get('/equipment/returns/pending'),

  // Staff: kiểm định tình trạng & xử lý cọc
  inspectReturn: (rentalId, data) => axiosClient.put(`/equipment/return/${rentalId}/inspect`, data),
};
