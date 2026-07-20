import { useState, useEffect } from 'react'

// Cùng breakpoint Tailwind `lg` (1024px) mà AdminLayout/OwnerSidebar dùng để ẩn/hiện sidebar
// mobile qua CSS. Cần biết đúng viewport hiện tại để không áp aria-hidden/inert nhầm lên
// sidebar đang hiển thị thật sự trên desktop (nơi state `sidebarOpen` luôn là false).
const QUERY = '(min-width: 1024px)'

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : true
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handler = (e) => setIsDesktop(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isDesktop
}
