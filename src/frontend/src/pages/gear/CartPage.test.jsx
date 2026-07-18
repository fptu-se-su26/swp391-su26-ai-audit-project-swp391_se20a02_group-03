import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CartPage from './CartPage';
import { useCart } from '../../context/CartContext';
import { equipmentApi } from '../../api/equipmentApi';

// BUG: mục "Có thể bạn sẽ thích" dùng 4 sản phẩm giả cứng (id 101-104) thay vì dữ liệu API thật;
// bấm "Thêm vào giỏ" trên các item này gọi addToCart với equipmentId không tồn tại. Đồng thời
// toàn bộ card là <Link> bọc <button> (nested interactive, HTML không hợp lệ) và nút chỉ hiện
// khi hover (không dùng được trên thiết bị cảm ứng).

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../../api/equipmentApi', () => ({
  equipmentApi: { getAll: vi.fn() },
}));

vi.mock('../../layouts/GearLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>
  );
}

describe('CartPage — gợi ý "Có thể bạn sẽ thích" dùng dữ liệu API thật, không còn ID giả', () => {
  it('lấy sản phẩm gợi ý từ equipmentApi.getAll thay vì mảng hardcode id 101-104', async () => {
    useCart.mockReturnValue({
      cartItems: [{ cartItemId: 1, equipmentId: 5, equipmentName: 'Vợt Yonex', unitPrice: 500000, quantity: 1 }],
      cartData: { totalAmount: 500000 },
      loading: false,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      addToCart: vi.fn(),
    });
    equipmentApi.getAll.mockResolvedValue({
      data: [
        { equipmentId: 10, name: 'Ống cầu lông thật', category: 'Ball / Birdie', price: 680000 },
        { equipmentId: 11, name: 'Quấn cán vợt thật', category: 'Accessories', price: 65000 },
      ],
    });

    renderPage();

    expect(await screen.findByText('Ống cầu lông thật')).toBeInTheDocument();
    expect(screen.getByText('Quấn cán vợt thật')).toBeInTheDocument();
    // Không còn tên sản phẩm giả cứng cũ.
    expect(screen.queryByText('Ống cầu lông Yonex AS-30')).not.toBeInTheDocument();
  });

  it('nút "Thêm vào giỏ" gọi addToCart với equipmentId thật lấy từ API, không phải id giả', async () => {
    const addToCart = vi.fn();
    useCart.mockReturnValue({
      cartItems: [{ cartItemId: 1, equipmentId: 5, equipmentName: 'Vợt Yonex', unitPrice: 500000, quantity: 1 }],
      cartData: { totalAmount: 500000 },
      loading: false,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      addToCart,
    });
    equipmentApi.getAll.mockResolvedValue({
      data: [{ equipmentId: 10, name: 'Ống cầu lông thật', category: 'Ball / Birdie', price: 680000 }],
    });

    renderPage();
    const addBtn = await screen.findByRole('button', { name: /thêm ống cầu lông thật vào giỏ/i });
    addBtn.click();

    await waitFor(() => expect(addToCart).toHaveBeenCalledWith(10, 1));
  });

  it('vẫn loại đúng sản phẩm đã có trong giỏ dù cartItems chỉ có sau khi component đã mount (giống CartContext thật tải bất đồng bộ)', async () => {
    // Mô phỏng đúng hành vi thật: CartContext trả cartItems RỖNG lúc mount đầu tiên, rồi mới có
    // dữ liệu sau một nhịp cập nhật — bug cũ chụp excludeIds rỗng trong effect [] nên sản phẩm
    // đã có trong giỏ vẫn lọt vào danh sách gợi ý.
    useCart.mockReturnValue({
      cartItems: [],
      cartData: null,
      loading: true,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      addToCart: vi.fn(),
    });
    equipmentApi.getAll.mockResolvedValue({
      data: [{ equipmentId: 1, name: 'Vợt Yonex Astrox 88D', category: 'Racket', price: 6000000 }],
    });

    const { rerender } = renderPage();

    useCart.mockReturnValue({
      cartItems: [{ cartItemId: 1, equipmentId: 1, equipmentName: 'Vợt Yonex Astrox 88D', unitPrice: 6000000, quantity: 1 }],
      cartData: { totalAmount: 6000000 },
      loading: false,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      addToCart: vi.fn(),
    });
    rerender(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Sản phẩm duy nhất trả về từ API chính là sản phẩm đã có trong giỏ -> mục gợi ý phải rỗng,
    // toàn bộ section "Có thể bạn sẽ thích" (chỉ render khi còn item) không được xuất hiện.
    await waitFor(() => {
      expect(screen.queryByText('Có thể bạn sẽ thích')).not.toBeInTheDocument();
    });
  });
});
