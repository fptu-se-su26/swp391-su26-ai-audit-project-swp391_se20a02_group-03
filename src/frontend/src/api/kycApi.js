import axiosClient from './axiosClient';

// Phê duyệt E-KYC (Admin). Backend: KycController (/api/kyc).
export const kycApi = {
  // status: Pending | Approved | Rejected ('' = tất cả)
  getAll: (status = '') => axiosClient.get('/kyc', { params: status ? { status } : {} }),
  getById: (id) => axiosClient.get(`/kyc/${id}`),
  approve: (id) => axiosClient.put(`/kyc/${id}/approve`),
  reject: (id, reason) => axiosClient.put(`/kyc/${id}/reject`, { reason }),
};

export default kycApi;
