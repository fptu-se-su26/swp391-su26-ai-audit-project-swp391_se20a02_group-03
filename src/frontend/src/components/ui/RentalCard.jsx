export default function RentalCard({ rental }) {
  const { name, dueTime, progress = 65, icon } = rental

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-[#E2E8F0] rounded-xl transition-all duration-200 hover:shadow-sm">
      {/* Icon */}
      <span className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-lg shrink-0">
        {icon || '🏸'}
      </span>

      {/* Info + progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
          <span className="text-xs text-foreground-muted shrink-0 ml-2">Hạn trả: {dueTime}</span>
        </div>
        <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: progress > 80 ? '#F59E0B' : '#14B8A6',
            }}
          />
        </div>
        <p className="text-[11px] text-[#94A3B8] mt-1">Đã qua {progress}% thời gian thuê</p>
      </div>
    </div>
  )
}
