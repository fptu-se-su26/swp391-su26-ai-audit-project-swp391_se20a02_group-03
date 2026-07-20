export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="h-10 w-48 bg-gray-200 rounded-[8px] mb-3"></div>
          <div className="h-4 w-64 bg-gray-100 rounded-[4px]"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded-[8px]"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-[8px]"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
            <div className="h-4 w-20 bg-gray-100 rounded-[4px] mb-3"></div>
            <div className="h-8 w-32 bg-gray-200 rounded-[6px]"></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] h-64"></div>
        <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] h-64"></div>
      </div>

      <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div className="h-6 w-40 bg-gray-200 rounded-[6px] mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-100 rounded-[4px]"></div>
          <div className="h-4 w-full bg-gray-100 rounded-[4px]"></div>
          <div className="h-4 w-full bg-gray-100 rounded-[4px]"></div>
        </div>
      </div>
    </div>
  );
}
