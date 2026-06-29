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

export default function EliteDisputesPage() {
  const { addToast } = useToast()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState('')
  const [acting, setActing] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await reportApi.getAll()
      if (res.statusCode === 200 && Array.isArray(res.data)) {
        // Staff ưu tiên các ticket chưa kết thúc
        const open = res.data.filter(r => r.status === 'Pending' || r.status === 'Investigating')
        setReports(open)
        if (open.length && !open.some(r => r.reportId === selectedId)) setSelectedId(open[0].reportId)
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được danh sách.', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast])

  useEffect(() => { load() }, [load])

  const selected = useMemo(() => reports.find(r => r.reportId === selectedId) || null, [reports, selectedId])

  useEffect(() => { setNote(selected?.adminNote || '') }, [selected])

  async function submitToAdmin() {
    if (!selected) return
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Xác nhận Bùng Kèo</h1>
          <p className="text-sm text-slate-500">Đối chứng hiện trường cho các ticket khiếu nại.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
              {loading ? 'Đang tải...' : `${reports.length} ticket cần đối chứng`}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {!loading && reports.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">Không có ticket nào.</div>
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
                    <p className="text-xs text-slate-500 mt-1">Kèo #{r.matchId} • Bị báo cáo #{r.reportedUserId}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[560px] flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Chọn ticket để đối chứng.</div>
            ) : (
              <>
                <div className="border-l-4 border-amber-500 pl-4 mb-6">
                  <h2 className="text-lg font-bold text-slate-800">Yêu cầu đối chứng: #RP-{selected.reportId}</h2>
                  <p className="text-sm text-slate-600 mt-1">Xác nhận sự việc với khách hàng bị báo cáo (#{selected.reportedUserId}).</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6 space-y-2 text-sm">
                  <p><strong>Nội dung khiếu nại:</strong> {selected.reason}</p>
                  {selected.evidence && (
                    <p><strong>Bằng chứng:</strong> <a href={selected.evidence} target="_blank" rel="noreferrer" className="text-[#00c2ff] underline break-all">{selected.evidence}</a></p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Chi tiết / Trích xuất Camera</label>
                  <textarea
                    rows="5"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-3 text-sm outline-none focus:border-[#00c2ff] resize-none"
                    placeholder="Nhập ghi chú hoặc đính kèm link camera..."
                  ></textarea>
                </div>

                <button onClick={submitToAdmin} disabled={acting} className="self-start mt-4 bg-[#00c2ff] text-white font-bold px-6 py-2 rounded-md hover:bg-[#00ace6] flex items-center gap-2 disabled:opacity-60">
                  {acting && <Loader2 size={16} className="animate-spin" />} Gửi báo cáo lên quản trị viên
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
