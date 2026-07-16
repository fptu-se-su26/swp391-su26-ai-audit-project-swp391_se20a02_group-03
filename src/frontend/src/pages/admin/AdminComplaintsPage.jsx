import { useState, useEffect, useCallback, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { reportApi } from '../../api/reportApi'
import { useToast } from '../../components/Toast'
import { Loader2 } from 'lucide-react'

const STATUS_META = {
  Pending: { label: 'CHỜ XỬ LÝ', cls: 'bg-ink text-paper border-2 border-ink', border: 'border-ink' },
  Investigating: { label: 'ĐANG ĐIỀU TRA', cls: 'bg-transparent text-foreground border border-border-strong', border: 'border-foreground' },
  Resolved: { label: 'ĐÃ XỬ LÝ', cls: 'bg-transparent text-accent border border-accent', border: 'border-accent' },
  Rejected: { label: 'BÁC BỎ', cls: 'bg-transparent text-foreground-muted border border-border-default', border: 'border-border-hover' },
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

  // Khi đổi filter (hoặc reload danh sách), nếu khiếu nại đang chọn không còn nằm trong danh
  // sách đang hiển thị, phải bỏ chọn — tránh panel chi tiết hiển thị "lơ lửng" một item đã bị
  // filter ẩn đi, gây hiểu nhầm là item đó vẫn nằm trong danh sách đang xem.
  useEffect(() => {
    if (selectedId != null && !filtered.some(r => r.reportId === selectedId)) {
      setSelectedId(null)
    }
  }, [filtered, selectedId])

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
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Giải quyết khiếu nại</h1>
          <p className="text-sm text-foreground-muted">Xử lý các báo cáo bùng kèo và tranh chấp giao dịch.</p>
        </div>

        <div className="flex gap-2 flex-wrap" role="group" aria-label="Lọc theo trạng thái">
          {FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`px-4.5 h-11 font-sans text-[11.5px] font-bold uppercase tracking-[0.04em] border-2 rounded-[2px] transition-colors cursor-pointer ${
                filter === f.key
                  ? 'bg-ink border-ink text-paper'
                  : 'bg-transparent border-border-hover text-foreground-muted hover:border-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5">
          {/* List */}
          <div className="col-span-1 border-2 border-border-strong bg-surface flex flex-col h-[600px]">
            <div className="px-4.5 py-4 border-b-2 border-border-strong label-mono text-foreground">
              {loading ? 'Đang tải...' : `${filtered.length} khiếu nại`}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border-default">
              {!loading && filtered.length === 0 && (
                <div className="p-6 text-center text-foreground-muted text-sm">Không có khiếu nại nào.</div>
              )}
              {filtered.map(r => {
                const meta = STATUS_META[r.status] || STATUS_META.Pending
                const active = r.reportId === selectedId
                return (
                  <button
                    key={r.reportId}
                    type="button"
                    onClick={() => setSelectedId(r.reportId)}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full text-left p-4.5 cursor-pointer border-l-4 transition-colors bg-transparent ${active ? 'bg-background-base ' + meta.border : 'hover:bg-surface-hover border-transparent'}`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-extrabold text-foreground text-sm">#RP-{r.reportId}</span>
                      <span className={`label-mono text-[9px] px-2 py-1 rounded-[2px] ${meta.cls}`}>{meta.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{r.reason}</p>
                    <p className="text-xs text-foreground-muted mt-1">
                      {r.reporterName || `#${r.reporterId}`} → {r.reportedUserName || `#${r.reportedUserId}`} • {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Detail */}
          <div className="col-span-1 border-2 border-border-strong bg-surface flex flex-col h-[600px]">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-foreground-muted text-sm">Chọn một khiếu nại để xem chi tiết.</div>
            ) : (
              <>
                <div className="p-5.5 border-b-2 border-border-strong">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h2 className="font-heading text-base uppercase text-foreground">#RP-{selected.reportId}: {selected.reason}</h2>
                    <span className={`label-mono px-2.5 py-1 rounded-[2px] shrink-0 ${(STATUS_META[selected.status] || STATUS_META.Pending).cls}`}>
                      {(STATUS_META[selected.status] || STATUS_META.Pending).label}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted">Kèo liên quan: <span className="font-bold text-foreground">#MATCH-{selected.matchId}</span></p>
                </div>

                <div className="flex-1 p-5.5 overflow-y-auto space-y-5">
                  <div className="bg-background-base p-4 border border-border-default">
                    <p className="label-mono text-foreground-muted mb-2">Người báo cáo {selected.reporterName || `#${selected.reporterId}`} tố cáo người chơi {selected.reportedUserName || `#${selected.reportedUserId}`}</p>
                    <p className="text-sm text-foreground leading-relaxed">{selected.reason}</p>
                    {selected.evidence && (
                      <a href={selected.evidence} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-accent underline break-all">
                        Xem bằng chứng
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Ghi chú xử lý của quản trị viên</label>
                    <textarea
                      rows={4}
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                      placeholder="Nhập kết luận / quyết định xử lý..."
                      className="input-base h-auto py-3.5 resize-none"
                    />
                  </div>
                </div>

                <div className="p-5.5 border-t-2 border-border-strong flex gap-2.5 flex-wrap">
                  <button onClick={() => resolve('Investigating')} disabled={acting} className="btn-outline flex-1 min-w-[120px] disabled:opacity-60">Điều tra</button>
                  <button onClick={() => resolve('Rejected')} disabled={acting} className="btn-outline flex-1 min-w-[120px] disabled:opacity-60">Bác bỏ</button>
                  <button onClick={() => resolve('Resolved')} disabled={acting} className="btn-primary flex-1 min-w-[120px] disabled:opacity-60">
                    {acting && <Loader2 size={15} className="animate-spin" />} Xử lý xong
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
