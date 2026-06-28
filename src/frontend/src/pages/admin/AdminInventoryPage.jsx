import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { Search, Loader2, ShieldAlert } from 'lucide-react'

const LOW_STOCK_THRESHOLD = 5

function stockBadge(qty) {
  if (qty <= 0) return { label: 'HẾT HÀNG', cls: 'bg-slate-200 text-slate-600' }
  if (qty <= LOW_STOCK_THRESHOLD) return { label: 'SẮP HẾT', cls: 'bg-red-100 text-red-700' }
  return { label: 'TỐT', cls: 'bg-green-100 text-green-700' }
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Quản lý Kho Dụng cụ</h1>
            <p className="text-sm text-slate-500">Theo dõi tồn kho thiết bị thể thao theo thời gian thực.</p>
          </div>
          <div className="text-sm text-slate-500">
            Tổng: <span className="font-bold text-slate-900">{items.length}</span> sản phẩm
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-md px-3 py-1.5 w-72">
              <Search size={15} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm vật phẩm..."
                className="border-none outline-none text-sm w-full bg-transparent"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Vật phẩm</th>
                  <th className="px-6 py-4">Phân loại</th>
                  <th className="px-6 py-4">Môn</th>
                  <th className="px-6 py-4 text-right">Giá bán lẻ</th>
                  <th className="px-6 py-4 text-right">Tồn kho</th>
                  <th className="px-6 py-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-red-500">
                    <ShieldAlert className="inline mr-2" size={18} /> {error}
                  </td></tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Không có sản phẩm nào.</td></tr>
                )}
                {!loading && !error && filtered.map(i => {
                  const badge = stockBadge(i.stock)
                  return (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{i.name}</td>
                      <td className="px-6 py-4 text-slate-500">{i.category}</td>
                      <td className="px-6 py-4 text-slate-500">{i.sport || '—'}</td>
                      <td className="px-6 py-4 text-right text-slate-700">{Number(i.price).toLocaleString('vi-VN')} ₫</td>
                      <td className={`px-6 py-4 text-right font-bold ${i.stock <= LOW_STOCK_THRESHOLD ? 'text-red-500' : 'text-slate-900'}`}>{i.stock}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${badge.cls}`}>{badge.label}</span></td>
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
