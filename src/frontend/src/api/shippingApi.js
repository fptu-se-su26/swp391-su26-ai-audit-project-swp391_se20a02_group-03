import axiosClient from './axiosClient';

export const shippingApi = {
  provinces: () => axiosClient.get('/shipping/provinces'),
  districts: (provinceId) => axiosClient.get('/shipping/districts', { params: { provinceId } }),
  wards: (districtId) => axiosClient.get('/shipping/wards', { params: { districtId } }),
  fee: (districtId, wardCode) => axiosClient.post('/shipping/fee', { districtId, wardCode, weightGrams: 1000 }),
};
