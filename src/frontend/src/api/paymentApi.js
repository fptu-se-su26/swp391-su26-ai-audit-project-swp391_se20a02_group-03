import axiosClient from './axiosClient';

export const paymentApi = {
  // Khởi tạo thanh toán VNPay — use params object for safe URL encoding
  createVnPayUrl: (amount, orderType, referenceId) => 
    axiosClient.post('/payment/vnpay/create-url', null, { params: { amount, orderType, referenceId } }),

  // Lấy thông tin ví Escrow của user
  getEscrowWallet: () => axiosClient.get('/escrow/my-wallet'),

  // Lấy lịch sử giao dịch ví Escrow
  getMyTransactions: () => axiosClient.get('/escrow/my-transactions'),

  // Thanh toán Booking bằng ví Escrow
  payBookingByEscrow: (bookingId) => axiosClient.post(`/escrow/pay-booking/${bookingId}`),
};
