import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MobileScannerPage from './MobileScannerPage';

// BUG: Html5Qrcode.stop()/clear() có thể ném lỗi ĐỒNG BỘ (không phải Promise reject) khi scanner
// chưa từng start thành công — ví dụ môi trường không có navigator.mediaDevices thật. .catch()
// không bắt được lỗi đồng bộ này, khiến effect cleanup ném lỗi chưa được bắt và cả trang crash
// trắng (kết hợp với bug ErrorBoundary phụ thuộc Router — xem ErrorBoundary.test.jsx).

vi.mock('html5-qrcode', () => ({
  Html5Qrcode: vi.fn().mockImplementation(() => ({
    start: vi.fn().mockRejectedValue(new Error('no camera')),
    stop: vi.fn(() => { throw new Error('Cannot stop, scanner is not running or paused.') }),
    clear: vi.fn(() => { throw new Error('Cannot clear, scanner is not running or paused.') }),
  })),
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

function renderPage() {
  return render(
    <MemoryRouter>
      <MobileScannerPage />
    </MemoryRouter>
  );
}

describe('MobileScannerPage — không crash khi camera không khả dụng', () => {
  it('rơi về trạng thái nhập mã thủ công, không ném lỗi chưa bắt khi unmount', async () => {
    const { unmount } = renderPage();

    await waitFor(() => {
      expect(screen.getByText(/camera không khả dụng/i)).toBeInTheDocument();
    });

    // Unmount kích hoạt cleanup effect gọi scanner.stop()/clear() — trước đây ném lỗi đồng bộ
    // chưa được bắt, khiến unmount/re-render sau đó crash cả cây React.
    expect(() => unmount()).not.toThrow();
  });
});
