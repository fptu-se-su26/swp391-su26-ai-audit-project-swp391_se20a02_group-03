import { useState, useEffect, useCallback } from 'react'
import EliteLayout from '../../layouts/EliteLayout'
import { voucherApi } from '../../api/voucherApi'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
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
  const confirm = useConfirm()
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
    const ok = await confirm({
      title: 'Xóa voucher',
      message: 'Xóa voucher này?',
      confirmLabel: 'Xóa',
      cancelLabel: 'Hủy',
      variant: 'danger',
    })
    if (!ok) return
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
    if (!v.isActive) return { label: 'TẮT', cls: 'bg-surface-hover text-foreground-subtle' }
    if (new Date(v.endDate) < now) return { label: 'HẾT HẠN', cls: 'bg-surface-hover text-foreground-subtle' }
    if (v.remainingQuantity <= 0) return { label: 'HẾT LƯỢT', cls: 'bg-warning-bg text-warning' }
    return { label: 'ĐANG CHẠY', cls: 'bg-ink text-paper' }
  }

  return (
    <EliteLayout>
      <div className="space-y-7">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-2">Phát hành voucher</h1>
          <p className="text-sm text-foreground-muted">Tạo mã giảm giá tại quầy hoặc đền bù khách hàng.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="card-base p-7">
            <h2 className="font-heading text-lg uppercase tracking-[-0.01em] text-foreground mb-5">Tạo voucher mới</h2>
            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setField('code', e.target.value)}
                  placeholder="VD: SALE50"
                  className="input-base flex-1 font-mono uppercase"
                />
                <button type="button" onClick={() => setField('code', randomCode())} className="btn-outline shrink-0">Ngẫu nhiên</button>
              </div>

              <input
                type="text"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="VD: Giảm 10% toàn sân"
                className="input-base w-full"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block">% Giảm</label>
                  <input type="number" min="0.01" max="100" step="0.5" value={form.discountPercent} onChange={e => setField('discountPercent', e.target.value)} className="input-base h-[42px]" />
                </div>
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block">Giảm tối đa (₫)</label>
                  <input type="number" min="0" value={form.maxDiscountAmount} onChange={e => setField('maxDiscountAmount', e.target.value)} placeholder="VD: 50000" className="input-base h-[42px]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block">Đơn tối thiểu (₫)</label>
                  <input type="number" min="0" value={form.minOrderAmount} onChange={e => setField('minOrderAmount', e.target.value)} placeholder="VD: 100000" className="input-base h-[42px]" />
                </div>
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block">Số lượng</label>
                  <input type="number" min="1" value={form.totalQuantity} onChange={e => setField('totalQuantity', e.target.value)} className="input-base h-[42px]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-1">
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block">Bắt đầu</label>
                  <input type="date" value={form.startDate} onChange={e => setField('startDate', e.target.value)} className="input-base h-[42px]" />
                </div>
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block">Kết thúc</label>
                  <input type="date" value={form.endDate} onChange={e => setField('endDate', e.target.value)} className="input-base h-[42px]" />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full h-[52px] mt-1">
                {submitting && <Loader2 size={16} className="animate-spin" />} Phát hành voucher
              </button>
            </form>
          </div>

          <div className="card-base p-7">
            <h2 className="font-heading text-lg uppercase tracking-[-0.01em] text-foreground mb-5">Danh sách voucher</h2>
            {loading ? (
              <div className="py-12 text-center text-foreground-subtle"><Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...</div>
            ) : vouchers.length === 0 ? (
              <div className="py-12 text-center text-foreground-subtle">Chưa có voucher nào.</div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto">
                {vouchers.map(v => {
                  const st = statusOf(v)
                  return (
                    <div key={v.voucherId} className="border-2 border-border-strong rounded-[2px] p-4 flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <p className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                          <Ticket size={14} className="text-accent" /> {v.code} — Giảm {v.discountPercent}%
                        </p>
                        <p className="text-xs text-foreground-muted truncate mt-0.5">{v.name}</p>
                        <p className="label-mono text-foreground-subtle mt-1 font-normal normal-case tracking-normal">
                          Đã dùng {v.usedQuantity}/{v.totalQuantity} • HSD {new Date(v.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`label-mono px-2.5 py-1 rounded-[2px] ${st.cls}`}>{st.label}</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(v.voucherId)}
                          aria-label={`Xóa voucher ${v.code}`}
                          className="text-foreground-subtle hover:text-danger w-10 h-10 flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
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
