import axiosClient from './axiosClient';

export const matchApi = {
  // Xem danh sách kèo đang mở
  getOpenMatches: () => axiosClient.get('/matches/open'),

  // Lịch sử kèo cá nhân
  getMyMatchHistory: () => axiosClient.get('/matches/my-history'),

  // Xem chi tiết kèo
  getMatchById: (id) => axiosClient.get(`/matches/${id}`),

  // Danh sách thành viên đã duyệt (host + joiner) — dùng để hiển thị/đánh giá uy tín (TK-035).
  // Khác getPendingJoiners (chỉ host, dùng để duyệt yêu cầu tham gia đang chờ).
  getMatchMembers: (id) => axiosClient.get(`/matches/${id}/members`),

  // Tạo kèo mới
  createMatch: (data) => axiosClient.post('/matches', data),

  // Xin tham gia kèo
  joinMatch: (id) => axiosClient.post(`/matches/${id}/join`),

  // Host xem danh sách người xin tham gia (mặc định status=Pending)
  getPendingJoiners: (id, status = 'Pending') => axiosClient.get(`/matches/${id}/participants`, { params: { status } }),

  // Host duyệt người tham gia
  approveJoiner: (id, participantId) => axiosClient.put(`/matches/${id}/participants/${participantId}/approve`),

  // Host từ chối người tham gia
  rejectJoiner: (id, participantId) => axiosClient.put(`/matches/${id}/participants/${participantId}/reject`),

  // Hủy kèo (chỉ dành cho Host trước giờ hoặc Admin)
  cancelMatch: (id) => axiosClient.post(`/matches/${id}/cancel`),

  // Rời kèo (Joiner xin rút)
  leaveMatch: (id) => axiosClient.post(`/matches/${id}/leave`),
};
