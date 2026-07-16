import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminCourtsPage from './AdminCourtsPage';
import { courtApi } from '../../api/courtApi';

// BUG P1-3: UpdateCourtAsync (backend) từng lưu thẳng dto.Status (dạng API "ACTIVE") vào DB
// thay vì normalize về canonical "Available", khiến sân hết bookable chỉ vì đổi tên. Ở phía
// FE, <select> trạng thái từng dùng value canonical ("Available"/"Booked"/"Maintenance"/
// "Closed") trong khi GET /courts luôn trả status dạng API-casing (ACTIVE/MAINTENANCE/
// INACTIVE) — không khớp nên hiển thị sai option mặc định. Test dưới đây khoá lại round-trip
// GET → mở sửa → chỉ đổi tên → submit: option hiển thị đúng & payload gửi đi giữ nguyên status.

vi.mock('../../layouts/AdminLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../../components/ui/ConfirmDialog', () => ({
  useConfirm: () => vi.fn(async () => true),
}));

vi.mock('../../api/courtApi', () => ({
  courtApi: {
    getAll: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}));

function courtFixture(apiStatus) {
  return {
    courtId: 1,
    name: 'Sân Cầu Lông A1',
    courtTypeId: 1,
    courtTypeName: 'Badminton',
    status: apiStatus, // API luôn trả UPPERCASE (CourtStatuses.ToApiStatus)
    imageUrl: '',
    description: '',
    pricePerHour: 100000,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  courtApi.update.mockResolvedValue({ statusCode: 200, data: {}, message: 'OK' });
});

async function openEditModal(court) {
  courtApi.getAll.mockResolvedValue({ statusCode: 200, data: [court] });
  render(<AdminCourtsPage />);
  const editBtn = await screen.findByRole('button', { name: /sửa/i });
  const user = userEvent.setup();
  await user.click(editBtn);
  return user;
}

describe.each([
  ['ACTIVE', 'Hoạt động'],
  ['MAINTENANCE', 'Bảo trì'],
  ['INACTIVE', 'Ngưng hoạt động'],
])('AdminCourtsPage — round-trip trạng thái sân (%s)', (apiStatus, expectedLabel) => {
  it(`mở sửa hiển thị đúng option "${expectedLabel}", chỉ đổi tên và submit vẫn giữ nguyên status=${apiStatus}`, async () => {
    const user = await openEditModal(courtFixture(apiStatus));

    // Modal có 2 <select> (Loại sân + Trạng thái) — chọn đúng cái bằng label thay vì role trần.
    const select = screen.getByRole('combobox', { name: /trạng thái/i });
    // Round-trip: option hiển thị phải khớp đúng status thật của sân, không rơi về mặc định.
    expect(within(select).getByRole('option', { name: expectedLabel }).selected).toBe(true);

    const nameInput = screen.getByDisplayValue('Sân Cầu Lông A1');
    await user.clear(nameInput);
    await user.type(nameInput, 'Sân Cầu Lông A1 (mới)');

    await user.click(screen.getByRole('button', { name: /lưu thay đổi/i }));

    expect(courtApi.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name: 'Sân Cầu Lông A1 (mới)', status: apiStatus })
    );
  });
});

describe('AdminCourtsPage — select trạng thái không còn cho chọn giá trị backend sẽ reject', () => {
  it('không còn option Booked/Closed trong form sửa sân', async () => {
    await openEditModal(courtFixture('ACTIVE'));
    const select = screen.getByRole('combobox', { name: /trạng thái/i });
    const optionLabels = within(select).getAllByRole('option').map(o => o.textContent);
    expect(optionLabels).toEqual(['Hoạt động', 'Bảo trì', 'Ngưng hoạt động']);
  });
});

describe('AdminCourtsPage — modal sửa sân có focus trap và Escape để đóng', () => {
  it('nhấn Escape đóng modal mà không gọi API update', async () => {
    const user = await openEditModal(courtFixture('ACTIVE'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(courtApi.update).not.toHaveBeenCalled();
  });
});
