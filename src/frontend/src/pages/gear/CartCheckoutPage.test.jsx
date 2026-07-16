import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CartCheckoutPage from './CartCheckoutPage';
import { MemoryRouter } from 'react-router-dom';

// Mock các hooks và context
const mockNavigate = vi.fn();
const mockAddToast = vi.fn();
const mockClearCart = vi.fn();
const mockSearchParams = { value: '' };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams(mockSearchParams.value)],
    };
});

vi.mock('../../components/Toast', () => ({
    useToast: () => ({ addToast: mockAddToast })
}));

const mockRefreshCart = vi.fn();

const mockCartData = {
    cartItems: [],
    cartData: { grandTotal: 0, totalPrice: 0 },
    clearCart: mockClearCart,
    refreshCart: mockRefreshCart,
    loading: false
};

vi.mock('../../context/CartContext', () => ({
    useCart: () => mockCartData
}));

const mockCheckout = vi.fn();
vi.mock('../../api/cartApi', () => ({
    cartApi: { checkout: (...args) => mockCheckout(...args) }
}));

const mockGetEscrowWallet = vi.fn();
const mockCreateVnPayUrl = vi.fn();
vi.mock('../../api/paymentApi', () => ({
    paymentApi: { 
        getEscrowWallet: (...args) => mockGetEscrowWallet(...args),
        createVnPayUrl: (...args) => mockCreateVnPayUrl(...args)
    }
}));

// Dummy layout to render children
vi.mock('../../layouts/GearLayout', () => ({
    default: ({ children }) => <div data-testid="gear-layout">{children}</div>
}));

describe('CartCheckoutPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';
        mockCartData.cartItems = [];
        mockCartData.cartData = { grandTotal: 0, totalPrice: 0 };
        mockCartData.loading = false;
        mockSearchParams.value = '';
        mockRefreshCart.mockResolvedValue(undefined);
        mockGetEscrowWallet.mockResolvedValue({ data: { balance: 500000 } });
    });

    afterEach(() => {
        cleanup();
        document.body.innerHTML = '';
    });

    const renderWithRouter = (ui) => {
        return render(<MemoryRouter>{ui}</MemoryRouter>);
    };

    it('hiển thị loader khi đang tải giỏ hàng', () => {
        mockCartData.loading = true;
        renderWithRouter(<CartCheckoutPage />);
        expect(screen.getByText('Đang tải thông tin thanh toán...')).toBeDefined();
    });

    it('hiển thị màn hình hoàn tất khi giỏ hàng trống', async () => {
        renderWithRouter(<CartCheckoutPage />);
        await waitFor(() => {
            expect(screen.getByText('Mọi thứ đã xong!')).toBeDefined();
        });
    });

    it('tính đúng tổng tiền và hiển thị chi tiết khi có sản phẩm', async () => {
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Vợt', quantity: 2, unitPrice: 100000 }
        ];
        mockCartData.cartData.grandTotal = 200000;

        renderWithRouter(<CartCheckoutPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Vợt')).toBeDefined();
            // Tổng là 200,000 VND
            expect(screen.getAllByText('200.000 ₫').length).toBeGreaterThan(0);
        });
    });

    it('gọi API checkout thành công và chuyển hướng', async () => {
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Giày', quantity: 1, unitPrice: 0 } // Tổng 0 VND
        ];
        mockCartData.cartData.grandTotal = 0;
        
        mockCheckout.mockResolvedValue({ success: true, message: 'OK' });

        renderWithRouter(<CartCheckoutPage />);
        
        await waitFor(() => {
            const buttons = screen.getAllByTestId('checkout-btn');
            expect(buttons[buttons.length - 1].disabled).toBe(false);
        });

        const buttons = screen.getAllByTestId('checkout-btn');
        fireEvent.click(buttons[buttons.length - 1]);

        await waitFor(() => {
            expect(mockCheckout).toHaveBeenCalledWith({ bookingId: null });
            expect(mockAddToast).toHaveBeenCalledWith('OK', 'success');
            expect(mockRefreshCart).toHaveBeenCalled();
            expect(mockClearCart).not.toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/customer/bookings');
        });
    });

    it('gọi API checkout theo booking không xóa toàn bộ giỏ hàng', async () => {
        mockSearchParams.value = 'bookingId=100';
        
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Sản phẩm 1', quantity: 1, unitPrice: 100000, bookingId: 100 },
            { cartItemId: 2, equipmentName: 'Sản phẩm 2', quantity: 1, unitPrice: 200000, bookingId: 100 },
            { cartItemId: 3, equipmentName: 'Booking khác', quantity: 1, unitPrice: 70000, bookingId: 200 },
            { cartItemId: 4, equipmentName: 'Sản phẩm lẻ', quantity: 1, unitPrice: 50000, bookingId: null }
        ];
        
        // Mock fallbackTotal sẽ là 300000 do chỉ tính sản phẩm có bookingId=100
        mockCartData.cartData = null; 
        mockGetEscrowWallet.mockResolvedValue({ data: { balance: 500000 } }); 
        mockCheckout.mockResolvedValue({ success: true, message: 'OK Booking' });

        renderWithRouter(<CartCheckoutPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Sản phẩm 1')).toBeDefined();
            expect(screen.getByText('Sản phẩm 2')).toBeDefined();
            expect(screen.queryByText('Booking khác')).toBeNull();
            expect(screen.queryByText('Sản phẩm lẻ')).toBeNull();
            const buttons = screen.getAllByTestId('checkout-btn');
            expect(buttons[buttons.length - 1].disabled).toBe(false);
        });

        const buttons = screen.getAllByTestId('checkout-btn');
        fireEvent.click(buttons[buttons.length - 1]);

        await waitFor(() => {
            expect(mockCheckout).toHaveBeenCalledWith({ bookingId: 100 });
            expect(mockAddToast).toHaveBeenCalledWith('OK Booking', 'success');
            expect(mockRefreshCart).toHaveBeenCalled();
            expect(mockClearCart).not.toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/customer/bookings');
        });
    });

    it('checkout toàn bộ giỏ khi route không có bookingId và có sản phẩm lẻ', async () => {
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Sản phẩm booking', quantity: 1, unitPrice: 100000, bookingId: 100 },
            { cartItemId: 2, equipmentName: 'Sản phẩm lẻ', quantity: 1, unitPrice: 50000, bookingId: null },
        ];
        mockCartData.cartData = null;
        mockCheckout.mockResolvedValue({ success: true, message: 'OK All' });

        renderWithRouter(<CartCheckoutPage />);

        await waitFor(() => {
            expect(screen.getByText('Sản phẩm booking')).toBeDefined();
            expect(screen.getByText('Sản phẩm lẻ')).toBeDefined();
            expect(screen.getAllByText('150.000 ₫').length).toBeGreaterThan(0);
        });

        fireEvent.click(screen.getByTestId('checkout-btn'));

        await waitFor(() => {
            expect(mockCheckout).toHaveBeenCalledWith({ bookingId: null });
            expect(mockRefreshCart).toHaveBeenCalledTimes(1);
            expect(mockClearCart).not.toHaveBeenCalled();
        });
    });

    it('gọi API checkout thất bại và hiện lỗi', async () => {
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Giày', quantity: 1, unitPrice: 100000 }
        ];
        mockCartData.cartData.grandTotal = 100000;
        
        mockCheckout.mockResolvedValue({ success: false, message: 'Sản phẩm đã hết hàng' });

        renderWithRouter(<CartCheckoutPage />);
        
        await waitFor(() => {
            const buttons = screen.getAllByTestId('checkout-btn');
            expect(buttons[buttons.length - 1].disabled).toBe(false);
        });

        const buttons = screen.getAllByTestId('checkout-btn');
        fireEvent.click(buttons[buttons.length - 1]);

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith('Sản phẩm đã hết hàng', 'error');
            expect(mockClearCart).not.toHaveBeenCalled();
            expect(mockRefreshCart).not.toHaveBeenCalled();
        });
    });

    it('xử lý lỗi HTTP 400 hoặc thiếu field success', async () => {
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Giày', quantity: 1, unitPrice: 100000 }
        ];
        mockCartData.cartData.grandTotal = 100000;
        
        // Mock API bị reject
        mockCheckout.mockRejectedValue('Bad Request');

        renderWithRouter(<CartCheckoutPage />);
        
        await waitFor(() => {
            const buttons = screen.getAllByTestId('checkout-btn');
            expect(buttons[buttons.length - 1].disabled).toBe(false);
        });

        const buttons = screen.getAllByTestId('checkout-btn');
        fireEvent.click(buttons[buttons.length - 1]);

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith('Bad Request', 'error');
            expect(mockClearCart).not.toHaveBeenCalled();
            expect(mockRefreshCart).not.toHaveBeenCalled();
        });
        
        // Mock API trả về nhưng không có success = true
        mockCheckout.mockResolvedValue({ status: 200, message: 'Checkout done without success flag' });
        
        fireEvent.click(buttons[buttons.length - 1]);
        
        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith('Checkout done without success flag', 'error');
        });
    });

    it('chặn checkout khi không đủ số dư ví', async () => {
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Vợt đắt tiền', quantity: 1, unitPrice: 1000000 }
        ];
        mockCartData.cartData.grandTotal = 1000000;
        mockGetEscrowWallet.mockResolvedValue({ data: { balance: 500000 } }); // shortfall 500,000

        renderWithRouter(<CartCheckoutPage />);
        
        await waitFor(() => {
            const buttons = screen.getAllByTestId('checkout-btn');
            expect(screen.queryAllByText(/Ví không đủ 500\.000\s*₫ để thanh toán/).length).toBeGreaterThan(0);
            expect(buttons[buttons.length - 1].disabled).toBe(true);
        });
    });

    it('sử dụng tổng tiền bằng 0 hợp lệ không bị ghi đè', async () => {
        mockCartData.cartItems = [
            { cartItemId: 1, equipmentName: 'Voucher Free', quantity: 1, unitPrice: 0 }
        ];
        mockCartData.cartData.grandTotal = 0; // grandTotal = 0 is falsy, should be caught by ??
        
        renderWithRouter(<CartCheckoutPage />);
        
        await waitFor(() => {
            const buttons = screen.getAllByTestId('checkout-btn');
            expect(screen.queryAllByText(/0\s*₫/).length).toBeGreaterThan(0);
            expect(buttons[buttons.length - 1].disabled).toBe(false);
        });
    });
});
