import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MobileDashboardPage from './MobileDashboardPage';
import { useAuth } from '../../context/AuthContext';

// BUG: CTA "Quét QR vào sân" luôn hiện cho mọi user, nhưng route đích /mobile/scanner bị gate
// bởi EliteRoute (chỉ Staff/Admin) -> Customer bấm vào bị văng sang /403. CTA phải khớp đúng
// điều kiện role của route guard.

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <MobileDashboardPage />
    </MemoryRouter>
  );
}

describe('MobileDashboardPage — CTA quét QR khớp đúng role guard của route /mobile/scanner', () => {
  it('Customer không thấy CTA "Quét QR vào sân" (route sẽ chặn 403)', () => {
    useAuth.mockReturnValue({ user: { role: 'Customer', fullName: 'Nguyễn Văn A' }, isStaff: false, isAdmin: false });
    renderPage();
    expect(screen.queryByText('Quét QR vào sân')).not.toBeInTheDocument();
    expect(screen.getByText('Đặt sân ngay')).toBeInTheDocument();
  });

  it('Staff thấy CTA "Quét QR vào sân"', () => {
    useAuth.mockReturnValue({ user: { role: 'Staff', fullName: 'Nhân viên B' }, isStaff: true, isAdmin: false });
    renderPage();
    expect(screen.getByText('Quét QR vào sân')).toBeInTheDocument();
  });

  it('Admin cũng thấy CTA "Quét QR vào sân"', () => {
    useAuth.mockReturnValue({ user: { role: 'Admin', fullName: 'Quản trị viên' }, isStaff: false, isAdmin: true });
    renderPage();
    expect(screen.getByText('Quét QR vào sân')).toBeInTheDocument();
  });
});
