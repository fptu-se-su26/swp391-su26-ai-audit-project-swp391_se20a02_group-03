import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminUsersPage from './AdminUsersPage';
import { userApi } from '../../api/userApi';

// BUG P1-2: effect debounce cũ phụ thuộc cả `page`, nên sau khi bấm "Sau" (Next), ~400ms sau
// page bị set lại về 1 và có thể gọi API 2 lần. Các test dưới đây khoá lại: debounce chỉ áp
// dụng cho search; đổi role reset về trang 1; đổi trang (Next/Prev) giữ nguyên trang đã chọn;
// mỗi thay đổi chỉ tạo đúng 1 request.

vi.mock('../../layouts/AdminLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../../api/userApi', () => ({
  userApi: {
    getUsers: vi.fn(),
    lockUser: vi.fn(),
    unlockUser: vi.fn(),
  },
}));

function pageResult(page, overrides = {}) {
  return {
    statusCode: 200,
    data: {
      items: [{ userId: page, fullName: `User ${page}`, email: `u${page}@test.com`, role: 'Customer', eKycStatus: 'Verified', isLocked: false, createdAt: '2026-01-01' }],
      totalPages: 5,
      totalCount: 50,
      ...overrides,
    },
  };
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  userApi.getUsers.mockImplementation(({ page }) => Promise.resolve(pageResult(page)));
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe('AdminUsersPage — pagination không tự reset về trang 1', () => {
  it('bấm Next giữ nguyên trang đã chọn, kể cả sau khi chờ quá 400ms (không bị debounce reset)', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<AdminUsersPage />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500); // fetch ban đầu (page 1)
    });
    expect(userApi.getUsers).toHaveBeenCalledTimes(1);
    expect(userApi.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }));

    const nextBtn = screen.getByRole('button', { name: /sau/i });
    await user.click(nextBtn);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    // Request cho trang 2 phải được gọi ngay, không cần chờ debounce.
    expect(userApi.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    const callsRightAfterClick = userApi.getUsers.mock.calls.length;

    // Đợi qua mốc 400ms — BUG cũ sẽ set lại page=1 và gọi thêm 1 request nữa tại đây.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(userApi.getUsers).toHaveBeenCalledTimes(callsRightAfterClick); // không có request thừa
    expect(userApi.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })); // vẫn ở trang 2
    expect(screen.getByText('2')).toBeInTheDocument(); // UI hiển thị đúng số trang hiện tại
  });

  it('đổi role reset về trang 1 và chỉ tạo đúng 1 request', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<AdminUsersPage />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Sang trang 2 trước.
    await user.click(screen.getByRole('button', { name: /sau/i }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(userApi.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    const callsBeforeRoleChange = userApi.getUsers.mock.calls.length;

    await user.click(screen.getByRole('button', { name: /nhân sự/i }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Đổi role phải fetch ngay (không chờ debounce) với role=Staff, page reset về 1.
    expect(userApi.getUsers).toHaveBeenCalledTimes(callsBeforeRoleChange + 1);
    expect(userApi.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ role: 'Staff', page: 1 }));
  });

  it('gõ tìm kiếm debounce 400ms rồi mới gọi API đúng 1 lần với search đã nhập, reset về trang 1', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<AdminUsersPage />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    await user.click(screen.getByRole('button', { name: /sau/i }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    const callsBeforeSearch = userApi.getUsers.mock.calls.length;

    // fireEvent.change mô phỏng một lần cập nhật giá trị (gõ nhanh) — chỉ giá trị cuối cùng
    // quan trọng với debounce, tránh nhiễu do userEvent tự advance timer theo từng ký tự.
    const input = screen.getByPlaceholderText(/tìm theo tên hoặc email/i);
    fireEvent.change(input, { target: { value: 'nguyen' } });

    // Chưa quá 400ms kể từ lúc gõ xong -> chưa gọi API mới.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    expect(userApi.getUsers).toHaveBeenCalledTimes(callsBeforeSearch);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300); // vượt mốc 400ms kể từ ký tự cuối
    });

    expect(userApi.getUsers).toHaveBeenCalledTimes(callsBeforeSearch + 1); // đúng 1 request mới
    expect(userApi.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'nguyen', page: 1 }));
  });
});
