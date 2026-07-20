import { useEffect } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null // bỏ qua phần tử đang bị ẩn (display:none/không render)
  )
}

/**
 * Bẫy focus (Tab/Shift+Tab tuần hoàn) bên trong containerRef khi `active`, hỗ trợ Escape để
 * đóng, tự đưa focus vào phần tử đầu tiên khi mở và trả focus về phần tử đã focus trước đó
 * (hoặc `restoreFocusRef` nếu chỉ định) khi đóng/unmount.
 *
 * Dùng chung cho mọi drawer/sidebar mobile và modal (AdminLayout, OwnerSidebar,
 * CourtFormModal, AdminKycPage reject dialog, OwnerStaffPage modal, ...).
 */
export function useFocusTrap({ active, containerRef, onEscape, restoreFocusRef, initialFocusRef }) {
  useEffect(() => {
    if (!active) return undefined
    const container = containerRef.current
    if (!container) return undefined

    const previouslyFocused = document.activeElement

    const toFocus = initialFocusRef?.current || getFocusable(container)[0] || container
    toFocus?.focus?.()

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onEscape?.()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = getFocusable(container)
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const restoreEl = restoreFocusRef?.current || previouslyFocused
      if (restoreEl && typeof restoreEl.focus === 'function') restoreEl.focus()
    }
    // Chỉ chạy lại khi active đổi — các ref là container ổn định, không cần trong deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
