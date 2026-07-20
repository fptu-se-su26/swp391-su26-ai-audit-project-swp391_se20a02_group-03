import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ApexShopPage from './ApexShopPage';
import { equipmentApi } from '../../api/equipmentApi';

// BUG V.1: file từng bị hỏng do merge conflict còn sót (không parse được — chặn cả ESLint/
// build). Sau khi tái cấu trúc, filter "Môn thi đấu" từng so sánh nhãn tiếng Việt ('Cầu lông')
// trực tiếp với SportType thật của API ('Badminton') nên KHÔNG BAO GIỜ khớp; filter "Tình
// trạng" dùng Premium/New/Trial trong khi Equipment.Status thật chỉ có 'Available'. Test dưới
// đây khoá lại: filter phải thật sự thay đổi kết quả hiển thị theo đúng field API.

vi.mock('../../layouts/ApexLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('../../api/equipmentApi', () => ({
  equipmentApi: { getAll: vi.fn() },
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    cartItems: [],
    cartCount: 0,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
  }),
}));

vi.mock('gsap', () => ({
  gsap: {
    context: (fn) => { fn(); return { revert: vi.fn() }; },
    from: vi.fn(),
  },
}));

function equipmentFixture() {
  return [
    { equipmentId: 1, name: 'Vợt Yonex Astrox', category: 'Racket', type: 'Badminton', retailPrice: 1000000, stockQuantity: 5, status: 'Available' },
    { equipmentId: 2, name: 'Vợt Pickleball Pro', category: 'Racket', type: 'Pickleball', retailPrice: 900000, stockQuantity: 3, status: 'Available' },
    { equipmentId: 3, name: 'Giày cầu lông', category: 'Footwear', type: 'Badminton', retailPrice: 800000, stockQuantity: 2, status: 'Available' },
  ];
}

beforeEach(() => {
  vi.clearAllMocks();
});

async function renderShop() {
  equipmentApi.getAll.mockResolvedValue({ statusCode: 200, data: equipmentFixture() });
  render(<MemoryRouter><ApexShopPage /></MemoryRouter>);
  await screen.findByText('Vợt Yonex Astrox');
}

describe('ApexShopPage — filter contract khớp API thật', () => {
  it('mặc định hiển thị cả 3 sản phẩm (Badminton + Pickleball)', async () => {
    await renderShop();
    expect(screen.getByText('Vợt Yonex Astrox')).toBeInTheDocument();
    expect(screen.getByText('Vợt Pickleball Pro')).toBeInTheDocument();
    expect(screen.getByText('Giày cầu lông')).toBeInTheDocument();
  });

  it('chọn "Cầu lông" chỉ hiển thị sản phẩm SportType=Badminton, ẩn Pickleball', async () => {
    await renderShop();
    const user = userEvent.setup();

    await user.click(screen.getByText('Cầu lông'));

    await waitFor(() => {
      expect(screen.queryByText('Vợt Pickleball Pro')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Vợt Yonex Astrox')).toBeInTheDocument();
    expect(screen.getByText('Giày cầu lông')).toBeInTheDocument();
  });

  it('chọn "Pickleball" chỉ hiển thị đúng 1 sản phẩm Pickleball thật', async () => {
    await renderShop();
    const user = userEvent.setup();

    await user.click(screen.getByText('Pickleball'));

    await waitFor(() => {
      expect(screen.queryByText('Vợt Yonex Astrox')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Vợt Pickleball Pro')).toBeInTheDocument();
    expect(screen.queryByText('Giày cầu lông')).not.toBeInTheDocument();
  });

  it('chọn category "Vợt" chỉ hiển thị Racket, ẩn Footwear', async () => {
    await renderShop();
    const user = userEvent.setup();

    await user.click(screen.getByText('Vợt'));

    await waitFor(() => {
      expect(screen.queryByText('Giày cầu lông')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Vợt Yonex Astrox')).toBeInTheDocument();
    expect(screen.getByText('Vợt Pickleball Pro')).toBeInTheDocument();
  });

  it('kết hợp category + sport rồi Đặt lại phải trả về đủ cả 3 sản phẩm', async () => {
    await renderShop();
    const user = userEvent.setup();

    await user.click(screen.getByText('Vợt'));
    await user.click(screen.getByText('Pickleball'));
    await waitFor(() => expect(screen.queryByText('Giày cầu lông')).not.toBeInTheDocument());

    await user.click(screen.getByText('Đặt lại'));

    await waitFor(() => expect(screen.getByText('Giày cầu lông')).toBeInTheDocument());
    expect(screen.getByText('Vợt Yonex Astrox')).toBeInTheDocument();
    expect(screen.getByText('Vợt Pickleball Pro')).toBeInTheDocument();
  });

  it('dùng bộ lọc tồn kho thật thay vì các trạng thái Premium/New/Trial không có trong API', async () => {
    await renderShop();
    expect(screen.getByText('Tình trạng')).toBeInTheDocument();
    expect(screen.getByText('Còn hàng')).toBeInTheDocument();
    expect(screen.getByText('Hết hàng')).toBeInTheDocument();
    expect(screen.queryByText('Dùng thử')).not.toBeInTheDocument();
  });
});
