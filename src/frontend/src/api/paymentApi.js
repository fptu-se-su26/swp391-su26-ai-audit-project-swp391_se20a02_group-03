import axiosClient from './axiosClient';

export const paymentApi = {
  // Khởi tạo thanh toán PayOS — use params object for safe URL encoding
  createPayOsUrl: (amount, orderType, referenceId) => 
    axiosClient.post('/payment/payos/create-url', null, { params: { amount, orderType, referenceId } }),

  // Lấy thông tin ví Escrow của user
  getEscrowWallet: () => axiosClient.get('/escrow/my-wallet'),

  // Lấy lịch sử giao dịch ví Escrow
  getMyTransactions: () => axiosClient.get('/escrow/my-transactions'),

  // Thanh toán Booking bằng ví Escrow
  payBookingByEscrow: (bookingId) => axiosClient.post(`/escrow/pay-booking/${bookingId}`),

  // Liên kết tài khoản ngân hàng / ví
  linkAccount: (provider, accountNumber, accountName) => 
    axiosClient.post('/escrow/link-account', { provider, accountNumber, accountName }),

  // Rút tiền từ ví
  withdrawEscrow: (amount) => 
    axiosClient.post('/escrow/withdraw', { amount }),
    
  // Nạp tiền mock (Dùng cho môi trường dev)
  depositMock: (amount) =>
    axiosClient.post('/escrow/deposit-mock', null, { params: { amount } }),
};
