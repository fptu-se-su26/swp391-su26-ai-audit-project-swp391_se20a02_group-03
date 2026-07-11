import { useState, useEffect, useRef, useCallback } from 'react'
import { ShieldCheck, Upload, Loader2, X } from 'lucide-react'
import { kycApi } from '../../api/kycApi'
import { useToast } from '../Toast'

// TK-004: Panel nộp hồ sơ E-KYC dùng chung cho CustomerProfilePage & ApexSettingsPage.
// Luồng: chọn ảnh mặt trước/sau CCCD → upload /api/upload/image (folder ekyc)
// → POST /api/kyc/submit → hồ sơ Pending chờ Admin duyệt trên AdminKycPage.

const STATUS_BADGE = {
  Pending:  { label: 'Chờ duyệt',      cls: 'bg-warning-bg text-warning border border-warning' },
  Approved: { label: 'Đã xác thực',    cls: 'bg-ink text-paper border border-ink' },
  Rejected: { label: 'Bị từ chối',     cls: 'bg-danger-bg text-danger border border-danger' },
  None:     { label: 'Chưa xác thực',  cls: 'bg-warning-bg text-warning border border-warning' },
}

function ImagePicker({ label, file, previewUrl, onPick, onClear, disabled }) {
  const inputRef = useRef(null)
  return (
    <div>
      <label className="block label-mono text-foreground-muted mb-2">{label}</label>
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
        <div className="relative border-2 border-border-strong h-40 overflow-hidden">
          <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-surface border-2 border-border-strong text-foreground-muted hover:text-danger hover:border-danger transition-colors"
              aria-label={`Xóa ${label}`}
            >
              <X size={13} />
            </button>
          )}
          {file && (
            <span className="absolute bottom-0 inset-x-0 bg-ink/80 text-paper text-[11px] px-2 py-1 truncate">{file.name}</span>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border-hover h-40 flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:bg-accent/5 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={32} className="mb-2" />
          <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
          <span className="label-mono text-foreground-subtle mt-1">JPG, PNG, WEBP · tối đa 5MB</span>
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
      <div className="flex items-center gap-2 text-sm text-foreground-muted py-8 justify-center">
        <Loader2 size={16} className="animate-spin" /> Đang tải trạng thái E-KYC...
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-heading text-xl uppercase text-foreground">Xác thực danh tính (E-KYC)</h2>
        <span className={`label-mono px-3 py-1.5 ${badge.cls}`}>{badge.label}</span>
      </div>

      <div className="border-2 border-border-strong bg-background-base p-4 flex gap-3 mb-6">
        <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-foreground-muted leading-relaxed">
          Xác thực E-KYC là bắt buộc để bạn có thể <b className="text-foreground">Tạo kèo</b> và{' '}
          <b className="text-foreground">Sử dụng ví ký quỹ</b>. Thông tin của bạn được mã hóa an toàn.
        </p>
      </div>

      {status === 'Pending' && (
        <div className="bg-warning-bg border border-warning p-4 text-sm text-warning mb-6">
          Hồ sơ của bạn (họ tên <b>{profile.fullName}</b>, CCCD <b>{profile.identityNumber}</b>) đang chờ quản trị viên phê duyệt.
        </div>
      )}
      {status === 'Approved' && (
        <div className="bg-background-base border-2 border-border-strong p-4 text-sm text-foreground mb-6 flex items-center gap-2">
          <ShieldCheck size={18} className="text-accent" />
          Tài khoản đã được xác thực định danh. Bạn có thể tạo kèo và sử dụng ví ký quỹ.
        </div>
      )}
      {status === 'Rejected' && (
        <div className="bg-danger-bg border border-danger p-4 text-sm text-danger mb-6">
          <span className="font-semibold">Hồ sơ bị từ chối:</span> {profile.rejectionReason || 'Không có lý do.'}
          <span className="block mt-1">Vui lòng nộp lại hồ sơ với ảnh rõ nét hơn.</span>
        </div>
      )}

      {canSubmit && (
        <>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block label-mono text-foreground-muted mb-2">Họ tên trên CCCD</label>
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                placeholder="NGUYEN VAN A"
                className="input-base"
              />
            </div>
            <div>
              <label className="block label-mono text-foreground-muted mb-2">Số CMND / CCCD</label>
              <input
                type="text"
                value={form.identityNumber}
                onChange={e => setForm(p => ({ ...p, identityNumber: e.target.value }))}
                placeholder="0790XXXXXXXX"
                maxLength={20}
                className="input-base"
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
            className="btn-primary w-full h-12 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Đang gửi hồ sơ...' : 'Gửi yêu cầu xác thực'}
          </button>
        </>
      )}
    </div>
  )
}
