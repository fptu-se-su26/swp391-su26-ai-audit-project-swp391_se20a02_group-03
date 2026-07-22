import { Link } from 'react-router-dom'

const SIZES = {
  sm: 'h-8 px-3 text-[11px] gap-1.5',
  md: 'h-10 px-5 text-[12px] gap-2',
  lg: 'h-12 px-6 text-[13px] gap-2',
}

// Light-dashboard palette — matches components/admin (AdminBtn) & components/owner (OwnerBtn)
const VARIANTS = {
  primary: 'bg-[#14b8a6] text-white hover:bg-[#0f9e8c] shadow-sm',
  secondary: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
}

export default function BaseButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  to,
  className = '',
  children,
  ...rest
}) {
  const cls = `inline-flex items-center justify-center rounded-[8px] font-bold uppercase tracking-wide
    transition-colors duration-150 no-underline cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    ${SIZES[size] || SIZES.md} ${VARIANTS[variant] || VARIANTS.primary} ${fullWidth ? 'w-full' : ''} ${className}`

  if (to) {
    return <Link to={to} className={cls} {...rest}>{children}</Link>
  }
  return (
    <button disabled={disabled} className={cls} {...rest}>
      {children}
    </button>
  )
}
