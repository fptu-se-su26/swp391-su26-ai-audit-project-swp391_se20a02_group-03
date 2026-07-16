import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import OwnerBookingsPage from './OwnerBookingsPage';
import { ownerApi } from '../../api/ownerApi';

vi.mock('../../api/ownerApi', () => ({
  ownerApi: {
    getCourts: vi.fn(),
    getBookings: vi.fn(),
  },
}));

describe('OwnerBookingsPage navigation and accessibility', () => {
  beforeEach(() => {
    ownerApi.getCourts.mockResolvedValue({ statusCode: 200, data: { items: [] } });
    ownerApi.getBookings.mockResolvedValue({ statusCode: 200, data: { items: [] } });
  });

  afterEach(() => cleanup());

  it('không lồng button trong link và đặt tên cho ô tìm kiếm', async () => {
    render(
      <MemoryRouter initialEntries={['/owner/bookings']}>
        <Routes>
          <Route element={<Outlet context={{ complexId: 1 }} />}>
            <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(ownerApi.getBookings).toHaveBeenCalled());
    expect(document.querySelector('a button')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Tìm kiếm' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Xem lịch (Calendar)' })).toBeDefined();
    expect(screen.getByRole('link', { name: '+ Đặt sân tại quầy' })).toBeDefined();
  });
});
