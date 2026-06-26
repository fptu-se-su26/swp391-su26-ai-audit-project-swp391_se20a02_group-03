import { useState, useEffect } from 'react'
import { Swords, Circle, CheckCircle, CreditCard, Wallet, Check } from 'lucide-react'
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
            icon: c.courtTypeName?.toLowerCase().includes('pickleball') ? <Circle size={20} className="text-[var(--theme-primary)]" /> : <Swords size={20} className="text-[var(--theme-primary)]" />,
            capacity: 4,
            features: c.description ? c.description.split(',').map(s => s.trim()) : ['Tiêu chuẩn'],
            imageUrl: c.imageUrl
          }))
          setCourts(mappedCourts)
        }
      })
      .catch(err => addToast('Lỗi tải danh sách sân: ' + (typeof err === 'string' ? err : err.message || 'Unknown error'), 'error'))
      
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
        <div className="max-w-[600px] mx-auto mt-12 card-base rounded-2xl p-8 md:p-12 text-center shadow-sm animate-scale-in">
          <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"><CheckCircle size={40} className="text-accent" /></div>
          <h2 className="text-2xl font-bold text-[var(--theme-primary)] tracking-tight mb-2">Đặt sân thành công!</h2>
          <p className="text-lg font-semibold text-[var(--theme-primary)] mb-1">{selectedCourt?.name}</p>
          <p className="text-foreground-muted mb-6">{selectedDate} · {selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</p>
          
          <div className="bg-[var(--theme-surface)] border border-border-default rounded-xl p-4 mb-8">
            <p className="text-sm text-foreground-muted mb-1">Đã thanh toán</p>
            <p className="text-xl font-bold text-accent">{totalPrice.toLocaleString('vi-VN')} VNĐ</p>
            <p className="text-xs text-foreground-muted mt-1 uppercase tracking-wider font-semibold">qua {paymentMethod === 'vnpay' ? 'VNPay' : 'Ví'}</p>
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
      <div className="max-w-[1200px] mx-auto animate-fade-up">
        {/* Header & Stepper */}
        <div className="flex max-md:flex-col md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--theme-primary)] tracking-tight">Đặt sân</h1>
            <p className="text-sm text-foreground-muted mt-1">Chọn môn thể thao, thời gian và bắt đầu trận đấu.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {['Chọn sân', 'Chọn giờ', 'Xác nhận'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  step > i + 1 ? 'text-accent bg-accent/10 border border-accent/20' : 
                  step === i + 1 ? 'text-white bg-[var(--theme-surface)] border border-border-hover shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 
                  'text-foreground-muted'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step > i + 1 ? 'bg-accent text-white' : 
                    step === i + 1 ? 'bg-white text-black' : 
                    'bg-[var(--theme-surface)] text-foreground-muted'
                  }`}>
                    {step > i + 1 ? <Check size={12} /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < 2 && <div className={`w-8 h-[2px] mx-2 rounded-full ${step > i + 1 ? 'bg-accent' : 'bg-[var(--theme-surface-hover)]'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Court */}
        {step === 1 && (
          <div className="animate-fade-in pb-20">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {sportTypes.map(t => (
                <button 
                  key={t} 
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === t 
                      ? 'bg-accent text-white shadow-[0_0_15px_rgba(94,106,210,0.4)]' 
                      : 'bg-[var(--theme-surface)] border border-border-default text-foreground-muted hover:border-border-hover hover:text-foreground'
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
                  className={`card-base flex flex-col justify-between transition-all duration-300 ${
                    court.status === 'booked' ? 'opacity-50 cursor-not-allowed grayscale' : 
                    selectedCourt?.id === court.id ? 'border-accent ring-1 ring-accent shadow-[0_0_20px_rgba(94,106,210,0.15)] cursor-pointer' : 
                    'hover:-translate-y-1 cursor-pointer'
                  }`}
                  onClick={() => court.status !== 'booked' && setSelectedCourt(court)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-border-default flex items-center justify-center text-xl shrink-0">{court.icon}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        court.status === 'booked' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {court.status === 'booked' ? 'Tạm ngưng' : 'Khả dụng'}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[var(--theme-primary)] mb-1">{court.name}</h3>
                    <p className="text-xs text-foreground-muted mb-4">{court.type === 'Badminton' ? 'Cầu lông' : court.type} · Tối đa {court.capacity} người</p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {court.features.slice(0, 3).map(f => (
                        <span key={f} className="px-2 py-1 bg-[var(--theme-surface)] border border-border-default rounded text-[10px] font-medium text-foreground-muted">{f}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border-default">
                    <span className="text-[13px] text-foreground-muted"><strong className="text-[var(--theme-primary)] font-bold">{court.price.toLocaleString('vi-VN')} đ</strong> /hr</span>
                    {court.status !== 'booked' && (
                      <button 
                        className={`h-8 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          selectedCourt?.id === court.id 
                            ? 'bg-accent text-white shadow-[0_0_10px_rgba(94,106,210,0.3)]' 
                            : 'bg-[var(--theme-surface)] text-foreground hover:bg-[var(--theme-surface-hover)]'
                        }`}
                        onClick={(e) => { e.stopPropagation(); setSelectedCourt(court); setStep(2) }}
                      >
                        {selectedCourt?.id === court.id ? '✓ Đã chọn' : 'Chọn'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Bar */}
            {selectedCourt && (
              <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] bg-white/90 backdrop-blur-md border-t border-[#E2E8F0] p-4 z-50 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-fade-up">
                <div className="flex max-sm:flex-col sm:items-center sm:gap-4 ml-6 lg:ml-8">
                  <span className="text-sm text-foreground-muted">Đã chọn: <strong className="text-foreground ml-1">{selectedCourt.name}</strong></span>
                  <span className="text-sm font-semibold text-[#14B8A6]">{selectedCourt.price.toLocaleString('vi-VN')} đ/giờ</span>
                </div>
                <button 
                  className="h-11 px-6 bg-[var(--theme-primary)] text-[var(--theme-primary)] rounded-xl text-sm font-semibold shadow-sm hover:bg-[#1E293B] active:scale-[0.98] transition-all mr-6 lg:mr-8 flex items-center gap-2" 
                  onClick={() => setStep(2)}
                >
                  Chọn giờ <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Pick Time */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left: Time Picker */}
            <div className="lg:col-span-2 card-base p-6 shadow-sm">
              <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border-default">
                <h2 className="text-[15px] font-bold text-[var(--theme-primary)]">Chọn khung giờ</h2>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider">Ngày</label>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    min={minDate}
                    onChange={e => { setSelectedDate(e.target.value); setSelectedSlots([]); }} 
                    className="h-10 px-3 bg-[var(--theme-surface)] border border-border-default rounded-lg text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all cursor-pointer shadow-sm" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[var(--theme-surface)] border border-border-hover" /> Trống</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent" /> Đã chọn</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[var(--theme-surface-hover)] border border-border-default opacity-50" /> Đã đặt</div>
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
                      className={`h-12 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        isDisabled 
                          ? 'bg-[var(--theme-surface)] border-border-default text-foreground-muted cursor-not-allowed opacity-70' 
                          : isSelected 
                          ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(94,106,210,0.4)] ring-2 ring-accent ring-offset-1 ring-offset-[#050506]' 
                          : 'bg-transparent border-border-hover text-foreground-muted hover:border-accent hover:text-accent hover:bg-accent/5'
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
            <div className="card-base p-6 shadow-sm h-fit sticky top-24">
              <h3 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5 pb-4 border-b border-border-default">Tóm tắt đặt sân</h3>
              
              <div className="flex items-center gap-3 mb-6 bg-[var(--theme-surface)] p-3 rounded-xl border border-border-default">
                <span className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center text-xl shadow-sm border border-border-default shrink-0">{selectedCourt.icon}</span>
                <div>
                  <p className="text-sm font-bold text-[var(--theme-primary)] leading-tight">{selectedCourt.name}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">{selectedCourt.type === 'Badminton' ? 'Cầu lông' : selectedCourt.type}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted font-medium">Ngày</span>
                  <strong className="text-[var(--theme-primary)]">{selectedDate}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted font-medium">Khung giờ</span>
                  <strong className="text-[var(--theme-primary)] text-right max-w-[140px] truncate">{selectedSlots.length > 0 ? selectedSlots.join(', ') : '—'}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted font-medium">Thời lượng</span>
                  <strong className="text-[var(--theme-primary)]">{selectedSlots.length} giờ</strong>
                </div>
              </div>
              
              <div className="pt-4 border-t border-dashed border-border-hover mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-[var(--theme-primary)]">Tổng thanh toán</span>
                  <strong className="text-lg font-bold text-accent">{totalPrice.toLocaleString('vi-VN')} đ</strong>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  className={`h-11 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    selectedSlots.length === 0 
                      ? 'bg-[var(--theme-surface)] text-foreground-muted cursor-not-allowed' 
                      : 'btn-primary'
                  }`} 
                  disabled={selectedSlots.length === 0} 
                  onClick={() => setStep(3)}
                >
                  Tiếp tục thanh toán →
                </button>
                <button 
                  className="btn-outline h-11" 
                  onClick={() => { setStep(1); setSelectedSlots([]) }}
                >
                  ← Quay lại chọn sân
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="max-w-[700px] mx-auto animate-fade-in">
            <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5">Xác nhận & Thanh toán</h2>
            
            <div className="card-base p-6 md:p-8 shadow-sm mb-6">
              <div className="space-y-4 mb-8">
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Sân</span>
                  <strong className="text-sm text-[var(--theme-primary)]">{selectedCourt.icon} {selectedCourt.name}</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Ngày</span>
                  <strong className="text-sm text-[var(--theme-primary)]">{selectedDate}</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Giờ</span>
                  <strong className="text-sm text-[var(--theme-primary)]">{selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3 border-b border-border-default">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Thời lượng</span>
                  <strong className="text-sm text-[var(--theme-primary)]">{selectedSlots.length} giờ</strong>
                </div>
                <div className="flex max-sm:flex-col sm:items-center justify-between py-3">
                  <span className="text-sm font-medium text-foreground-muted mb-1 sm:mb-0">Giá thuê</span>
                  <strong className="text-sm text-[var(--theme-primary)]">{selectedCourt.price.toLocaleString('vi-VN')} đ/giờ</strong>
                </div>
              </div>
              
              <div className="p-4 bg-[var(--theme-surface)] border border-border-default rounded-xl flex items-center justify-between mb-8">
                <span className="text-[15px] font-bold text-[var(--theme-primary)] uppercase tracking-wider">Tổng thanh toán</span>
                <strong className="text-2xl font-bold text-accent">{totalPrice.toLocaleString('vi-VN')} đ</strong>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-3">Phương thức thanh toán</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'vnpay' ? 'border-accent bg-accent/10 ring-1 ring-accent' : 'border-border-default bg-transparent hover:border-border-hover'
                  }`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-4 h-4 text-accent focus:ring-accent" /> 
                    <span className="text-sm font-semibold text-[var(--theme-primary)] flex items-center gap-2"><CreditCard size={16} /> VNPay</span>
                  </label>
                  <label className={`flex flex-col justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'escrow' ? 'border-accent bg-accent/10 ring-1 ring-accent' : 'border-border-default bg-transparent hover:border-border-hover'
                  }`}>
                    <div className="flex items-center gap-3 mb-1">
                      <input type="radio" name="payment" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="w-4 h-4 text-accent focus:ring-accent" /> 
                      <span className="text-sm font-semibold text-[var(--theme-primary)] flex items-center gap-2"><Wallet size={16} /> Ví cá nhân</span>
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
                  ← Chỉnh sửa
                </button>
                <button 
                  className="btn-primary flex-1 h-12 flex items-center justify-center gap-2" 
                  disabled={isLoading} 
                  onClick={handleConfirm}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-[var(--theme-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
