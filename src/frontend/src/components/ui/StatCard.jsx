export default function StatCard({ icon, label, value, trend, className = '' }) {
  return (
    <div className={`bg-surface border-2 border-border-strong rounded-[2px] p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="w-10 h-10 rounded-[2px] bg-[var(--theme-primary)] text-[var(--theme-secondary)] flex items-center justify-center">
          {icon}
        </span>
        {trend && (
          <span className={`label-mono px-2 py-0.5 rounded-[2px] border ${
            trend > 0 ? 'text-accent border-accent' : 'text-danger border-danger'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="font-heading text-3xl text-foreground tracking-tight">{value}</p>
      <p className="label-mono text-foreground-muted mt-1">{label}</p>
    </div>
  )
}
