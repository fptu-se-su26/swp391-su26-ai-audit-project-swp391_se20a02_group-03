export default function StatCard({ icon, label, value, trend, className = '' }) {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-2xl p-5 transition-shadow duration-200 hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-foreground-muted">
          {icon}
        </span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-sm text-foreground-muted mt-0.5">{label}</p>
    </div>
  )
}
