export default function EmptyState({ icon, title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-border-hover rounded-[2px] ${className}`}>
      {icon && (
        <span className="w-16 h-16 rounded-[2px] bg-surface border-2 border-border-strong flex items-center justify-center text-foreground-muted mb-4 text-2xl">
          {icon}
        </span>
      )}
      <h3 className="font-heading text-lg uppercase tracking-tight text-foreground mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-foreground-muted max-w-[280px]">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
