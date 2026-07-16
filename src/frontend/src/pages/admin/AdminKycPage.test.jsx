import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminKycPage from './AdminKycPage';
import { kycApi } from '../../api/kycApi';

// BUG P1-4: trang duyệt E-KYC dùng ảnh Unsplash ngẫu nhiên làm fallback cho CCCD/chân dung
// khi thiếu URL hoặc ảnh lỗi — Admin có thể nhầm ảnh giả là bằng chứng thật. Không có
// ConfirmDialog trước khi phê duyệt, và không chặn phê duyệt khi ảnh bắt buộc chưa tải xong.

vi.mock('../../layouts/AdminLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

const mockAddToast = vi.fn();
vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

const mockConfirm = vi.fn();
vi.mock('../../components/ui/ConfirmDialog', () => ({
  useConfirm: () => mockConfirm,
}));

vi.mock('../../api/kycApi', () => ({
  kycApi: {
    getAll: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
  },
}));

function profileFixture(overrides = {}) {
  return {
    ekycProfileId: 1,
    fullName: 'Nguyễn Văn A',
    profileFullName: 'Nguyễn Văn A',
    identityNumber: '079123456789',
    userEmail: 'a@test.com',
    frontImageUrl: 'https://cdn.test/front.jpg',
    backImageUrl: 'https://cdn.test/back.jpg',
    faceImageUrl: 'https://cdn.test/face.jpg',
    status: 'Pending',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

async function renderWithProfile(profile) {
  kycApi.getAll.mockResolvedValue({ statusCode: 200, data: [profile] });
  render(<AdminKycPage />);
  // Danh sách bên trái CŨNG chứa chuỗi "KYC-{id}" nên phải chờ đúng heading chi tiết
  // (tránh "Found multiple elements") để chắc chắn panel Detail đã render xong.
  await screen.findByRole('heading', { name: new RegExp(`KYC-${profile.ekycProfileId}$`) });
}

function getImagesByLabel() {
  return {
    front: screen.getByAltText('Mặt trước'),
    back: screen.getByAltText('Mặt sau'),
    face: screen.queryByAltText('Chân dung'),
  };
}

describe('AdminKycPage — không dùng ảnh giả thay bằng chứng thật', () => {
  it('URL thiếu (faceImageUrl rỗng) hiển thị "Chưa có bằng chứng", KHÔNG render ảnh stock', async () => {
    await renderWithProfile(profileFixture({ faceImageUrl: '' }));

    expect(screen.getByText('Chưa có bằng chứng')).toBeInTheDocument();
    expect(screen.queryByAltText('Chân dung')).not.toBeInTheDocument();
  });

  it('ảnh lỗi tải (onError) hiển thị "Không tải được ảnh" kèm nút thử lại, không fallback ảnh khác', async () => {
    await renderWithProfile(profileFixture());
    const { front } = getImagesByLabel();

    fireEvent.error(front);

    expect(await screen.findByText('Không tải được ảnh')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thử lại/i })).toBeInTheDocument();
    // Ảnh lỗi không được âm thầm đổi sang URL stock nào khác.
    expect(screen.queryByAltText('Mặt trước')).not.toBeInTheDocument();
  });

  it('cả 3 ảnh tải thành công thì hiển thị đúng ảnh thật (không phải fallback)', async () => {
    await renderWithProfile(profileFixture());
    const { front, back, face } = getImagesByLabel();

    fireEvent.load(front);
    fireEvent.load(back);
    fireEvent.load(face);

    expect(front).toHaveAttribute('src', expect.stringContaining('https://cdn.test/front.jpg'));
    expect(screen.queryByText('Không tải được ảnh')).not.toBeInTheDocument();
    expect(screen.queryByText('Chưa có bằng chứng')).not.toBeInTheDocument();
  });
});

describe('AdminKycPage — chặn phê duyệt khi bằng chứng bắt buộc chưa sẵn sàng', () => {
  it('nút Phê duyệt bị disable khi ảnh bắt buộc (mặt trước) còn đang tải', async () => {
    await renderWithProfile(profileFixture());
    const approveBtn = screen.getByRole('button', { name: /phê duyệt/i });
    expect(approveBtn).toBeDisabled();
  });

  it('nút Phê duyệt bật lại khi front+back đã loaded, dù face optional còn missing', async () => {
    await renderWithProfile(profileFixture({ faceImageUrl: '' }));
    const { front, back } = getImagesByLabel();
    fireEvent.load(front);
    fireEvent.load(back);

    const approveBtn = screen.getByRole('button', { name: /phê duyệt/i });
    expect(approveBtn).toBeEnabled();
  });

  it('ảnh bắt buộc lỗi thì nút Phê duyệt vẫn bị khoá dù ảnh còn lại đã loaded', async () => {
    await renderWithProfile(profileFixture());
    const { front, back, face } = getImagesByLabel();
    fireEvent.error(front);
    fireEvent.load(back);
    fireEvent.load(face);

    expect(screen.getByRole('button', { name: /phê duyệt/i })).toBeDisabled();
  });
});

describe('AdminKycPage — ConfirmDialog trước khi phê duyệt', () => {
  async function approveReady() {
    const profile = profileFixture();
    await renderWithProfile(profile);
    const { front, back, face } = getImagesByLabel();
    fireEvent.load(front);
    fireEvent.load(back);
    fireEvent.load(face);
    return profile;
  }

  it('bấm Phê duyệt mở ConfirmDialog nêu tên khách; huỷ (confirm=false) thì KHÔNG gọi API', async () => {
    mockConfirm.mockResolvedValue(false);
    await approveReady();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /phê duyệt/i }));

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Nguyễn Văn A') })
    );
    expect(kycApi.approve).not.toHaveBeenCalled();
  });

  it('đồng ý ConfirmDialog (confirm=true) mới gọi API approve', async () => {
    mockConfirm.mockResolvedValue(true);
    kycApi.approve.mockResolvedValue({ statusCode: 200, message: 'OK' });
    kycApi.getAll.mockResolvedValueOnce({ statusCode: 200, data: [profileFixture()] });
    const profile = await approveReady();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /phê duyệt/i }));

    await waitFor(() => expect(kycApi.approve).toHaveBeenCalledWith(profile.ekycProfileId));
  });

  it('approve thất bại (API trả lỗi) vẫn giữ nguyên selection và báo lỗi rõ ràng', async () => {
    mockConfirm.mockResolvedValue(true);
    kycApi.approve.mockResolvedValue({ statusCode: 400, message: 'Hồ sơ đã bị thu hồi.' });
    await approveReady();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /phê duyệt/i }));

    await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith('Hồ sơ đã bị thu hồi.', 'error'));
    // Selection vẫn còn hồ sơ KYC-1 hiển thị chi tiết (không bị clear).
    expect(screen.getByRole('heading', { name: /KYC-1$/ })).toBeInTheDocument();
  });

  it('approve reject với string error (axiosClient interceptor) vẫn giữ selection', async () => {
    mockConfirm.mockResolvedValue(true);
    kycApi.approve.mockRejectedValue('Lỗi kết nối server');
    await approveReady();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /phê duyệt/i }));

    await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith('Lỗi kết nối server', 'error'));
    expect(screen.getByRole('heading', { name: /KYC-1$/ })).toBeInTheDocument();
  });
});

describe('AdminKycPage — dialog Từ chối có focus trap và Escape để đóng', () => {
  it('nhấn Escape đóng dialog Từ chối mà không gọi API reject', async () => {
    await renderWithProfile(profileFixture());
    const user = userEvent.setup();

    // "Từ chối" cũng là nhãn của filter pill trạng thái -> lấy đúng nút hành động (không có aria-pressed).
    const rejectButtons = screen.getAllByRole('button', { name: /^từ chối$/i });
    const rejectTrigger = rejectButtons.find(b => !b.hasAttribute('aria-pressed'));
    await user.click(rejectTrigger);
    expect(screen.getByRole('dialog', { name: /nhập lý do từ chối/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(kycApi.reject).not.toHaveBeenCalled();
  });
});
