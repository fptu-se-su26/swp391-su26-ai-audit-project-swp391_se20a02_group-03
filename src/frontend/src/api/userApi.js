import axiosClient from './axiosClient';

// TK-010: API quản lý người dùng (chỉ Admin). Backend: UserController (/api/users).
export const userApi = {
  // Danh sách người dùng (phân trang + lọc theo từ khóa/role).
  // `signal` (AbortController) cho phép caller huỷ request cũ khi filter đổi nhanh (race condition).
  getUsers: ({ search = '', role = '', page = 1, pageSize = 10, signal } = {}) =>
    axiosClient.get('/users', { params: { search, role, page, pageSize }, signal }),

  // Khóa tài khoản (Ban).
  lockUser: (id) => axiosClient.put(`/users/${id}/lock`),

  // Mở khóa tài khoản (Unban).
  unlockUser: (id) => axiosClient.put(`/users/${id}/unlock`),
};

export default userApi;
