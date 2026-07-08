import StatusBadge from './StatusBadge'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

export default function BookingCard({ booking }) {
  const { name, date, startTime, endTime, status, icon } = booking
  const formattedDate = dayjs(date).locale('vi').format('DD MMM')
  const dayName = dayjs(date).locale('vi').format('ddd')

  return (
    <div className="flex items-center gap-4 p-4 bg-surface border-2 border-border-strong rounded-[2px]">
      {/* Date badge */}
      <div className="w-12 h-14 rounded-[2px] bg-[var(--theme-primary)] text-[var(--theme-secondary)] flex flex-col items-center justify-center shrink-0">
        <span className="label-mono leading-none">{dayName}</span>
        <span className="font-heading text-lg leading-tight mt-1">{dayjs(date).format('DD')}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{icon} {name}</p>
        <p className="text-xs text-foreground-muted mt-0.5">
          {formattedDate} · {startTime?.slice(0, 5)} – {endTime?.slice(0, 5)}
        </p>
      </div>

      {/* Status */}
      <StatusBadge status={status} />
    </div>
  )
}
