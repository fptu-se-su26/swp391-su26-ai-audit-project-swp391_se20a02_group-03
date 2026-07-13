import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import EliteLayout from '../../layouts/EliteLayout'
import { courtApi } from '../../api/courtApi'
import { bookingApi } from '../../api/bookingApi'
import { equipmentApi } from '../../api/equipmentApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/Toast'
import { Plus, Minus, ShoppingBag } from 'lucide-react'

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
  const [equipmentList, setEquipmentList] = useState([])
  const [invoiceItems, setInvoiceItems] = useState([])

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

  useEffect(() => {
    if (!lastBooking) return
    equipmentApi.getAll()
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.items || [])
        setEquipmentList(list)
      })
      .catch(() => setEquipmentList([]))
  }, [lastBooking])

  // Ghi chú: đây là hóa đơn phát sinh tại quầy (thu tiền mặt trực tiếp), tách biệt khỏi
  // giỏ hàng/ví ký quỹ của khách (vốn gắn với tài khoản đăng nhập của khách, không phải Staff).
  function handleAddEquipment(item) {
    setInvoiceItems(prev => {
      const existing = prev.find(i => i.equipmentId === item.equipmentId)
      if (existing) {
        return prev.map(i => i.equipmentId === item.equipmentId ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { equipmentId: item.equipmentId, name: item.equipmentName || item.name, unitPrice: item.retailPrice || 0, quantity: 1 }]
    })
  }

  function handleAdjustQuantity(equipmentId, delta) {
    setInvoiceItems(prev => prev
      .map(i => i.equipmentId === equipmentId ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0))
  }

  const invoiceTotal = invoiceItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

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
      <div className="space-y-7">
        <div className="flex flex-wrap justify-between items-end gap-3.5">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-2">Đặt sân trực tiếp tại quầy</h1>
            <p className="text-sm text-foreground-muted">Chọn sân, khung giờ và xác nhận thanh toán tiền mặt.</p>
          </div>
          <Link to="/elite/scanner" className="text-sm font-bold text-foreground no-underline hover:underline">Quét QR vào sân →</Link>
        </div>

        {error ? (
          <div className="border-2 border-danger bg-danger-bg p-8 text-center rounded-[2px]">
            <p className="text-danger font-medium">{error}</p>
          </div>
        ) : courts.length === 0 ? (
          <EmptyState title="Không có sân trống" subtitle="Tất cả sân đang được sử dụng hoặc bảo trì." />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {courts.map(court => {
                  const selected = selectedCourtId === court.courtId
                  return (
                    <button
                      key={court.courtId}
                      type="button"
                      onClick={() => setSelectedCourtId(court.courtId)}
                      className="text-left bg-surface border-2 border-border-strong p-4 cursor-pointer rounded-[2px] transition-colors hover:border-foreground"
                    >
                      <img src={court.imageUrl || FALLBACK_IMG} alt={court.name} className="w-full aspect-[16/10] object-cover mb-2.5" />
                      <h3 className="text-[13px] font-extrabold text-foreground mb-1">{court.name}</h3>
                      <p className="text-xs text-foreground-muted mb-2">{court.location || court.courtTypeName || 'Trong nhà'}</p>
                      <span className={`label-mono text-[9px] px-2 py-1 ${selected ? 'bg-ink text-paper' : 'border border-border-strong text-foreground'}`}>
                        {selected ? 'ĐANG CHỌN' : 'TRỐNG'}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="bg-surface border-2 border-border-strong p-6">
                <div className="flex flex-wrap items-center gap-5 mb-4">
                  <label className="text-[12.5px] font-bold text-foreground">
                    Ngày chơi
                    <input
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="block mt-1.5 h-10 px-3 border-2 border-border-strong bg-surface text-foreground text-sm rounded-[2px]"
                    />
                  </label>
                  {selectedSlots.length > 0 && (
                    <p className="text-sm text-foreground-muted">
                      Đã chọn: {selectedSlots[0]} – {slotEndTime(selectedSlots[selectedSlots.length - 1])}
                      ({selectedSlots.length} giờ)
                    </p>
                  )}
                </div>

                {slotsLoading ? (
                  <p className="text-sm text-foreground-muted">Đang tải lịch trống...</p>
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
                          className={`py-2.5 label-mono rounded-[2px] border-2 transition-colors ${
                            booked
                              ? 'bg-background-base text-foreground-subtle border-border-default cursor-not-allowed opacity-60'
                              : active
                                ? 'bg-ink text-paper border-ink'
                                : 'bg-surface text-foreground border-border-strong hover:border-accent'
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

            <aside className="bg-ink text-paper border-2 border-ink p-7 sticky top-24 space-y-4">
              <h2 className="font-heading text-lg uppercase mb-1">Thanh toán tiền mặt</h2>

              {selectedCourt && (
                <>
                  <div>
                    <p className="label-mono text-[#9c9c96] mb-1.5">Sân</p>
                    <p className="font-extrabold text-paper mb-1">{selectedCourt.name}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomerMode('email')}
                      className={`flex-1 py-2.5 label-mono border-none rounded-[2px] cursor-pointer transition-colors ${customerMode === 'email' ? 'bg-paper text-ink' : 'bg-transparent border-2 border-white/30 text-paper'}`}
                    >
                      Có tài khoản
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerMode('guest')}
                      className={`flex-1 py-2.5 label-mono border-none rounded-[2px] cursor-pointer transition-colors ${customerMode === 'guest' ? 'bg-paper text-ink' : 'bg-transparent border-2 border-white/30 text-paper'}`}
                    >
                      Khách lẻ
                    </button>
                  </div>

                  {customerMode === 'email' ? (
                    <label className="block">
                      <span className="label-mono text-[#9c9c96] block mb-1.5">Email khách</span>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="customer1@prosport.vn"
                        className="w-full h-[42px] px-3 bg-[#16283a] border border-white/20 text-paper text-sm outline-none rounded-[2px]"
                      />
                    </label>
                  ) : (
                    <>
                      <label className="block">
                        <span className="label-mono text-[#9c9c96] block mb-1.5">Tên khách lẻ</span>
                        <input
                          type="text"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full h-[42px] px-3 bg-[#16283a] border border-white/20 text-paper text-sm outline-none rounded-[2px]"
                        />
                      </label>
                      <label className="block">
                        <span className="label-mono text-[#9c9c96] block mb-1.5">SĐT (tuỳ chọn)</span>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="0901234567"
                          className="w-full h-[42px] px-3 bg-[#16283a] border border-white/20 text-paper text-sm outline-none rounded-[2px]"
                        />
                      </label>
                    </>
                  )}

                  <label className="block">
                    <span className="label-mono text-[#9c9c96] block mb-1.5">Ghi chú quầy</span>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full h-[42px] px-3 bg-[#16283a] border border-white/20 text-paper text-sm outline-none rounded-[2px]"
                    />
                  </label>

                  <div className="flex justify-between items-center py-4 border-t border-white/15">
                    <span className="label-mono text-[#9c9c96]">Tạm tính ({selectedSlots.length || 0} giờ)</span>
                    <span className="font-heading text-xl text-paper">
                      {Number(estimatedTotal).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleBook}
                    className="w-full py-4 label-mono bg-paper text-ink border-none rounded-[2px] cursor-pointer transition-colors hover:bg-accent hover:text-ink disabled:opacity-60"
                  >
                    {submitting ? 'Đang xử lý...' : 'Xác nhận & thu tiền mặt'}
                  </button>
                </>
              )}

              {lastBooking && (
                <div className="rounded-[2px] bg-[#16283a] border border-accent/40 p-4 text-sm">
                  <p className="font-bold text-accent mb-1">Đặt thành công #{lastBooking.bookingId}</p>
                  <p className="text-[#9c9c96]">Mã QR check-in:</p>
                  <p className="font-mono font-bold text-paper break-all">{lastBooking.checkInCode}</p>
                  <Link to="/elite/scanner" className="inline-block mt-2 text-accent font-semibold no-underline hover:underline">
                    Quét ngay →
                  </Link>
                </div>
              )}
            </aside>
          </div>
        )}

        {lastBooking && (
          <div className="bg-surface border-2 border-border-strong p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-heading text-xl uppercase text-foreground flex items-center gap-2">
                <ShoppingBag size={18} /> Thêm nước uống / thiết bị vào hóa đơn
              </h2>
              <span className="label-mono text-foreground-muted">Đơn #{lastBooking.bookingId}</span>
            </div>

            {equipmentList.length === 0 ? (
              <p className="text-sm text-foreground-muted">Đang tải danh sách thiết bị...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {equipmentList.map(item => (
                  <button
                    key={item.equipmentId}
                    type="button"
                    onClick={() => handleAddEquipment(item)}
                    className="text-left border-2 border-border-strong bg-background-base p-3.5 hover:border-accent transition-colors"
                  >
                    <p className="text-[13px] font-extrabold text-foreground mb-1 truncate">{item.equipmentName || item.name}</p>
                    <p className="label-mono text-foreground-muted mb-2">
                      {Number(item.retailPrice || 0).toLocaleString('vi-VN')}đ
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-accent">
                      <Plus size={12} /> Thêm vào hóa đơn
                    </span>
                  </button>
                ))}
              </div>
            )}

            {invoiceItems.length > 0 && (
              <div className="border-t-2 border-border-strong pt-5">
                <h3 className="label-mono text-foreground-muted mb-3">Đã thêm vào hóa đơn (thu tiền mặt tại quầy)</h3>
                <div className="divide-y divide-border-default">
                  {invoiceItems.map(i => (
                    <div key={i.equipmentId} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-foreground font-medium">{i.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border-2 border-border-strong">
                          <button type="button" onClick={() => handleAdjustQuantity(i.equipmentId, -1)} className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-surface-hover"><Minus size={12} /></button>
                          <span className="w-6 text-center font-bold text-foreground">{i.quantity}</span>
                          <button type="button" onClick={() => handleAdjustQuantity(i.equipmentId, 1)} className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-surface-hover"><Plus size={12} /></button>
                        </div>
                        <span className="font-bold text-foreground w-24 text-right">{(i.unitPrice * i.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border-default mt-2">
                  <span className="font-heading text-lg uppercase text-foreground">Tổng phát sinh</span>
                  <span className="font-heading text-xl text-accent">{invoiceTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <button
                  type="button"
                  onClick={() => { addToast('Đã ghi nhận thu tiền mặt phát sinh.', 'success'); setInvoiceItems([]) }}
                  className="btn-primary w-full h-12 mt-4"
                >
                  Xác nhận đã thu tiền mặt
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </EliteLayout>
  )
}
