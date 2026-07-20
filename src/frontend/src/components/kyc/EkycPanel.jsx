import { useState, useEffect, useRef, useCallback } from 'react'
import { ShieldCheck, Upload, Loader2, X, Info } from 'lucide-react'
import { kycApi } from '../../api/kycApi'
import { useToast } from '../Toast'

// TK-004: Panel nộp hồ sơ E-KYC dùng chung cho CustomerProfilePage & ApexSettingsPage.
// Luồng: chọn ảnh mặt trước/sau CCCD → upload /api/upload/image (folder ekyc)
// → POST /api/kyc/submit → hồ sơ Pending chờ Admin duyệt trên AdminKycPage.

const STATUS_BADGE = {
  Pending:  { label: 'Chờ duyệt',      cls: 'bg-yellow-50 text-yellow-700 border-yellow-200/50' },
  Approved: { label: 'Đã xác thực',    cls: 'bg-green-50 text-green-700 border-green-200/50' },
  Rejected: { label: 'Bị từ chối',     cls: 'bg-red-50 text-red-700 border-red-200/50' },
  None:     { label: 'Chưa xác thực',  cls: 'bg-gray-100 text-gray-600 border-gray-200' },
}

function ImagePicker({ label, file, previewUrl, onPick, onClear, disabled }) {
  const inputRef = useRef(null)
  return (
    <div>
      <label className="block text-[13px] font-semibold text-gray-700 mb-2">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) onPick(f)
          e.target.value = ''
        }}
      />
      {previewUrl ? (
        <div className="relative border border-gray-200 rounded-xl h-48 overflow-hidden bg-gray-50">
          <img src={previewUrl} alt={label} className="w-full h-full object-contain p-2" />
          {!disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label={`Xóa ${label}`}
            >
              <X size={16} />
            </button>
          )}
          {file && (
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[12px] px-3 py-2 truncate backdrop-blur-sm">
              {file.name}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-500 hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors mb-3">
            <Upload size={24} />
          </div>
          <span className="text-[14px] font-medium text-gray-900 group-hover:text-teal-600">Nhấn để tải ảnh lên</span>
          <span className="text-[12px] text-gray-500 mt-1">JPG, PNG, WEBP · tối đa 5MB</span>
        </button>
      )}
    </div>
  )
}

export default function EkycPanel() {
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)   // hồ sơ đã nộp (null = chưa nộp)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ fullName: '', identityNumber: '' })
  const [frontFile, setFrontFile] = useState(null)
  const [backFile, setBackFile] = useState(null)
  const [frontPreview, setFrontPreview] = useState('')
  const [backPreview, setBackPreview] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await kycApi.getMine()
      if (res?.statusCode === 200 && res.data) setProfile(res.data)
    } catch {
      // 404 = chưa nộp hồ sơ — hiển thị form trống
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Thu hồi objectURL khi đổi/hủy ảnh để tránh rò rỉ bộ nhớ
  useEffect(() => () => { if (frontPreview) URL.revokeObjectURL(frontPreview) }, [frontPreview])
  useEffect(() => () => { if (backPreview) URL.revokeObjectURL(backPreview) }, [backPreview])

  function pickFront(f) { setFrontFile(f); setFrontPreview(URL.createObjectURL(f)) }
  function pickBack(f)  { setBackFile(f);  setBackPreview(URL.createObjectURL(f)) }

  async function handleSubmit() {
    if (!form.fullName.trim() || !form.identityNumber.trim()) {
      addToast('Vui lòng nhập họ tên và số CMND/CCCD.', 'error')
      return
    }
    if (!frontFile || !backFile) {
      addToast('Vui lòng tải lên đủ ảnh mặt trước và mặt sau CCCD.', 'error')
      return
    }
    try {
      setSubmitting(true)
      const [frontRes, backRes] = await Promise.all([
        kycApi.uploadImage(frontFile),
        kycApi.uploadImage(backFile),
      ])
      const frontUrl = frontRes?.url || frontRes?.Url
      const backUrl = backRes?.url || backRes?.Url
      if (!frontUrl || !backUrl) {
        addToast('Tải ảnh lên thất bại. Vui lòng thử lại.', 'error')
        return
      }
      const res = await kycApi.submit({
        fullName: form.fullName.trim(),
        identityNumber: form.identityNumber.trim(),
        frontImageUrl: frontUrl,
        backImageUrl: backUrl,
      })
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        addToast('Đã gửi hồ sơ E-KYC. Vui lòng chờ phê duyệt.', 'success')
        setFrontFile(null); setBackFile(null)
        setFrontPreview(''); setBackPreview('')
        load()
      } else {
        addToast(res?.message || 'Gửi hồ sơ thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Gửi hồ sơ thất bại.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const status = profile?.status || 'None'
  const badge = STATUS_BADGE[status] || STATUS_BADGE.None
  // Cho phép nộp khi: chưa có hồ sơ, hoặc hồ sơ bị từ chối (nộp lại)
  const canSubmit = !profile || status === 'Rejected'

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 py-12 justify-center">
        <Loader2 size={16} className="animate-spin" /> Đang tải trạng thái E-KYC...
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl uppercase tracking-tight text-gray-900 mb-1">Xác thực danh tính</h2>
          <p className="text-gray-500 text-[14px]">Cung cấp thông tin CCCD để xác minh tài khoản của bạn</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-[13px] font-medium border ${badge.cls}`}>{badge.label}</span>
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex gap-3 mb-8">
        <ShieldCheck size={20} className="text-teal-600 shrink-0 mt-0.5" />
        <p className="text-[14px] text-teal-800 leading-relaxed">
          Xác thực E-KYC là bắt buộc để bạn có thể <span className="font-bold">Tạo kèo</span> và{' '}
          <span className="font-bold">Sử dụng ví ký quỹ</span>. Thông tin của bạn được mã hóa an toàn.
        </p>
      </div>

      {status === 'Pending' && (
        <div className="bg-yellow-50 border border-yellow-200/50 rounded-xl p-4 text-[14px] text-yellow-800 mb-8 flex items-start gap-3">
          <Info size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            Hồ sơ của bạn (họ tên <span className="font-bold">{profile.fullName}</span>, CCCD <span className="font-bold">{profile.identityNumber}</span>) đang chờ quản trị viên phê duyệt.
          </div>
        </div>
      )}
      {status === 'Approved' && (
        <div className="bg-green-50 border border-green-200/50 rounded-xl p-4 text-[14px] text-green-800 mb-8 flex items-center gap-3">
          <ShieldCheck size={20} className="text-green-600 shrink-0" />
          Tài khoản đã được xác thực định danh. Bạn có thể tạo kèo và sử dụng ví ký quỹ.
        </div>
      )}
      {status === 'Rejected' && (
        <div className="bg-red-50 border border-red-200/50 rounded-xl p-4 text-[14px] text-red-800 mb-8 flex items-start gap-3">
          <Info size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Hồ sơ bị từ chối:</span> {profile.rejectionReason || 'Không có lý do.'}
            <span className="block mt-1">Vui lòng nộp lại hồ sơ với ảnh rõ nét hơn.</span>
          </div>
        </div>
      )}

      {canSubmit && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Họ tên trên CCCD</label>
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                placeholder="NGUYEN VAN A"
                className="w-full px-4 py-2.5 rounded-[8px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Số CMND / CCCD</label>
              <input
                type="text"
                value={form.identityNumber}
                onChange={e => setForm(p => ({ ...p, identityNumber: e.target.value }))}
                placeholder="0790XXXXXXXX"
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-[8px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-[14px]"
              />
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <ImagePicker
              label="Mặt trước CMND / CCCD"
              file={frontFile}
              previewUrl={frontPreview}
              onPick={pickFront}
              onClear={() => { setFrontFile(null); setFrontPreview('') }}
              disabled={submitting}
            />
            <ImagePicker
              label="Mặt sau CMND / CCCD"
              file={backFile}
              previewUrl={backPreview}
              onPick={pickBack}
              onClear={() => { setBackFile(null); setBackPreview('') }}
              disabled={submitting}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-[8px] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? 'Đang gửi hồ sơ...' : 'Gửi yêu cầu xác thực'}
          </button>
        </>
      )}
    </div>
  )
}
