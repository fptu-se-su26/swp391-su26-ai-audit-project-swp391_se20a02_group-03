import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
  const [message, setMessage] = useState('Đang xử lý giao dịch...');
  const [bookingData, setBookingData] = useState(null);
  const [depositAmount, setDepositAmount] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const isProcessed = useRef(false); // Chống React StrictMode gọi 2 lần

  useEffect(() => {
    // Chống double-call: chỉ xử lý 1 lần duy nhất
    if (isProcessed.current) return;
    isProcessed.current = true;

    async function processPayment() {
      try {
        const queryString = searchParams.toString();
        if (!queryString) {
          setStatus('failed');
          setMessage('Không tìm thấy thông tin giao dịch.');
          return;
        }

        const orderInfoRaw = searchParams.get('vnp_OrderInfo');
        let parsedInfo = 'Giao dịch';
        
        if (orderInfoRaw) {
            // Parse với pipe separator: {OrderType}|{ReferenceId}|{UserId}
            const parts = orderInfoRaw.split('|');
            if (parts[0] === 'Booking') {
                parsedInfo = `Thanh toán đặt sân mã #${parts[1]}`;
            } else if (parts[0] === 'Deposit') {
                parsedInfo = `Nạp tiền ví ký quỹ (Mã GD: ${parts[1]})`;
            }
        }

        const response = await axiosClient.get(`/payment/vnpay/return?${queryString}`);
        
        if (response.statusCode === 200) {
          setStatus('success');
          setMessage(`Giao dịch "${parsedInfo}" đã hoàn tất thành công!`);
          // Lấy booking data nếu có
          if (response.data?.booking) {
            setBookingData(response.data.booking);
          }
          // Hiển thị số tiền nạp ví khi order type là Deposit
          if (response.data?.amount && !response.data?.booking) {
            setDepositAmount(response.data.amount);
          }
        } else {
          setStatus('failed');
          setMessage(response.message || 'Giao dịch không thành công.');
        }
      } catch (error) {
        setStatus('failed');
        // axiosClient interceptor rejects with a plain string, not Error object
        const errorMsg = typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi trong quá trình xác thực thanh toán.');
        setMessage(typeof errorMsg === 'string' ? errorMsg : 'Đã xảy ra lỗi trong quá trình xác thực thanh toán.');
      }
    };

    processPayment();
  }, [searchParams]);

  // Countdown timer khi đang processing
  useEffect(() => {
    if (status !== 'processing') return;
    if (countdown <= 0) {
      // Use a 0ms timer so setState runs in the timer callback, not
      // synchronously inside the effect body (satisfies react-hooks/set-state-in-effect).
      const expire = setTimeout(() => {
        setStatus('failed');
        setMessage('Quá thời gian xử lý. Vui lòng kiểm tra lịch sử đặt sân.');
      }, 0);
      return () => clearTimeout(expire);
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);

  function formatTime(t) {
    if (!t) return '';
    // Handle "HH:MM:SS" → "HH:MM"
    return t.length > 5 ? t.slice(0, 5) : t;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar theme="light" />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card-base p-10 max-w-[520px] w-full text-center">

          {status === 'processing' && (
            <div className="animate-pulse">
              <div className="w-16 h-16 border-4 border-border-strong border-t-accent rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="font-heading text-2xl uppercase text-foreground mb-2">Đang xử lý</h1>
              <p className="text-foreground-muted text-sm">Vui lòng đợi trong giây lát, không tắt trình duyệt...</p>
              <p className="text-foreground-subtle text-xs mt-2">Tự động hết hạn sau {countdown} giây</p>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-accent/10 text-accent rounded-[2px] flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h1 className="font-heading text-3xl uppercase text-foreground tracking-tight mb-2">Thanh toán thành công!</h1>
              <p className="text-foreground-muted mb-6 leading-relaxed text-[0.95rem]">{message}</p>

              {/* Hiển thị chi tiết booking nếu có */}
              {bookingData && (
                <div className="bg-surface rounded-[2px] p-5 mb-6 text-left border-2 border-border-default">
                  <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Chi tiết đặt sân
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Mã đơn</span>
                      <span className="font-semibold text-foreground">#{bookingData.bookingId}</span>
                    </div>
                    {bookingData.details?.map((d, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-foreground-muted">{d.courtName}</span>
                        <span className="font-medium text-foreground">{formatTime(d.startTime)} - {formatTime(d.endTime)}</span>
                      </div>
                    ))}
                    {bookingData.details?.[0]?.bookingDate && (
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">Ngày</span>
                        <span className="font-medium text-foreground">{new Date(bookingData.details[0].bookingDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-border-default pt-2 mt-2 flex justify-between">
                      <span className="font-semibold text-foreground">Tổng tiền</span>
                      <span className="font-bold text-accent">{bookingData.totalAmount?.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                  {/* Hiển thị mã Check-in */}
                  {bookingData.checkInCode && (
                    <div className="mt-4 p-3 bg-surface rounded-[2px] border-2 border-accent/30 text-center">
                      <p className="text-xs text-foreground-muted mb-1">Mã vào sân (QR đã gửi qua email)</p>
                      <p className="font-mono text-lg font-bold text-accent tracking-wider">{bookingData.checkInCode}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Hiển thị chi tiết nạp tiền nếu là Deposit */}
              {depositAmount && !bookingData && (
                <div className="bg-surface rounded-[2px] p-5 mb-6 text-left border-2 border-border-default">
                  <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Chi tiết nạp tiền
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Số tiền nạp</span>
                    <span className="font-bold text-accent">{Number(depositAmount).toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Link to="/customer/bookings" className="btn-outline flex-1 py-3.5 text-[0.9rem]">Xem lịch sử</Link>
                <Link to="/courts" className="btn-primary flex-1 py-3.5 text-[0.9rem]">Về trang chủ</Link>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 bg-danger-bg text-danger rounded-[2px] flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <h1 className="font-heading text-3xl uppercase text-foreground tracking-tight mb-2">Thanh toán thất bại</h1>
              <p className="text-foreground-muted mb-8 leading-relaxed text-[0.95rem]">{message}</p>
              <div className="flex gap-4">
                <Link to="/customer/bookings" className="btn-outline flex-1 py-3.5 text-[0.9rem]">Xem lịch sử</Link>
                <Link to="/courts" className="btn-outline flex-1 py-3.5 text-[0.9rem]">Thử lại sau</Link>
              </div>
            </>
          )}

        </div>
      </div>
      <Footer variant="light" />
    </div>
  );
}
