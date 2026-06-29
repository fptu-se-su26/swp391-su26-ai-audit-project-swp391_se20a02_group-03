import axiosClient from './axiosClient';

// TK-035: API đánh giá người chơi + Trust Score. Backend: RatingController (/api/ratings).
export const ratingApi = {
  // Gửi đánh giá người chơi sau trận (yêu cầu đăng nhập).
  createRating: (data) => axiosClient.post('/ratings', data),

  // Lấy điểm uy tín (Trust Score) của một người chơi (public).
  getTrustScore: (userId) => axiosClient.get(`/ratings/trust-score/${userId}`),

  // Bảng xếp hạng người chơi theo Trust Score.
  getLeaderboard: (limit = 20) => axiosClient.get('/ratings/leaderboard', { params: { limit } }),
};

export default ratingApi;
