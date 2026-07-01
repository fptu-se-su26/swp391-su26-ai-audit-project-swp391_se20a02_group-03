import { useState, useEffect, useCallback, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { kycApi } from '../../api/kycApi'
import { useToast } from '../../components/Toast'
import { Loader2, X } from 'lucide-react'

const STATUS_META = {
  Pending: { label: 'CHỜ DUYỆT', cls: 'bg-amber-100 text-amber-700' },
  Approved: { label: 'ĐÃ DUYỆT', cls: 'bg-green-100 text-green-700' },
  Rejected: { label: 'TỪ CHỐI', cls: 'bg-red-100 text-red-700' },
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Phê duyệt E-KYC</h1>
          <p className="text-sm text-slate-500">Kiểm tra giấy tờ tùy thân để mở khóa ví ký quỹ và quyền tạo kèo.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`py-[6px] px-4 rounded-full border text-sm font-medium transition-colors ${filter === f.key ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-[#0d9488]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">{loading ? 'Đang tải...' : `${requests.length} hồ sơ`}</h2>
            </div>
            <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
              {!loading && requests.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">Không có hồ sơ nào.</div>
              )}
              {requests.map(req => {
                const meta = STATUS_META[req.status] || STATUS_META.Pending
                const active = req.ekycProfileId === selectedId
                return (
                  <div key={req.ekycProfileId} onClick={() => setSelectedId(req.ekycProfileId)} className={`p-4 flex justify-between items-center cursor-pointer ${active ? 'bg-[#14B8A6]/5 border-l-4 border-[#14B8A6]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}>
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-1">{req.fullName}</p>
                      <p className="text-xs text-slate-500">KYC-{req.ekycProfileId} • {req.identityNumber}</p>
                    </div>
                    <span className={`text-[0.65rem] font-bold px-2 py-1 rounded-full ${meta.cls}`}>{meta.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm min-h-[300px]">Chọn một hồ sơ để xem chi tiết.</div>
            ) : (
              <>
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-800">Chi tiết KYC-{selected.ekycProfileId}</h2>
                  <span className={`text-[0.65rem] font-bold px-2 py-1 rounded-full ${(STATUS_META[selected.status] || STATUS_META.Pending).cls}`}>
                    {(STATUS_META[selected.status] || STATUS_META.Pending).label}
                  </span>
                </div>
                <div className="p-6 flex-1 space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[['Mặt trước', selected.frontImageUrl], ['Mặt sau', selected.backImageUrl], ['Chân dung', selected.faceImageUrl]].map(([label, url]) => (
                      <div key={label}>
                        <p className="text-xs font-semibold text-slate-500 mb-2">{label}</p>
                        <div className="bg-slate-100 rounded-lg h-28 flex items-center justify-center border border-slate-200 overflow-hidden">
                          <img src={url || IMG_FALLBACK} alt={label} className="w-full h-full object-cover" onError={e => { e.currentTarget.src = IMG_FALLBACK }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider mb-1">Họ tên trên thẻ</p>
                      <p className="text-sm font-bold text-slate-900">{selected.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider mb-1">Họ tên hồ sơ</p>
                      <p className="text-sm font-bold text-slate-900">{selected.profileFullName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider mb-1">Số CMND/CCCD</p>
                      <p className="text-sm font-bold text-slate-900">{selected.identityNumber}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider mb-1">Thư điện tử</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{selected.userEmail || '—'}</p>
                    </div>
                  </div>

                  {selected.status === 'Rejected' && selected.rejectionReason && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
                      <span className="font-semibold">Lý do từ chối:</span> {selected.rejectionReason}
                    </div>
                  )}

                  {selected.status === 'Pending' && (
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button onClick={openRejectDialog} disabled={acting} className="flex-1 border border-red-200 text-red-500 font-bold py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60">Từ chối</button>
                      <button onClick={approve} disabled={acting} className="flex-1 bg-[#14B8A6] text-white font-bold py-2.5 rounded-lg hover:bg-[#0D9488] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Nhập lý do từ chối</h3>
              <button onClick={() => setRejectDialogOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              Hồ sơ KYC-{selected?.ekycProfileId} · <span className="font-semibold">{selected?.fullName}</span>
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Ảnh CMND bị mờ, không khớp với họ tên hồ sơ..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 resize-none"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectDialogOpen(false)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={acting || !rejectReason.trim()}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
