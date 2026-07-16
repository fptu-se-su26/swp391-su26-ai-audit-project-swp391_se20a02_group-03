import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { courtApi } from '../../api/courtApi'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { translateStatus, translateCourtTypeName } from '../../utils/labels'
import { Trash2, Loader2, MapPin, Plus, Pencil } from 'lucide-react'
import {
  AdminPageHeader,
  AdminToolbar,
  AdminSearchInput,
  AdminFilterPills,
  AdminStatusBadge,
  AdminModal,
  AdminFormField,
  adminInputCls,
  AdminBtn,
  AdminEmptyState,
  AdminErrorState,
} from '../../components/admin'

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'ACTIVE', label: 'Hoạt động' },
  { key: 'MAINTENANCE', label: 'Bảo trì' },
  { key: 'INACTIVE', label: 'Ngưng hoạt động' },
]

const COURT_TYPES = [
  { id: 1, label: 'Cầu lông' },
  { id: 2, label: 'Pickleball' },
]

const EMPTY_FORM = { name: '', courtTypeId: 1, imageUrl: '', description: '', status: 'ACTIVE' }

const STATUS_VARIANT = {
  ACTIVE: 'success',
  MAINTENANCE: 'warning',
  INACTIVE: 'danger',
}

const STATUS_LABEL_MAP = {
  ACTIVE: 'Hoạt động',
  MAINTENANCE: 'Bảo trì',
  INACTIVE: 'Ngưng hoạt động',
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

function CourtFormModal({ initial, onClose, onSaved }) {
  const { addToast } = useToast()
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(() => initial
    ? {
        name: initial.name || '',
        courtTypeId: initial.courtTypeId || 1,
        imageUrl: initial.imageUrl || '',
        description: initial.description || '',
        status: initial.status || 'ACTIVE',
      }
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
    <AdminModal
      open
      onClose={onClose}
      title={isEdit ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
      description={isEdit ? `ID: ${initial.courtId}` : 'Điền thông tin để tạo sân mới.'}
    >
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-[8px] p-3 text-sm text-red-600 mb-5">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AdminFormField label="Tên sân" htmlFor="court-name" required>
          <input
            id="court-name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="VD: Sân cầu lông A1"
            className={adminInputCls(!!error && !form.name.trim())}
          />
        </AdminFormField>

        <AdminFormField label="Loại sân" htmlFor="court-type">
          <select
            id="court-type"
            value={form.courtTypeId}
            onChange={e => setForm({ ...form, courtTypeId: parseInt(e.target.value, 10) })}
            className={adminInputCls()}
          >
            {COURT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </AdminFormField>

        <AdminFormField label="Ảnh (URL)" htmlFor="court-image" hint="Dán đường dẫn URL ảnh (tuỳ chọn)">
          <input
            id="court-image"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className={adminInputCls()}
          />
        </AdminFormField>

        <AdminFormField label="Mô tả / Vị trí" htmlFor="court-desc">
          <textarea
            id="court-desc"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-[8px] border border-gray-200 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 resize-y transition-all"
          />
        </AdminFormField>

        {isEdit && (
          <AdminFormField label="Trạng thái" htmlFor="court-status">
            <select
              id="court-status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className={adminInputCls()}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="INACTIVE">Ngưng hoạt động</option>
            </select>
          </AdminFormField>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <AdminBtn type="button" variant="secondary" onClick={onClose}>Hủy</AdminBtn>
          <AdminBtn type="submit" variant="primary" loading={saving} disabled={saving}>
            {isEdit ? 'Lưu thay đổi' : 'Tạo sân'}
          </AdminBtn>
        </div>
      </form>
    </AdminModal>
  )
}

export default function AdminCourtsPage() {
  const { addToast } = useToast()
  const confirm = useConfirm()
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [modalCourt, setModalCourt] = useState(undefined)

  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await courtApi.getAll({ searchTerm: search, status })
      if (res.statusCode === 200 && res.data) {
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
      <AdminPageHeader
        title="Quản lý sân"
        description="Danh sách toàn bộ sân thể thao và trạng thái hoạt động."
        action={
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-gray-500 font-medium">
              <span className="font-bold text-gray-900">{courts.length}</span> sân
            </span>
            <AdminBtn
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => setModalCourt(null)}
            >
              Thêm sân
            </AdminBtn>
          </div>
        }
      />

      <AdminToolbar>
        <AdminSearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên sân..."
          className="flex-1 max-w-[340px]"
        />
        <AdminFilterPills
          tabs={STATUS_TABS}
          activeKey={status}
          onChange={setStatus}
        />
      </AdminToolbar>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#14b8a6]" />
        </div>
      )}

      {!loading && error && (
        <AdminErrorState message={error} onRetry={fetchCourts} />
      )}

      {!loading && !error && courts.length === 0 && (
        <AdminEmptyState
          message={search ? 'Không tìm thấy sân nào phù hợp.' : 'Chưa có sân nào.'}
          isSearch={!!search}
        />
      )}

      {!loading && !error && courts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courts.map(court => {
            const stLabel = STATUS_LABEL_MAP[court.status] || translateStatus(court.status, 'Không rõ')
            const stVariant = STATUS_VARIANT[court.status] || 'neutral'
            return (
              <div
                key={court.courtId}
                className="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all"
              >
                {/* Cover image */}
                <div className="relative h-[140px]">
                  <img
                    src={court.imageUrl || FALLBACK_IMG}
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30" />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                      {translateCourtTypeName(court.courtTypeName)}
                    </span>
                    <AdminStatusBadge
                      label={stLabel}
                      variant={stVariant}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-bold text-sm text-gray-900 m-0 mb-2">{court.name}</h2>
                  {court.description && (
                    <p className="flex items-start gap-1.5 text-[12px] text-gray-500 m-0 mb-3 leading-relaxed">
                      <MapPin size={13} className="mt-0.5 shrink-0 text-gray-400" />
                      {court.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-[13px] font-bold text-gray-800">
                      {court.pricePerHour > 0
                        ? `${Number(court.pricePerHour).toLocaleString('vi-VN')} ₫/giờ`
                        : <span className="text-gray-400 font-medium">Chưa có giá</span>}
                    </span>
                    <div className="flex items-center gap-2">
                      <AdminBtn
                        variant="secondary"
                        icon={<Pencil size={13} />}
                        onClick={() => setModalCourt(court)}
                        className="!h-8 !px-3"
                      >
                        Sửa
                      </AdminBtn>
                      <AdminBtn
                        variant="danger"
                        disabled={deletingId === court.courtId}
                        loading={deletingId === court.courtId}
                        icon={<Trash2 size={13} />}
                        onClick={() => handleDelete(court)}
                        className="!h-8 !px-3"
                      >
                        Xóa
                      </AdminBtn>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
