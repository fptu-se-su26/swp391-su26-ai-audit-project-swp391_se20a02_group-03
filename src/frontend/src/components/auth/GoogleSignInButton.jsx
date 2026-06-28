import { useEffect, useRef, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID, isGoogleAuthConfigured } from '../../utils/googleAuth'

export default function GoogleSignInButton({ onSuccess, onError, text = 'continue_with', disabled = false }) {
  const containerRef = useRef(null)
  const [buttonWidth, setButtonWidth] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return
    setButtonWidth(Math.max(240, Math.floor(containerRef.current.offsetWidth)))
  }, [])

  if (!isGoogleAuthConfigured()) {
    return (
      <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 leading-relaxed">
        <p className="font-semibold mb-1">Google Sign-In chưa sẵn sàng</p>
        <p className="text-amber-800/90">
          Tạo file <code className="text-xs bg-amber-100 px-1 rounded">src/frontend/.env</code> với{' '}
          <code className="text-xs bg-amber-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> và cấu hình{' '}
          <code className="text-xs bg-amber-100 px-1 rounded">GoogleAuth:ClientId</code> trên backend (cùng một Client ID).
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full flex justify-center min-h-[44px]">
      {buttonWidth != null && (
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          onSuccess={onSuccess}
          onError={() => onError?.('Không mở được cửa sổ Google. Kiểm tra chặn popup hoặc Client ID.')}
          theme="outline"
          size="large"
          shape="rectangular"
          width={buttonWidth}
          text={text}
          locale="vi"
          useOneTap={false}
          auto_select={false}
          disabled={disabled}
        />
      )}
    </div>
  )
}
