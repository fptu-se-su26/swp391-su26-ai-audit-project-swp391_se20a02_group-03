export default function SearchBar({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3.5 h-10 transition-all duration-200 focus-within:border-[#14B8A6] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#14B8A6]/20 ${className}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#94A3B8] shrink-0">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        placeholder="Tìm kiếm sân, dụng cụ, người chơi..."
        id="apex-search"
        className="border-none bg-transparent text-sm text-foreground w-full outline-none placeholder:text-[#94A3B8] font-medium"
      />
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#94A3B8] font-mono shrink-0">
        ⌘K
      </kbd>
    </div>
  )
}
