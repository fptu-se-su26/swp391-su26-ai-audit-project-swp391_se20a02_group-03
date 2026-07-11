import axiosClient from './axiosClient';

// E-KYC. Backend: KycController (/api/kyc) + UploadController (/api/upload/image).
export const kycApi = {
  // ---- Admin (AdminKycPage) ----
  // status: Pending | Approved | Rejected ('' = tất cả)
  getAll: (status = '') => axiosClient.get('/kyc', { params: status ? { status } : {} }),
  getById: (id) => axiosClient.get(`/kyc/${id}`),
  approve: (id) => axiosClient.put(`/kyc/${id}/approve`),
  reject: (id, reason) => axiosClient.put(`/kyc/${id}/reject`, { reason }),

  // ---- Customer (TK-004) ----
  // Trạng thái hồ sơ của chính mình (404 = chưa nộp)
  getMine: () => axiosClient.get('/kyc/me'),
  // data: { fullName, identityNumber, frontImageUrl, backImageUrl, faceImageUrl? }
  submit: (data) => axiosClient.post('/kyc/submit', data),

  // Upload 1 ảnh CCCD → trả về { url }. Backend giới hạn 5MB, jpg/png/webp.
  uploadImage: (file, folder = 'ekyc') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return axiosClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default kycApi;
