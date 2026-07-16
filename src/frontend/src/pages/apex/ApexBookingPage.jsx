import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Swords, Circle, CheckCircle, CreditCard, Wallet, Check, ArrowLeft, ArrowRight, Calendar, Users, Info } from 'lucide-react'
import dayjs from 'dayjs'
import ApexLayout from '../../layouts/ApexLayout'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { useToast } from '../../components/Toast'

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
]

const sportTypes = ['Tất cả', 'Cầu lông', 'Pickleball']

export default function ApexBookingPage() {
  const [filter, setFilter] = useState('Tất cả')
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
  const [createdBookingId, setCreatedBookingId] = useState(null)

  const { addToast } = useToast()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const origin = searchParams.get('origin')

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
            status: ['available', 'active'].includes(c.status?.toLowerCase()) ? 'available' : 'booked',
            icon: c.courtTypeName?.toLowerCase().includes('pickleball') ? <Circle size={16} /> : <Swords size={16} />,
            capacity: 4,
            features: c.description ? c.description.split(',').map(s => s.trim()) : ['Sân thảm PVC Yonex cao cấp'],
            imageUrl: (
              c.name?.toLowerCase().includes('a1') ? '/images/caulong-a1.jpg' :
              c.name?.toLowerCase().includes('a2') ? '/images/caulong-a3.jpg' :
              c.name?.toLowerCase().includes('a3') ? '/images/caulong-a3.jpg' :
              c.name?.toLowerCase().includes('p1') ? '/images/pickleball-p1.jpg' :
              c.name?.toLowerCase().includes('p2') ? '/images/pickleball-p2.jpg' :
              (c.imageUrl && c.imageUrl.length > 5 ? c.imageUrl : (c.courtTypeName?.toLowerCase().includes('pickleball') ? '/images/pickleball-p1.jpg' : '/images/caulong-a1.jpg'))
            )
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

  const filtered = courts.filter(c => filter === 'Tất cả' || (filter === 'Cầu lông' && c.type === 'Badminton') || (filter === 'Pickleball' && c.type === 'Pickleball'))

  function toggleSlot(slot) {
    if (bookedSlots.includes(slot)) return

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
    if (!lastSlot) return ''
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
             // Might need special handling to pass origin through VNPay return URL in a real app,
             // but assuming we rely on escrow or normal flow here.
             window.location.assign(vnpayRes.data)
             return
          } else {
             addToast("Không thể tạo link thanh toán VNPay", "error")
          }
        } else if (paymentMethod === 'escrow') {
          const escrowRes = await paymentApi.payBookingByEscrow(bookingId)
          if (escrowRes.statusCode === 200) {
            setCreatedBookingId(bookingId)
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
        <div className="bg-[#F8F9FA] min-h-screen py-12">
          <div className="max-w-[500px] mx-auto p-10 text-center auth-animate-in bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-[#14b8a6]" />
            </div>
            <h2 className="font-bold text-[24px] text-[#0f172a] mb-2 m-0 tracking-tight">Đặt sân thành công!</h2>
            <p className="text-[18px] font-bold text-[#14b8a6] mb-2 m-0 uppercase">{selectedCourt?.name}</p>
            <p className="text-gray-500 mb-8 text-[14px] m-0 font-medium">{dayjs(selectedDate).format('DD/MM/YYYY')} · {selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</p>

            <div className="bg-[#F8F9FA] rounded-[16px] p-6 mb-8 text-center border border-gray-100">
              <p className="text-[13px] text-gray-500 mb-1 m-0 font-bold uppercase tracking-wide">Đã thanh toán</p>
              <p className="text-3xl font-bold text-[#0f172a] m-0">{totalPrice.toLocaleString('vi-VN')} đ</p>
              <p className="text-[12px] text-gray-400 mt-2 m-0 font-medium">qua {paymentMethod === 'vnpay' ? 'VNPay' : 'Ví Pro-Sport'}</p>
            </div>

            {origin === 'host_match' ? (
              <button
                className="w-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white h-14 rounded-full text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer"
                onClick={() => navigate(`/matches/create?step=2&new_booking_id=${createdBookingId}`)}
              >
                Quay lại hoàn thành tạo trận
              </button>
            ) : (
              <button
                className="w-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white h-14 rounded-full text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer"
                onClick={() => { setBooked(false); setStep(1); setSelectedCourt(null); setSelectedSlots([]) }}
              >
                Đặt thêm sân khác
              </button>
            )}
          </div>
        </div>
      </ApexLayout>
    )
  }

  return (
    <ApexLayout>
      <div className="bg-[#F8F9FA] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 auth-animate-in pb-28 lg:pb-12 font-sans">

          {/* Header & Stepper */}
          <div className="flex max-md:flex-col md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="font-heading text-4xl uppercase tracking-tight text-[#0f172a] mb-2 m-0">ĐẶT SÂN</h1>
              <p className="text-[14.5px] text-gray-500 m-0">Chọn môn thể thao, thời gian và bắt đầu trận đấu.</p>
            </div>

            <div className="flex items-center gap-3">
              {['Chọn sân', 'Chọn giờ', 'Xác nhận'].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                    step === i + 1 ? 'bg-teal-50 text-[#14b8a6]' :
                    step > i + 1 ? 'bg-gray-100 text-[#0f172a]' : 'text-gray-400'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                      step === i + 1 ? 'bg-[#14b8a6] text-white shadow-sm' :
                      step > i + 1 ? 'bg-[#0f172a] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > i + 1 ? <Check size={14} /> : i + 1}
                    </div>
                    <span className="text-[13px] font-bold hidden sm:block">{s}</span>
                  </div>
                  {i < 2 && <div className="w-8 h-[2px] bg-gray-200 rounded-full" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Select Court */}
          {step === 1 && (
            <div className="auth-animate-fade">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 mb-8">
                {sportTypes.map(t => (
                  <button
                    key={t}
                    className={`px-6 py-2.5 rounded-full text-[13.5px] font-bold transition-all cursor-pointer border ${
                      filter === t
                        ? 'bg-[#14b8a6] text-white border-[#14b8a6] shadow-[0_4px_12px_rgba(20,184,166,0.25)]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#0f172a] shadow-sm'
                    }`}
                    onClick={() => setFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Court Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.length === 0 && filtered.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500 text-[14px]">Đang tải danh sách sân...</div>
                )}
                {courts.length > 0 && filtered.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500 text-[14px]">Không có sân phù hợp với bộ lọc hiện tại.</div>
                )}
                {filtered.map(court => (
                  <div
                    key={court.id}
                    className={`flex flex-col justify-between overflow-hidden transition-all duration-300 bg-white rounded-[20px] border border-gray-100 ${
                      court.status === 'booked' ? 'opacity-60 cursor-not-allowed filter grayscale-[0.3]' :
                      selectedCourt?.id === court.id ? 'ring-2 ring-[#14b8a6] shadow-[0_8px_30px_rgba(20,184,166,0.15)] cursor-pointer -translate-y-1' :
                      'shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer'
                    }`}
                    onClick={() => court.status !== 'booked' && setSelectedCourt(court)}
                  >
                    {/* Thumbnail Image */}
                    <div className="h-[180px] relative bg-gray-100 overflow-hidden">
                      <img src={court.imageUrl} alt={court.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
                        court.status === 'booked' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {court.status === 'booked' ? 'Tạm ngưng' : 'Khả dụng'}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-[18px] uppercase tracking-tight text-[#0f172a] m-0 mb-2">{court.name}</h3>
                      <p className="text-[13px] text-gray-500 mb-4 flex items-center gap-1.5 font-medium m-0">
                        <span className="text-[#14b8a6]">{court.icon}</span>
                        {court.type === 'Badminton' ? 'Cầu lông' : court.type}
                      </p>

                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                          <Users size={16} className="text-gray-400" /> Tối đa {court.capacity} người
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                          <Info size={16} className="text-gray-400" /> <span className="line-clamp-1">{court.features[0] || 'Sân đạt chuẩn'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 pt-2 mt-auto">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[20px] font-bold text-[#0f172a] m-0">{court.price.toLocaleString('vi-VN')}đ</span>
                        <span className="text-[13px] text-gray-500 font-medium">/h</span>
                      </div>
                      {court.status !== 'booked' && (
                        <button
                          className={`h-10 px-5 rounded-full text-[13px] font-bold uppercase tracking-wide transition-all border-0 cursor-pointer shadow-sm ${
                            selectedCourt?.id === court.id
                              ? 'bg-[#0f172a] text-white'
                              : 'bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-[0_4px_12px_rgba(20,184,166,0.25)]'
                          }`}
                          onClick={(e) => { e.stopPropagation(); setSelectedCourt(court); setStep(2) }}
                        >
                          {selectedCourt?.id === court.id ? 'Đã chọn' : 'Chọn sân'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pick Time */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 auth-animate-fade">
              {/* Left: Time Picker */}
              <div className="lg:col-span-2 bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-5 md:p-8">
                <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-100">
                  <h2 className="text-[18px] md:text-[20px] font-bold uppercase tracking-tight text-[#0f172a] m-0">Chọn khung giờ</h2>
                  <div className="flex items-center gap-2 bg-[#F8F9FA] p-1.5 rounded-full border border-gray-200">
                    <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 shrink-0"><Calendar size={16} /></span>
                    <input
                      id="booking-date"
                      type="date"
                      value={selectedDate}
                      min={minDate}
                      onChange={e => { setSelectedDate(e.target.value); setSelectedSlots([]); }}
                      className="h-8 pr-4 bg-transparent text-[13px] md:text-[14px] font-bold text-[#0f172a] cursor-pointer outline-none transition-all appearance-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-8 text-[12px] md:text-[13px] font-bold text-gray-500">
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#F8F9FA] border border-gray-200" /> Trống</div>
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#14b8a6] shadow-[0_0_10px_rgba(20,184,166,0.3)]" /> Đang chọn</div>
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-gray-200" /> Kín chỗ / Quá hạn</div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {timeSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot)
                    const isSelected = selectedSlots.includes(slot)
                    const isPast = selectedDate === minDate && slot < new Date().toTimeString().slice(0, 5)
                    const isDisabled = isBooked || isPast

                    return (
                      <button
                        key={slot}
                        className={`h-12 rounded-[12px] text-[15px] font-bold transition-all border cursor-pointer ${
                          isDisabled
                            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-[#14b8a6] border-[#14b8a6] text-white shadow-[0_4px_12px_rgba(20,184,166,0.3)] transform -translate-y-0.5'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#14b8a6] hover:text-[#14b8a6] hover:bg-teal-50'
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
              <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 h-fit lg:sticky lg:top-24">
                <h3 className="text-[16px] md:text-[18px] font-bold uppercase tracking-tight text-[#0f172a] mb-6 m-0">Tóm tắt đặt sân</h3>

                <div className="flex items-center gap-4 mb-8 bg-[#F8F9FA] p-4 rounded-[16px] border border-gray-100">
                  <img src={selectedCourt.imageUrl} alt="" className="w-16 h-16 rounded-[12px] object-cover shrink-0 shadow-sm" />
                  <div>
                    <p className="text-[15px] font-bold uppercase text-[#0f172a] leading-tight m-0 mb-1">{selectedCourt.name}</p>
                    <p className="text-[13px] font-bold text-[#14b8a6] m-0">{selectedCourt.type === 'Badminton' ? 'Cầu lông' : selectedCourt.type}</p>
                  </div>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="flex items-center justify-between text-[14.5px]">
                    <span className="text-gray-500 font-medium">Ngày chơi</span>
                    <strong className="text-[#0f172a]">{dayjs(selectedDate).format('DD/MM/YYYY')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[14.5px]">
                    <span className="text-gray-500 font-medium">Khung giờ</span>
                    <strong className="text-[#0f172a] text-right max-w-[140px] truncate">{selectedSlots.length > 0 ? selectedSlots.join(', ') : '—'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[14.5px]">
                    <span className="text-gray-500 font-medium">Thời lượng</span>
                    <strong className="text-[#0f172a]">{selectedSlots.length} tiếng</strong>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold uppercase tracking-wide text-gray-500 m-0">Tổng tiền</span>
                    <strong className="text-[24px] font-black text-[#14b8a6]">{totalPrice.toLocaleString('vi-VN')} đ</strong>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className={`h-12 rounded-full text-[14px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 border-0 ${
                      selectedSlots.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-[0_4px_14px_rgba(20,184,166,0.3)] cursor-pointer'
                    }`}
                    disabled={selectedSlots.length === 0}
                    onClick={() => setStep(3)}
                  >
                    Tiếp tục thanh toán <ArrowRight size={18} />
                  </button>
                  <button
                    className="bg-white text-gray-500 hover:text-[#0f172a] h-12 rounded-full text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2 border border-transparent hover:bg-gray-50"
                    onClick={() => { setStep(1); setSelectedSlots([]) }}
                  >
                    <ArrowLeft size={16} /> Đổi sân khác
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="max-w-[700px] mx-auto auth-animate-fade">
              <h2 className="text-[20px] font-bold uppercase tracking-tight text-[#0f172a] mb-8 m-0 text-center">Xác nhận thanh toán</h2>

              <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-8 mb-8">
                <div className="space-y-6 mb-8">
                  <div className="flex max-sm:flex-col sm:items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Sân bãi</span>
                    <strong className="text-[16px] font-bold uppercase text-[#0f172a] flex items-center gap-2"><span className="text-[#14b8a6]">{selectedCourt.icon}</span> {selectedCourt.name}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Ngày chơi</span>
                    <strong className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2"><Calendar size={18} className="text-gray-400" /> {dayjs(selectedDate).format('DD/MM/YYYY')}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Khung giờ</span>
                    <strong className="text-[16px] font-bold text-[#14b8a6]">{selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center justify-between">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Thời lượng</span>
                    <strong className="text-[16px] font-bold text-[#0f172a]">{selectedSlots.length} tiếng</strong>
                  </div>
                </div>

                <div className="p-6 bg-[#F8F9FA] rounded-[16px] flex items-center justify-between mb-8 border border-gray-100">
                  <span className="text-[15px] font-bold uppercase tracking-wide text-gray-500 m-0">Tổng thanh toán</span>
                  <strong className="text-[28px] font-black text-[#14b8a6]">{totalPrice.toLocaleString('vi-VN')} đ</strong>
                </div>

                <div className="mb-8">
                  <h3 className="text-[15px] font-bold text-[#0f172a] mb-4 m-0">Chọn nguồn tiền thanh toán</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`flex items-center gap-4 p-5 rounded-[16px] border-2 cursor-pointer transition-all ${
                      paymentMethod === 'vnpay' ? 'border-[#14b8a6] bg-teal-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-[#F8F9FA]'
                    }`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-4 h-4 accent-[#14b8a6]" />
                      <span className="text-[15px] font-bold text-[#0f172a] flex items-center gap-3"><CreditCard size={20} className="text-[#14b8a6]" /> VNPay</span>
                    </label>
                    <label className={`flex flex-col justify-center p-5 rounded-[16px] border-2 cursor-pointer transition-all ${
                      paymentMethod === 'escrow' ? 'border-[#14b8a6] bg-teal-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-[#F8F9FA]'
                    }`}>
                      <div className="flex items-center gap-4 mb-1">
                        <input type="radio" name="payment" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="w-4 h-4 accent-[#14b8a6]" />
                        <span className="text-[15px] font-bold text-[#0f172a] flex items-center gap-3"><Wallet size={20} className="text-[#14b8a6]" /> Ví cá nhân</span>
                      </div>
                      <span className="text-[13px] font-medium text-gray-500 ml-9">Số dư khả dụng: {escrowBalance.toLocaleString('vi-VN')} đ</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    className="bg-white text-gray-600 hover:text-[#0f172a] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 w-full sm:w-1/3 h-14 rounded-full text-[14px] font-bold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
                    disabled={isLoading}
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft size={18} /> Đổi giờ
                  </button>
                  <button
                    className="bg-[#14b8a6] hover:bg-[#0f9e8c] text-white flex-1 h-14 rounded-full text-[15px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_16px_rgba(20,184,166,0.3)] border-0 cursor-pointer flex items-center justify-center"
                    disabled={isLoading}
                    onClick={handleConfirm}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      `Thanh toán ngay`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ApexLayout>
  )
}
