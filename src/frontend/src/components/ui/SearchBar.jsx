export default function SearchBar({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 bg-gray-100 rounded-[8px] px-3.5 h-10 transition-colors duration-150 focus-within:ring-2 focus-within:ring-teal-500/20 ${className}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        placeholder="Tìm kiếm sân, dụng cụ, người chơi..."
        id="apex-search"
        className="border-none bg-transparent text-sm text-gray-900 w-full outline-none placeholder:text-gray-400 font-sans"
      />
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px] bg-white border border-gray-200 text-[10px] text-gray-500 font-mono shrink-0 font-bold shadow-sm">
        ⌘K
      </kbd>
    </div>
  )
}
