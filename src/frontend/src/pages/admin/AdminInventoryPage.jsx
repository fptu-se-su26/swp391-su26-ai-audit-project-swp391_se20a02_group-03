import { useState, useEffect, useMemo, useCallback } from 'react'
import { Loader2, Trash2, Plus } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { useToast } from '../../components/Toast'
import {
  AdminPageHeader,
  AdminCard,
  AdminToolbar,
  AdminSearchInput,
  AdminTable,
  AdminThead,
  AdminTh,
  AdminTd,
  AdminStatusBadge,
  AdminTableLoader,
  AdminEmptyState,
  AdminErrorState,
  AdminBtn,
  AdminModal,
  AdminFormField,
  adminInputCls,
} from '../../components/admin'

const LOW_STOCK_THRESHOLD = 5

const SPORT_OPTIONS = [
  { value: 'Badminton', label: 'Cầu lông' },
  { value: 'Pickleball', label: 'Pickleball' },
]

const EMPTY_FORM = { equipmentCategoryId: '', name: '', sportType: 'Badminton', price: '', stockQuantity: '', imageUrl: '', description: '' }

function getStockVariant(qty) {
  if (qty <= 0) return { label: 'Hết hàng', variant: 'danger' }
  if (qty <= LOW_STOCK_THRESHOLD) return { label: 'Sắp hết', variant: 'warning' }
  return { label: 'Tốt', variant: 'success' }
}

function AddProductModal({ categories, onClose, onSaved }) {
  const { addToast } = useToast()
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    equipmentCategoryId: categories[0]?.equipmentCategoryId ?? '',
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên sản phẩm.')
      return
    }
    if (!form.equipmentCategoryId) {
      setError('Vui lòng chọn danh mục.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      // POST /equipment trả về EquipmentDto trần (HTTP 201, không có envelope) —
      // axiosClient interceptor coi 2xx là thành công, lỗi validate (400) sẽ ném exception.
      await equipmentApi.create({
        equipmentCategoryId: Number(form.equipmentCategoryId),
        name: form.name.trim(),
        sportType: form.sportType,
        price: Number(form.price) || 0,
        stockQuantity: Number(form.stockQuantity) || 0,
        imageUrl: form.imageUrl.trim() || null,
        description: form.description.trim() || null,
      })
      addToast('Đã tạo sản phẩm mới.', 'success')
      onSaved()
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Tạo sản phẩm thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title="Thêm sản phẩm mới"
      description="Điền thông tin để thêm thiết bị vào kho."
    >
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-[8px] p-3 text-sm text-red-600 mb-5">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AdminFormField label="Tên sản phẩm" htmlFor="eq-name" required>
          <input
            id="eq-name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="VD: Vợt Yonex Astrox 88D"
            className={adminInputCls(!!error && !form.name.trim())}
          />
        </AdminFormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <AdminFormField label="Danh mục" htmlFor="eq-category" required>
            <select
              id="eq-category"
              value={form.equipmentCategoryId}
              onChange={e => setForm({ ...form, equipmentCategoryId: e.target.value })}
              className={adminInputCls()}
            >
              {categories.map(c => (
                <option key={c.equipmentCategoryId} value={c.equipmentCategoryId}>{c.name}</option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Môn thể thao" htmlFor="eq-sport">
            <select
              id="eq-sport"
              value={form.sportType}
              onChange={e => setForm({ ...form, sportType: e.target.value })}
              className={adminInputCls()}
            >
              {SPORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </AdminFormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <AdminFormField label="Giá bán lẻ (VNĐ)" htmlFor="eq-price" required>
            <input
              id="eq-price"
              type="number"
              min="0"
              step="1000"
              required
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              className={adminInputCls()}
            />
          </AdminFormField>

          <AdminFormField label="Số lượng tồn kho" htmlFor="eq-stock" required>
            <input
              id="eq-stock"
              type="number"
              min="0"
              step="1"
              required
              value={form.stockQuantity}
              onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
              placeholder="0"
              className={adminInputCls()}
            />
          </AdminFormField>
        </div>

        <AdminFormField label="Ảnh (URL)" htmlFor="eq-image" hint="Dán đường dẫn URL ảnh (tuỳ chọn)">
          <input
            id="eq-image"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className={adminInputCls()}
          />
        </AdminFormField>

        <AdminFormField label="Mô tả" htmlFor="eq-desc">
          <textarea
            id="eq-desc"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-[8px] border border-gray-200 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 resize-y transition-all"
          />
        </AdminFormField>

        <div className="flex gap-3 justify-end pt-2">
          <AdminBtn type="button" variant="secondary" onClick={onClose}>Hủy</AdminBtn>
          <AdminBtn type="submit" variant="primary" loading={saving} disabled={saving}>
            Tạo sản phẩm
          </AdminBtn>
        </div>
      </form>
    </AdminModal>
  )
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const confirm = useConfirm()
  const { addToast } = useToast()

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [eqRes, catRes] = await Promise.all([
        equipmentApi.getAll(),
        // GET /equipment-categories trả về mảng trần (không có envelope ApiResponseDto).
        equipmentApi.getCategories().catch(() => []),
      ])
      if (eqRes.statusCode === 200 && Array.isArray(eqRes.data)) {
        setItems(eqRes.data.map(p => ({
          id: p.equipmentId,
          name: p.name || p.equipmentName,
          category: p.category || '—',
          sport: p.type || p.sportType || '',
          stock: p.availableQuantity ?? p.stockQuantity ?? 0,
          price: p.retailPrice ?? p.price ?? 0,
        })))
      } else {
        setError(eqRes.message || 'Không tải được danh sách kho.')
      }
      setCategories(Array.isArray(catRes) ? catRes : [])
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải được danh sách kho.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete(item) {
    const ok = await confirm({
      title: 'Xóa sản phẩm',
      message: `Xóa "${item.name}" khỏi kho? Sản phẩm sẽ không còn hiển thị trên cửa hàng.`,
      confirmLabel: 'Xóa',
      cancelLabel: 'Hủy',
      variant: 'danger',
    })
    if (!ok) return
    try {
      setDeletingId(item.id)
      // DELETE /equipment/{id} trả về 204 No Content (không có envelope ApiResponseDto) —
      // axiosClient interceptor coi mọi response 2xx là thành công, lỗi (404/403) sẽ ném exception.
      await equipmentApi.delete(item.id)
      addToast('Đã xóa sản phẩm.', 'success')
      setItems(prev => prev.filter(i => i.id !== item.id))
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Xóa thất bại.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(i =>
      i.name?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q))
  }, [items, search])

  const lowStockCount = items.filter(i => i.stock <= LOW_STOCK_THRESHOLD && i.stock > 0).length
  const outOfStockCount = items.filter(i => i.stock <= 0).length

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý kho dụng cụ"
        description="Theo dõi tồn kho thiết bị thể thao theo thời gian thực."
        action={
          <AdminBtn
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => setShowAddModal(true)}
            disabled={categories.length === 0}
          >
            Thêm sản phẩm
          </AdminBtn>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Tổng sản phẩm', value: items.length, variant: 'gray' },
          { label: 'Sắp hết hàng', value: lowStockCount, variant: 'orange' },
          { label: 'Hết hàng', value: outOfStockCount, variant: 'red' },
        ].map(card => (
          <AdminCard key={card.label} className="flex flex-col gap-1 hover:shadow-md transition-shadow">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 m-0">{card.label}</p>
            <p className={`font-heading text-3xl m-0 ${
              card.variant === 'orange' ? 'text-orange-500'
              : card.variant === 'red' ? 'text-red-500'
              : 'text-gray-900'
            }`}>
              {card.value}
            </p>
          </AdminCard>
        ))}
      </div>

      <AdminToolbar>
        <AdminSearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc danh mục..."
          className="flex-1 max-w-[380px]"
        />
        {search && (
          <p className="text-[12px] text-gray-400">
            Hiển thị <span className="font-semibold text-gray-600">{filtered.length}</span> / {items.length} sản phẩm
          </p>
        )}
      </AdminToolbar>

      <AdminCard noPad>
        <AdminTable>
          <AdminThead>
            <AdminTh>Vật phẩm</AdminTh>
            <AdminTh>Phân loại</AdminTh>
            <AdminTh>Môn thể thao</AdminTh>
            <AdminTh right>Giá bán lẻ</AdminTh>
            <AdminTh right>Tồn kho</AdminTh>
            <AdminTh>Trạng thái</AdminTh>
            <AdminTh right></AdminTh>
          </AdminThead>

          {loading && <AdminTableLoader cols={7} />}

          {!loading && error && (
            <tbody>
              <tr>
                <td colSpan={7}>
                  <AdminErrorState message={error} />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && filtered.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={7}>
                  <AdminEmptyState
                    message={search ? 'Không tìm thấy sản phẩm nào phù hợp.' : 'Chưa có sản phẩm nào trong kho.'}
                    isSearch={!!search}
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && filtered.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {filtered.map(i => {
                const { label: stockLabel, variant: stockVariant } = getStockVariant(i.stock)
                return (
                  <tr key={i.id} className="hover:bg-gray-50/60 transition-colors">
                    <AdminTd>
                      <span className="font-semibold text-gray-900 text-sm">{i.name}</span>
                    </AdminTd>
                    <AdminTd>
                      <span className="text-sm text-gray-500">{i.category}</span>
                    </AdminTd>
                    <AdminTd>
                      <span className="text-sm text-gray-500">{i.sport || '—'}</span>
                    </AdminTd>
                    <AdminTd className="text-right">
                      <span className="font-semibold text-gray-800">
                        {Number(i.price).toLocaleString('vi-VN')} ₫
                      </span>
                    </AdminTd>
                    <AdminTd className="text-right">
                      <span className={`font-bold text-[15px] ${i.stock <= LOW_STOCK_THRESHOLD ? 'text-red-500' : 'text-gray-900'}`}>
                        {i.stock}
                      </span>
                    </AdminTd>
                    <AdminTd>
                      <AdminStatusBadge label={stockLabel} variant={stockVariant} />
                    </AdminTd>
                    <AdminTd className="text-right">
                      <AdminBtn
                        variant="ghost"
                        icon={deletingId === i.id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <Trash2 size={13} />
                        }
                        disabled={deletingId === i.id}
                        onClick={() => handleDelete(i)}
                        className="!h-8 !px-2.5 text-red-500 hover:!bg-red-50 hover:!text-red-600"
                      >
                        Xóa
                      </AdminBtn>
                    </AdminTd>
                  </tr>
                )
              })}
            </tbody>
          )}
        </AdminTable>
      </AdminCard>

      {showAddModal && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSaved={() => { setShowAddModal(false); load() }}
        />
      )}
    </AdminLayout>
  )
}
