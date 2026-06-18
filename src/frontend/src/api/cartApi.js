import axiosClient from './axiosClient';

export const cartApi = {
  // Lấy giỏ hàng
  getCart: () => axiosClient.get('/equipment/cart'),

  // Thêm vào giỏ
  addToCart: (data) => axiosClient.post('/equipment/cart/add', data),

  // Cập nhật số lượng
  updateQuantity: (cartItemId, quantity) => 
    axiosClient.put(`/equipment/cart/items/${cartItemId}`, { quantity }),

  // Xóa khỏi giỏ
  removeItem: (cartItemId) => 
    axiosClient.delete(`/equipment/cart/items/${cartItemId}`),

  // Xóa toàn bộ giỏ
  clearCart: () => axiosClient.delete('/equipment/cart'),

  // Thanh toán
  checkout: (data) => axiosClient.post('/equipment/checkout', data),
};
