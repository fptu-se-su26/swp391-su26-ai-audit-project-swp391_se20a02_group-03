import { useState, useEffect, useCallback, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { kycApi } from '../../api/kycApi'
import { useToast } from '../../components/Toast'
import { Loader2, X } from 'lucide-react'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'

const STATUS_META = {
  Pending: { label: 'CHỜ DUYỆT', cls: 'bg-transparent text-warning border border-warning' },
  Approved: { label: 'ĐÃ DUYỆT', cls: 'bg-ink text-paper border-2 border-ink' },
  Rejected: { label: 'TỪ CHỐI', cls: 'bg-transparent text-danger border border-danger' },
}

const FILTERS = [
  { key: 'Pending', label: 'Chờ duyệt' },
  { key: 'Approved', label: 'Đã duyệt' },
  { key: 'Rejected', label: 'Từ chối' },
  { key: '', label: 'Tất cả' },
]

const IMG_FALLBACK = 'https://images.unsplash.com/photo-1633265486064-086b219458ce?w=300&q=80'

export default function AdminKycPage() {
  const { addToast } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Pending')
  const [selectedId, setSelectedId] = useState(null)
  const [acting, setActing] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await kycApi.getAll(filter)
      if (res.statusCode === 200 && Array.isArray(res.data)) {
        setRequests(res.data)
        if (res.data.length && !res.data.some(r => r.ekycProfileId === selectedId)) {
          setSelectedId(res.data[0].ekycProfileId)
        }
        if (res.data.length === 0) setSelectedId(null)
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được danh sách E-KYC.', 'error')
    } finally {
      setLoading(false)
    }
  }, [filter, addToast])

  useEffect(() => { load() }, [load])

  const selected = useMemo(() => requests.find(r => r.ekycProfileId === selectedId) || null, [requests, selectedId])

  async function approve() {
    if (!selected) return
    try {
      setActing(true)
      const res = await kycApi.approve(selected.ekycProfileId)
      if (res.statusCode === 200) { addToast('Đã phê duyệt hồ sơ.', 'success'); load() }
      else addToast(res.message || 'Phê duyệt thất bại.', 'error')
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Phê duyệt thất bại.', 'error')
    } finally { setActing(false) }
  }

  function openRejectDialog() {
    if (!selected) return
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  async function confirmReject() {
    if (!selected || !rejectReason.trim()) return
    try {
      setActing(true)
      const res = await kycApi.reject(selected.ekycProfileId, rejectReason.trim())
      if (res.statusCode === 200) {
        addToast('Đã từ chối hồ sơ.', 'success')
        setRejectDialogOpen(false)
        load()
      } else {
        addToast(res.message || 'Từ chối thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Từ chối thất bại.', 'error')
    } finally {
      setActing(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Phê duyệt E-KYC</h1>
        <p className="text-sm text-foreground-muted mb-6">Kiểm tra giấy tờ tùy thân để mở khóa ví ký quỹ và quyền tạo kèo.</p>

        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`py-2.5 px-4 font-sans font-extrabold text-[11.5px] uppercase tracking-wide rounded-[2px] border-2 transition-colors ${
                filter === f.key
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-transparent text-foreground border-border-strong font-bold hover:bg-surface-hover'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* List */}
          <div className="border-2 border-border-strong bg-surface">
            <div className="p-4 border-b-2 border-border-strong">
              <h2 className="label-mono text-foreground">{loading ? 'Đang tải...' : `${requests.length} hồ sơ chờ duyệt`}</h2>
            </div>
            <div className="divide-y divide-border-default max-h-[560px] overflow-y-auto">
              {!loading && requests.length === 0 && (
                <EmptyState title="Không có hồ sơ nào" />
              )}
              {requests.map(req => {
                const meta = STATUS_META[req.status] || STATUS_META.Pending
                const active = req.ekycProfileId === selectedId
                return (
                  <div key={req.ekycProfileId} onClick={() => setSelectedId(req.ekycProfileId)} className={`p-4 flex justify-between items-center cursor-pointer ${active ? 'bg-background-base' : 'hover:bg-surface-hover'}`}>
                    <div>
                      <p className="font-extrabold text-foreground text-sm mb-1">{req.fullName}</p>
                      <p className="label-mono text-foreground-subtle">KYC-{req.ekycProfileId} • {req.identityNumber}</p>
                    </div>
                    <span className={`label-mono px-2 py-1 rounded-[2px] h-fit ${meta.cls}`}>{meta.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail */}
          <div className="border-2 border-border-strong bg-surface flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-foreground-subtle text-sm min-h-[300px]">Chọn một hồ sơ để xem chi tiết.</div>
            ) : (
              <>
                <div className="p-5 border-b-2 border-border-strong flex justify-between items-center">
                  <h2 className="font-heading text-base uppercase text-foreground">Chi tiết KYC-{selected.ekycProfileId}</h2>
                  <span className={`label-mono px-2.5 py-1 rounded-[2px] ${(STATUS_META[selected.status] || STATUS_META.Pending).cls}`}>
                    {(STATUS_META[selected.status] || STATUS_META.Pending).label}
                  </span>
                </div>
                <div className="p-6 flex-1 space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[['Mặt trước', selected.frontImageUrl], ['Mặt sau', selected.backImageUrl], ['Chân dung', selected.faceImageUrl]].map(([label, url]) => (
                      <div key={label}>
                        <p className="label-mono text-foreground-subtle mb-2">{label}</p>
                        <div className="bg-background-base h-28 flex items-center justify-center border border-border-default overflow-hidden rounded-[2px]">
                          <img src={url || IMG_FALLBACK} alt={label} className="w-full h-full object-cover" onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-background-base p-4 border border-border-default grid grid-cols-2 gap-4 rounded-[2px]">
                    <div>
                      <p className="label-mono text-foreground-subtle mb-1">Họ tên trên thẻ</p>
                      <p className="text-sm font-extrabold text-foreground">{selected.fullName}</p>
                    </div>
                    <div>
                      <p className="label-mono text-foreground-subtle mb-1">Họ tên hồ sơ</p>
                      <p className="text-sm font-extrabold text-foreground">{selected.profileFullName || '—'}</p>
                    </div>
                    <div>
                      <p className="label-mono text-foreground-subtle mb-1">Số CMND/CCCD</p>
                      <p className="text-sm font-extrabold text-foreground">{selected.identityNumber}</p>
                    </div>
                    <div>
                      <p className="label-mono text-foreground-subtle mb-1">Thư điện tử</p>
                      <p className="text-sm font-extrabold text-foreground truncate">{selected.userEmail || '—'}</p>
                    </div>
                  </div>

                  {selected.status === 'Rejected' && selected.rejectionReason && (
                    <div className="bg-danger-bg border border-danger p-3 text-sm text-danger rounded-[2px]">
                      <span className="font-semibold">Lý do từ chối:</span> {selected.rejectionReason}
                    </div>
                  )}

                  {selected.status === 'Pending' && (
                    <div className="flex gap-3 pt-4 border-t border-border-default">
                      <button onClick={openRejectDialog} disabled={acting} className="flex-1 border-2 border-danger text-danger font-bold text-xs uppercase tracking-wide py-3 rounded-[2px] hover:bg-danger-bg transition-colors disabled:opacity-60">Từ chối</button>
                      <button onClick={approve} disabled={acting} className="flex-1 bg-ink text-paper font-extrabold text-xs uppercase tracking-wide py-3 rounded-[2px] hover:opacity-90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                        {acting && <Loader2 size={15} className="animate-spin" />} Phê duyệt
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {rejectDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border-2 border-border-strong rounded-[2px] w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-lg uppercase text-foreground">Nhập lý do từ chối</h3>
              <button onClick={() => setRejectDialogOpen(false)} className="text-foreground-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-foreground-muted mb-3">
              Hồ sơ KYC-{selected?.ekycProfileId} · <span className="font-semibold text-foreground">{selected?.fullName}</span>
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Ảnh CMND bị mờ, không khớp với họ tên hồ sơ..."
              className="w-full border-2 border-border-strong rounded-[2px] px-3 py-2 text-sm outline-none focus:border-danger resize-none bg-background-base text-foreground"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectDialogOpen(false)}
                className="flex-1 border-2 border-border-strong text-foreground font-semibold py-2.5 rounded-[2px] hover:bg-surface-hover transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={acting || !rejectReason.trim()}
                className="flex-1 bg-danger text-paper font-bold py-2.5 rounded-[2px] hover:opacity-90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {acting && <Loader2 size={15} className="animate-spin" />} Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
