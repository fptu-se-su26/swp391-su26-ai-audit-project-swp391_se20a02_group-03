import axiosClient from './axiosClient';

export const orderApi = {
  // Tạo đơn hàng shop từ giỏ (bắt buộc địa chỉ + SĐT)
  checkout: (data) => axiosClient.post('/orders/checkout', data),
  // Đơn của tôi
  myOrders: () => axiosClient.get('/orders/my-orders'),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  // Giả lập thanh toán PayOS ở chế độ mock (demo)
  payosMockConfirm: (id) => axiosClient.post(`/orders/${id}/payos/mock-confirm`),
};
