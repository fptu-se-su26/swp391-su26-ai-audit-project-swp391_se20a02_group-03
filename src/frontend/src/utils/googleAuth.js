export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()

export function isGoogleAuthConfigured() {
  return GOOGLE_CLIENT_ID.length > 0 && !GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE')
}

export function extractAuthPayload(response) {
  const data = response?.data ?? response
  return {
    token: data?.accessToken || response?.accessToken || data?.token || response?.token,
    userId: data?.userId || response?.userId,
    fullName: data?.fullName || response?.fullName,
    email: data?.email || response?.email,
    role: data?.role || response?.role || 'Customer',
    avatarUrl: data?.avatarUrl || response?.avatarUrl || null,
    isProfileComplete: data?.isProfileComplete ?? response?.isProfileComplete ?? true,
  }
}

export function mapGoogleAuthError(err) {
  if (typeof err !== 'string') return 'Đăng nhập Google thất bại. Vui lòng thử lại.'
  const m = err.toLowerCase()

  if (m.includes('not configured') || m.includes('chưa được cấu hình')) {
    return 'Đăng nhập Google chưa được cấu hình trên server. Cần thiết lập Google Client ID cho frontend và backend (xem src/frontend/.env.example).'
  }
  if (m.includes('invalid google token') || m.includes('token')) {
    return 'Token Google không hợp lệ. Kiểm tra Client ID frontend và backend phải trùng nhau, và thêm http://localhost:5173 cùng http://127.0.0.1:5173 vào Google Cloud Console.'
  }
  if (m.includes('network error') || m.includes('kết nối')) {
    return err
  }
  if (m.includes('khóa') || m.includes('locked') || m.includes('403')) {
    return 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'
  }

  return err
}
