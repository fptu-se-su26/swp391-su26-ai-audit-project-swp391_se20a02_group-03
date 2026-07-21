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

  // Xóa thiết bị (Admin) — soft delete, thiết bị biến mất khỏi mọi danh sách GET sau đó
  delete: (id) => axiosClient.delete(`/equipment/${id}`),

  // Tạo thiết bị mới (Admin)
  create: (data) => axiosClient.post('/equipment', data),

  // Danh mục thiết bị (Racket/Footwear/Apparel/...) — dùng cho dropdown khi tạo/sửa
  getCategories: () => axiosClient.get('/equipment-categories'),
};
