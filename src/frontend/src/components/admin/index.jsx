/**
 * Admin UI Kit — ProSport Admin Portal
 * Minimalist/Cold Luxury design system, synchronized with Apex User portal.
 *
 * Exports:
 *   AdminPageHeader     – page title + description
 *   AdminCard           – white surface card with soft shadow
 *   AdminToolbar        – search + filter + action toolbar row
 *   AdminFilterPills    – tab/pill filter set
 *   AdminTable          – styled table wrapper
 *   AdminStatusBadge    – semantic status chip
 *   AdminModal          – accessible dialog with backdrop
 *   AdminFormField      – label + input + error
 *   AdminPagination     – prev/page/next
 *   AdminEmptyState     – empty or no-results message
 *   AdminErrorState     – API error display
 *   AdminSkeleton       – loading skeleton row
 */

import { useEffect, useRef, useId } from 'react'
import { Loader2, AlertTriangle, SearchX, ChevronLeft, ChevronRight, X } from 'lucide-react'

/* ─────────────────────────────────────────────
   PageHeader
───────────────────────────────────────────── */
export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-gray-900 m-0 mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 m-0">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Card
───────────────────────────────────────────── */
export function AdminCard({ children, className = '', noPad = false }) {
  return (
    <div
      className={`bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${noPad ? '' : 'p-6'} ${className}`}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Toolbar (search + filters + actions)
───────────────────────────────────────────── */
export function AdminToolbar({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 mb-6 ${className}`}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Search Input
───────────────────────────────────────────── */
export function AdminSearchInput({ value, onChange, placeholder = 'Tìm kiếm...', className = '' }) {
  return (
    <div className={`flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-[8px] h-10 px-3.5 focus-within:bg-white focus-within:border-teal-200 focus-within:ring-2 focus-within:ring-teal-100 transition-all min-w-[220px] ${className}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="Tìm kiếm"
        className="border-none outline-none bg-transparent w-full text-sm text-gray-700 placeholder:text-gray-400"
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Filter Pills (tabs)
───────────────────────────────────────────── */
export function AdminFilterPills({ tabs, activeKey, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-full border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] w-fit" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeKey === tab.key}
          onClick={() => onChange(tab.key)}
          className={`h-8 px-4 rounded-full text-[12px] font-bold transition-all border-0 cursor-pointer ${
            activeKey === tab.key
              ? 'bg-[#14b8a6] text-white shadow-sm'
              : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-[10px] ${activeKey === tab.key ? 'opacity-80' : 'opacity-60'}`}>
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Table wrapper
───────────────────────────────────────────── */
export function AdminTable({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-[12px] border border-gray-100 ${className}`}>
      <table className="w-full border-collapse font-sans text-sm">
        {children}
      </table>
    </div>
  )
}

export function AdminThead({ children }) {
  return (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-100">
        {children}
      </tr>
    </thead>
  )
}

export function AdminTh({ children, className = '', right = false }) {
  return (
    <th className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap ${right ? 'text-right' : 'text-left'} ${className}`}>
      {children}
    </th>
  )
}

export function AdminTd({ children, className = '' }) {
  return (
    <td className={`px-4 py-2.5 text-[13px] text-gray-700 ${className}`}>
      {children}
    </td>
  )
}

/* ─────────────────────────────────────────────
   Status Badge
───────────────────────────────────────────── */
const BADGE_VARIANTS = {
  // Success / Active
  success:  'bg-teal-50 text-teal-700 border border-teal-100',
  active:   'bg-teal-50 text-teal-700 border border-teal-100',
  // Warning / Pending
  warning:  'bg-orange-50 text-orange-600 border border-orange-100',
  pending:  'bg-orange-50 text-orange-600 border border-orange-100',
  // Danger / Error
  danger:   'bg-red-50 text-red-600 border border-red-100',
  error:    'bg-red-50 text-red-600 border border-red-100',
  // Neutral
  neutral:  'bg-gray-100 text-gray-600 border border-gray-200',
  // Info
  info:     'bg-blue-50 text-blue-600 border border-blue-100',
}

export function AdminStatusBadge({ label, variant = 'neutral', className = '' }) {
  const cls = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] whitespace-nowrap ${cls} ${className}`}>
      {label}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Modal
───────────────────────────────────────────── */
export function AdminModal({ open, onClose, title, description, children, width = 'max-w-lg' }) {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    const focusTimer = setTimeout(() => {
      const el = modalRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (el && !el.hasAttribute('disabled')) el.focus()
      else modalRef.current?.focus()
    }, 0)
    
    function onKey(e) {
      if (e.key === 'Escape') onCloseRef.current?.()
    }
    document.addEventListener('keydown', onKey)
    
    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const modal = modalRef.current
    if (!modal) return
    
    const handleTab = (e) => {
      if (e.key !== 'Tab') return
      const focusable = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(element => !element.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!modal.contains(document.activeElement)) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative bg-white rounded-[16px] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-full ${width} max-h-[90vh] overflow-y-auto outline-none`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h2 id={titleId} className="font-heading text-lg uppercase tracking-wide text-gray-900 m-0">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-gray-500 m-0 mt-1">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex items-center justify-center w-8 h-8 rounded-[8px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Form Field
───────────────────────────────────────────── */
export function AdminFormField({ label, htmlFor, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400 m-0">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 m-0" role="alert">{error}</p>}
    </div>
  )
}

export function adminInputCls(error = false) {
  return `w-full h-10 px-3.5 rounded-[8px] border text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`
}

/* ─────────────────────────────────────────────
   Pagination
───────────────────────────────────────────── */
export function AdminPagination({ page, totalPages, totalCount, onPrev, onNext, loading, noun = 'bản ghi' }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 pt-4 mt-2 border-t border-gray-100">
      <span className="text-[12px] text-gray-400 font-medium">
        {totalCount > 0
          ? `Trang ${page} / ${totalPages} · ${totalCount} ${noun}`
          : 'Không có dữ liệu'}
      </span>
      <div className="flex gap-1.5 items-center">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1 || loading}
          aria-label="Trang trước"
          className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-[#14b8a6] text-white text-[13px] font-bold">
          {page}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages || loading}
          aria-label="Trang sau"
          className="flex items-center justify-center w-8 h-8 rounded-[8px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
export function AdminEmptyState({ message = 'Không có dữ liệu.', isSearch = false }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {isSearch
        ? <SearchX size={40} className="text-gray-300" />
        : <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" />
            </svg>
          </div>
      }
      <p className="text-sm text-gray-400 m-0">{message}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
export function AdminErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 m-0 mb-1">Đã xảy ra lỗi</p>
        <p className="text-[12px] text-gray-400 m-0">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="h-9 px-5 rounded-[8px] text-[12px] font-bold uppercase tracking-wide bg-[#14b8a6] text-white border-0 cursor-pointer hover:bg-[#0f9e8c] transition-colors"
        >
          Thử lại
        </button>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Skeleton rows
───────────────────────────────────────────── */
export function AdminTableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-5 py-4">
              <div
                className="h-4 bg-gray-100 rounded-full animate-pulse"
                style={{ width: `${50 + ((i + j) * 13) % 40}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

/* ─────────────────────────────────────────────
   Loading spinner row (in tbody)
───────────────────────────────────────────── */
export function AdminTableLoader({ cols = 5 }) {
  return (
    <tbody>
      <tr>
        <td colSpan={cols} className="py-20 text-center text-gray-400">
          <Loader2 size={24} className="inline animate-spin mr-2 text-[#14b8a6]" />
          <span className="text-sm">Đang tải...</span>
        </td>
      </tr>
    </tbody>
  )
}

/* ─────────────────────────────────────────────
   Primary / Secondary / Danger buttons
───────────────────────────────────────────── */
export function AdminBtn({ children, onClick, type = 'button', variant = 'primary', disabled = false, loading: isLoading = false, icon, className = '' }) {
  const base = 'inline-flex items-center gap-2 h-9 px-4 rounded-[8px] text-[12px] font-bold uppercase tracking-wide transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
  const variants = {
    primary:   'bg-[#14b8a6] text-white hover:bg-[#0f9e8c] shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    danger:    'bg-red-500 text-white hover:bg-red-600',
    ghost:     'bg-transparent text-gray-600 hover:bg-gray-100',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || isLoading} className={`${base} ${variants[variant] || variants.primary} ${className}`}>
      {isLoading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}
