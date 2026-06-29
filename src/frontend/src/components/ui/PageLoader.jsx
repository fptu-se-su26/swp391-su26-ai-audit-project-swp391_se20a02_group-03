/** Spinner dùng chung cho route guards và trang đang tải dữ liệu. */
export default function PageLoader({ message = 'Đang tải...' }) {
  return (
    <div className="flex items-center justify-center min-h-[40vh] w-full">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-[#5E6AD2] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-medium">{message}</p>
      </div>
    </div>
  )
}
