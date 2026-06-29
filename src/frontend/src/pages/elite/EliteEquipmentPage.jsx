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
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Cho thuê / Trả thiết bị</h1>
          <p className="text-sm text-slate-500">Giao dụng cụ tại quầy và xác nhận khi khách trả.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab('active')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer ${
                  tab === 'active' ? 'bg-[#5E6AD2] text-white border-[#5E6AD2]' : 'border-slate-200 text-slate-600'
                }`}
              >
                Đang thuê ({tab === 'active' ? rentals.length : '…'})
              </button>
              <button
                type="button"
                onClick={() => setTab('history')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer ${
                  tab === 'history' ? 'bg-[#5E6AD2] text-white border-[#5E6AD2]' : 'border-slate-200 text-slate-600'
                }`}
              >
                Đã trả
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {rentals.length === 0 ? (
                <p className="p-8 text-center text-slate-400 text-sm">
                  {tab === 'active' ? 'Không có thiết bị đang cho thuê.' : 'Chưa có lịch sử trả.'}
                </p>
              ) : rentals.map(r => (
                <div key={r.detailId} className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{r.equipmentName}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      #{r.detailId} • SL {r.quantity} • {r.customerName || `User #${r.userId}`}
                      {r.bookingId ? ` • Booking #${r.bookingId}` : ''}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(r.rentedAt).toLocaleString('vi-VN')} • {Number(r.subtotal || r.unitPrice * r.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  {tab === 'active' && (
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <select
                        value={getReturnForm(r.detailId).condition}
                        onChange={e => setReturnForm(r.detailId, { condition: e.target.value })}
                        className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                      >
                        <option value="Good">Tốt</option>
                        <option value="Damaged">Hư hỏng</option>
                        <option value="Lost">Mất</option>
                      </select>
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => handleReturn(r.detailId)}
                        className="inline-flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer hover:bg-green-700 disabled:opacity-60"
                      >
                        {acting ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                        Nhận trả
                      </button>
                    </div>
                  )}
                  {tab === 'history' && r.returnCondition && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                      {r.returnCondition}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package size={18} /> Giao tại quầy
            </h2>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {equipments.map(eq => (
                <button
                  key={eq.equipmentId}
                  type="button"
                  onClick={() => setSelectedId(eq.equipmentId)}
                  className={`text-left p-2 rounded-lg border text-xs cursor-pointer ${
                    selected?.equipmentId === eq.equipmentId
                      ? 'border-[#5E6AD2] bg-[#5E6AD2]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={eq.imageUrl || FALLBACK_IMG} alt="" className="w-full h-14 object-cover rounded mb-1" />
                  <p className="font-semibold text-slate-800 line-clamp-1">{eq.name}</p>
                  <p className="text-slate-500">Kho: {eq.stockQuantity}</p>
                </button>
              ))}
            </div>

            {selected && (
              <>
                <div className="border-t border-slate-100 pt-3">
                  <p className="font-semibold text-slate-900">{selected.name}</p>
                  <p className="text-sm text-slate-500">Giá thuê/giờ: {rentalPrice.toLocaleString('vi-VN')}đ</p>
                </div>

                <label className="block text-sm">
                  <span className="text-slate-600">Email khách (tuỳ chọn)</span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="customer1@prosport.vn"
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-slate-600">Mã booking (tuỳ chọn)</span>
                  <input
                    type="number"
                    value={bookingId}
                    onChange={e => setBookingId(e.target.value)}
                    placeholder="123"
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-slate-600">Số lượng</span>
                  <input
                    type="number"
                    min={1}
                    max={selected.stockQuantity}
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </label>

                <button
                  type="button"
                  disabled={acting}
                  onClick={handleRent}
                  className="w-full bg-[#5E6AD2] hover:bg-[#4e5bc4] text-white border-none rounded-lg py-3 font-semibold cursor-pointer disabled:opacity-60"
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
