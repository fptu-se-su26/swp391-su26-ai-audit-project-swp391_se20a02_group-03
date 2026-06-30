import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { playerFeaturesApi } from '../../api/playerFeaturesApi'
import { useToast } from '../../components/Toast'

/**
 * Helper: decode JWT token từ localStorage để lấy thông tin user.
 * Nếu không có token, trả về null.
 */
function getCurrentUser() {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
  
  const [paymentMethod, setPaymentMethod] = useState('vnpay')
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

        if (paymentMethod === 'vnpay') {
          const vnpayRes = await paymentApi.createVnPayUrl(0, 'Booking', bookingId);
          if (vnpayRes.statusCode === 200 && vnpayRes.data) {
             window.location.assign(vnpayRes.data);
             return;
          } else {
             addToast("Không thể mở Truyền Tống Trận: " + (vnpayRes.message || 'Lỗi không xác định'), "error");
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
      <div className="flex flex-col min-h-screen bg-neo-bg">
        <Navbar theme="light" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-neo-surface border-4 border-neo-muted rounded-sm p-10 max-w-[480px] w-full text-center shadow-[8px_8px_0_var(--color-neo-danger)] relative">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-neo-muted opacity-80"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-neo-muted opacity-80"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-neo-muted opacity-80"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-neo-muted opacity-80"></div>

            <div className="text-neo-accent text-6xl mb-6" style={{ textShadow: '4px 4px 0px var(--color-neo-danger)' }}>📜</div>
            <h1 className="font-heading text-2xl font-bold text-neo-ink tracking-tight mb-4" style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>Lập Khế Ước Thành Công!</h1>
            <p className="text-neo-ink text-xl font-bold mb-8 leading-relaxed">
              Cảm ơn Đạo hữu. Bí Cảnh {court.name} lúc {slot} đã được giữ chỗ. Mã Khế Ước của Đạo hữu là <b className="text-neo-accent" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>#{bookingResult?.bookingId || '—'}</b>.
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
    <div className="flex flex-col min-h-screen bg-neo-bg">
      <Navbar theme="light" />

      <main className="flex-1 max-w-[1080px] mx-auto px-6 pt-28 pb-24 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2.5 text-xl font-bold tracking-wide uppercase text-neo-ink mb-8">
          <Link to="/" className="hover:text-neo-accent transition-colors duration-200">Tông Môn</Link>
          <span className="text-neo-muted border border-neo-muted bg-white px-1">/</span>
          <Link to="/courts" className="hover:text-neo-accent transition-colors duration-200">Các Bí Cảnh</Link>
          <span className="text-neo-muted border border-neo-muted bg-white px-1">/</span>
          <span className="text-neo-accent font-heading text-sm uppercase">Lập Khế Ước</span>
        </nav>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-neo-ink tracking-tight mb-10" style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>Lập Khế Ước Tu Luyện</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">
          <div className="flex flex-col gap-6">
            {/* User Details */}
            <div className="bg-neo-surface border-4 border-neo-muted shadow-[6px_6px_0_var(--color-neo-danger)] rounded-sm p-8">
              <h2 className="font-heading text-xl font-bold text-neo-ink tracking-tight mb-5" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>Hồ Sơ Tu Chân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xl font-bold text-neo-ink tracking-wide uppercase">Đạo Hiệu (Họ Tên)</label>
                  <input type="text" value={currentUser?.fullName || 'Không có'} readOnly className="w-full bg-neo-bg border-4 border-neo-muted rounded-sm px-4 py-3 text-xl text-neo-ink font-bold outline-none shadow-[inset_2px_2px_0_rgba(0,0,0,0.1)]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xl font-bold text-neo-ink tracking-wide uppercase">Truyền Âm Phù (SĐT)</label>
                  <input type="text" value={currentUser?.phone || 'Không có'} readOnly className="w-full bg-neo-bg border-4 border-neo-muted rounded-sm px-4 py-3 text-xl text-neo-ink font-bold outline-none shadow-[inset_2px_2px_0_rgba(0,0,0,0.1)]" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-neo-surface border-4 border-neo-muted shadow-[6px_6px_0_var(--color-neo-danger)] rounded-sm p-8">
              <h2 className="font-heading text-xl font-bold text-neo-ink tracking-tight mb-5" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>Phương Thức Xuất Linh Thạch</h2>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input type="checkbox" checked={splitMode} onChange={(e) => setSplitMode(e.target.checked)} className="w-5 h-5" />
                <span className="font-bold text-neo-ink">Chia bill với bạn bè (Split Payment)</span>
              </label>
              {splitMode && (
                <div className="mb-4">
                  <label className="text-sm font-bold text-neo-ink block mb-1">Email người chơi cùng</label>
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full border-2 border-neo-muted rounded-sm px-3 py-2"
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-4">
                <label className={`group flex items-start gap-4 p-5 border-4 cursor-pointer transition-all duration-75 rounded-sm ${paymentMethod === 'escrow' ? 'border-neo-muted bg-neo-accent shadow-[4px_4px_0_var(--color-neo-danger)]' : 'border-neo-muted bg-white hover:bg-neo-secondary'}`}>
                  <input type="radio" name="payment" value="escrow" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="mt-1 w-5 h-5 accent-neo-danger" />
                  <div>
                    <p className={`font-bold text-xl ${paymentMethod === 'escrow' ? 'text-neo-secondary' : 'text-neo-ink'}`}>Túi Càn Khôn (Ví ký quỹ)</p>
                    <p className={`text-xl mt-1.5 font-bold ${paymentMethod === 'escrow' ? 'text-neo-secondary' : 'text-neo-ink'}`}>Linh Thạch hiện có: <b className="text-[var(--theme-primary)] bg-neo-secondary px-2 py-0.5 border-2 border-neo-muted">{escrowBalance.toLocaleString('vi-VN')} LT</b></p>
                  </div>
                </label>

                <label className={`group flex items-start gap-4 p-5 border-4 cursor-pointer transition-all duration-75 rounded-sm ${paymentMethod === 'vnpay' ? 'border-neo-muted bg-neo-accent shadow-[4px_4px_0_var(--color-neo-danger)]' : 'border-neo-muted bg-white hover:bg-neo-secondary'}`}>
                  <input type="radio" name="payment" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="mt-1 w-5 h-5 accent-neo-danger" />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className={`font-bold text-xl ${paymentMethod === 'vnpay' ? 'text-neo-secondary' : 'text-neo-ink'}`}>Mã Trận VNPay</p>
                      <p className={`text-xl mt-1.5 font-bold ${paymentMethod === 'vnpay' ? 'text-neo-secondary' : 'text-neo-ink'}`}>Thẻ Ngọc / Thẻ Tín Dụng / QR Trận</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel - Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-neo-secondary border-4 border-neo-muted rounded-sm p-7 lg:p-8 shadow-[8px_8px_0_var(--color-neo-danger)] relative overflow-hidden">
              <h2 className="font-heading text-xl font-bold text-neo-ink tracking-tight mb-6" style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>Khế Ước Thư</h2>
              
              <div className="flex gap-4 pb-5 border-b-4 border-neo-muted border-dashed mb-5">
                <div className="w-20 h-20 bg-neo-surface border-4 border-neo-muted flex items-center justify-center shrink-0">
                   <span className="text-4xl">⛩️</span>
                </div>
                <div>
                  <h3 className="font-bold text-neo-ink text-xl leading-snug">{court.name}</h3>
                  <p className="text-lg text-neo-ink mt-2 font-bold bg-white border border-neo-muted px-2 inline-block shadow-[2px_2px_0_var(--color-neo-danger)]">{formatDate(date)} • {slot}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-xl font-bold text-neo-ink">
                  <span>Linh Thạch vào cửa</span>
                  <span>{court.price.toLocaleString('vi-VN')} LT</span>
                </div>
                {court.serviceFee > 0 && (
                  <div className="flex justify-between items-center text-xl font-bold text-neo-ink">
                    <span className="flex items-center gap-1.5">
                      Phí truyền tống trận
                      <span className="bg-neo-bg border-2 border-neo-muted px-1.5 text-lg">5%</span>
                    </span>
                    <span>{court.serviceFee.toLocaleString('vi-VN')} LT</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-2xl border-t-4 border-neo-muted border-dashed pt-6 mt-4">
                  <span className="font-bold text-neo-ink uppercase">Tổng Tiêu Hao</span>
                  <span className="font-heading text-2xl font-bold text-neo-accent" style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>{total.toLocaleString('vi-VN')} LT</span>
                </div>
              </div>

              <button onClick={handleBooking} disabled={isLoading} className="w-full flex items-center justify-center gap-2 h-16 bg-neo-muted border-2 border-neo-muted text-neo-secondary font-bold text-2xl uppercase transition-all duration-75 active:translate-y-1 shadow-[4px_4px_0_var(--color-neo-danger)] hover:bg-neo-accent disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Đang kích hoạt...' : 'Xuất Linh Thạch & Lập Khế Ước'}
              </button>
              
              <p className="text-center text-neo-ink text-lg font-bold mt-6 uppercase tracking-wider leading-relaxed">
                Bằng việc nhấn Lập Khế Ước, Đạo hữu đã đồng ý với <a href="#" className="text-neo-accent hover:underline" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>Thiên Đạo Pháp Tắc</a> của Thương Hội.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="light" />
    </div>
  )
}
