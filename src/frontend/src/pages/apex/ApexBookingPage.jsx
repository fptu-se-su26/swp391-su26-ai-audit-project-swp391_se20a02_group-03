import { useState, useEffect } from 'react'
import { Swords, Circle, CheckCircle, CreditCard, Wallet, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import ApexLayout from '../../layouts/ApexLayout'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { useToast } from '../../components/Toast'

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
]

const sportTypes = ['All', 'Badminton', 'Pickleball']

export default function ApexBookingPage() {
  const [filter, setFilter] = useState('All')
  const [courts, setCourts] = useState([])
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [minDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedSlots, setSelectedSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [step, setStep] = useState(1) // 1=select court, 2=pick time, 3=confirm
  const [booked, setBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('vnpay')
  const [escrowBalance, setEscrowBalance] = useState(0)

  const { addToast } = useToast()

  // Load Courts
  useEffect(() => {
    bookingApi.getCourts()
      .then(res => {
        if (res.data) {
          const courtsArray = Array.isArray(res.data) ? res.data : (res.data.items || []);
          const mappedCourts = courtsArray.map(c => ({
            id: c.courtId,
            name: c.name,
            type: c.courtTypeName || 'Badminton',
            price: c.pricePerHour > 0 ? c.pricePerHour : 100000,
            status: c.status?.toLowerCase() === 'available' ? 'available' : 'booked',
            icon: c.courtTypeName?.toLowerCase().includes('pickleball') ? <Circle size={20} /> : <Swords size={20} />,
            capacity: 4,
            features: c.description ? c.description.split(',').map(s => s.trim()) : ['Tiêu chuẩn'],
            imageUrl: c.imageUrl
          }))
          setCourts(mappedCourts)
        }
      })
      .catch(err => addToast('Lỗi tải danh sách sân: ' + (typeof err === 'string' ? err : err.message || 'Lỗi không xác định'), 'error'))

    // Load Wallet
    paymentApi.getEscrowWallet()
      .then(res => {
        if (res.data) setEscrowBalance(res.data.balance || 0)
      })
      .catch(err => console.error("Lỗi ví", err))
  }, [addToast])

  // Load booked slots when court or date changes
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      bookingApi.getBookedSlots(selectedCourt.id, selectedDate)
        .then(res => {
          if (res.data) {
            const slots = Array.isArray(res.data) ? res.data : []
            const normalized = slots.map(s => typeof s === 'string' ? s.substring(0, 5) : s)
            setBookedSlots(normalized)
          } else {
            setBookedSlots([])
          }
        })
        .catch(err => console.error('Lỗi tải giờ bận', err))
    }
  }, [selectedCourt, selectedDate])

  const filtered = courts.filter(c => filter === 'All' || c.type === filter)

  function toggleSlot(slot) {
    if (bookedSlots.includes(slot)) return

    // Đảm bảo chọn giờ liên tiếp
    setSelectedSlots(prev => {
        if (prev.includes(slot)) return prev.filter(s => s !== slot)

        if (prev.length > 0) {
            const slotHour = parseInt(slot.split(':')[0])
            const prevHours = prev.map(s => parseInt(s.split(':')[0]))
            const minHour = Math.min(...prevHours)
            const maxHour = Math.max(...prevHours)

            if (slotHour !== minHour - 1 && slotHour !== maxHour + 1) {
                addToast("Vui lòng chọn các khung giờ liên tiếp", "warning")
                return prev
            }
        }
        return [...prev, slot].sort()
    })
  }

  const totalPrice = selectedCourt ? selectedSlots.length * selectedCourt.price : 0

  function calculateEndTime(lastSlot) {
    const h = parseInt(lastSlot.split(':')[0])
    return `${String(h + 1).padStart(2, '0')}:00`
  }

  async function handleConfirm() {
    if (selectedSlots.length === 0) return

    if (paymentMethod === 'escrow' && escrowBalance < totalPrice) {
      addToast(`Số dư ví không đủ! (Cần thêm ${(totalPrice - escrowBalance).toLocaleString('vi-VN')} VNĐ). Vui lòng nạp tiền.`, "error");
      return;
    }

    setIsLoading(true)
    try {
      const startTime = selectedSlots[0].length === 5 ? selectedSlots[0] + ':00' : selectedSlots[0]
      const lastSlot = selectedSlots[selectedSlots.length - 1]
      const endTimeStr = calculateEndTime(lastSlot)
      const endTime = endTimeStr.length === 5 ? endTimeStr + ':00' : endTimeStr

      const payload = {
        details: [
          {
            courtId: selectedCourt.id,
            bookingDate: selectedDate,
            startTime: startTime,
            endTime: endTime
          }
        ]
      }

      const res = await bookingApi.createBooking(payload)

      if (res.statusCode === 200 || res.statusCode === 201) {
        const bookingId = res.data?.bookingId

        if (!bookingId) {
            addToast("Không nhận được mã đặt sân từ server.", "error")
            setIsLoading(false)
            return
        }

        if (paymentMethod === 'vnpay') {
          const vnpayRes = await paymentApi.createVnPayUrl(0, 'Booking', bookingId)
          if (vnpayRes.statusCode === 200 && vnpayRes.data) {
             addToast('Bạn có 15 phút để hoàn tất thanh toán. Quá hạn sẽ tự động hủy đơn.', 'warning')
             window.location.assign(vnpayRes.data)
             return
          } else {
             addToast("Không thể tạo link thanh toán VNPay", "error")
          }
        } else if (paymentMethod === 'escrow') {
          const escrowRes = await paymentApi.payBookingByEscrow(bookingId)
          if (escrowRes.statusCode === 200) {
            setBooked(true)
          } else {
            addToast("Lỗi thanh toán ví: " + escrowRes.message, "error")
          }
        }
      } else {
        addToast(res.message || "Lỗi đặt sân", "error")
      }
    } catch (error) {
      const errMsg = typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || "Có lỗi xảy ra");
      addToast(errMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (booked) {
    return (
      <ApexLayout>
        <div className="max-w-[600px] mx-auto mt-12 card-base text-center auth-animate-in">
          <div className="w-16 h-16 border-2 border-accent flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-accent" />
          </div>
          <h2 className="font-heading text-2xl uppercase text-foreground mb-2">Đặt sân thành công!</h2>
          <p className="text-lg font-bold text-foreground mb-1">{selectedCourt?.name}</p>
          <p className="text-foreground-muted mb-6">{selectedDate} · {selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</p>

          <div className="bg-background-base border-2 border-border-strong p-4 mb-8">
            <p className="label-mono text-foreground-muted mb-1">Đã thanh toán</p>
            <p className="text-xl font-bold text-accent">{totalPrice.toLocaleString('vi-VN')} VNĐ</p>
            <p className="label-mono text-foreground-muted mt-1">qua {paymentMethod === 'vnpay' ? 'VNPay' : 'Ví'}</p>
          </div>

          <button
            className="w-full h-11 btn-primary"
            onClick={() => { setBooked(false); setStep(1); setSelectedCourt(null); setSelectedSlots([]) }}
          >
            Đặt sân khác
          </button>
        </div>
      </ApexLayout>
    )
  }

  return (
    <ApexLayout>
      <div className="max-w-[1200px] mx-auto auth-animate-in pb-24 lg:pb-0">
        {/* Header & Stepper */}
        <div className="flex max-md:flex-col md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-heading text-3xl uppercase tracking-[-0.01em] text-foreground">Đặt sân</h1>
            <p className="text-sm text-foreground-muted mt-1">Chọn môn thể thao, thời gian và bắt đầu trận đấu.</p>
          </div>

          <div className="flex items-center gap-2">
            {['Chọn sân', 'Chọn giờ', 'Xác nhận'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 label-mono border-2 ${
                  step > i + 1 ? 'text-accent border-accent' :
                  step === i + 1 ? 'text-ink bg-accent border-accent' :
                  'text-foreground-muted border-border-default'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    step > i + 1 ? 'bg-accent text-ink' :
                    step === i + 1 ? 'bg-ink text-paper' :
                    'bg-surface text-foreground-muted'
                  }`}>
                    {step > i + 1 ? <Check size={12} /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < 2 && <div className={`w-8 h-[2px] mx-2 ${step > i + 1 ? 'bg-accent' : 'bg-border-default'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Court */}
        {step === 1 && (
          <div className="auth-animate-fade">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {sportTypes.map(t => (
                <button
                  key={t}
                  className={`px-4 h-9 label-mono border-2 transition-colors ${
                    filter === t
                      ? 'bg-accent text-ink border-accent'
                      : 'bg-surface border-border-default text-foreground-muted hover:border-border-hover hover:text-foreground'
                  }`}
                  onClick={() => setFilter(t)}
                >
                  {t === 'All' ? 'Tất cả' : t === 'Badminton' ? 'Cầu lông' : t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {courts.length === 0 && filtered.length === 0 && (
                <div className="col-span-full py-12 text-center text-foreground-muted">Đang tải danh sách sân...</div>
              )}
              {courts.length > 0 && filtered.length === 0 && (
                <div className="col-span-full py-12 text-center text-foreground-muted">Không có sân phù hợp với bộ lọc hiện tại.</div>
              )}
              {filtered.map(court => (
                <div
                  key={court.id}
                  className={`card-base flex flex-col justify-between transition-colors duration-150 ${
                    court.status === 'booked' ? 'opacity-50 cursor-not-allowed' :
                    selectedCourt?.id === court.id ? '!border-accent cursor-pointer' :
                    'hover:border-border-hover cursor-pointer'
                  }`}
                  onClick={() => court.status !== 'booked' && setSelectedCourt(court)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="w-10 h-10 bg-background-base border-2 border-border-default flex items-center justify-center shrink-0 text-foreground">{court.icon}</span>
                      <span className={`px-2 py-0.5 label-mono border ${
                        court.status === 'booked' ? 'bg-transparent text-danger border-danger' : 'bg-transparent text-accent border-accent'
                      }`}>
                        {court.status === 'booked' ? 'Tạm ngưng' : 'Khả dụng'}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg uppercase text-foreground mb-1">{court.name}</h3>
                    <p className="text-xs text-foreground-muted mb-4">{court.type === 'Badminton' ? 'Cầu lông' : court.type} · Tối đa {court.capacity} người</p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {court.features.slice(0, 3).map(f => (
                        <span key={f} className="px-2 py-1 bg-background-base border border-border-default text-[10px] font-medium text-foreground-muted">{f}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-default">
                    <span className="text-[13px] text-foreground-muted"><strong className="text-foreground font-bold">{court.price.toLocaleString('vi-VN')} đ</strong> /giờ</span>
                    {court.status !== 'booked' && (
                      <button
                        className={`h-8 px-4 label-mono border-2 transition-colors ${
                          selectedCourt?.id === court.id
                            ? 'bg-accent text-ink border-accent'
                            : 'bg-transparent text-foreground border-border-default hover:border-foreground'
                        }`}
                        onClick={(e) => { e.stopPropagation(); setSelectedCourt(court); setStep(2) }}
                      >
                        {selectedCourt?.id === court.id ? 'Đã chọn' : 'Chọn'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Bar */}
            {selectedCourt && (
              <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] bg-surface border-t-2 border-border-strong p-4 z-50 flex flex-wrap items-center justify-between gap-4 auth-animate-fade">
                <div className="flex max-sm:flex-col sm:items-center sm:gap-4 ml-2 lg:ml-4">
                  <span className="text-sm text-foreground-muted">Đã chọn: <strong className="text-foreground ml-1">{selectedCourt.name}</strong></span>
                  <span className="label-mono text-accent">{selectedCourt.price.toLocaleString('vi-VN')} đ/giờ</span>
                </div>
                <button
                  className="btn-primary mr-2 lg:mr-4"
                  onClick={() => setStep(2)}
                >
                  Chọn giờ <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Pick Time */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auth-animate-fade">
            {/* Left: Time Picker */}
            <div className="lg:col-span-2 card-base">
              <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border-default">
                <h2 className="font-heading text-lg uppercase text-foreground">Chọn khung giờ</h2>
                <div className="flex items-center gap-3">
                  <label htmlFor="booking-date" className="label-mono text-foreground-muted">Ngày</label>
                  <input
                    id="booking-date"
                    type="date"
                    value={selectedDate}
                    min={minDate}
                    onChange={e => { setSelectedDate(e.target.value); setSelectedSlots([]); }}
                    className="input-base w-auto h-10 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 label-mono text-foreground-muted">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-surface border border-border-hover" /> Trống</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-accent" /> Đã chọn</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-surface-hover border border-border-default opacity-50" /> Đã đặt</div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {timeSlots.map(slot => {
                  const isBooked = bookedSlots.includes(slot)
                  const isSelected = selectedSlots.includes(slot)
                  const isPast = selectedDate === minDate && slot < new Date().toTimeString().slice(0, 5)
                  const isDisabled = isBooked || isPast

                  return (
                    <button
                      key={slot}
                      className={`h-12 text-sm font-bold transition-colors border-2 ${
                        isDisabled
                          ? 'bg-surface border-border-default text-foreground-muted cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-accent border-accent text-ink'
                          : 'bg-transparent border-border-hover text-foreground-muted hover:border-accent hover:text-accent'
                      }`}
                      onClick={() => toggleSlot(slot)}
                      disabled={isDisabled}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right: Summary Panel */}
            <div className="card-base h-fit sticky top-24">
              <h3 className="font-heading text-lg uppercase text-foreground mb-5 pb-4 border-b border-border-default">Tóm tắt đặt sân</h3>

              <div className="flex items-center gap-3 mb-6 bg-background-base p-3 border-2 border-border-default">
                <span className="w-10 h-10 bg-surface flex items-center justify-center border border-border-default shrink-0 text-foreground">{selectedCourt.icon}</span>
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">{selectedCourt.name}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">{selectedCourt.type === 'Badminton' ? 'Cầu lông' : selectedCourt.type}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted font-medium">Ngày</span>
                  <strong className="text-foreground">{selectedDate}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted font-medium">Khung giờ</span>
                  <strong className="text-foreground text-right max-w-[140px] truncate">{selectedSlots.length > 0 ? selectedSlots.join(', ') : '—'}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted font-medium">Thời lượng</span>
                  <strong className="text-foreground">{selectedSlots.length} giờ</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-border-hover mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-base uppercase text-foreground">Tổng thanh toán</span>
                  <strong className="text-lg font-bold text-accent">{totalPrice.toLocaleString('vi-VN')} đ</strong>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className={`h-11 text-sm font-bold transition-colors ${
                    selectedSlots.length === 0
                      ? 'bg-surface text-foreground-muted cursor-not-allowed border-2 border-border-default'
                      : 'btn-primary'
                  }`}
                  disabled={selectedSlots.length === 0}
                  onClick={() => setStep(3)}
                >
                  Tiếp tục thanh toán <ArrowRight size={16} />
                </button>
                <button
                  className="btn-outline h-11"
                  onClick={() => { setStep(1); setSelectedSlots([]) }}
                >
                  <ArrowLeft size={16} /> Quay lại chọn sân
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="max-w-[700px] mx-auto auth-animate-fade">
            <h2 className="font-heading text-lg uppercase text-foreground mb-5">Xác nhận &amp; Thanh toán</h2>

            <div className="card-base mb-6">
              <div className="space-y-4 mb-8">
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Sân</span>
                  <strong className="text-sm text-foreground flex items-center gap-1.5">{selectedCourt.icon} {selectedCourt.name}</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Ngày</span>
                  <strong className="text-sm text-foreground">{selectedDate}</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Giờ</span>
                  <strong className="text-sm text-foreground">{selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Thời lượng</span>
                  <strong className="text-sm text-foreground">{selectedSlots.length} giờ</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Giá thuê</span>
                  <strong className="text-sm text-foreground">{selectedCourt.price.toLocaleString('vi-VN')} đ/giờ</strong>
                </div>
              </div>

              <div className="p-4 bg-background-base border-2 border-border-strong flex items-center justify-between mb-8">
                <span className="font-heading text-base uppercase text-foreground">Tổng thanh toán</span>
                <strong className="text-2xl font-bold text-accent">{totalPrice.toLocaleString('vi-VN')} đ</strong>
              </div>

              <div className="mb-8">
                <h3 className="label-mono text-foreground-muted mb-3">Phương thức thanh toán</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'vnpay' ? 'border-accent' : 'border-border-default hover:border-border-hover'
                  }`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-4 h-4 accent-[var(--color-accent)]" />
                    <span className="text-sm font-semibold text-foreground flex items-center gap-2"><CreditCard size={16} /> VNPay</span>
                  </label>
                  <label className={`flex flex-col justify-center p-4 border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'escrow' ? 'border-accent' : 'border-border-default hover:border-border-hover'
                  }`}>
                    <div className="flex items-center gap-3 mb-1">
                      <input type="radio" name="payment" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="w-4 h-4 accent-[var(--color-accent)]" />
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Wallet size={16} /> Ví cá nhân</span>
                    </div>
                    <span className="text-[11px] text-foreground-muted ml-7">Số dư: {escrowBalance.toLocaleString('vi-VN')} đ</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn-outline w-1/3 h-12"
                  disabled={isLoading}
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft size={16} /> Chỉnh sửa
                </button>
                <button
                  className="btn-primary flex-1 h-12"
                  disabled={isLoading}
                  onClick={handleConfirm}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    `Thanh toán ${totalPrice.toLocaleString('vi-VN')} đ & Xác nhận`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ApexLayout>
  )
}
