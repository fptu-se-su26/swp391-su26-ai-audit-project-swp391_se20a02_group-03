import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdminUsersPage from './AdminUsersPage';
import { MemoryRouter } from 'react-router-dom';
import { userApi } from '../../api/userApi';

vi.mock('../../api/userApi', () => ({
  userApi: {
    getUsers: vi.fn(),
    lockUser: vi.fn(),
    unlockUser: vi.fn(),
  },
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'Admin' } })
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));
vi.mock('../../components/ui/ConfirmDialog', () => ({
  useConfirm: () => vi.fn().mockResolvedValue(true),
}));

describe('AdminUsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gọi API phân trang và tìm kiếm đúng debounce', async () => {
    userApi.getUsers.mockResolvedValue({
      statusCode: 200,
      data: {
        items: [
          { userId: 1, email: 'test@example.com', roleName: 'Customer', isLocked: false, kycStatus: 'Verified', createdAt: new Date().toISOString() },
        ],
        totalPages: 5,
        totalCount: 50,
      },
    });

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    );

    // Initial render fetches page 1
    await waitFor(() => {
      expect(userApi.getUsers).toHaveBeenCalledTimes(1);
    });

    const searchInput = screen.getByPlaceholderText('Tìm theo tên hoặc email...');

    // Simulate user typing
    fireEvent.change(searchInput, { target: { value: 'john' } });

    // Timer hasn't fired yet, should not call API again
    expect(userApi.getUsers).toHaveBeenCalledTimes(1);

    // Advance timer by 450ms
    await act(async () => {
      await new Promise(r => setTimeout(r, 450));
    });

    await waitFor(() => {
      // Called 2nd time after debounce
      expect(userApi.getUsers).toHaveBeenCalledTimes(2);
      expect(userApi.getUsers.mock.calls[1][0].search).toBe('john');
      expect(userApi.getUsers.mock.calls[1][0].page).toBe(1);
    });

    // Go to next page
    const nextBtn = screen.getByLabelText('Trang sau');
    fireEvent.click(nextBtn);

    await waitFor(() => {
      // Called 3rd time for page 2
      expect(userApi.getUsers).toHaveBeenCalledTimes(3);
      expect(userApi.getUsers.mock.calls[2][0].page).toBe(2);
    });

    // Wait and advance timer to make sure page doesn't reset to 1 due to old bug
    await act(async () => {
      await new Promise(r => setTimeout(r, 1000));
    });

    // Should NOT call API again, shouldn't reset to page 1
    expect(userApi.getUsers).toHaveBeenCalledTimes(3);
  });

  it('bỏ qua request tìm kiếm đã bị hủy và chỉ hiển thị kết quả mới nhất', async () => {
    let rejectStale
    let resolveLatest
    const staleRequest = new Promise((_, reject) => { rejectStale = reject })
    const latestRequest = new Promise(resolve => { resolveLatest = resolve })

    userApi.getUsers
      .mockResolvedValueOnce({
        statusCode: 200,
        data: {
          items: [{ userId: 1, fullName: 'Người dùng ban đầu', email: 'old@example.com', role: 'Customer', eKycStatus: 'Verified', isLocked: false }],
          totalPages: 1,
          totalCount: 1,
        },
      })
      .mockImplementationOnce((_, config) => {
        config.signal.addEventListener('abort', () => rejectStale('canceled'), { once: true })
        return staleRequest
      })
      .mockImplementationOnce(() => latestRequest)

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    )

    await screen.findByText('Người dùng ban đầu')
    const searchInput = screen.getByPlaceholderText('Tìm theo tên hoặc email...')

    fireEvent.change(searchInput, { target: { value: 'john' } })
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 450)) })
    expect(userApi.getUsers).toHaveBeenCalledTimes(2)

    fireEvent.change(searchInput, { target: { value: 'jane' } })
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 450)) })
    expect(userApi.getUsers).toHaveBeenCalledTimes(3)

    expect(screen.queryByText('Không tải được danh sách người dùng.')).toBeNull()

    resolveLatest({
      statusCode: 200,
      data: {
        items: [{ userId: 2, fullName: 'Jane Doe', email: 'jane@example.com', role: 'CourtOwner', eKycStatus: 'Pending', isLocked: false }],
        totalPages: 1,
        totalCount: 1,
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeDefined()
      expect(screen.queryByText('Người dùng ban đầu')).toBeNull()
    })
  })
});
