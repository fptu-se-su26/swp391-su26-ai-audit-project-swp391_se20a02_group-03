import { useState, useEffect, useCallback, useMemo } from 'react'
import EliteLayout from '../../layouts/EliteLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useToast } from '../../components/Toast'
import PageLoader from '../../components/ui/PageLoader'
import { Loader2, Package, RotateCcw } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80'

export default function EliteEquipmentPage() {
  const { addToast } = useToast()
  const [equipments, setEquipments] = useState([])
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('active')
  const [selectedId, setSelectedId] = useState(null)
  const [customerEmail, setCustomerEmail] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [acting, setActing] = useState(false)
  const [returnForms, setReturnForms] = useState({})

  function getReturnForm(detailId) {
    return returnForms[detailId] || { condition: 'Good', note: '' }
  }

  function setReturnForm(detailId, patch) {
    setReturnForms(prev => ({
      ...prev,
      [detailId]: { ...(prev[detailId] || { condition: 'Good', note: '' }), ...patch },
    }))
  }

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const [eqRes, rentRes] = await Promise.all([
        equipmentApi.getAll(),
        equipmentApi.getRentals(tab === 'active' ? 'Rented' : 'Returned'),
      ])
      if (eqRes.statusCode === 200 && eqRes.data) {
        const list = Array.isArray(eqRes.data) ? eqRes.data : (eqRes.data.items || [])
        const available = list.filter(e => e.status === 'Available' && e.stockQuantity > 0)
        setEquipments(available)
        if (available.length && !available.some(e => e.equipmentId === selectedId)) {
          setSelectedId(available[0].equipmentId)
        }
      }
      if (rentRes.statusCode === 200 && Array.isArray(rentRes.data)) {
        setRentals(rentRes.data)
      } else {
        setRentals([])
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được dữ liệu.', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast, tab])

  useEffect(() => { load() }, [load])

  const selected = useMemo(
    () => equipments.find(e => e.equipmentId === selectedId) || equipments[0] || null,
    [equipments, selectedId]
  )

  const rentalPrice = selected
    ? Math.max(Math.round((selected.retailPrice ?? selected.price ?? 0) * 0.05), 10000)
    : 0

  async function handleRent() {
    if (!selected) return
    setActing(true)
    try {
      const payload = {
        equipmentId: selected.equipmentId,
        quantity: Number(quantity) || 1,
        customerEmail: customerEmail.trim() || undefined,
        bookingId: bookingId.trim() ? Number(bookingId) : undefined,
      }
      const res = await equipmentApi.rentAtCounter(payload)
      if (res.statusCode === 201) {
        addToast(res.message || 'Cho thuê thành công!', 'success')
        setCustomerEmail('')
        setBookingId('')
        setQuantity(1)
        load()
      } else {
        addToast(res.message || 'Cho thuê thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Cho thuê thất bại.', 'error')
    } finally {
      setActing(false)
    }
  }

  async function handleReturn(detailId) {
    const form = getReturnForm(detailId)
    setActing(true)
    try {
      const res = await equipmentApi.returnRental(detailId, {
        returnCondition: form.condition,
        damageNote: form.note.trim() || undefined,
        damageFee: form.condition === 'Damaged' ? rentalPrice : undefined,
      })
      if (res.statusCode === 200) {
        addToast(res.message || 'Đã nhận trả thiết bị.', 'success')
        setReturnForms(prev => {
          const next = { ...prev }
          delete next[detailId]
          return next
        })
        load()
      } else {
        addToast(res.message || 'Trả thiết bị thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Trả thiết bị thất bại.', 'error')
    } finally {
      setActing(false)
    }
  }

  if (loading && equipments.length === 0 && rentals.length === 0) {
    return (
      <EliteLayout>
        <PageLoader message="Đang tải thiết bị..." />
      </EliteLayout>
    )
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-2">Cho thuê / trả thiết bị</h1>
          <p className="text-sm text-foreground-muted">Giao dụng cụ tại quầy và xác nhận khi khách trả.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab('active')}
                className={`label-mono px-[18px] h-10 rounded-[2px] border-2 cursor-pointer transition-colors ${
                  tab === 'active' ? 'bg-ink border-ink text-paper' : 'border-border-hover text-foreground-muted bg-transparent hover:border-foreground'
                }`}
              >
                Đang thuê ({tab === 'active' ? rentals.length : '…'})
              </button>
              <button
                type="button"
                onClick={() => setTab('history')}
                className={`label-mono px-[18px] h-10 rounded-[2px] border-2 cursor-pointer transition-colors ${
                  tab === 'history' ? 'bg-ink border-ink text-paper' : 'border-border-hover text-foreground-muted bg-transparent hover:border-foreground'
                }`}
              >
                Đã trả
              </button>
            </div>

            <div className="border-2 border-border-strong bg-surface divide-y divide-border-default">
              {rentals.length === 0 ? (
                <p className="p-8 text-center text-foreground-subtle text-sm">
                  {tab === 'active' ? 'Không có thiết bị đang cho thuê.' : 'Chưa có lịch sử trả.'}
                </p>
              ) : rentals.map(r => (
                <div key={r.detailId} className="p-[18px] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-foreground mb-1">{r.equipmentName}</p>
                    <p className="label-mono text-foreground-subtle">
                      #{r.detailId} • SL {r.quantity} • {r.customerName || `User #${r.userId}`}
                      {r.bookingId ? ` • Booking #${r.bookingId}` : ''}
                    </p>
                    <p className="text-xs text-foreground-subtle mt-1">
                      {new Date(r.rentedAt).toLocaleString('vi-VN')} • {Number(r.subtotal || r.unitPrice * r.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  {tab === 'active' && (
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <select
                        value={getReturnForm(r.detailId).condition}
                        onChange={e => setReturnForm(r.detailId, { condition: e.target.value })}
                        className="h-[38px] px-2.5 border-2 border-border-strong bg-surface text-foreground text-xs rounded-[2px]"
                      >
                        <option value="Good">Tốt</option>
                        <option value="Damaged">Hư hỏng</option>
                        <option value="Lost">Mất</option>
                      </select>
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => handleReturn(r.detailId)}
                        className="inline-flex items-center justify-center gap-1.5 label-mono px-4 py-2.5 bg-ink text-paper border-none rounded-[2px] cursor-pointer hover:bg-accent hover:text-ink disabled:opacity-60"
                      >
                        {acting ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                        Nhận trả
                      </button>
                    </div>
                  )}
                  {tab === 'history' && r.returnCondition && (
                    <span className="label-mono px-2.5 py-1 bg-background-base border border-border-default text-foreground-muted">
                      {r.returnCondition}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className="border-2 border-border-strong bg-surface p-6 sticky top-24 space-y-4">
            <h2 className="font-heading text-base uppercase text-foreground flex items-center gap-2">
              <Package size={18} /> Giao tại quầy
            </h2>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {equipments.map(eq => (
                <button
                  key={eq.equipmentId}
                  type="button"
                  onClick={() => setSelectedId(eq.equipmentId)}
                  className={`text-left p-2 border-2 text-xs cursor-pointer rounded-[2px] transition-colors ${
                    selected?.equipmentId === eq.equipmentId
                      ? 'border-accent bg-background-base'
                      : 'border-border-default hover:border-border-hover'
                  }`}
                >
                  <img src={eq.imageUrl || FALLBACK_IMG} alt="" className="w-full h-14 object-cover mb-1.5 rounded-[2px]" />
                  <p className="font-bold text-foreground line-clamp-1">{eq.name}</p>
                  <p className="text-foreground-muted">Kho: {eq.stockQuantity}</p>
                </button>
              ))}
            </div>

            {selected && (
              <>
                <div className="border-t border-border-default pt-3.5">
                  <p className="font-extrabold text-sm text-foreground mb-1">{selected.name}</p>
                  <p className="text-[12.5px] text-foreground-muted">Giá thuê/giờ: {rentalPrice.toLocaleString('vi-VN')}đ</p>
                </div>

                <label className="block">
                  <span className="label-mono text-foreground-subtle block mb-1.5">Email khách (tuỳ chọn)</span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="customer1@prosport.vn"
                    className="w-full h-10 px-3 border-2 border-border-strong bg-surface text-foreground text-sm rounded-[2px] outline-none focus:border-accent"
                  />
                </label>

                <label className="block">
                  <span className="label-mono text-foreground-subtle block mb-1.5">Mã booking (tuỳ chọn)</span>
                  <input
                    type="number"
                    value={bookingId}
                    onChange={e => setBookingId(e.target.value)}
                    placeholder="123"
                    className="w-full h-10 px-3 border-2 border-border-strong bg-surface text-foreground text-sm rounded-[2px] outline-none focus:border-accent"
                  />
                </label>

                <label className="block">
                  <span className="label-mono text-foreground-subtle block mb-1.5">Số lượng</span>
                  <input
                    type="number"
                    min={1}
                    max={selected.stockQuantity}
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full h-10 px-3 border-2 border-border-strong bg-surface text-foreground text-sm rounded-[2px] outline-none focus:border-accent"
                  />
                </label>

                <button
                  type="button"
                  disabled={acting}
                  onClick={handleRent}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {acting ? 'Đang xử lý...' : 'Xác nhận cho thuê'}
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
    </EliteLayout>
  )
}
