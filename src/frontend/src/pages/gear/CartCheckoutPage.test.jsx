import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CartCheckoutPage from './CartCheckoutPage';
import { cartApi } from '../../api/cartApi';
import { paymentApi } from '../../api/paymentApi';
import { useCart } from '../../context/CartContext';

// BUG P1-1: checkout theo bookingId chỉ xoá item của booking đó ở server, nhưng trang trước
// đây gọi clearCart() (DELETE /equipment/cart) sau khi thanh toán — xoá NHẦM toàn bộ giỏ,
// bao gồm cả item của booking khác và item không gắn booking nào.
// Các test dưới đây khoá lại hành vi đúng: dùng refreshCart() thay clearCart(), chỉ coi
// response.success === true là thành công, và tổng tiền luôn có fallback hợp lý.

vi.mock('../../api/cartApi', () => ({
  cartApi: { checkout: vi.fn() },
}));

vi.mock('../../api/paymentApi', () => ({
  paymentApi: {
    getEscrowWallet: vi.fn(() => Promise.resolve({ data: { balance: 1_000_000 } })),
    createVnPayUrl: vi.fn(),
  },
}));

const mockAddToast = vi.fn();
vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn(),
}));

const itemBookingA = { cartItemId: 1, equipmentName: 'Vợt A', unitPrice: 100_000, quantity: 1, bookingId: 10 };
const itemBookingB = { cartItemId: 2, equipmentName: 'Vợt B', unitPrice: 200_000, quantity: 1, bookingId: 20 };
const itemNoBooking = { cartItemId: 3, equipmentName: 'Bóng', unitPrice: 50_000, quantity: 2, bookingId: null };

function mockUseCart({ cartItems, cartData = null, refreshCart = vi.fn(), clearCart = vi.fn(), loading = false }) {
  useCart.mockReturnValue({ cartItems, cartData, refreshCart, clearCart, loading });
  return { refreshCart, clearCart };
}

function renderPage(initialEntry = '/gear/cart/checkout?bookingId=10') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <CartCheckoutPage />
    </MemoryRouter>
  );
}

async function clickCheckout() {
  const user = userEvent.setup();
  const button = screen.getByRole('button', { name: /xác nhận thanh toán/i });
  await user.click(button);
}

beforeEach(() => {
  vi.clearAllMocks();
  paymentApi.getEscrowWallet.mockResolvedValue({ data: { balance: 1_000_000 } });
});

describe('CartCheckoutPage — checkout theo bookingId không được xoá cả giỏ', () => {
  it('chỉ gửi payload bookingId của booking A và KHÔNG gọi clearCart, có gọi refreshCart khi success:true', async () => {
    const { refreshCart, clearCart } = mockUseCart({
      cartItems: [itemBookingA, itemBookingB, itemNoBooking],
    });
    cartApi.checkout.mockResolvedValue({ success: true, message: 'Thanh toán thành công' });

    renderPage('/gear/cart/checkout?bookingId=10');
    await clickCheckout();

    await waitFor(() => expect(cartApi.checkout).toHaveBeenCalledWith({ bookingId: 10 }));
    expect(clearCart).not.toHaveBeenCalled();
    await waitFor(() => expect(refreshCart).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/customer/bookings');
  });

  it('chỉ hiển thị item của booking A, không hiển thị item booking B hay item không gắn booking', () => {
    mockUseCart({ cartItems: [itemBookingA, itemBookingB, itemNoBooking] });
    renderPage('/gear/cart/checkout?bookingId=10');

    expect(screen.getByText('Vợt A')).toBeInTheDocument();
    expect(screen.queryByText('Vợt B')).not.toBeInTheDocument();
    expect(screen.queryByText('Bóng')).not.toBeInTheDocument();
  });

  it('response { success: false } không điều hướng, không refreshCart, hiển thị lỗi', async () => {
    const { refreshCart } = mockUseCart({ cartItems: [itemBookingA] });
    cartApi.checkout.mockResolvedValue({ success: false, message: 'Số dư không đủ' });

    renderPage('/gear/cart/checkout?bookingId=10');
    await clickCheckout();

    await waitFor(() => expect(cartApi.checkout).toHaveBeenCalled());
    expect(refreshCart).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockAddToast).toHaveBeenCalledWith('Số dư không đủ', 'error');
  });

  it('response thiếu field success (undefined) KHÔNG được coi là thành công', async () => {
    const { refreshCart } = mockUseCart({ cartItems: [itemBookingA] });
    cartApi.checkout.mockResolvedValue({ message: 'Đã xử lý' }); // không có success

    renderPage('/gear/cart/checkout?bookingId=10');
    await clickCheckout();

    await waitFor(() => expect(cartApi.checkout).toHaveBeenCalled());
    expect(refreshCart).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('API reject với string error (axiosClient interceptor) hiển thị đúng lỗi, không crash', async () => {
    mockUseCart({ cartItems: [itemBookingA] });
    cartApi.checkout.mockRejectedValue('Số dư ví không đủ hoặc lỗi kết nối server');

    renderPage('/gear/cart/checkout?bookingId=10');
    await clickCheckout();

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith('Số dư ví không đủ hoặc lỗi kết nối server', 'error')
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('API reject với HTTP 400 dạng object error.message vẫn hiển thị lỗi hợp lý', async () => {
    mockUseCart({ cartItems: [itemBookingA] });
    cartApi.checkout.mockRejectedValue({ message: 'Bad Request' });

    renderPage('/gear/cart/checkout?bookingId=10');
    await clickCheckout();

    await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith('Bad Request', 'error'));
  });

  it('cartData null nhưng cartItems có dữ liệu vẫn tính đúng tổng tiền fallback (checkout toàn giỏ)', () => {
    mockUseCart({ cartItems: [itemNoBooking], cartData: null });
    renderPage('/gear/cart/checkout');

    // itemNoBooking: 50_000 * 2 = 100_000
    expect(screen.getByTestId('checkout-grand-total').textContent).toMatch(/100\.000/);
  });

  it('grandTotal = 0 từ cartData là giá trị hợp lệ, không bị fallback ghi đè bởi computedTotal khác 0', () => {
    mockUseCart({ cartItems: [itemNoBooking], cartData: { totalAmount: 0 } });
    renderPage('/gear/cart/checkout');

    // itemNoBooking computedTotal = 100_000 (≠0) — nếu code dùng `||` thay vì `??`,
    // giá trị 0 hợp lệ từ cartData sẽ bị ghi đè sai thành 100_000.
    expect(screen.getByTestId('checkout-grand-total').textContent).toMatch(/^0(?:\D|$)/);
  });
});
