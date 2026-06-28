import { useState, useEffect, useCallback } from 'react'
import EliteLayout from '../../layouts/EliteLayout'
import { voucherApi } from '../../api/voucherApi'
import { useToast } from '../../components/Toast'
import { Loader2, Trash2, Ticket } from 'lucide-react'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
function plusDaysStr(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const emptyForm = () => ({
  code: '',
  name: '',
  discountPercent: 10,
  maxDiscountAmount: '',
  minOrderAmount: '',
  totalQuantity: 50,
  startDate: todayStr(),
  endDate: plusDaysStr(30),
})

function randomCode() {
  const s = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SALE${s}`
}

export default function EliteVouchersPage() {
  const { addToast } = useToast()
  const [form, setForm] = useState(emptyForm())
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await voucherApi.getAll()
      if (res.statusCode === 200 && Array.isArray(res.data)) setVouchers(res.data)
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được danh sách voucher.', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  function setField(k, v) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.code.trim() || !form.name.trim()) {
      addToast('Vui lòng nhập mã và tên voucher.', 'error')
      return
    }
    try {
      setSubmitting(true)
      const payload = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        discountPercent: Number(form.discountPercent),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        totalQuantity: Number(form.totalQuantity),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      }
      const res = await voucherApi.create(payload)
      if (res.statusCode === 201 || res.statusCode === 200) {
        addToast('Phát hành voucher thành công!', 'success')
        setForm(emptyForm())
        load()
      } else {
        addToast(res.message || 'Tạo voucher thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Tạo voucher thất bại.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa voucher này?')) return
    try {
      const res = await voucherApi.remove(id)
      if (res.statusCode === 200) {
        addToast('Đã xóa voucher.', 'success')
        setVouchers(prev => prev.filter(v => v.voucherId !== id))
      } else {
        addToast(res.message || 'Xóa thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Xóa thất bại.', 'error')
    }
  }

  function statusOf(v) {
    const now = new Date()
    if (!v.isActive) return { label: 'TẮT', cls: 'bg-slate-100 text-slate-600' }
    if (new Date(v.endDate) < now) return { label: 'HẾT HẠN', cls: 'bg-slate-100 text-slate-600' }
    if (v.remainingQuantity <= 0) return { label: 'HẾT LƯỢT', cls: 'bg-amber-100 text-amber-700' }
    return { label: 'ĐANG CHẠY', cls: 'bg-green-100 text-green-600' }
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Phát hành Voucher</h1>
            <p className="text-sm text-slate-500">Tạo mã giảm giá tại quầy hoặc đền bù khách hàng.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tạo Voucher Mới</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mã Voucher (Code)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={e => setField('code', e.target.value)}
                    placeholder="VD: SALE50"
                    className="flex-1 border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff] uppercase"
                  />
                  <button type="button" onClick={() => setField('code', randomCode())} className="bg-slate-100 px-3 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-200">Random</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên / Mô tả</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="VD: Giảm 10% toàn sân"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">% Giảm</label>
                  <input type="number" min="0.01" max="100" step="0.5" value={form.discountPercent} onChange={e => setField('discountPercent', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Giảm tối đa (₫)</label>
                  <input type="number" min="0" value={form.maxDiscountAmount} onChange={e => setField('maxDiscountAmount', e.target.value)} placeholder="VD: 50000" className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Đơn tối thiểu (₫)</label>
                  <input type="number" min="0" value={form.minOrderAmount} onChange={e => setField('minOrderAmount', e.target.value)} placeholder="VD: 100000" className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Số lượng</label>
                  <input type="number" min="1" value={form.totalQuantity} onChange={e => setField('totalQuantity', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Bắt đầu</label>
                  <input type="date" value={form.startDate} onChange={e => setField('startDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kết thúc</label>
                  <input type="date" value={form.endDate} onChange={e => setField('endDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-[#00c2ff]" />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full bg-[#00c2ff] text-white font-bold py-2.5 rounded-md hover:bg-[#00ace6] mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting && <Loader2 size={16} className="animate-spin" />} Phát hành Voucher
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Danh sách Voucher</h2>
            {loading ? (
              <div className="py-12 text-center text-slate-400"><Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...</div>
            ) : vouchers.length === 0 ? (
              <div className="py-12 text-center text-slate-400">Chưa có voucher nào.</div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto">
                {vouchers.map(v => {
                  const st = statusOf(v)
                  return (
                    <div key={v.voucherId} className="border border-slate-200 rounded-lg p-3 flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Ticket size={14} className="text-[#00c2ff]" /> {v.code} — Giảm {v.discountPercent}%
                        </p>
                        <p className="text-xs text-slate-500 truncate">{v.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Đã dùng {v.usedQuantity}/{v.totalQuantity} • HSD {new Date(v.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${st.cls}`}>{st.label}</span>
                        <button onClick={() => handleDelete(v.voucherId)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
