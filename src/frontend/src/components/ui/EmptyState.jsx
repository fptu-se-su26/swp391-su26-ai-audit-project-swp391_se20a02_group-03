export default function EmptyState({ icon, title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {icon && (
        <span className="w-16 h-16 rounded-2xl bg-[var(--theme-surface)] border border-border-default flex items-center justify-center text-foreground-muted mb-4 text-2xl">
          {icon}
        </span>
      )}
      <h3 className="text-base font-semibold text-[var(--theme-primary)] mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-foreground-muted max-w-[280px]">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
