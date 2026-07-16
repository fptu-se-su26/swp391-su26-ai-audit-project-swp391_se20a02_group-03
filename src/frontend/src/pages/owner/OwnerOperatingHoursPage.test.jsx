import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OwnerOperatingHoursPage from './OwnerOperatingHoursPage';
import { ownerApi } from '../../api/ownerApi';

const routeState = vi.hoisted(() => ({ complexId: 1 }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useOutletContext: () => ({ complexId: routeState.complexId }),
  };
});

vi.mock('../../api/ownerApi', () => ({
  ownerApi: {
    getOperatingHours: vi.fn(),
    saveOperatingHours: vi.fn(),
  },
}));

function schedule(slotDurationMinutes) {
  return {
    statusCode: 200,
    data: {
      slotDurationMinutes,
      weeklySchedule: Array.from({ length: 7 }, (_, dayOfWeek) => ({
        dayOfWeek,
        openTime: '06:00',
        closeTime: '22:00',
      })),
      closures: [],
      maintenanceWindows: [],
    },
  };
}

describe('OwnerOperatingHoursPage', () => {
  beforeEach(() => {
    routeState.complexId = 1;
    ownerApi.getOperatingHours.mockReset();
    ownerApi.saveOperatingHours.mockReset();
  });

  afterEach(() => cleanup());

  it('chặn form lưu khi tải lịch thất bại', async () => {
    ownerApi.getOperatingHours.mockResolvedValue({ statusCode: 500, message: 'Không tải được lịch.' });
    render(<OwnerOperatingHoursPage />);

    expect(await screen.findByText('Không tải được lịch.')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Lưu lịch vận hành' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeDefined();
  });

  it('ẩn dữ liệu cụm cũ trong khi cụm mới chưa tải xong', async () => {
    let resolveSecond;
    ownerApi.getOperatingHours
      .mockResolvedValueOnce(schedule(30))
      .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve; }));

    const { rerender } = render(<OwnerOperatingHoursPage />);
    await waitFor(() => expect(screen.getByRole('combobox').value).toBe('30'));

    routeState.complexId = 2;
    rerender(<OwnerOperatingHoursPage />);
    expect(screen.queryByRole('button', { name: 'Lưu lịch vận hành' })).toBeNull();

    resolveSecond(schedule(90));
    await waitFor(() => expect(screen.getByRole('combobox').value).toBe('90'));
  });
});
