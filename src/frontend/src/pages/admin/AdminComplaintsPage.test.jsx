import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminComplaintsPage from './AdminComplaintsPage';
import { reportApi } from '../../api/reportApi';

// BUG: đổi filter không bỏ chọn khiếu nại đang xem, dù khiếu nại đó không còn nằm trong danh
// sách đã lọc -> panel chi tiết hiển thị "lơ lửng" một item người dùng không còn thấy trong
// danh sách bên trái, dễ gây hiểu nhầm hoặc thao tác nhầm trạng thái.

vi.mock('../../layouts/AdminLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../../api/reportApi', () => ({
  reportApi: {
    getAll: vi.fn(),
    resolve: vi.fn(),
  },
}));

const REPORTS = [
  { reportId: 1, status: 'Pending', reason: 'Bùng kèo', reporterId: 10, reportedUserId: 20, matchId: 5, createdAt: '2026-01-01' },
  { reportId: 2, status: 'Resolved', reason: 'Gian lận', reporterId: 11, reportedUserId: 21, matchId: 6, createdAt: '2026-01-02' },
];

beforeEach(() => {
  reportApi.getAll.mockResolvedValue({ statusCode: 200, data: REPORTS });
});

describe('AdminComplaintsPage — không giữ lựa chọn lơ lửng sau khi đổi filter', () => {
  it('bỏ chọn khiếu nại đang xem nếu nó không còn nằm trong danh sách sau khi đổi filter', async () => {
    const user = userEvent.setup();
    render(<AdminComplaintsPage />);

    await waitFor(() => expect(screen.getByText(/Bùng kèo/)).toBeInTheDocument());

    await user.click(screen.getByText(/Bùng kèo/));
    expect(await screen.findByText(/Kèo liên quan/)).toBeInTheDocument();

    // Lọc sang "Đã xử lý" — khiếu nại #1 (Pending) đang chọn không còn nằm trong danh sách này.
    await user.click(screen.getByRole('button', { name: /^đã xử lý$/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Kèo liên quan/)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Chọn một khiếu nại để xem chi tiết/)).toBeInTheDocument();
  });

  it('giữ nguyên lựa chọn nếu khiếu nại đang xem vẫn còn trong danh sách sau khi đổi filter', async () => {
    const user = userEvent.setup();
    render(<AdminComplaintsPage />);

    await waitFor(() => expect(screen.getByText(/Gian lận/)).toBeInTheDocument());
    await user.click(screen.getByText(/Gian lận/));
    expect(await screen.findByText(/Kèo liên quan/)).toBeInTheDocument();

    // Lọc sang "Đã xử lý" — khiếu nại #2 (Resolved) vẫn còn trong danh sách này.
    await user.click(screen.getByRole('button', { name: /^đã xử lý$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Kèo liên quan/)).toBeInTheDocument();
    });
  });
});
