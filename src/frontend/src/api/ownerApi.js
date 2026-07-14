import axiosClient from './axiosClient';
import axios from 'axios';
import { getAuthToken } from '../utils/authStorage';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5138/api';

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const ownerApi = {
  getContext: () => axiosClient.get('/owner/context'),
  getComplexes: () => axiosClient.get('/owner/complexes'),
  getComplex: (id) => axiosClient.get(`/owner/complexes/${id}`),
  updateComplex: (id, data) => axiosClient.put(`/owner/complexes/${id}`, data),
  getOperatingHours: (complexId) => axiosClient.get(`/owner/complexes/${complexId}/operating-hours`),
  saveOperatingHours: (complexId, data) => axiosClient.put(`/owner/complexes/${complexId}/operating-hours`, data),
  getCancellationPolicy: (complexId) => axiosClient.get(`/owner/complexes/${complexId}/cancellation-policy`),
  saveCancellationPolicy: (complexId, data) => axiosClient.put(`/owner/complexes/${complexId}/cancellation-policy`, data),

  getDashboard: (complexId, from, to) =>
    axiosClient.get('/owner/dashboard', { params: { complexId, from, to } }),

  getCourts: (complexId, params = {}) =>
    axiosClient.get('/owner/courts', { params: { complexId, ...params } }),
  getCourt: (id) => axiosClient.get(`/owner/courts/${id}`),
  createCourt: (data) => axiosClient.post('/owner/courts', data),
  updateCourt: (id, data) => axiosClient.put(`/owner/courts/${id}`, data),
  updateCourtStatus: (id, status) => axiosClient.patch(`/owner/courts/${id}/status`, { status }),
  deleteCourt: (id) => axiosClient.delete(`/owner/courts/${id}`),

  getPricingRules: (complexId, courtId) =>
    axiosClient.get('/owner/pricing-rules', { params: { complexId, courtId } }),
  createPricingRule: (courtId, data) =>
    axiosClient.post('/owner/pricing-rules', data, { params: { courtId } }),
  updatePricingRule: (courtId, ruleId, data) =>
    axiosClient.put(`/owner/pricing-rules/${ruleId}`, data, { params: { courtId } }),
  deletePricingRule: (courtId, ruleId) =>
    axiosClient.delete(`/owner/pricing-rules/${ruleId}`, { params: { courtId } }),

  getBookings: (params) => axiosClient.get('/owner/bookings', { params }),
  getCalendarBookings: (params) => axiosClient.get('/owner/bookings/calendar', { params }),
  getBooking: (id) => axiosClient.get(`/owner/bookings/${id}`),
  createWalkIn: (data) => axiosClient.post('/owner/bookings/walk-in', data),
  checkInBooking: (id, checkInCode) => axiosClient.post(`/owner/bookings/${id}/check-in`, { checkInCode }),
  cancelBooking: (id) => axiosClient.put(`/owner/bookings/${id}/cancel`),
  updateBookingStatus: (id, status) => axiosClient.patch(`/owner/bookings/${id}/status`, { status }),

  getStaff: (complexId) => axiosClient.get('/owner/staff', { params: { complexId } }),
  inviteStaff: (data) => axiosClient.post('/owner/staff/invitations', data),
  updateStaffPermissions: (id, complexId, data) =>
    axiosClient.patch(`/owner/staff/${id}/permissions`, data, { params: { complexId } }),
  updateStaffStatus: (id, complexId, data) =>
    axiosClient.patch(`/owner/staff/${id}/status`, data, { params: { complexId } }),
  removeStaff: (id, complexId) =>
    axiosClient.delete(`/owner/staff/${id}/assignment`, { params: { complexId } }),

  getProducts: (complexId, params = {}) =>
    axiosClient.get('/owner/inventory/products', { params: { complexId, ...params } }),
  createProduct: (data) => axiosClient.post('/owner/inventory/products', data),
  updateProduct: (id, complexId, data) =>
    axiosClient.put(`/owner/inventory/products/${id}`, data, { params: { complexId } }),

  getVouchers: (complexId) => axiosClient.get('/owner/vouchers', { params: { complexId } }),
  createVoucher: (complexId, data) =>
    axiosClient.post('/owner/vouchers', data, { params: { complexId } }),
  updateVoucher: (id, complexId, data) =>
    axiosClient.put(`/owner/vouchers/${id}`, data, { params: { complexId } }),
  updateVoucherStatus: (id, complexId, data) =>
    axiosClient.patch(`/owner/vouchers/${id}/status`, data, { params: { complexId } }),

  getRevenueReport: (complexId, from, to) =>
    axiosClient.get('/owner/reports/revenue', { params: { complexId, from, to } }),
  getOccupancyReport: (complexId, from, to) =>
    axiosClient.get('/owner/reports/occupancy', { params: { complexId, from, to } }),
  getInventoryReport: (complexId) =>
    axiosClient.get('/owner/reports/inventory', { params: { complexId } }),
  exportReport: async (complexId, from, to) => {
    const res = await axios.get(`${apiBase}/owner/reports/export`, {
      params: { complexId, from, to },
      responseType: 'blob',
      headers: authHeaders(),
      validateStatus: () => true,
    });
    if (res.status !== 200) {
      let msg = 'Xuất báo cáo thất bại';
      try {
        const text = await res.data.text();
        const json = JSON.parse(text);
        msg = json.message || msg;
      } catch { /* blob is not JSON */ }
      throw msg;
    }
    return res.data;
  },

  getReviews: (complexId) => axiosClient.get('/owner/reviews', { params: { complexId } }),
  replyReview: (id, complexId, data) =>
    axiosClient.post(`/owner/reviews/${id}/reply`, data, { params: { complexId } }),
  reportReview: (id, complexId, data) =>
    axiosClient.post(`/owner/reviews/${id}/report`, data, { params: { complexId } }),

  getAuditLogs: (params) => axiosClient.get('/owner/audit-logs', { params }),

  getMemberships: (complexId) => axiosClient.get('/owner/memberships', { params: { complexId } }),
  createMembership: (complexId, data) => axiosClient.post('/owner/memberships', data, { params: { complexId } }),
  updateMembershipStatus: (membershipId, complexId, status) =>
    axiosClient.patch(`/owner/memberships/${membershipId}/status`, { status }, { params: { complexId } }),
};
