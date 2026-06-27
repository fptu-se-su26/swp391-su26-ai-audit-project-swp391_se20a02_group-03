import axiosClient from './axiosClient';

// Voucher giảm giá. Backend: VoucherController (/api/vouchers).
export const voucherApi = {
  // (Admin/Staff) Toàn bộ voucher
  getAll: () => axiosClient.get('/vouchers'),

  // (Public) Voucher đang hiệu lực
  getActive: () => axiosClient.get('/vouchers/active'),

  getById: (id) => axiosClient.get(`/vouchers/${id}`),

  create: (data) => axiosClient.post('/vouchers', data),

  update: (id, data) => axiosClient.put(`/vouchers/${id}`, data),

  remove: (id) => axiosClient.delete(`/vouchers/${id}`),
};

export default voucherApi;
