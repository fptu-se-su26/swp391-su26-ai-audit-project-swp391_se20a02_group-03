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
 * variant "light" = luôn hiển thị trên nền tối (paper trên ink), "default" = theo theme hiện tại.
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

  const wordmarkClass = variant === 'light' ? 'text-paper' : 'text-foreground'
  const subtitleClass = variant === 'light' ? 'text-paper/50' : 'text-foreground-muted'

  return (
    <Link
      to="/"
      className={`prosport-logo group inline-flex items-center ${s.gap} no-underline shrink-0 ${wordmarkClass} transition-opacity duration-150 hover:opacity-80 active:opacity-65 ${className}`}
      aria-label="PRO-SPORT — về trang chủ"
    >
      <ProSportLogoMark size={s.icon} />

      {showText && !iconOnly && (
        <div className="flex flex-col leading-none">
          <span className={`font-heading uppercase tracking-[0.02em] ${s.text}`}>
            PRO<span className="text-accent">-</span>SPORT
          </span>
          {subtitle && (
            <span className={`text-[0.58rem] font-mono font-semibold tracking-[0.1em] uppercase mt-1 ${subtitleClass}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
