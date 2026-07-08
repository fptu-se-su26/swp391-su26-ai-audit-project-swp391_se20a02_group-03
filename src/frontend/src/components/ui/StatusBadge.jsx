import { statusLabels } from '../../utils/labels'

const SOLID = new Set(['Confirmed', 'Completed', 'Available', 'Paid', 'Returned', 'Open'])
const DANGER = new Set(['Cancelled', 'Refunded'])
const WARNING = new Set(['Pending', 'Unpaid'])

function variantClass(status) {
  if (SOLID.has(status)) return 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] border-2 border-[var(--theme-primary)]'
  if (DANGER.has(status)) return 'bg-transparent text-danger border border-danger'
  if (WARNING.has(status)) return 'bg-transparent text-warning border border-warning'
  return 'bg-transparent text-foreground-muted border border-border-strong'
}

export default function StatusBadge({ status, className = '' }) {
  const text = statusLabels[status] || status || 'Không rõ'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-[2px] font-mono text-[10px] font-bold uppercase tracking-[0.08em] ${variantClass(status)} ${className}`}>
      {text}
    </span>
  )
}
