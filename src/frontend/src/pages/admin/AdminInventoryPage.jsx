import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { Search, Loader2, ShieldAlert } from 'lucide-react'

const LOW_STOCK_THRESHOLD = 5

function stockBadge(qty) {
  if (qty <= 0) return { label: 'HẾT HÀNG', cls: 'bg-surface-hover text-foreground-subtle' }
  if (qty <= LOW_STOCK_THRESHOLD) return { label: 'SẮP HẾT', cls: 'border border-danger text-danger' }
  return { label: 'TỐT', cls: 'bg-ink text-paper' }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-3.5 mb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Quản lý kho dụng cụ</h1>
            <p className="text-[13px] text-foreground-muted">Theo dõi tồn kho thiết bị thể thao theo thời gian thực.</p>
          </div>
          <p className="label-mono text-foreground">
            Tổng: <strong>{items.length}</strong> sản phẩm
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface border-2 border-border-strong h-11 px-3.5 min-w-[300px] max-w-md rounded-[2px] mb-[22px]">
          <Search size={15} className="text-foreground-subtle shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm vật phẩm..."
            aria-label="Tìm kiếm vật phẩm"
            className="border-none outline-none text-[13px] text-foreground w-full bg-transparent"
          />
        </div>

        <div className="border-2 border-border-strong bg-surface rounded-[2px]">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-ink text-paper">
                <tr>
                  <th className="text-left px-[18px] py-3.5 label-mono">Vật phẩm</th>
                  <th className="text-left px-[18px] py-3.5 label-mono">Phân loại</th>
                  <th className="text-left px-[18px] py-3.5 label-mono">Môn</th>
                  <th className="text-right px-[18px] py-3.5 label-mono">Giá bán lẻ</th>
                  <th className="text-right px-[18px] py-3.5 label-mono">Tồn kho</th>
                  <th className="text-left px-[18px] py-3.5 label-mono">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="px-[18px] py-12 text-center text-foreground-subtle">
                    <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={6} className="px-[18px] py-12 text-center text-danger">
                    <ShieldAlert className="inline mr-2" size={18} /> {error}
                  </td></tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-[18px] py-12 text-center text-foreground-subtle">Không có sản phẩm nào.</td></tr>
                )}
                {!loading && !error && filtered.map(i => {
                  const badge = stockBadge(i.stock)
                  return (
                    <tr key={i.id} className="border-t border-border-default hover:bg-surface-hover">
                      <td className="px-[18px] py-3.5 font-extrabold text-foreground">{i.name}</td>
                      <td className="px-[18px] py-3.5 text-foreground-muted">{i.category}</td>
                      <td className="px-[18px] py-3.5 text-foreground-muted">{i.sport || '—'}</td>
                      <td className="px-[18px] py-3.5 text-right text-foreground">{Number(i.price).toLocaleString('vi-VN')} ₫</td>
                      <td className={`px-[18px] py-3.5 text-right font-extrabold ${i.stock <= LOW_STOCK_THRESHOLD ? 'text-danger' : 'text-foreground'}`}>{i.stock}</td>
                      <td className="px-[18px] py-3.5"><span className={`label-mono px-2.5 py-1 ${badge.cls}`}>{badge.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
