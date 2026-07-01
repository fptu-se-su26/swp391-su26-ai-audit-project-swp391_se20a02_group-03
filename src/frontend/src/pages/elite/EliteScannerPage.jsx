import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Html5QrcodeScanner } from 'html5-qrcode'
import EliteLayout from '../../layouts/EliteLayout'
import { bookingApi } from '../../api/bookingApi'
import { gsap } from 'gsap'
import './EliteScannerPage.css'

export default function EliteScannerPage() {
  const [searchParams] = useSearchParams()
  const prefillCode = searchParams.get('code')
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [manualCode, setManualCode] = useState(prefillCode || '')
  const [scanKey, setScanKey] = useState(0)
  const scannerRef = useRef(null)

  async function doCheckIn(code, { fromScanner = false } = {}) {
    if (!code) return
    setLoading(true)
    setError(null)
    try {
      const res = await bookingApi.checkInBooking(code)
      // axiosClient đã bóc 1 lớp -> res = { statusCode, message, data: BookingDto }
      if (res.statusCode === 200 && res.data) {
        setScanResult(res.data)
        gsap.fromTo('.scanner-success', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
      } else {
        throw res.message || 'Xác nhận vào thất bại! Mã không hợp lệ.'
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.response?.data?.message || err?.message || 'Xác nhận vào thất bại! Mã không hợp lệ.')
      setError(msg)
      if (fromScanner && scannerRef.current) {
        setTimeout(() => {
          setError(null)
          try { scannerRef.current.resume() } catch (_) { /* noop */ }
        }, 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (prefillCode?.trim()) {
      doCheckIn(prefillCode.trim())
    }
  }, [prefillCode])

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    }, false)
    scannerRef.current = scanner

    scanner.render(async (text) => {
      scanner.pause()
      await doCheckIn(text, { fromScanner: true })
    }, () => { /* bỏ qua lỗi mỗi frame khi chưa thấy QR */ })

    return () => {
      try { scanner.clear() } catch (_) { /* noop */ }
    }
  }, [scanKey])

  function resetScanner() {
    setScanResult(null)
    setError(null)
    setManualCode('')
    setScanKey(k => k + 1) // force remount scanner — không reload trang
  }

  return (
    <EliteLayout title="Máy quét QR">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Xác nhận vào bằng QR</h1>
          <p className="text-foreground-muted">Quét mã QR đặt sân của khách để xác nhận vào sân ngay.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trái: Scanner + nhập tay */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div key={scanKey} id="reader" className="w-full overflow-hidden rounded-lg"></div>
            {loading && <p className="text-center mt-4 text-blue-600 font-semibold animate-pulse">Đang xử lý...</p>}
            {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center font-medium">{error}</div>}

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">Hoặc nhập mã thủ công</p>
              <form
                onSubmit={(e) => { e.preventDefault(); doCheckIn(manualCode.trim()) }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Nhập mã xác nhận vào..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={loading || !manualCode.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  Xác nhận vào
                </button>
              </form>
            </div>
          </div>

          {/* Phải: Kết quả */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center min-h-[300px]">
            {!scanResult && !loading && !error && (
              <div className="text-center text-foreground-muted">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                <p>Đang chờ quét mã QR...</p>
              </div>
            )}

            {scanResult && (
              <div className="scanner-success w-full">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Xác nhận vào thành công!</h2>
                  <div className="text-left bg-white p-4 rounded-lg mt-4 shadow-sm">
                    <p className="mb-2"><span className="text-foreground-muted">Mã đặt:</span> <span className="font-semibold">#{scanResult.bookingId}</span></p>
                    <p className="mb-2"><span className="text-foreground-muted">Tổng tiền:</span> <span className="font-semibold">{scanResult.totalAmount?.toLocaleString('vi-VN')} đ</span></p>
                    <p className="mb-2"><span className="text-foreground-muted">Trạng thái:</span> <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">ĐÃ VÀO SÂN</span></p>
                    <hr className="my-3" />
                    <h3 className="font-bold text-gray-700 mb-2">Cơ sở/Sân</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {scanResult.details?.map((d, i) => (
                        <li key={i}>{d.courtName} ({String(d.startTime).slice(0, 5)} - {String(d.endTime).slice(0, 5)})</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={resetScanner}
                    className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors">
                    Quét khách tiếp theo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
