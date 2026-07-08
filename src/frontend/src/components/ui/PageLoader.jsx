/** Spinner dùng chung cho route guards và trang đang tải dữ liệu. */
export default function PageLoader({ message, label }) {
  const text = message || label || 'Đang tải...'
  return (
    <div className="flex items-center justify-center min-h-[40vh] w-full">
      <div className="text-center">
        <div className="flex items-end justify-center gap-1.5 h-8 mb-4" aria-hidden="true">
          <span className="loader-bar" />
          <span className="loader-bar" style={{ animationDelay: '0.15s' }} />
          <span className="loader-bar" style={{ animationDelay: '0.3s' }} />
          <span className="loader-bar" style={{ animationDelay: '0.45s' }} />
        </div>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-foreground mb-1">Pro-Sport</p>
        <p className="label-mono text-foreground-muted">{text}</p>
      </div>
    </div>
  )
}
