import StatusBadge from './StatusBadge'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

export default function BookingCard({ booking }) {
  const { name, date, startTime, endTime, status, icon } = booking
  const formattedDate = dayjs(date).locale('vi').format('DD MMM')
  const dayName = dayjs(date).locale('vi').format('ddd')

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-[#E2E8F0] rounded-xl transition-all duration-200 hover:shadow-sm hover:border-[#CBD5E1]">
      {/* Date badge */}
      <div className="w-12 h-14 rounded-lg bg-[#F1F5F9] flex flex-col items-center justify-center shrink-0">
        <span className="text-[10px] font-semibold text-[#94A3B8] uppercase leading-none">{dayName}</span>
        <span className="text-lg font-bold text-foreground leading-tight">{dayjs(date).format('DD')}</span>
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
