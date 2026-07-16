import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { playerFeaturesApi } from '../../api/playerFeaturesApi'
import { useToast } from '../../components/Toast'
import { CheckCircle2 } from 'lucide-react'

import { getAuthToken } from '../../utils/authStorage'
function getCurrentUser() {
  try {
    const token = getAuthToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      fullName: payload.full_name || payload.FullName || payload.name || 'Vô Danh',
      phone: payload.phone_number || payload.PhoneNumber || payload.phone || 'Ẩn Số',
    };
  } catch {
    return null;
  }
}

export default function BookingPage() {
  const { id: courtId } = useParams()
  const [searchParams] = useSearchParams()
  const { addToast } = useToast()
  const isSubmitting = useRef(false) // Chống double-click

  const slot = searchParams.get('slot') || '10:00'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  const [paymentMethod, setPaymentMethod] = useState('payos')
  const [splitMode, setSplitMode] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [escrowBalance, setEscrowBalance] = useState(0)
  const [bookingResult, setBookingResult] = useState(null) // Lưu kết quả booking từ API
  const [currentUser] = useState(() => getCurrentUser())
  const [court, setCourt] = useState({
    name: 'Bí Cảnh đang mở...',
    price: 0,
    serviceFee: 0,
  })

  // Tính endTime dựa trên slot (90 phút mặc định)
  function calculateEndTime(startTime) {
    const [h, m] = startTime.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(h, m + 90, 0);
    return `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  }

  // Format ngày hiển thị
  function formatDate(dateStr) {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) return 'Hôm nay';
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      if (d.toDateString() === tomorrow.toDateString()) return 'Ngày mai';
      return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch {
      return dateStr;
    }
  }

  useEffect(() => {
    // Tải thông tin sân
    if (courtId) {
      bookingApi.getCourtById(courtId)
        .then(res => {
           if(res.data) {
             setCourt({
               name: res.data.name,
               price: res.data.pricePerHour > 0 ? res.data.pricePerHour * 1.5 : 120000,
               serviceFee: 5000
             });
           } else {
             setCourt({
               name: 'Bí Cảnh Vô Cực – Tầng 1',
               price: 120000,
               serviceFee: 5000
             });
           }
        })
        .catch(err => {
           console.error("Lỗi tải sân", err);
           setCourt({
             name: 'Bí Cảnh Vô Cực – Tầng 1',
             price: 120000,
             serviceFee: 5000
           });
        })
    }

    // Tải số dư ví
    paymentApi.getEscrowWallet()
      .then(res => {
        if(res.data) setEscrowBalance(res.data.balance);
      })
      .catch(err => console.error("Lỗi ví", err));
  }, [courtId]);

  async function handleBooking() {
    // Chống double-click
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    setIsLoading(true);
    try {
      const detail = {
        courtId: parseInt(courtId),
        bookingDate: date,
        startTime: slot.length === 5 ? slot + ':00' : slot,
        endTime: calculateEndTime(slot).length === 5 ? calculateEndTime(slot) + ':00' : calculateEndTime(slot)
      };

      let res;
      if (splitMode && partnerEmail.trim()) {
        const half = Math.floor((court.price + court.serviceFee) / 2);
        const remainder = court.price + court.serviceFee - half;
        res = await playerFeaturesApi.createSplitBooking({
          details: [detail],
          participants: [
            { amount: half, isHost: true },
            { email: partnerEmail.trim(), amount: remainder }
          ],
          splitDeadlineHours: 24
        });
        if (res.statusCode === 201 || res.statusCode === 200) {
          setBookingResult(res.data);
          addToast('Đã tạo đơn chia bill. Mời bạn bè thanh toán phần của họ qua ví Escrow.', 'success');
          setIsSuccess(true);
          return;
        }
      } else {
        res = await bookingApi.createBooking({ details: [detail] });
      }

      if (res.statusCode === 200 || res.statusCode === 201) {
        const bookingId = res.data?.bookingId;

        if (!bookingId) {
          addToast("Không lấy được Cấm Chế bài từ server. Vui lòng thử lại.", "error");
          return;
        }

        setBookingResult(res.data);

        if (res.data?.totalAmount) {
          setCourt(prev => ({ ...prev, price: res.data.totalAmount, serviceFee: 0 }));
        }

        if (paymentMethod === 'payos') {
          const payosRes = await paymentApi.createPayOsUrl(0, 'Booking', bookingId);
          if (payosRes.statusCode === 200 && payosRes.data) {
             window.location.assign(payosRes.data);
          } else {
             setIsLoading(false);
             addToast("Không thể mở Truyền Tống Trận: " + (payosRes.message || 'Lỗi không xác định'), "error");
          }
        } else if (paymentMethod === 'escrow') {
          const escrowRes = await paymentApi.payBookingByEscrow(bookingId);
          if (escrowRes.statusCode === 200) {
            setIsSuccess(true);
          } else {
            addToast("Không đủ Linh Thạch: " + (escrowRes.message || 'Lỗi không xác định'), "error");
          }
        }
      } else {
        addToast("Lỗi Lập Khế Ước: " + (res.message || 'Lỗi không xác định'), "error");
      }
    } catch (error) {
      addToast(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || "Có lỗi xảy ra"), "error");
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  }

  const total = court.price + court.serviceFee;

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background-base">
        <Navbar theme="light" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="card-base max-w-[480px] w-full text-center p-10">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="font-heading text-2xl uppercase tracking-tight text-foreground mb-4">Lập Khế Ước Thành Công!</h1>
            <p className="text-foreground-muted text-base mb-8 leading-relaxed">
              Cảm ơn Đạo hữu. Bí Cảnh {court.name} lúc {slot} đã được giữ chỗ. Mã Khế Ước của Đạo hữu là <b className="text-accent">#{bookingResult?.bookingId || '—'}</b>.
            </p>
            <div className="flex gap-4">
              <Link to="/customer/bookings" className="btn-outline flex-1">Sổ Lưu Khế Ước</Link>
              <Link to="/courts" className="btn-primary flex-1">Về Tông Môn</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar theme="light" />

      <main className="flex-1 max-w-[1080px] mx-auto px-6 pt-[100px] sm:pt-[130px] pb-24 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2.5 label-mono text-foreground-subtle mb-8">
          <Link to="/" className="hover:text-foreground transition-colors duration-200">Tông Môn</Link>
          <span>/</span>
          <Link to="/courts" className="hover:text-foreground transition-colors duration-200">Các Bí Cảnh</Link>
          <span>/</span>
          <span className="text-accent normal-case">Lập Khế Ước</span>
        </nav>

        <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-10">Lập Khế Ước Tu Luyện</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">
          <div className="flex flex-col gap-6">
            {/* User Details */}
            <div className="card-base p-7 sm:p-8">
              <h2 className="font-heading text-xl uppercase text-foreground mb-5">Hồ Sơ Tu Chân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="label-mono text-foreground-muted">Đạo Hiệu (Họ Tên)</label>
                  <input type="text" value={currentUser?.fullName || 'Không có'} readOnly className="input-base bg-surface-hover cursor-not-allowed" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-mono text-foreground-muted">Truyền Âm Phù (SĐT)</label>
                  <input type="text" value={currentUser?.phone || 'Không có'} readOnly className="input-base bg-surface-hover cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card-base p-7 sm:p-8">
              <h2 className="font-heading text-xl uppercase text-foreground mb-5">Phương Thức Xuất Linh Thạch</h2>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input type="checkbox" checked={splitMode} onChange={(e) => setSplitMode(e.target.checked)} className="w-5 h-5 accent-accent" />
                <span className="font-bold text-foreground">Chia bill với bạn bè (Split Payment)</span>
              </label>
              {splitMode && (
                <div className="mb-4">
                  <label className="label-mono text-foreground-muted block mb-2">Email người chơi cùng</label>
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="input-base"
                  />
                </div>
              )}

              <div className="flex flex-col gap-4">
                <label className={`flex items-start gap-4 p-5 border-2 cursor-pointer transition-colors ${paymentMethod === 'escrow' ? 'border-accent bg-accent/10' : 'border-border-default hover:border-border-hover'}`}>
                  <input type="radio" name="payment" value="escrow" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="mt-1 w-5 h-5 accent-accent" />
                  <div>
                    <p className="font-bold text-foreground">Túi Càn Khôn (Ví ký quỹ)</p>
                    <p className="text-sm mt-1.5 font-medium text-foreground-muted">Linh Thạch hiện có: <b className="text-accent">{escrowBalance.toLocaleString('vi-VN')} LT</b></p>
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-5 border-2 cursor-pointer transition-colors ${paymentMethod === 'payos' ? 'border-accent bg-accent/10' : 'border-border-default hover:border-border-hover'}`}>
                  <input type="radio" name="payment" value="payos" checked={paymentMethod === 'payos'} onChange={() => setPaymentMethod('payos')} className="mt-1 w-5 h-5 accent-accent" />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-foreground">Mã Trận PayOS</p>
                      <p className="text-sm mt-1.5 font-medium text-foreground-muted">Thẻ Ngọc / Thẻ Tín Dụng / QR Trận</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel - Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="card-base p-7 sm:p-8 bg-ink text-paper">
              <h2 className="font-heading text-xl uppercase mb-6">Khế Ước Thư</h2>

              <div className="flex gap-4 pb-5 border-b border-white/15 mb-5">
                <div className="w-20 h-20 border-2 border-white/20 flex items-center justify-center shrink-0">
                   <span className="text-4xl">⛩️</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-snug">{court.name}</h3>
                  <p className="text-sm mt-2 font-medium text-paper/70">{formatDate(date)} • {slot}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-medium text-paper/80">
                  <span>Linh Thạch vào cửa</span>
                  <span>{court.price.toLocaleString('vi-VN')} LT</span>
                </div>
                {court.serviceFee > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-paper/80">
                    <span className="flex items-center gap-1.5">
                      Phí truyền tống trận
                      <span className="label-mono border border-white/20 px-1.5">5%</span>
                    </span>
                    <span>{court.serviceFee.toLocaleString('vi-VN')} LT</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-white/15 pt-6 mt-4">
                  <span className="font-bold uppercase text-sm">Tổng Tiêu Hao</span>
                  <span className="font-heading text-2xl text-accent">{total.toLocaleString('vi-VN')} LT</span>
                </div>
              </div>

              <button onClick={handleBooking} disabled={isLoading} className="w-full h-14 bg-accent text-ink font-bold text-sm uppercase tracking-[0.04em] transition-colors hover:bg-accent-bright disabled:opacity-70 disabled:cursor-not-allowed rounded-[2px]">
                {isLoading ? 'Đang kích hoạt...' : 'Xuất Linh Thạch & Lập Khế Ước'}
              </button>

              <p className="text-center text-paper/60 text-xs font-medium mt-6 leading-relaxed">
                Bằng việc nhấn Lập Khế Ước, Đạo hữu đã đồng ý với <a href="#" className="text-accent hover:underline">Thiên Đạo Pháp Tắc</a> của Thương Hội.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="light" />
    </div>
  )
}
