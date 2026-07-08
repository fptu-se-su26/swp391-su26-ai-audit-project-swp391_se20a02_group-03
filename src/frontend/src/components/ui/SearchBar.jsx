export default function SearchBar({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 bg-surface border-2 border-border-strong rounded-[2px] px-3.5 h-10 transition-colors duration-150 focus-within:border-accent ${className}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted shrink-0">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        placeholder="Tìm kiếm sân, dụng cụ, người chơi..."
        id="apex-search"
        className="border-none bg-transparent text-sm text-foreground w-full outline-none placeholder:text-foreground-subtle font-sans"
      />
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[2px] bg-[var(--theme-bg-deep)] border border-border-default text-[10px] text-foreground-muted font-mono shrink-0">
        ⌘K
      </kbd>
    </div>
  )
}
