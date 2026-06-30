export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-64 bg-white rounded-2xl border border-slate-100" />
        <div className="h-64 bg-white rounded-2xl border border-slate-100" />
      </div>
      <div className="h-48 bg-white rounded-2xl border border-slate-100" />
    </div>
  );
}
