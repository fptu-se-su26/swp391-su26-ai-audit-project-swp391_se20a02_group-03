import { useState, useEffect, useCallback, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { kycApi } from '../../api/kycApi'
import { useToast } from '../../components/Toast'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import {
  AdminPageHeader,
  AdminFilterPills,
  AdminStatusBadge,
  AdminModal,
  AdminFormField,
  adminInputCls,
  AdminBtn,
  AdminCard,
} from '../../components/admin'

const KYC_FILTERS = [
  { key: 'Pending', label: 'Chờ duyệt' },
  { key: 'Approved', label: 'Đã duyệt' },
  { key: 'Rejected', label: 'Từ chối' },
  { key: '', label: 'Tất cả' },
]

const STATUS_VARIANT = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',
}

const STATUS_LABEL = {
  Pending: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Rejected: 'Từ chối',
}

const INITIAL_EVIDENCE_STATE = {
  front: 'missing',
  back: 'missing',
  face: 'missing',
}

function KycEvidenceImage({ evidenceKey, label, url, required, status, onStatusChange }) {
  const [retryKey, setRetryKey] = useState(0)

  if (!url) {
    return (
      <div>
        <p className="text-[11px] text-gray-400 mb-1.5 m-0">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
        <div className="h-28 rounded-[8px] bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center px-3 text-center">
          <span className="text-[11px] font-medium text-gray-400">
            {required ? 'Chưa có bằng chứng' : 'Không có ảnh (không bắt buộc)'}
          </span>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <p className="text-[11px] text-gray-400 mb-1.5 m-0">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
        <div className="h-28 rounded-[8px] bg-red-50/60 border border-red-100 flex flex-col items-center justify-center gap-2 px-3 text-center" role="status">
          <span className="text-[11px] font-medium text-red-600">Không tải được ảnh</span>
          <button
            type="button"
            className="text-[11px] font-bold text-red-600 underline underline-offset-2 bg-transparent border-0 cursor-pointer"
            onClick={() => {
              setRetryKey(key => key + 1)
              onStatusChange(evidenceKey, 'loading')
            }}
          >
            Thử tải lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[11px] text-gray-400 mb-1.5 m-0">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
      <div className="relative h-28 rounded-[8px] bg-gray-50 border border-gray-100 overflow-hidden">
        {status !== 'loaded' && (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-gray-400" role="status">
            Đang tải ảnh...
          </div>
        )}
        <img
          key={`${url}-${retryKey}`}
          src={url}
          alt={label}
          className={`w-full h-full object-cover ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => onStatusChange(evidenceKey, 'loaded')}
          onError={() => onStatusChange(evidenceKey, 'error')}
        />
      </div>
    </div>
  )
}

export default function AdminKycPage() {
  const { addToast } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Pending')
  const [selectedId, setSelectedId] = useState(null)
  const [acting, setActing] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [evidenceState, setEvidenceState] = useState(INITIAL_EVIDENCE_STATE)

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

  const selected = useMemo(
    () => requests.find(r => r.ekycProfileId === selectedId) || null,
    [requests, selectedId]
  )

  useEffect(() => {
    setEvidenceState({
      front: selected?.frontImageUrl ? 'loading' : 'missing',
      back: selected?.backImageUrl ? 'loading' : 'missing',
      face: selected?.faceImageUrl ? 'loading' : 'missing',
    })
    setApproveDialogOpen(false)
  }, [selected?.ekycProfileId, selected?.frontImageUrl, selected?.backImageUrl, selected?.faceImageUrl])

  const requiredEvidenceReady = evidenceState.front === 'loaded' && evidenceState.back === 'loaded'

  const handleEvidenceStatus = useCallback((key, status) => {
    setEvidenceState(current => current[key] === status ? current : { ...current, [key]: status })
  }, [])

  async function approve() {
    if (!selected || !requiredEvidenceReady || acting) return
    try {
      setActing(true)
      const res = await kycApi.approve(selected.ekycProfileId)
      if (res.statusCode === 200) {
        addToast('Đã phê duyệt hồ sơ.', 'success')
        setApproveDialogOpen(false)
        load()
      } else {
        addToast(res.message || 'Phê duyệt thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Phê duyệt thất bại.', 'error')
    } finally {
      setActing(false)
    }
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
      <AdminPageHeader
        title="Phê duyệt E-KYC"
        description="Kiểm tra giấy tờ tùy thân để mở khóa ví ký quỹ và quyền tạo kèo."
      />

      <div className="mb-6">
        <AdminFilterPills
          tabs={KYC_FILTERS}
          activeKey={filter}
          onChange={setFilter}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        {/* List panel */}
        <AdminCard noPad className="flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500 m-0">
              {loading ? 'Đang tải...' : `${requests.length} hồ sơ`}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 max-h-[560px]">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-[#14b8a6]" />
              </div>
            )}
            {!loading && requests.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">
                Không có hồ sơ nào.
              </div>
            )}
            {!loading && requests.map(req => {
              const isActive = req.ekycProfileId === selectedId
              return (
                <button
                  key={req.ekycProfileId}
                  type="button"
                  onClick={() => setSelectedId(req.ekycProfileId)}
                  className={`w-full text-left px-5 py-4 flex justify-between items-start gap-3 transition-colors cursor-pointer border-0 border-l-2 ${
                    isActive
                      ? 'bg-teal-50/60 border-l-[#14b8a6]'
                      : 'bg-white border-l-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm m-0 mb-0.5 truncate">{req.fullName}</p>
                    <p className="text-[11px] text-gray-400 m-0 font-mono">
                      KYC-{req.ekycProfileId} · {req.identityNumber}
                    </p>
                  </div>
                  <AdminStatusBadge
                    label={STATUS_LABEL[req.status] || req.status}
                    variant={STATUS_VARIANT[req.status] || 'neutral'}
                  />
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 m-0">Chọn một hồ sơ để xem chi tiết.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
                <div>
                  <p className="font-heading text-base uppercase tracking-wide text-gray-900 m-0">
                    Chi tiết KYC-{selected.ekycProfileId}
                  </p>
                  <p className="text-[12px] text-gray-400 m-0 mt-0.5">{selected.fullName}</p>
                </div>
                <AdminStatusBadge
                  label={STATUS_LABEL[selected.status] || selected.status}
                  variant={STATUS_VARIANT[selected.status] || 'neutral'}
                />
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* Document images */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Hình ảnh giấy tờ</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'front', label: 'Mặt trước', url: selected.frontImageUrl, required: true },
                      { key: 'back', label: 'Mặt sau', url: selected.backImageUrl, required: true },
                      { key: 'face', label: 'Chân dung', url: selected.faceImageUrl, required: false },
                    ].map(item => (
                      <KycEvidenceImage
                        key={`${selected.ekycProfileId}-${item.key}`}
                        evidenceKey={item.key}
                        label={item.label}
                        url={item.url}
                        required={item.required}
                        status={evidenceState[item.key]}
                        onStatusChange={handleEvidenceStatus}
                      />
                    ))}
                  </div>
                </div>

                {/* Info grid */}
                <div className="bg-gray-50 rounded-[8px] p-4 grid grid-cols-2 gap-4">
                  {[
                    ['Họ tên trên thẻ', selected.fullName],
                    ['Họ tên hồ sơ', selected.profileFullName || '—'],
                    ['Số CMND/CCCD', selected.identityNumber],
                    ['Email', selected.userEmail || '—'],
                  ].map(([key, val]) => (
                    <div key={key}>
                      <p className="text-[11px] text-gray-400 m-0 mb-0.5">{key}</p>
                      <p className="text-sm font-semibold text-gray-900 m-0 truncate">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Rejection reason */}
                {selected.status === 'Rejected' && selected.rejectionReason && (
                  <div className="bg-red-50 border border-red-100 rounded-[8px] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 m-0 mb-1">Lý do từ chối</p>
                    <p className="text-sm text-red-700 m-0">{selected.rejectionReason}</p>
                  </div>
                )}

                {/* Action buttons (Pending only) */}
                {selected.status === 'Pending' && (
                  <div className="pt-4 border-t border-gray-100">
                    {!requiredEvidenceReady && (
                      <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-100 rounded-[8px] px-3 py-2.5 m-0 mb-3" role="status">
                        Cần tải thành công ảnh mặt trước và mặt sau trước khi phê duyệt.
                      </p>
                    )}
                    <div className="flex gap-3">
                    <AdminBtn
                      variant="danger"
                      onClick={() => { setRejectReason(''); setRejectDialogOpen(true) }}
                      disabled={acting}
                      icon={<XCircle size={14} />}
                      className="flex-1"
                    >
                      Từ chối
                    </AdminBtn>
                    <AdminBtn
                      variant="primary"
                      onClick={() => setApproveDialogOpen(true)}
                      disabled={acting || !requiredEvidenceReady}
                      loading={acting}
                      icon={<CheckCircle size={14} />}
                      className="flex-1"
                    >
                      Phê duyệt
                    </AdminBtn>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </AdminCard>
      </div>

      {/* Reject Modal */}
      <AdminModal
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        title="Từ chối hồ sơ KYC"
        description={selected ? `KYC-${selected.ekycProfileId} · ${selected.fullName}` : ''}
      >
        <div className="space-y-5">
          <AdminFormField
            label="Lý do từ chối"
            htmlFor="reject-reason"
            required
            hint="Mô tả rõ ràng để người dùng biết cần sửa chữa điều gì."
          >
            <textarea
              id="reject-reason"
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="VD: Ảnh CMND bị mờ, không khớp với họ tên hồ sơ..."
              className={`${adminInputCls(!rejectReason.trim() ? false : false)} h-auto py-3 resize-none`}
              autoFocus
            />
          </AdminFormField>

          <div className="flex gap-3">
            <AdminBtn
              variant="secondary"
              onClick={() => setRejectDialogOpen(false)}
              className="flex-1"
            >
              Hủy
            </AdminBtn>
            <AdminBtn
              variant="danger"
              onClick={confirmReject}
              disabled={acting || !rejectReason.trim()}
              loading={acting}
              className="flex-1"
            >
              Xác nhận từ chối
            </AdminBtn>
          </div>
        </div>
      </AdminModal>

      {/* Approve Modal */}
      <AdminModal
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        title="Xác nhận phê duyệt"
        description={selected ? `Bạn có chắc chắn muốn phê duyệt KYC-${selected.ekycProfileId} của ${selected.fullName}?` : ''}
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600 m-0">
            Hành động này sẽ xác thực hồ sơ và cho phép người dùng thực hiện các giao dịch yêu cầu KYC.
          </p>
          {!requiredEvidenceReady && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-[8px] px-3 py-2.5 m-0" role="alert">
              Không thể phê duyệt vì bằng chứng bắt buộc chưa tải thành công.
            </p>
          )}
          <div className="flex gap-3">
            <AdminBtn
              variant="secondary"
              onClick={() => setApproveDialogOpen(false)}
              className="flex-1"
            >
              Hủy
            </AdminBtn>
            <AdminBtn
              variant="primary"
              onClick={approve}
              disabled={acting || !requiredEvidenceReady}
              loading={acting}
              className="flex-1"
            >
              Xác nhận phê duyệt
            </AdminBtn>
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  )
}
