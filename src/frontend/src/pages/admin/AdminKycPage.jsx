import { useState, useEffect, useCallback, useMemo, useRef, useId } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { kycApi } from '../../api/kycApi'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { Loader2, X, RefreshCw } from 'lucide-react'
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

// Backend contract (SubmitEkycDto): FrontImageUrl/BackImageUrl là [Required] — luôn có giá trị
// khi hồ sơ đã được nộp. FaceImageUrl là optional (string?) — có thể rỗng hợp lệ.
const REQUIRED_EVIDENCE_FIELDS = ['frontImageUrl', 'backImageUrl']

// Ảnh bằng chứng E-KYC: KHÔNG BAO GIỜ dùng ảnh giả/stock để thay thế bằng chứng thật —
// hiển thị rõ "Chưa có bằng chứng" (thiếu URL) hoặc "Không tải được ảnh" (URL lỗi) kèm nút thử
// lại, tránh đánh lừa Admin tưởng nhầm ảnh ngẫu nhiên là giấy tờ CCCD/chân dung thật của khách.
function EvidenceImage({ label, url, onStatusChange }) {
  const [status, setStatus] = useState(() => (url ? 'loading' : 'missing'))
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    setStatus(url ? 'loading' : 'missing')
  }, [url])

  useEffect(() => {
    onStatusChange(status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  function handleRetry() {
    setStatus('loading')
    setRetryToken(t => t + 1)
  }

  // Cache-bust khi thử lại để trình duyệt thực sự phát lại request thay vì trả cache lỗi cũ.
  const src = retryToken > 0 && url ? `${url}${url.includes('?') ? '&' : '?'}retry=${retryToken}` : url

  return (
    <div>
      <p className="label-mono text-foreground-subtle mb-2">{label}</p>
      <div className="bg-background-base h-28 flex items-center justify-center border border-border-default overflow-hidden rounded-[2px] relative">
        {status === 'missing' && (
          <span className="text-[11px] text-foreground-subtle text-center px-2">Chưa có bằng chứng</span>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-1.5 text-center px-2">
            <span className="text-[11px] text-danger">Không tải được ảnh</span>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-foreground-subtle hover:text-foreground underline"
            >
              <RefreshCw size={11} /> Thử lại
            </button>
          </div>
        )}
        {status === 'loading' && (
          <Loader2 size={20} className="animate-spin text-foreground-subtle absolute" />
        )}
        {(status === 'loading' || status === 'loaded') && (
          <img
            src={src}
            alt={label}
            className={`w-full h-full object-cover ${status === 'loaded' ? '' : 'opacity-0'}`}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
        )}
      </div>
    </div>
  )
}

export default function AdminKycPage() {
  const { addToast } = useToast()
  const confirm = useConfirm()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Pending')
  const [selectedId, setSelectedId] = useState(null)
  const [acting, setActing] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  // Trạng thái tải của từng ảnh bằng chứng (front/back/face) cho hồ sơ đang chọn — reset mỗi
  // khi đổi selection. Dùng để chặn phê duyệt lúc bằng chứng bắt buộc chưa tải xong/lỗi.
  const [imgStatus, setImgStatus] = useState({})
  // Chống double-submit khi request đang chạy — bổ sung guard đồng bộ ngoài `disabled={acting}`
  // để an toàn cả khi 2 sự kiện click lọt vào cùng 1 tick trước khi re-render kịp disable nút.
  const actingRef = useRef(false)
  const rejectDialogRef = useRef(null)
  const rejectTriggerRef = useRef(null)
  const rejectReasonRef = useRef(null)
  const rejectTitleId = useId()

  useFocusTrap({
    active: rejectDialogOpen,
    containerRef: rejectDialogRef,
    onEscape: () => setRejectDialogOpen(false),
    restoreFocusRef: rejectTriggerRef,
    initialFocusRef: rejectReasonRef,
  })

  useEffect(() => {
    if (!rejectDialogOpen) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [rejectDialogOpen])

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

  // Reset trạng thái ảnh mỗi khi đổi hồ sơ đang xem — tránh giữ trạng thái loaded/error của
  // hồ sơ trước đó gán nhầm cho hồ sơ mới chọn.
  useEffect(() => {
    setImgStatus({})
  }, [selectedId])

  const selected = useMemo(() => requests.find(r => r.ekycProfileId === selectedId) || null, [requests, selectedId])

  // Bằng chứng bắt buộc (front/back — luôn có URL theo contract) phải tải THÀNH CÔNG; ảnh
  // chân dung là optional nên chỉ bắt buộc tải thành công khi hồ sơ THỰC SỰ có cung cấp URL.
  const canApprove = useMemo(() => {
    if (!selected) return false
    const requiredOk = REQUIRED_EVIDENCE_FIELDS.every(field => imgStatus[field] === 'loaded')
    const faceUrl = selected.faceImageUrl
    const faceOk = !faceUrl || imgStatus.faceImageUrl === 'loaded'
    return requiredOk && faceOk
  }, [selected, imgStatus])

  async function approve() {
    if (!selected || actingRef.current) return
    if (!canApprove) {
      addToast('Cần tải xong đầy đủ ảnh bằng chứng bắt buộc trước khi phê duyệt.', 'error')
      return
    }
    const ok = await confirm({
      title: 'Phê duyệt hồ sơ E-KYC',
      message: `Xác nhận phê duyệt hồ sơ của "${selected.fullName}" (KYC-${selected.ekycProfileId})? Tài khoản sẽ được xác thực, mở khóa ví ký quỹ và quyền tạo kèo.`,
      confirmLabel: 'Phê duyệt',
      cancelLabel: 'Hủy',
      variant: 'default',
    })
    if (!ok) return

    actingRef.current = true
    try {
      setActing(true)
      const res = await kycApi.approve(selected.ekycProfileId)
      if (res.statusCode === 200) { addToast('Đã phê duyệt hồ sơ.', 'success'); load() }
      else addToast(res.message || 'Phê duyệt thất bại.', 'error') // giữ nguyên selection hiện tại
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Phê duyệt thất bại.', 'error') // giữ nguyên selection hiện tại
    } finally {
      setActing(false)
      actingRef.current = false
    }
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

        <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label="Lọc theo trạng thái duyệt">
          {FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
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
                  <button
                    key={req.ekycProfileId}
                    type="button"
                    onClick={() => setSelectedId(req.ekycProfileId)}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full text-left p-4 flex justify-between items-center cursor-pointer bg-transparent ${active ? 'bg-background-base' : 'hover:bg-surface-hover'}`}
                  >
                    <div>
                      <p className="font-extrabold text-foreground text-sm mb-1">{req.fullName}</p>
                      <p className="label-mono text-foreground-subtle">KYC-{req.ekycProfileId} • {req.identityNumber}</p>
                    </div>
                    <span className={`label-mono px-2 py-1 rounded-[2px] h-fit ${meta.cls}`}>{meta.label}</span>
                  </button>
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
                  {/* key theo ekycProfileId: đổi hồ sơ -> remount toàn bộ, không giữ ảnh/preview
                      của hồ sơ trước đó lẫn vào hồ sơ mới chọn. */}
                  <div className="grid grid-cols-3 gap-3" key={selected.ekycProfileId}>
                    {[
                      ['Mặt trước', selected.frontImageUrl, 'frontImageUrl'],
                      ['Mặt sau', selected.backImageUrl, 'backImageUrl'],
                      ['Chân dung', selected.faceImageUrl, 'faceImageUrl'],
                    ].map(([label, url, field]) => (
                      <EvidenceImage
                        key={field}
                        label={label}
                        url={url}
                        onStatusChange={s => setImgStatus(prev => (prev[field] === s ? prev : { ...prev, [field]: s }))}
                      />
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
                      <button ref={rejectTriggerRef} type="button" onClick={openRejectDialog} disabled={acting} className="flex-1 border-2 border-danger text-danger font-bold text-xs uppercase tracking-wide py-3 rounded-[2px] hover:bg-danger-bg transition-colors disabled:opacity-60">Từ chối</button>
                      <button
                        onClick={approve}
                        disabled={acting || !canApprove}
                        title={!canApprove ? 'Cần tải xong ảnh bằng chứng bắt buộc (mặt trước/mặt sau) trước khi phê duyệt' : undefined}
                        className="flex-1 bg-ink text-paper font-extrabold text-xs uppercase tracking-wide py-3 rounded-[2px] hover:opacity-90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
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
          <div
            ref={rejectDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={rejectTitleId}
            className="bg-surface border-2 border-border-strong rounded-[2px] w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id={rejectTitleId} className="font-heading text-lg uppercase text-foreground">Nhập lý do từ chối</h3>
              <button type="button" onClick={() => setRejectDialogOpen(false)} aria-label="Đóng" className="text-foreground-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-foreground-muted mb-3">
              Hồ sơ KYC-{selected?.ekycProfileId} · <span className="font-semibold text-foreground">{selected?.fullName}</span>
            </p>
            <label htmlFor={`${rejectTitleId}-reason`} className="sr-only">Lý do từ chối</label>
            <textarea
              id={`${rejectTitleId}-reason`}
              ref={rejectReasonRef}
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Ảnh CMND bị mờ, không khớp với họ tên hồ sơ..."
              className="w-full border-2 border-border-strong rounded-[2px] px-3 py-2 text-sm outline-none focus:border-danger resize-none bg-background-base text-foreground"
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setRejectDialogOpen(false)}
                className="flex-1 border-2 border-border-strong text-foreground font-semibold py-2.5 rounded-[2px] hover:bg-surface-hover transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
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
