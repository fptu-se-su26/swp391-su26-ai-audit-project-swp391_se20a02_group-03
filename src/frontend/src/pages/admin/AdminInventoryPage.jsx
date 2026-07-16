import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { equipmentApi } from '../../api/equipmentApi'
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
} from '../../components/admin'

const LOW_STOCK_THRESHOLD = 5

function getStockVariant(qty) {
  if (qty <= 0) return { label: 'Hết hàng', variant: 'danger' }
  if (qty <= LOW_STOCK_THRESHOLD) return { label: 'Sắp hết', variant: 'warning' }
  return { label: 'Tốt', variant: 'success' }
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await equipmentApi.getAll()
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setItems(res.data.map(p => ({
            id: p.equipmentId,
            name: p.name || p.equipmentName,
            category: p.category || '—',
            sport: p.type || p.sportType || '',
            stock: p.availableQuantity ?? p.stockQuantity ?? 0,
            price: p.retailPrice ?? p.price ?? 0,
          })))
        } else {
          setError(res.message || 'Không tải được danh sách kho.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được danh sách kho.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

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
          </AdminThead>

          {loading && <AdminTableLoader cols={6} />}

          {!loading && error && (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <AdminErrorState message={error} />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && filtered.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={6}>
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
                  </tr>
                )
              })}
            </tbody>
          )}
        </AdminTable>
      </AdminCard>
    </AdminLayout>
  )
}
