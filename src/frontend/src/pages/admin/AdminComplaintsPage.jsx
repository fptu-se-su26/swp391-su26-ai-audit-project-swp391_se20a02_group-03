import { useState, useEffect, useCallback, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { reportApi } from '../../api/reportApi'
import { useToast } from '../../components/Toast'
import { Loader2, ExternalLink } from 'lucide-react'
import {
  AdminPageHeader,
  AdminFilterPills,
  AdminStatusBadge,
  AdminCard,
  AdminBtn,
  AdminEmptyState,
} from '../../components/admin'

const COMPLAINT_FILTERS = [
  { key: '', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ xử lý' },
  { key: 'Investigating', label: 'Đang điều tra' },
  { key: 'Resolved', label: 'Đã xử lý' },
  { key: 'Rejected', label: 'Bác bỏ' },
]

const STATUS_VARIANT = {
  Pending: 'warning',
  Investigating: 'info',
  Resolved: 'success',
  Rejected: 'neutral',
}

const STATUS_LABEL = {
  Pending: 'Chờ xử lý',
  Investigating: 'Đang điều tra',
  Resolved: 'Đã xử lý',
  Rejected: 'Bác bỏ',
}

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
    () => filtered.find(r => r.reportId === selectedId) || null,
    [filtered, selectedId]
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
      <AdminPageHeader
        title="Giải quyết khiếu nại"
        description="Xử lý các báo cáo bùng kèo và tranh chấp giao dịch."
      />

      <div className="mb-6">
        <AdminFilterPills
          tabs={COMPLAINT_FILTERS}
          activeKey={filter}
          onChange={f => { setFilter(f); setSelectedId(null) }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        {/* List panel */}
        <AdminCard noPad className="flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 m-0">
              {loading ? 'Đang tải...' : `${filtered.length} khiếu nại`}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={22} className="animate-spin text-[#14b8a6]" />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <AdminEmptyState message="Không có khiếu nại nào." />
            )}

            {!loading && filtered.map(r => {
              const isActive = r.reportId === selectedId
              return (
                <button
                  key={r.reportId}
                  type="button"
                  onClick={() => setSelectedId(r.reportId)}
                  className={`w-full text-left px-5 py-4 flex flex-col gap-1.5 border-0 border-l-2 border-b border-b-gray-50/80 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-teal-50/40 border-l-[#14b8a6]'
                      : 'bg-white border-l-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-gray-800 text-[13px]">#RP-{r.reportId}</span>
                    <AdminStatusBadge
                      label={STATUS_LABEL[r.status] || r.status}
                      variant={STATUS_VARIANT[r.status] || 'neutral'}
                    />
                  </div>
                  <p className="text-sm text-gray-700 font-medium m-0 line-clamp-1">{r.reason}</p>
                  <p className="text-[11px] text-gray-400 m-0">
                    {r.reporterName || `#${r.reporterId}`} → {r.reportedUserName || `#${r.reportedUserId}`} · {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </button>
              )
            })}
          </div>
        </AdminCard>

        {/* Detail panel */}
        <AdminCard noPad className="flex flex-col">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 m-0">Chọn một khiếu nại để xem chi tiết.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="font-heading text-base uppercase tracking-wide text-gray-900 m-0 leading-snug">
                    #RP-{selected.reportId}: {selected.reason}
                  </p>
                  <AdminStatusBadge
                    label={STATUS_LABEL[selected.status] || selected.status}
                    variant={STATUS_VARIANT[selected.status] || 'neutral'}
                    className="shrink-0"
                  />
                </div>
                <p className="text-sm text-gray-400 m-0">
                  Kèo liên quan:{' '}
                  <span className="font-semibold text-gray-700">#MATCH-{selected.matchId}</span>
                </p>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5">
                {/* Complaint content */}
                <div className="bg-gray-50 rounded-[8px] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 m-0 mb-2">
                    Nội dung khiếu nại
                  </p>
                  <p className="text-[12px] text-gray-500 m-0 mb-2">
                    <span className="font-semibold text-gray-700">{selected.reporterName || `#${selected.reporterId}`}</span>
                    {' '}tố cáo{' '}
                    <span className="font-semibold text-gray-700">{selected.reportedUserName || `#${selected.reportedUserId}`}</span>
                  </p>
                  <p className="text-sm text-gray-800 m-0 leading-relaxed">{selected.reason}</p>
                  {selected.evidence && (
                    <a
                      href={selected.evidence}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-[#14b8a6] hover:underline no-underline"
                    >
                      <ExternalLink size={12} />
                      Xem bằng chứng
                    </a>
                  )}
                </div>

                {/* Admin note */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="admin-note" className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Ghi chú xử lý (Quản trị viên)
                  </label>
                  <textarea
                    id="admin-note"
                    rows={4}
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    placeholder="Nhập kết luận / quyết định xử lý..."
                    className="w-full px-3.5 py-3 rounded-[8px] border border-gray-200 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 resize-none transition-all"
                  />
                </div>
              </div>

              {/* Action bar */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-2.5 flex-wrap">
                <AdminBtn
                  onClick={() => resolve('Investigating')}
                  disabled={acting}
                  loading={acting}
                  variant="secondary"
                  className="flex-1 min-w-[110px] justify-center"
                >
                  Điều tra
                </AdminBtn>
                <AdminBtn
                  onClick={() => resolve('Rejected')}
                  disabled={acting}
                  variant="secondary"
                  className="flex-1 min-w-[110px] justify-center"
                >
                  Bác bỏ
                </AdminBtn>
                <AdminBtn
                  onClick={() => resolve('Resolved')}
                  disabled={acting}
                  loading={acting}
                  variant="primary"
                  className="flex-1 min-w-[110px] justify-center"
                >
                  Xử lý xong
                </AdminBtn>
              </div>
            </div>
          )}
        </AdminCard>
      </div>
    </AdminLayout>
  )
}
