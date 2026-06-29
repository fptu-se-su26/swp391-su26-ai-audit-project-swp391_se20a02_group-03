import { statusLabels } from '../../utils/labels'

const variants = {
  Confirmed: 'bg-accent/10 text-accent border border-accent/20',
  Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  Open: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  Completed: 'bg-[var(--theme-surface)] text-foreground-muted border border-border-default',
  Available: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Rented: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Returned: 'bg-[var(--theme-surface)] text-foreground-muted border border-border-default',
  Paid: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  Refunded: 'bg-red-500/10 text-red-400 border border-red-500/20',
  Unpaid: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
}

export default function StatusBadge({ status, className = '' }) {
  const style = variants[status] || 'bg-slate-100 text-slate-500'
  const text = statusLabels[status] || status || 'Không rõ'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${style} ${className}`}>
      {text}
    </span>
  )
}
