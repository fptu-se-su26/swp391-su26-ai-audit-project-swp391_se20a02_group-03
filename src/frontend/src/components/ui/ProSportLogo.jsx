import { Link } from 'react-router-dom'
import ProSportLogoMark from './ProSportLogoMark'

const SIZES = {
  sm: { icon: 24, text: 'text-[0.9375rem]', gap: 'gap-2' },
  md: { icon: 30, text: 'text-lg', gap: 'gap-2.5' },
  lg: { icon: 38, text: 'text-2xl', gap: 'gap-3' },
  xl: { icon: 44, text: 'text-[1.75rem]', gap: 'gap-3.5' },
}

/**
 * Logo PRO-SPORT — monogram lục giác riêng, bấm về trang chủ (/).
 */
export default function ProSportLogo({
  size = 'md',
  showText = true,
  subtitle,
  className = '',
  variant = 'default',
  iconOnly = false,
}) {
  const s = SIZES[size] || SIZES.md

  const wordmarkClass =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
        ? 'text-slate-900'
        : variant === 'shop'
          ? 'text-[#0f172a]'
          : 'text-[var(--theme-primary)]'

  const accentClass = variant === 'shop' ? 'text-[#14B8A6]' : 'text-[#5E6AD2]'

  const subtitleClass =
    variant === 'light'
      ? 'text-white/50'
      : 'text-slate-500'

  return (
    <Link
      to="/"
      className={`prosport-logo group inline-flex items-center ${s.gap} no-underline shrink-0 ${wordmarkClass} transition-opacity duration-200 hover:opacity-80 active:opacity-65 ${className}`}
      aria-label="PRO-SPORT — về trang chủ"
    >
      <ProSportLogoMark size={s.icon} />

      {showText && !iconOnly && (
        <div className="flex flex-col leading-none">
          <span className={`font-heading font-bold tracking-tight ${s.text}`}>
            PRO<span className={accentClass}>-</span>SPORT
          </span>
          {subtitle && (
            <span className={`text-[0.58rem] font-medium tracking-[0.08em] uppercase mt-1 ${subtitleClass}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
