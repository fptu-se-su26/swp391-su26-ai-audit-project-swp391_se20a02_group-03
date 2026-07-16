import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useId, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/* =========================================================================
   1. Typography & Headers
   ========================================================================= */

export function OwnerPageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0">
          {title}
        </h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

/* =========================================================================
   2. Buttons
   ========================================================================= */

export const OwnerBtn = forwardRef(({
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  href,
  children,
  ...props
}, ref) => {
  const base = "inline-flex items-center justify-center rounded-[8px] font-bold uppercase tracking-wide transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed no-underline";

  const variants = {
    primary: "bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-sm",
    secondary: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };

  const sizes = {
    sm: "h-8 px-3 text-[11px]",
    md: "h-10 px-5 text-[12px]",
    lg: "h-12 px-6 text-[13px]",
  };

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} ref={ref} className={cls} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} ref={ref} className={cls} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={cls}
      {...props}
    >
      {children}
    </button>
  );
});
OwnerBtn.displayName = 'OwnerBtn';

/* =========================================================================
   3. Cards & Surfaces
   ========================================================================= */

export function OwnerCard({ children, className = '', noPad = false }) {
  return (
    <div className={`bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${noPad ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}

export function OwnerStatCard({ label, value, description, icon: Icon, color = 'teal' }) {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  const iconBg = colorMap[color] || colorMap.teal;

  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 flex items-start gap-4 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      {Icon && (
        <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
        <p className="font-heading text-3xl text-[#0f172a] m-0">{value}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}

/* =========================================================================
   4. Toolbar & Filtering
   ========================================================================= */

export function OwnerToolbar({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 ${className}`}>
      {children}
    </div>
  );
}

export function OwnerFilterPills({ tabs, activeTab, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 w-fit" role="tablist">
      {tabs.map(t => {
        const value = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={`h-9 px-5 rounded-full text-[13px] font-bold transition-all border-0 cursor-pointer flex items-center gap-2 ${
              isActive
                ? 'bg-[#14b8a6] text-white shadow-sm'
                : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function OwnerSearchInput({ value, onChange, placeholder = 'Tìm kiếm...', ariaLabel = 'Tìm kiếm', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-[8px] text-sm text-[#0f172a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6] transition-all"
      />
    </div>
  );
}

/* =========================================================================
   5. Tables & Data Display
   ========================================================================= */

export function OwnerTable({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  );
}

export function OwnerThead({ children }) {
  return (
    <thead className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 border-b border-gray-100">
      <tr>{children}</tr>
    </thead>
  );
}

export function OwnerTh({ children, right = false, center = false, className = '' }) {
  return (
    <th className={`px-6 py-4 whitespace-nowrap ${right ? 'text-right' : center ? 'text-center' : ''} ${className}`}>
      {children}
    </th>
  );
}

export function OwnerTd({ children, right = false, center = false, className = '' }) {
  return (
    <td className={`px-6 py-4 text-[#0f172a] ${right ? 'text-right' : center ? 'text-center' : ''} ${className}`}>
      {children}
    </td>
  );
}

export function OwnerPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
      <p className="text-sm text-gray-500 m-0">
        Trang <span className="font-semibold text-[#0f172a]">{currentPage}</span> / {totalPages}
      </p>
      <div className="flex gap-2">
        <OwnerBtn
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={16} />
        </OwnerBtn>
        <OwnerBtn
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight size={16} />
        </OwnerBtn>
      </div>
    </div>
  );
}

export { default as OwnerStatusBadge } from './OwnerStatusBadge';

/* =========================================================================
   6. Forms
   ========================================================================= */

export const ownerInputCls = "w-full h-10 px-3 bg-white border border-gray-200 rounded-[8px] text-sm text-[#0f172a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6] transition-all";

const FORM_CONTROL_TAGS = new Set(['input', 'select', 'textarea']);

function enhanceFirstFormControl(children, controlProps) {
  let enhanced = false;

  const visit = (child) => {
    if (!isValidElement(child) || enhanced) return child;

    if (typeof child.type === 'string' && FORM_CONTROL_TAGS.has(child.type)) {
      enhanced = true;
      const describedBy = [child.props['aria-describedby'], controlProps['aria-describedby']]
        .filter(Boolean)
        .join(' ') || undefined;

      return cloneElement(child, {
        ...controlProps,
        required: child.props.required ?? controlProps.required,
        'aria-describedby': describedBy,
      });
    }

    if (child.props.children) {
      return cloneElement(child, undefined, Children.map(child.props.children, visit));
    }

    return child;
  };

  return Children.map(children, visit);
}

export function OwnerFormField({ label, error, required, children, className = '', helpText }) {
  const controlId = useId();
  const helpId = useId();
  const errorId = useId();
  const descriptionId = error ? errorId : helpText ? helpId : undefined;
  const enhancedChildren = enhanceFirstFormControl(children, {
    id: controlId,
    required: Boolean(required),
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': descriptionId,
  });

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={controlId} className="text-[12px] font-bold uppercase tracking-wide text-gray-500 cursor-pointer">
          {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
      )}
      {enhancedChildren}
      {helpText && !error && <span id={helpId} className="text-xs text-gray-400 m-0 block">{helpText}</span>}
      {error && <span id={errorId} role="alert" className="text-xs text-red-500 m-0 block">{error}</span>}
    </div>
  );
}

/* =========================================================================
   7. Modals
   ========================================================================= */

export function OwnerModal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const previousOverflowRef = useRef('');
  const focusTimerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const modal = modalRef.current;
    previousFocusRef.current = document.activeElement;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusable = () => Array.from(modalRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || []).filter(element => element.getAttribute('aria-hidden') !== 'true');

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (!modalRef.current?.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (activeElement === first || activeElement === modalRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    focusTimerRef.current = window.setTimeout(() => {
      const first = getFocusable()[0];
      (first || modal)?.focus();
    }, 0);

    return () => {
      if (focusTimerRef.current != null) window.clearTimeout(focusTimerRef.current);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflowRef.current;
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={() => onCloseRef.current?.()}
      />

      {/* Dialog */}
      <div
        ref={modalRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`relative w-full ${maxWidth} bg-white rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[90vh] outline-none`}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <h2 id={titleId} className="font-heading text-lg uppercase tracking-tight text-[#0f172a] m-0">{title}</h2>
          <button
            type="button"
            onClick={() => onCloseRef.current?.()}
            aria-label="Đóng"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   8. States (Empty, Error, Loader)
   ========================================================================= */

export function OwnerEmptyState({ title = 'Không có dữ liệu.', description, icon: Icon = Search, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-gray-200 rounded-[16px] bg-gray-50/50">
      <div className="w-12 h-12 rounded-[12px] bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-bold text-[#0f172a] m-0 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 m-0 mb-4 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

export function OwnerErrorState({ message = 'Đã có lỗi xảy ra.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-red-100 rounded-[16px] bg-red-50/50">
      <p className="text-sm text-red-600 mb-3">{message}</p>
      {onRetry && (
        <OwnerBtn variant="secondary" size="sm" onClick={onRetry}>
          Thử lại
        </OwnerBtn>
      )}
    </div>
  );
}

export function OwnerTableLoader({ cols = 1, rows = 3 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 rounded-[4px] w-3/4"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
