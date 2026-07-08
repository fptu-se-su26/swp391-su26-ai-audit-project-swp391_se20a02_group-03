import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { courtApi } from '../../api/courtApi'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { translateStatus, translateCourtTypeName } from '../../utils/labels'
import { Search, Trash2, Loader2, ShieldAlert, MapPin, Plus, Pencil, X } from 'lucide-react'

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Available', label: 'Trống' },
  { key: 'Booked', label: 'Đã đặt' },
  { key: 'Maintenance', label: 'Bảo trì' },
]

const COURT_TYPES = [
  { id: 1, label: 'Cầu lông' },
  { id: 2, label: 'Pickleball' },
]

const EMPTY_FORM = { name: '', courtTypeId: 1, imageUrl: '', description: '', status: 'Available' }

function CourtFormModal({ initial, onClose, onSaved }) {
  const { addToast } = useToast()
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(() => initial
    ? { name: initial.name || '', courtTypeId: initial.courtTypeId || 1, imageUrl: initial.imageUrl || '', description: initial.description || '', status: initial.status || 'Available' }
    : EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên sân.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = isEdit
        ? await courtApi.update(initial.courtId, {
            name: form.name.trim(),
            courtTypeId: form.courtTypeId,
            imageUrl: form.imageUrl.trim() || null,
            description: form.description.trim() || null,
            status: form.status,
          })
        : await courtApi.create({
            name: form.name.trim(),
            courtTypeId: form.courtTypeId,
            imageUrl: form.imageUrl.trim() || null,
            description: form.description.trim() || null,
          })
      if (res.statusCode === 200 || res.statusCode === 201) {
        addToast(isEdit ? 'Đã cập nhật sân.' : 'Đã tạo sân mới.', 'success')
        onSaved()
      } else {
        setError(res.message || 'Thao tác thất bại.')
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Thao tác thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-ink/60" onClick={onClose}>
      <div className="bg-surface border-2 border-border-strong rounded-[2px] max-w-lg w-full p-7" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl uppercase text-foreground">{isEdit ? 'Sửa sân' : 'Thêm sân mới'}</h3>
          <button onClick={onClose} className="text-foreground-muted hover:text-foreground"><X size={20} /></button>
        </div>
        {error && <div className="text-sm text-danger bg-danger-bg border border-danger p-3 rounded-[2px] mb-5">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="grid gap-1.5 text-sm">
            <span className="label-mono text-foreground">Tên sân *</span>
            <input required className="input-base" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Sân cầu lông A1" />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="label-mono text-foreground">Loại sân</span>
            <select className="input-base" value={form.courtTypeId} onChange={e => setForm({ ...form, courtTypeId: parseInt(e.target.value, 10) })}>
              {COURT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="label-mono text-foreground">Ảnh (URL)</span>
            <input className="input-base" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="label-mono text-foreground">Mô tả</span>
            <textarea className="input-base h-auto py-3.5 resize-y" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </label>
          {isEdit && (
            <label className="grid gap-1.5 text-sm">
              <span className="label-mono text-foreground">Trạng thái</span>
              <select className="input-base" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="Available">Trống</option>
                <option value="Booked">Đã đặt</option>
                <option value="Maintenance">Bảo trì</option>
                <option value="Closed">Đóng</option>
              </select>
            </label>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-outline">Hủy</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo sân'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const STATUS_STYLE = {
  Available: { label: 'TRỐNG', cls: 'bg-ink text-paper' },
  Booked: { label: 'ĐÃ ĐẶT', cls: 'border border-paper text-paper' },
  Maintenance: { label: 'BẢO TRÌ', cls: 'bg-warning-bg text-warning border border-warning' },
  Closed: { label: 'ĐÓNG', cls: 'bg-danger text-paper' },
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

export default function AdminCourtsPage() {
  const { addToast } = useToast()
  const confirm = useConfirm()
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [modalCourt, setModalCourt] = useState(undefined) // undefined = closed, null = create, object = edit

  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await courtApi.getAll({ searchTerm: search, status })
      if (res.statusCode === 200 && res.data) {
        // Hỗ trợ cả PagedResult (items) lẫn list thuần.
        const list = Array.isArray(res.data) ? res.data : (res.data.items || [])
        setCourts(list)
      } else {
        setError(res.message || 'Không tải được danh sách sân.')
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải được danh sách sân.')
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    const t = setTimeout(fetchCourts, 300)
    return () => clearTimeout(t)
  }, [fetchCourts])

  async function handleDelete(court) {
    const ok = await confirm({
      title: 'Xóa sân',
      message: `Xóa sân "${court.name}"? Thao tác này là xóa mềm (ẩn khỏi hệ thống).`,
      confirmLabel: 'Xóa sân',
      cancelLabel: 'Hủy',
      variant: 'danger',
    })
    if (!ok) return
    try {
      setDeletingId(court.courtId)
      const res = await courtApi.remove(court.courtId)
      if (res.statusCode === 200 || res.statusCode === 204) {
        addToast(res.message || 'Đã xóa sân.', 'success')
        setCourts(prev => prev.filter(c => c.courtId !== court.courtId))
      } else {
        addToast(res.message || 'Xóa sân thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Xóa sân thất bại.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-3.5 mb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Quản lý sân</h1>
            <p className="text-[13px] text-foreground-muted">Danh sách toàn bộ sân và trạng thái hoạt động.</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="label-mono text-foreground">
              Tổng: <strong>{courts.length}</strong> sân
            </p>
            <button
              onClick={() => setModalCourt(null)}
              className="btn-primary text-xs h-9 px-4"
            >
              <Plus size={14} /> Thêm sân
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3.5 justify-between mb-6">
          <div className="flex items-center gap-2 bg-surface border-2 border-border-strong h-11 px-3.5 min-w-[280px] rounded-[2px]">
            <Search size={16} className="text-foreground-subtle shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên sân..."
              className="border-none outline-none text-[13px] text-foreground w-full bg-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatus(tab.key)}
                className={`py-2.5 px-[18px] rounded-[2px] border-2 font-bold text-[11.5px] uppercase cursor-pointer transition-colors ${
                  status === tab.key
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-transparent border-border-strong text-foreground hover:bg-surface-hover'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center text-foreground-subtle">
            <Loader2 className="inline animate-spin mr-2" size={20} /> Đang tải...
          </div>
        )}
        {!loading && error && (
          <div className="py-16 text-center text-danger">
            <ShieldAlert className="inline mr-2" size={20} /> {error}
          </div>
        )}
        {!loading && !error && courts.length === 0 && (
          <div className="py-16 text-center text-foreground-subtle">Không có sân nào.</div>
        )}

        {!loading && !error && courts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courts.map(court => {
              const st = STATUS_STYLE[court.status] || {
                label: translateStatus(court.status, 'Không rõ').toUpperCase(),
                cls: 'bg-surface-hover text-foreground border border-border-strong',
              }
              return (
                <div key={court.courtId} className="border-2 border-border-strong bg-surface flex flex-col rounded-[2px] overflow-hidden">
                  <div className="relative h-[130px] border-b-2 border-border-strong">
                    <img src={court.imageUrl || FALLBACK_IMG} alt={court.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex justify-between items-start p-3">
                      <span className="label-mono bg-paper text-ink px-2 py-1">
                        {translateCourtTypeName(court.courtTypeName)}
                      </span>
                      <span className={`label-mono px-2 py-1 ${st.cls}`}>{st.label}</span>
                    </div>
                  </div>
                  <div className="p-[18px] flex-1 flex flex-col">
                    <h2 className="font-extrabold text-sm text-foreground mb-3">{court.name}</h2>
                    {court.description && (
                      <p className="flex items-start gap-1.5 text-[0.8125rem] text-foreground-muted mb-3">
                        <MapPin size={14} className="mt-0.5 shrink-0" /> {court.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-default">
                      <span className="font-bold text-[12.5px] text-foreground">
                        {court.pricePerHour > 0 ? `${Number(court.pricePerHour).toLocaleString('vi-VN')} ₫/giờ` : 'Chưa có giá'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalCourt(court)}
                          className="inline-flex items-center gap-1.5 py-[5px] px-3 rounded-[2px] border-2 border-border-strong text-xs font-bold uppercase text-foreground cursor-pointer hover:bg-surface-hover transition-colors"
                        >
                          <Pencil size={14} />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(court)}
                          disabled={deletingId === court.courtId}
                          className="inline-flex items-center gap-1.5 py-[5px] px-3 rounded-[2px] border-2 border-danger text-xs font-bold uppercase text-danger cursor-pointer hover:bg-danger-bg transition-colors disabled:opacity-50"
                        >
                          {deletingId === court.courtId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {modalCourt !== undefined && (
        <CourtFormModal
          initial={modalCourt}
          onClose={() => setModalCourt(undefined)}
          onSaved={() => { setModalCourt(undefined); fetchCourts() }}
        />
      )}
    </AdminLayout>
  )
}
