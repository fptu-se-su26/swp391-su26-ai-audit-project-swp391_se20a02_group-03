import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { courtApi } from '../../api/courtApi'
import { useToast } from '../../components/Toast'
import { Search, Trash2, Loader2, ShieldAlert, MapPin } from 'lucide-react'

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Available', label: 'Trống' },
  { key: 'Booked', label: 'Đã đặt' },
  { key: 'Maintenance', label: 'Bảo trì' },
]

const STATUS_STYLE = {
  Available: { label: 'TRỐNG', cls: 'bg-green-500 text-white' },
  Booked: { label: 'ĐÃ ĐẶT', cls: 'bg-slate-800 text-white' },
  Maintenance: { label: 'BẢO TRÌ', cls: 'bg-amber-500 text-white' },
  Closed: { label: 'ĐÓNG', cls: 'bg-red-500 text-white' },
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

export default function AdminCourtsPage() {
  const { addToast } = useToast()
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [deletingId, setDeletingId] = useState(null)

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
    if (!window.confirm(`Xóa sân "${court.name}"? Thao tác này là xóa mềm (ẩn khỏi hệ thống).`)) return
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
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Quản lý Sân</h1>
            <p className="text-sm text-slate-500">Danh sách toàn bộ sân và trạng thái hoạt động.</p>
          </div>
          <div className="text-sm text-slate-500">
            Tổng: <span className="font-bold text-slate-900">{courts.length}</span> sân
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full py-2 px-4 w-80 focus-within:border-[#14B8A6]">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên sân..."
              className="border-none outline-none text-sm text-slate-900 w-full bg-transparent"
            />
          </div>
          <div className="flex gap-2">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatus(tab.key)}
                className={`py-[6px] px-4 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
                  status === tab.key
                    ? 'border-[#e0f2fe] bg-[#e0f2fe] text-[#0284c7]'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="inline animate-spin mr-2" size={20} /> Đang tải...
          </div>
        )}
        {!loading && error && (
          <div className="py-16 text-center text-red-500">
            <ShieldAlert className="inline mr-2" size={20} /> {error}
          </div>
        )}
        {!loading && !error && courts.length === 0 && (
          <div className="py-16 text-center text-slate-400">Không có sân nào.</div>
        )}

        {!loading && !error && courts.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {courts.map(court => {
              const st = STATUS_STYLE[court.status] || { label: (court.status || '').toUpperCase(), cls: 'bg-slate-400 text-white' }
              return (
                <div key={court.courtId} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col">
                  <div className="relative h-[140px]">
                    <img src={court.imageUrl || FALLBACK_IMG} alt={court.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 right-3 flex justify-between">
                      <span className="py-1 px-[10px] rounded-full text-[0.65rem] font-bold tracking-[0.05em] bg-white text-slate-900">
                        {(court.courtTypeName || '').toUpperCase()}
                      </span>
                      <span className={`py-1 px-[10px] rounded-full text-[0.65rem] font-bold tracking-[0.05em] ${st.cls}`}>{st.label}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900 mb-[6px]">{court.name}</h2>
                    {court.description && (
                      <p className="flex items-start gap-[6px] text-[0.8125rem] text-slate-500 mb-3">
                        <MapPin size={14} className="mt-0.5 shrink-0" /> {court.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-sm font-semibold text-slate-900">
                        {court.pricePerHour > 0 ? `${Number(court.pricePerHour).toLocaleString('vi-VN')} ₫/giờ` : 'Chưa có giá'}
                      </span>
                      <button
                        onClick={() => handleDelete(court)}
                        disabled={deletingId === court.courtId}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deletingId === court.courtId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
