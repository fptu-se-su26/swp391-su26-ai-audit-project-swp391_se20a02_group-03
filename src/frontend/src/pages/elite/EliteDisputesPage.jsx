import { useState, useEffect, useCallback, useMemo } from 'react'
import EliteLayout from '../../layouts/EliteLayout'
import { reportApi } from '../../api/reportApi'
import { useToast } from '../../components/Toast'
import { Loader2 } from 'lucide-react'

const STATUS_META = {
  Pending: { label: 'CHỜ', cls: 'bg-amber-100 text-amber-700' },
  Investigating: { label: 'ĐANG ĐIỀU TRA', cls: 'bg-blue-100 text-blue-700' },
  Resolved: { label: 'ĐÃ XỬ LÝ', cls: 'bg-green-100 text-green-700' },
  Rejected: { label: 'BÁC BỎ', cls: 'bg-slate-200 text-slate-600' },
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Xác nhận Bùng Kèo</h1>
            <p className="text-sm text-slate-500">Đối chứng hiện trường cho các ticket khiếu nại.</p>
          </div>
          <div className="flex gap-2">
            {VIEW_TABS.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setViewTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer ${
                  viewTab === t.key
                    ? 'bg-[#5E6AD2] text-white border-[#5E6AD2]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
              {loading ? 'Đang tải...' : `${reports.length} ticket`}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {!loading && reports.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">
                  {viewTab === 'open' ? 'Không có ticket cần xử lý.' : 'Chưa có ticket đã đóng.'}
                </div>
              )}
              {reports.map(r => {
                const meta = STATUS_META[r.status] || STATUS_META.Pending
                const active = r.reportId === selectedId
                return (
                  <div key={r.reportId} onClick={() => setSelectedId(r.reportId)} className={`p-4 cursor-pointer border-l-4 ${active ? 'bg-blue-50 border-[#00c2ff]' : 'border-transparent hover:bg-slate-50'}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">#RP-{r.reportId}</span>
                      <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded ${meta.cls}`}>{meta.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{r.reason}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Kèo #{r.matchId} • {r.reportedUserName || `Bị báo cáo #${r.reportedUserId}`}
                      {r.reporterName ? ` • Người báo: ${r.reporterName}` : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[560px] flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Chọn ticket để xem chi tiết.</div>
            ) : (
              <>
                <div className={`border-l-4 pl-4 mb-6 ${isReadOnly ? 'border-slate-300' : 'border-amber-500'}`}>
                  <h2 className="text-lg font-bold text-slate-800">Ticket #RP-{selected.reportId}</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {isReadOnly ? 'Ticket đã đóng — chỉ xem.' : `Xác nhận sự việc với ${selected.reportedUserName || `khách #${selected.reportedUserId}`}.`}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6 space-y-2 text-sm">
                  <p><strong>Nội dung khiếu nại:</strong> {selected.reason}</p>
                  {selected.evidence && (
                    <p><strong>Bằng chứng:</strong> <a href={selected.evidence} target="_blank" rel="noreferrer" className="text-[#00c2ff] underline break-all">{selected.evidence}</a></p>
                  )}
                  {selected.adminNote && (
                    <p><strong>Ghi chú:</strong> {selected.adminNote}</p>
                  )}
                </div>

                {!isReadOnly ? (
                  <>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Chi tiết / Trích xuất Camera</label>
                      <textarea
                        rows="5"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="w-full border border-slate-300 rounded-md p-3 text-sm outline-none focus:border-[#00c2ff] resize-none"
                        placeholder="Nhập ghi chú hoặc đính kèm link camera..."
                      />
                    </div>
                    <button onClick={submitToAdmin} disabled={acting} className="self-start mt-4 bg-[#00c2ff] text-white font-bold px-6 py-2 rounded-md hover:bg-[#00ace6] flex items-center gap-2 disabled:opacity-60">
                      {acting && <Loader2 size={16} className="animate-spin" />} Gửi báo cáo lên quản trị viên
                    </button>
                  </>
                ) : (
                  <div className="flex-1 text-sm text-slate-500">
                    Trạng thái cuối: <strong>{STATUS_META[selected.status]?.label || selected.status}</strong>
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
