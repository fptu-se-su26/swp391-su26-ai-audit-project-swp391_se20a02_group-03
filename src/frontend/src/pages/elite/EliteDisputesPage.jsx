import { useState, useEffect, useCallback, useMemo } from 'react'
import EliteLayout from '../../layouts/EliteLayout'
import { reportApi } from '../../api/reportApi'
import { useToast } from '../../components/Toast'
import { Loader2 } from 'lucide-react'

const STATUS_META = {
  Pending: { label: 'CHỜ', cls: 'bg-ink text-paper' },
  Investigating: { label: 'ĐANG ĐIỀU TRA', cls: 'bg-accent text-ink' },
  Resolved: { label: 'ĐÃ XỬ LÝ', cls: 'bg-surface border border-border-strong text-foreground' },
  Rejected: { label: 'BÁC BỎ', cls: 'bg-surface border border-border-strong text-foreground-muted' },
}

const VIEW_TABS = [
  { key: 'open', label: 'Cần đối chứng' },
  { key: 'history', label: 'Lịch sử' },
]

export default function EliteDisputesPage() {
  const { addToast } = useToast()
  const [allReports, setAllReports] = useState([])
  const [viewTab, setViewTab] = useState('open')
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState('')
  const [acting, setActing] = useState(false)

  const reports = useMemo(() => {
    if (viewTab === 'open') {
      return allReports.filter(r => r.status === 'Pending' || r.status === 'Investigating')
    }
    return allReports.filter(r => r.status === 'Resolved' || r.status === 'Rejected')
  }, [allReports, viewTab])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await reportApi.getAll()
      if (res.statusCode === 200 && Array.isArray(res.data)) {
        setAllReports(res.data)
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được danh sách.', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (reports.length && !reports.some(r => r.reportId === selectedId)) {
      setSelectedId(reports[0].reportId)
    }
    if (reports.length === 0) setSelectedId(null)
  }, [reports, selectedId])

  const selected = useMemo(() => reports.find(r => r.reportId === selectedId) || null, [reports, selectedId])
  const isReadOnly = viewTab === 'history' || !selected || (selected.status !== 'Pending' && selected.status !== 'Investigating')

  useEffect(() => { setNote(selected?.adminNote || '') }, [selected])

  async function submitToAdmin() {
    if (!selected || isReadOnly) return
    if (!note.trim()) { addToast('Vui lòng nhập ghi chú đối chứng.', 'error'); return }
    try {
      setActing(true)
      const res = await reportApi.resolve(selected.reportId, { status: 'Investigating', adminNote: `[Staff đối chứng] ${note.trim()}` })
      if (res.statusCode === 200) {
        addToast('Đã gửi báo cáo đối chứng lên quản trị viên.', 'success')
        load()
      } else {
        addToast(res.message || 'Gửi thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Gửi thất bại.', 'error')
    } finally {
      setActing(false)
    }
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-3.5">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-2">Xác nhận bùng kèo</h1>
            <p className="text-sm text-foreground-muted">Đối chứng hiện trường cho các ticket khiếu nại.</p>
          </div>
          <div className="flex gap-2">
            {VIEW_TABS.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setViewTab(t.key)}
                className={`label-mono px-4.5 h-10 px-[18px] rounded-[2px] border-2 cursor-pointer transition-colors ${
                  viewTab === t.key
                    ? 'bg-ink border-ink text-paper'
                    : 'border-border-hover text-foreground-muted bg-transparent hover:border-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5">
          <div className="border-2 border-border-strong bg-surface overflow-hidden flex flex-col h-[560px]">
            <div className="label-mono px-[18px] py-4 border-b-2 border-border-strong text-foreground">
              {loading ? 'Đang tải...' : `${reports.length} ticket`}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border-default">
              {!loading && reports.length === 0 && (
                <div className="p-6 text-center text-foreground-subtle text-sm">
                  {viewTab === 'open' ? 'Không có ticket cần xử lý.' : 'Chưa có ticket đã đóng.'}
                </div>
              )}
              {reports.map(r => {
                const meta = STATUS_META[r.status] || STATUS_META.Pending
                const active = r.reportId === selectedId
                return (
                  <div
                    key={r.reportId}
                    onClick={() => setSelectedId(r.reportId)}
                    className={`px-[18px] py-4 cursor-pointer transition-colors ${active ? 'bg-background-base' : 'hover:bg-surface-hover'}`}
                  >
                    <div className="flex justify-between mb-1.5">
                      <span className="font-extrabold text-sm text-foreground">#RP-{r.reportId}</span>
                      <span className={`label-mono text-[9px] px-2 py-[3px] ${meta.cls}`}>{meta.label}</span>
                    </div>
                    <p className="text-[12.5px] text-foreground mb-1 line-clamp-1">{r.reason}</p>
                    <p className="label-mono text-foreground-subtle">
                      Kèo #{r.matchId} • {r.reportedUserName || `Bị báo cáo #${r.reportedUserId}`}
                      {r.reporterName ? ` • Người báo: ${r.reporterName}` : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="border-2 border-border-strong bg-surface flex flex-col h-[560px]">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-foreground-subtle text-sm">Chọn ticket để xem chi tiết.</div>
            ) : (
              <>
                <div className={`p-[22px] border-b-2 border-border-strong ${isReadOnly ? 'border-l-4 border-l-border-strong' : 'border-l-4 border-l-warning'}`}>
                  <h2 className="font-heading text-base uppercase text-foreground mb-1.5">Ticket #RP-{selected.reportId}</h2>
                  <p className="text-[12.5px] text-foreground-muted">
                    {isReadOnly ? 'Ticket đã đóng — chỉ xem.' : `Xác nhận sự việc với ${selected.reportedUserName || `khách #${selected.reportedUserId}`}.`}
                  </p>
                </div>

                <div className="p-[22px] flex-1 overflow-y-auto">
                  <div className="bg-background-base p-4 border border-border-default mb-5 space-y-2 text-sm text-foreground">
                    <p><strong>Nội dung khiếu nại:</strong> {selected.reason}</p>
                    {selected.evidence && (
                      <p><strong>Bằng chứng:</strong> <a href={selected.evidence} target="_blank" rel="noreferrer" className="text-accent underline break-all">{selected.evidence}</a></p>
                    )}
                    {selected.adminNote && (
                      <p><strong>Ghi chú:</strong> {selected.adminNote}</p>
                    )}
                  </div>

                  {!isReadOnly ? (
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2">Chi tiết / trích xuất camera</label>
                      <textarea
                        rows="4"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="w-full box-border p-3.5 text-sm border-2 border-border-strong bg-surface text-foreground outline-none resize-y rounded-[2px] focus:border-accent"
                        placeholder="Nhập ghi chú hoặc đính kèm link camera..."
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-foreground-muted">
                      Trạng thái cuối: <strong className="text-foreground">{STATUS_META[selected.status]?.label || selected.status}</strong>
                    </div>
                  )}
                </div>

                {!isReadOnly && (
                  <div className="p-[22px] border-t-2 border-border-strong">
                    <button onClick={submitToAdmin} disabled={acting} className="btn-primary disabled:opacity-60">
                      {acting && <Loader2 size={16} className="animate-spin" />} Gửi báo cáo lên quản trị viên
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
