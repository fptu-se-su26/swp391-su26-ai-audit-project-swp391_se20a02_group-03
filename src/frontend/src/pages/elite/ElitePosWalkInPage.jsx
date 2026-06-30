import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import EliteLayout from '../../layouts/EliteLayout'
import { courtApi } from '../../api/courtApi'
import { bookingApi } from '../../api/bookingApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/Toast'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
]

function slotEndTime(lastSlot) {
  const h = parseInt(lastSlot.split(':')[0], 10)
  return `${String(h + 1).padStart(2, '0')}:00`
}

export default function ElitePosWalkInPage() {
  const { addToast } = useToast()
  const [searchParams] = useSearchParams()
  const prefillCourtId = searchParams.get('courtId')
  const prefillDate = searchParams.get('date')
  const prefillStart = searchParams.get('start')
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourtId, setSelectedCourtId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedSlots, setSelectedSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [customerMode, setCustomerMode] = useState('email')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastBooking, setLastBooking] = useState(null)

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  useEffect(() => {
    courtApi.getAll({ pageSize: 24, status: 'Available' })
      .then(res => {
        if (res.statusCode === 200 && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.items || [])
          setCourts(list)
          if (list.length) {
            const fromQuery = prefillCourtId ? Number(prefillCourtId) : null
            const match = fromQuery && list.some(c => c.courtId === fromQuery)
            setSelectedCourtId(match ? fromQuery : list[0].courtId)
          }
        } else {
          setError(res.message || 'Không tải được danh sách sân.')
        }
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được danh sách sân.'))
      .finally(() => setLoading(false))
  }, [prefillCourtId])

  useEffect(() => {
    if (prefillDate && /^\d{4}-\d{2}-\d{2}$/.test(prefillDate)) {
      setSelectedDate(prefillDate)
    }
  }, [prefillDate])

  useEffect(() => {
    if (!selectedCourtId || !selectedDate) return
    setSlotsLoading(true)
    setSelectedSlots([])
    bookingApi.getBookedSlots(selectedCourtId, selectedDate)
      .then(res => {
        const slots = Array.isArray(res.data) ? res.data : []
        setBookedSlots(slots.map(s => (typeof s === 'string' ? s.substring(0, 5) : s)))
      })
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [selectedCourtId, selectedDate])

  useEffect(() => {
    if (!prefillStart || slotsLoading) return
    const slot = prefillStart.substring(0, 5)
    if (bookedSlots.includes(slot)) return
    setSelectedSlots([slot])
  }, [prefillStart, bookedSlots, slotsLoading])

  const selectedCourt = courts.find(c => c.courtId === selectedCourtId) || courts[0]
  const hourlyRate = selectedCourt?.pricePerHour ?? selectedCourt?.basePrice ?? selectedCourt?.hourlyRate ?? 100000
  const estimatedTotal = selectedSlots.length * hourlyRate

  function toggleSlot(slot) {
    if (bookedSlots.includes(slot)) return
    setSelectedSlots(prev => {
      if (prev.includes(slot)) return prev.filter(s => s !== slot)
      if (prev.length > 0) {
        const slotHour = parseInt(slot.split(':')[0], 10)
        const prevHours = prev.map(s => parseInt(s.split(':')[0], 10))
        const minHour = Math.min(...prevHours)
        const maxHour = Math.max(...prevHours)
        if (slotHour !== minHour - 1 && slotHour !== maxHour + 1) {
          addToast('Vui lòng chọn các khung giờ liên tiếp', 'warning')
          return prev
        }
      }
      return [...prev, slot].sort()
    })
  }

  async function handleBook() {
    if (!selectedCourt) return
    if (selectedSlots.length === 0) {
      addToast('Chọn ít nhất 1 khung giờ', 'warning')
      return
    }
    if (customerMode === 'email' && !customerEmail.trim()) {
      addToast('Nhập email khách hàng', 'warning')
      return
    }
    if (customerMode === 'guest' && !customerName.trim()) {
      addToast('Nhập tên khách lẻ', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const startTime = `${selectedSlots[0]}:00`
      const endTime = `${slotEndTime(selectedSlots[selectedSlots.length - 1])}:00`

      const payload = {
        details: [{
          courtId: selectedCourt.courtId,
          bookingDate: selectedDate,
          startTime,
          endTime,
        }],
        notes: notes.trim() || undefined,
      }

      if (customerMode === 'email') {
        payload.customerEmail = customerEmail.trim()
      } else {
        payload.customerName = customerName.trim()
        payload.customerPhone = customerPhone.trim() || undefined
      }

      const res = await bookingApi.createWalkInBooking(payload)
      if (res.statusCode === 201 && res.data) {
        setLastBooking(res.data)
        addToast(res.message || 'Đặt sân tại quầy thành công!', 'success')
        setSelectedSlots([])
        bookingApi.getBookedSlots(selectedCourt.courtId, selectedDate)
          .then(r => {
            const slots = Array.isArray(r.data) ? r.data : []
            setBookedSlots(slots.map(s => (typeof s === 'string' ? s.substring(0, 5) : s)))
          })
          .catch(() => {})
      } else {
        addToast(res.message || 'Đặt sân thất bại', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Đặt sân thất bại', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <EliteLayout>
        <PageLoader message="Đang tải sân..." />
      </EliteLayout>
    )
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Đặt sân trực tiếp tại quầy</h1>
            <p className="text-sm text-slate-500">Chọn sân, khung giờ và xác nhận thanh toán tiền mặt.</p>
          </div>
          <Link to="/elite/scanner" className="text-sm font-semibold text-[#5E6AD2] no-underline hover:underline">Quét QR vào sân →</Link>
        </div>

        {error ? (
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : courts.length === 0 ? (
          <EmptyState title="Không có sân trống" subtitle="Tất cả sân đang được sử dụng hoặc bảo trì." />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courts.map(court => {
                  const selected = selectedCourtId === court.courtId
                  return (
                    <button
                      key={court.courtId}
                      type="button"
                      onClick={() => setSelectedCourtId(court.courtId)}
                      className={`text-left bg-white rounded-xl border-2 p-4 transition-all cursor-pointer ${selected ? 'border-[#5E6AD2] shadow-[0_4px_12px_rgba(94,106,210,0.15)]' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <img src={court.imageUrl || FALLBACK_IMG} alt={court.name} className="w-full h-28 object-cover rounded-lg mb-3" />
                      <h3 className="text-base font-bold text-slate-800">{court.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{court.location || court.courtTypeName || 'Trong nhà'}</p>
                      <span className={`inline-block mt-3 text-[0.65rem] font-bold px-2 py-1 rounded ${selected ? 'bg-[#5E6AD2] text-white' : 'bg-green-100 text-green-700'}`}>
                        {selected ? 'ĐANG CHỌN' : 'TRỐNG'}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <label className="text-sm font-semibold text-slate-700">
                    Ngày chơi
                    <input
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="block mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </label>
                  {selectedSlots.length > 0 && (
                    <p className="text-sm text-slate-600">
                      Đã chọn: {selectedSlots[0]} – {slotEndTime(selectedSlots[selectedSlots.length - 1])}
                      ({selectedSlots.length} giờ)
                    </p>
                  )}
                </div>

                {slotsLoading ? (
                  <p className="text-sm text-slate-500">Đang tải lịch trống...</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const booked = bookedSlots.includes(slot)
                      const active = selectedSlots.includes(slot)
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={booked}
                          onClick={() => toggleSlot(slot)}
                          className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                            booked
                              ? 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed'
                              : active
                                ? 'bg-[#5E6AD2] text-white border-[#5E6AD2]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#5E6AD2]'
                          }`}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <aside className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Thanh toán tiền mặt</h2>

              {selectedCourt && (
                <>
                  <div>
                    <p className="text-sm text-slate-500">Sân</p>
                    <p className="font-semibold text-slate-900">{selectedCourt.name}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomerMode('email')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${customerMode === 'email' ? 'bg-[#5E6AD2] text-white border-[#5E6AD2]' : 'border-slate-200 text-slate-600'}`}
                    >
                      Có tài khoản
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerMode('guest')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${customerMode === 'guest' ? 'bg-[#5E6AD2] text-white border-[#5E6AD2]' : 'border-slate-200 text-slate-600'}`}
                    >
                      Khách lẻ
                    </button>
                  </div>

                  {customerMode === 'email' ? (
                    <label className="block text-sm">
                      <span className="text-slate-600">Email khách</span>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="customer1@prosport.vn"
                        className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                      />
                    </label>
                  ) : (
                    <>
                      <label className="block text-sm">
                        <span className="text-slate-600">Tên khách lẻ</span>
                        <input
                          type="text"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="text-slate-600">SĐT (tuỳ chọn)</span>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="0901234567"
                          className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                        />
                      </label>
                    </>
                  )}

                  <label className="block text-sm">
                    <span className="text-slate-600">Ghi chú quầy</span>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                    />
                  </label>

                  <div className="flex justify-between items-center py-3 border-t border-slate-100">
                    <span className="text-sm text-slate-500">Tạm tính ({selectedSlots.length || 0} giờ)</span>
                    <span className="text-lg font-bold text-[#5E6AD2]">
                      {Number(estimatedTotal).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleBook}
                    className="w-full bg-[#5E6AD2] hover:bg-[#4e5bc4] disabled:opacity-60 text-white border-none rounded-lg py-3 font-semibold cursor-pointer transition-colors"
                  >
                    {submitting ? 'Đang xử lý...' : 'Xác nhận & thu tiền mặt'}
                  </button>
                </>
              )}

              {lastBooking && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm">
                  <p className="font-bold text-green-800 mb-1">Đặt thành công #{lastBooking.bookingId}</p>
                  <p className="text-green-700">Mã QR check-in:</p>
                  <p className="font-mono font-bold text-green-900 break-all">{lastBooking.checkInCode}</p>
                  <Link to="/elite/scanner" className="inline-block mt-2 text-[#5E6AD2] font-semibold no-underline hover:underline">
                    Quét ngay →
                  </Link>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </EliteLayout>
  )
}
