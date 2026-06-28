import { useState, useEffect, useCallback, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { reportApi } from '../../api/reportApi'
import { useToast } from '../../components/Toast'
import { Loader2 } from 'lucide-react'

const STATUS_META = {
  Pending: { label: 'CHỜ XỬ LÝ', cls: 'bg-amber-100 text-amber-700', border: 'border-amber-500' },
  Investigating: { label: 'ĐANG ĐIỀU TRA', cls: 'bg-blue-100 text-blue-700', border: 'border-blue-500' },
  Resolved: { label: 'ĐÃ XỬ LÝ', cls: 'bg-green-100 text-green-700', border: 'border-green-500' },
  Rejected: { label: 'BÁC BỎ', cls: 'bg-slate-200 text-slate-600', border: 'border-slate-400' },
}

const FILTERS = [
  { key: '', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ xử lý' },
  { key: 'Investigating', label: 'Đang điều tra' },
  { key: 'Resolved', label: 'Đã xử lý' },
  { key: 'Rejected', label: 'Bác bỏ' },
]

export default function AdminComplaintsPage() {
  const { addToast } = useToast()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [acting, setActing] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await reportApi.getAll()
      if (res.statusCode === 200 && Array.isArray(res.data)) setReports(res.data)
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được danh sách khiếu nại.', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(
    () => reports.filter(r => !filter || r.status === filter),
    [reports, filter]
  )

  const selected = useMemo(
    () => reports.find(r => r.reportId === selectedId) || null,
    [reports, selectedId]
  )

  useEffect(() => {
    setAdminNote(selected?.adminNote || '')
  }, [selected])

  async function resolve(status) {
    if (!selected) return
    try {
      setActing(true)
      const res = await reportApi.resolve(selected.reportId, { status, adminNote })
      if (res.statusCode === 200 && res.data) {
        addToast('Cập nhật khiếu nại thành công.', 'success')
        setReports(prev => prev.map(r => (r.reportId === res.data.reportId ? res.data : r)))
      } else {
        addToast(res.message || 'Cập nhật thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Cập nhật thất bại.', 'error')
    } finally {
      setActing(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Giải quyết Khiếu nại</h1>
          <p className="text-sm text-slate-500">Xử lý các báo cáo bùng kèo và tranh chấp giao dịch.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`py-[6px] px-4 rounded-full border text-sm font-medium transition-colors ${
                filter === f.key ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-[#0d9488]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
              {loading ? 'Đang tải...' : `${filtered.length} khiếu nại`}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {!loading && filtered.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">Không có khiếu nại nào.</div>
              )}
              {filtered.map(r => {
                const meta = STATUS_META[r.status] || STATUS_META.Pending
                const active = r.reportId === selectedId
                return (
                  <div
                    key={r.reportId}
                    onClick={() => setSelectedId(r.reportId)}
                    className={`p-4 cursor-pointer ${active ? 'bg-blue-50 border-l-4 ' + meta.border : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">#RP-{r.reportId}</span>
                      <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded ${meta.cls}`}>{meta.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{r.reason}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Người báo cáo #{r.reporterId} → Bị báo cáo #{r.reportedUserId} • {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Chọn một khiếu nại để xem chi tiết.</div>
            ) : (
              <>
                <div className="p-5 border-b border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-slate-900">#RP-{selected.reportId}: {selected.reason}</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${(STATUS_META[selected.status] || STATUS_META.Pending).cls}`}>
                      {(STATUS_META[selected.status] || STATUS_META.Pending).label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Kèo liên quan: <span className="font-bold text-[#14B8A6]">#MATCH-{selected.matchId}</span></p>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Người báo cáo #{selected.reporterId} tố cáo người chơi #{selected.reportedUserId}</p>
                    <p className="text-sm text-slate-800 leading-relaxed">{selected.reason}</p>
                    {selected.evidence && (
                      <a href={selected.evidence} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-[#14B8A6] underline break-all">
                        Xem bằng chứng
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú xử lý của quản trị viên</label>
                    <textarea
                      rows={4}
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                      placeholder="Nhập kết luận / quyết định xử lý..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#14B8A6] resize-none text-sm"
                    />
                  </div>
                </div>

                <div className="p-5 border-t border-slate-200 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Quyết định xử lý</p>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => resolve('Investigating')} disabled={acting} className="flex-1 min-w-[120px] border border-blue-300 text-blue-600 font-semibold py-2 rounded-lg bg-white hover:bg-blue-50 disabled:opacity-60">Điều tra</button>
                    <button onClick={() => resolve('Rejected')} disabled={acting} className="flex-1 min-w-[120px] border border-slate-300 text-slate-700 font-semibold py-2 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-60">Bác bỏ</button>
                    <button onClick={() => resolve('Resolved')} disabled={acting} className="flex-1 min-w-[120px] bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 disabled:opacity-60 flex items-center justify-center gap-2">
                      {acting && <Loader2 size={15} className="animate-spin" />} Xử lý xong
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
