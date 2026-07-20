import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import ProSportLogo from '../../components/ui/ProSportLogo'
import { bookingApi } from '../../api/bookingApi'
import { useToast } from '../../components/Toast'

export default function MobileScannerPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const scannerRef = useRef(null)
  const processingRef = useRef(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState(null)
  const [cameraError, setCameraError] = useState(false)
  const [scanKey, setScanKey] = useState(0)

  async function doCheckIn(code) {
    const trimmed = code?.trim()
    if (!trimmed || loading || processingRef.current) return
    processingRef.current = true
    if (scannerRef.current) {
      try { await scannerRef.current.stop() } catch { /* noop */ }
    }
    setLoading(true)
    setError(null)
    try {
      const res = await bookingApi.checkInBooking(trimmed)
      if (res.statusCode === 200 && res.data) {
        setScanResult(res.data)
        setManualOpen(false)
        setManualCode('')
        addToast('Check-in thành công!', 'success')
      } else {
        throw res.message || 'Mã không hợp lệ.'
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.message || 'Check-in thất bại.')
      setError(msg)
      addToast(msg, 'error')
    } finally {
      setLoading(false)
      processingRef.current = false
    }
  }

  useEffect(() => {
    if (scanResult || manualOpen) return undefined
    let active = true
    // Trình duyệt/thiết bị không hỗ trợ camera (thiếu navigator.mediaDevices, không phải chỉ
    // từ chối quyền) khiến Html5Qrcode ném lỗi ĐỒNG BỘ ngay tại constructor/start — không rơi
    // vào .catch() của promise. Bọc try/catch để luôn rơi về trạng thái "nhập mã thủ công"
    // thay vì crash trắng trang.
    let scanner
    try {
      scanner = new Html5Qrcode('mobile-qr-reader')
      scannerRef.current = scanner
      scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text) => { if (active) doCheckIn(text) },
        () => {},
      ).catch(() => {
        if (active) setCameraError(true)
      })
    } catch {
      if (active) setCameraError(true)
    }

    return () => {
      active = false
      // scanner.stop()/clear() có thể ném lỗi ĐỒNG BỘ (không phải Promise reject) khi scanner
      // chưa từng start thành công (ví dụ camera không khả dụng) — .catch() không bắt được lỗi
      // đồng bộ nên phải bọc try/catch riêng, nếu không cleanup effect sẽ crash cả trang.
      try { scanner?.stop()?.catch(() => {}) } catch { /* noop */ }
      try { scanner?.clear()?.catch(() => {}) } catch { /* noop */ }
    }
  }, [scanKey, scanResult, manualOpen])

  function resetScan() {
    setScanResult(null)
    setError(null)
    setManualCode('')
    setCameraError(false)
    setScanKey(k => k + 1)
  }

  const courtLabel = scanResult?.details?.[0]?.courtName || 'Sân'
  const timeLabel = scanResult?.details?.[0]
    ? `${String(scanResult.details[0].startTime).slice(0, 5)} – ${String(scanResult.details[0].endTime).slice(0, 5)}`
    : ''

  return (
    <div className="flex justify-center min-h-screen bg-slate-200 py-5 max-[449px]:p-0">
      <div className="w-full max-w-[414px] bg-[#0f172a] min-h-[800px] relative flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] min-[450px]:rounded-[40px] min-[450px]:border-[8px] min-[450px]:border-[#0f172a] min-[450px]:h-[850px] max-[449px]:max-w-full max-[449px]:min-h-screen">

        <div className="h-[60px] flex items-center justify-between px-4 absolute top-0 left-0 right-0 z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
            className="bg-[var(--theme-surface-hover)] border-none w-11 h-11 rounded-full text-[var(--theme-primary)] flex items-center justify-center cursor-pointer hover:bg-white/20"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <ProSportLogo size="sm" variant="light" />
          <Link to="/elite/scanner" aria-label="Scanner desktop" className="bg-[var(--theme-surface-hover)] border-none w-11 h-11 rounded-full text-[var(--theme-primary)] flex items-center justify-center cursor-pointer hover:bg-white/20 no-underline" title="Scanner desktop">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 7h10v10H7z"/></svg>
          </Link>
        </div>

        <div className="flex-1 relative bg-slate-800 flex flex-col justify-center items-center pt-[60px]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-950 opacity-80" />

          <div className="relative z-10 flex flex-col items-center w-full px-6">
            <div className="bg-black/60 text-[var(--theme-primary)] text-xs py-2 px-4 rounded-full mb-4">
              {loading ? 'Đang xử lý...' : cameraError ? 'Camera không khả dụng — nhập mã thủ công' : 'Hướng camera vào mã QR check-in'}
            </div>

            <div id="mobile-qr-reader" key={scanKey} className="w-[250px] min-h-[250px] rounded-xl overflow-hidden mb-4 bg-black/40" />

            {error && (
              <p className="text-red-400 text-sm text-center mb-4 max-w-[280px]">{error}</p>
            )}

            <button
              type="button"
              onClick={() => { setManualOpen(true); setError(null) }}
              className="bg-transparent border-none text-[#00c2ff] text-sm font-semibold cursor-pointer hover:underline"
            >
              Nhập mã check-in thủ công
            </button>
          </div>
        </div>

        {manualOpen && (
          <div className="absolute inset-0 z-20 bg-black/70 flex items-end">
            <div className="w-full bg-slate-100 rounded-t-2xl p-5">
              <h3 className="font-bold text-slate-900 mb-3">Nhập mã QR</h3>
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="DEMO-QR-... hoặc QR-..."
                className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setManualOpen(false)} className="flex-1 py-3 rounded-lg border border-slate-300 bg-white font-semibold cursor-pointer">Hủy</button>
                <button type="button" disabled={loading || !manualCode.trim()} onClick={() => doCheckIn(manualCode)} className="flex-1 py-3 rounded-lg bg-[#006070] text-white font-semibold border-none cursor-pointer disabled:opacity-50">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {scanResult && (
          <div className="absolute bottom-6 left-4 right-4 bg-slate-200 rounded-2xl p-5 flex items-center gap-4 z-10 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-[#006070]/10 text-[#006070] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[0.65rem] font-bold text-[#008ba3] mb-0.5">Check-in thành công</span>
              <h3 className="text-base font-bold text-slate-900 mb-0.5 truncate">{courtLabel}</h3>
              <p className="text-xs text-slate-500">#{scanResult.bookingId} • {timeLabel}</p>
            </div>
            <button
              type="button"
              onClick={resetScan}
              className="bg-[#006070] text-white border-none py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#004e5c] shrink-0"
            >
              Tiếp
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
