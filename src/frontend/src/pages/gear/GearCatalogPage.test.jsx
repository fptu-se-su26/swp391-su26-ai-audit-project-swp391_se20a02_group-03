import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GearCatalogPage from './GearCatalogPage';
import { equipmentApi } from '../../api/equipmentApi';
import { CATEGORY_FALLBACKS } from '../../utils/productImages';

// BUG P1-5: onError của ảnh sản phẩm tham chiếu `CATEGORY_FALLBACKS` nhưng file không import
// gì cả -> ReferenceError runtime bất kỳ khi nào ảnh lỗi tải (ESLint no-undef cũng chặn build
// sạch). Test dưới đây khoá lại: ảnh lỗi phải fallback đúng ảnh theo category, và ảnh fallback
// tự nó lỗi thì KHÔNG được lặp vô hạn (onerror phải tự tắt sau lần đầu).

vi.mock('../../layouts/GearLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({ addToCart: vi.fn() }),
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../../api/equipmentApi', () => ({
  equipmentApi: { getAll: vi.fn() },
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <GearCatalogPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GearCatalogPage — ảnh sản phẩm lỗi không crash, không lặp vô hạn', () => {
  it('ảnh lỗi tải (onError) thì fallback đúng ảnh theo category, không ném ReferenceError', async () => {
    equipmentApi.getAll.mockResolvedValue({
      statusCode: 200,
      data: [{ equipmentId: 1, name: 'Vợt lỗi ảnh', category: 'Racket', price: 1000000, imageUrl: 'https://broken.test/x.png', stockQuantity: 5 }],
    });

    renderPage();
    const img = await screen.findByAltText('Vợt lỗi ảnh');

    // Trước đây: fireEvent.error ở đây ném ReferenceError vì CATEGORY_FALLBACKS chưa import.
    expect(() => fireEvent.error(img)).not.toThrow();
    expect(img.src).toBe(CATEGORY_FALLBACKS.Racket);
  });

  it('ảnh fallback cũng lỗi thì KHÔNG lặp vô hạn — src giữ nguyên sau lần fallback đầu tiên', async () => {
    equipmentApi.getAll.mockResolvedValue({
      statusCode: 200,
      data: [{ equipmentId: 2, name: 'Phụ kiện lỗi', category: 'Accessories', price: 200000, imageUrl: 'https://broken.test/y.png', stockQuantity: 3 }],
    });

    renderPage();
    const img = await screen.findByAltText('Phụ kiện lỗi');

    fireEvent.error(img); // ảnh gốc lỗi -> fallback Accessories
    expect(img.src).toBe(CATEGORY_FALLBACKS.Accessories);
    expect(img.onerror).toBeNull(); // handler đã tự tắt

    fireEvent.error(img); // giả lập chính ảnh fallback cũng lỗi (mất mạng/CDN down)
    expect(img.src).toBe(CATEGORY_FALLBACKS.Accessories); // không đổi tiếp, không loop
  });
});
