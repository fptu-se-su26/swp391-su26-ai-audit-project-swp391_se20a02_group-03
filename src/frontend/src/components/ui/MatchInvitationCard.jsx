export default function MatchInvitationCard({ match, onJoin, onDecline }) {
  const {
    hostName = 'Chủ phòng ẩn danh',
    hostAvatar,
    title = 'Trận đấu',
    skillLevel = 'Mọi cấp độ',
    courtName = '',
    date = '',
    playerCount = 0,
    maxPlayers = 4,
  } = match

  const defaultAvatar = `https://ui-avatars.com/api/?name=${hostName}&background=14B8A6&color=fff&size=80`

  return (
    <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl transition-all duration-200 hover:shadow-sm hover:border-[#CBD5E1]">
      <div className="flex items-start gap-3.5">
        <img
          src={hostAvatar || defaultAvatar}
          alt={hostName}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-foreground-muted mt-0.5">Tổ chức bởi {hostName}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-foreground-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {playerCount}/{maxPlayers}
            </span>
            {courtName && (
              <span className="inline-flex items-center gap-1 text-xs text-foreground-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
                {courtName}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-600">
              {skillLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
        <button
          onClick={onJoin}
          className="flex-1 h-9 rounded-lg bg-[#14B8A6] text-[var(--theme-primary)] text-sm font-semibold transition-all duration-200 hover:bg-[#0D9488] active:scale-[0.98]"
        >
          Tham gia
        </button>
        <button
          onClick={onDecline}
          className="flex-1 h-9 rounded-lg bg-white border border-[#E2E8F0] text-foreground-muted text-sm font-medium transition-all duration-200 hover:bg-[#F1F5F9] active:scale-[0.98]"
        >
          Từ chối
        </button>
      </div>
    </div>
  )
}
