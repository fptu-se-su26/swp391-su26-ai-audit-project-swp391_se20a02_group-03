import { useState } from 'react'
import GearLayout from '../../layouts/GearLayout'

const maintenanceItems = [
  { id: 'MT-001', name: 'Wilson Pro Staff RF97', type: 'Racket', issue: 'Kiểm tra & căng lại dây vợt', technician: 'Tuấn T.', submitted: '2026-05-30', expected: '2026-06-02', status: 'in-progress', priority: 'medium', img: 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=80&q=80' },
  { id: 'MT-002', name: 'TaylorMade P790 Iron Set', type: 'Golf Club', issue: 'Thay quấn cán — toàn bộ gậy', technician: 'Lan K.', submitted: '2026-05-29', expected: '2026-06-01', status: 'overdue', priority: 'high', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=80&q=80' },
  { id: 'MT-003', name: 'Nike Court Lite 3 (x4)', type: 'Footwear', issue: 'Vệ sinh sâu & kiểm tra đế giày', technician: 'Minh R.', submitted: '2026-06-01', expected: '2026-06-03', status: 'scheduled', priority: 'low', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80' },
  { id: 'MT-004', name: 'Yonex Astrox 100 ZZ', type: 'Racket', issue: 'Kiểm tra nứt khung vợt', technician: 'Tuấn T.', submitted: '2026-05-28', expected: '2026-05-31', status: 'completed', priority: 'high', img: 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=80&q=80' },
  { id: 'MT-005', name: 'Badminton Net Assembly', type: 'Accessories', issue: 'Căng lưới & căn chỉnh cột', technician: 'Hà M.', submitted: '2026-06-01', expected: '2026-06-04', status: 'scheduled', priority: 'medium', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=80' },
  { id: 'MT-006', name: 'Elbow Support Sleeve (x6)', type: 'Protection', issue: 'Kiểm tra độ đàn hồi & khử khuẩn', technician: 'Lan K.', submitted: '2026-05-31', expected: '2026-06-02', status: 'completed', priority: 'low', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&q=80' },
]

const statusConfig = {
  'in-progress': { label: 'Đang xử lý', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', border: 'border-blue-200' },
  'overdue':     { label: 'Quá hạn',     bg: 'bg-red-50',  text: 'text-red-700',  dot: 'bg-red-500',  border: 'border-red-200' },
  'scheduled':   { label: 'Đã lên lịch',   bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
  'completed':   { label: 'Hoàn tất',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
}

const priorityConfig = {
  high:   { label: 'Cao',   color: 'text-red-500',    bg: 'bg-red-50' },
  medium: { label: 'Trung bình', color: 'text-amber-600',  bg: 'bg-amber-50' },
  low:    { label: 'Thấp',    color: 'text-slate-500',  bg: 'bg-slate-100' },
}

const tabLabels = {
  all: 'Tất cả',
  scheduled: 'Đã lên lịch',
  'in-progress': 'Đang xử lý',
  overdue: 'Quá hạn',
  completed: 'Hoàn tất',
}

const schedule = [
  { month: 'Hàng tháng', tasks: ['Kiểm tra độ căng dây tất cả vợt', 'Kiểm tra tình trạng quấn cán', 'Kiểm tra đế & dây giày', 'Khử khuẩn toàn bộ đồ mềm'] },
  { month: 'Hàng quý', tasks: ['Kiểm tra độ vững khung (vợt, vợt pickleball)', 'Căn chỉnh đầu & cán gậy golf', 'Kiểm tra cấu trúc lưới & cột', 'Kiểm kê & đánh giá tình trạng toàn bộ'] },
  { month: 'Hàng năm', tasks: ['Bảo dưỡng tổng thể thiết bị', 'Loại bỏ thiết bị hết tuổi thọ', 'Rà soát nâng cấp công nghệ', 'Kiểm tra tuân thủ an toàn'] },
]

const tabs = ['all', 'scheduled', 'in-progress', 'overdue', 'completed']

export default function GearMaintenancePage() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = activeTab === 'all' ? maintenanceItems : maintenanceItems.filter(i => i.status === activeTab)

  const stats = [
    { label: 'Đang bảo trì', value: maintenanceItems.filter(i => i.status === 'in-progress').length, color: '#3b82f6' },
    { label: 'Quá hạn', value: maintenanceItems.filter(i => i.status === 'overdue').length, color: '#ef4444' },
    { label: 'Đã lên lịch', value: maintenanceItems.filter(i => i.status === 'scheduled').length, color: '#f59e0b' },
    { label: 'Hoàn tất tháng này', value: maintenanceItems.filter(i => i.status === 'completed').length, color: '#10b981' },
  ]

  return (
    <GearLayout>
      <div className="px-7 py-8 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="font-['Oswald'] text-2xl font-bold text-foreground">Theo dõi bảo trì</h1>
            <p className="text-sm text-slate-400 mt-1">Giám sát bảo dưỡng thiết bị và lịch bảo trì</p>
          </div>
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ghi nhận bảo trì
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 max-[800px]:grid-cols-2 gap-4 mb-7">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e0ecf0] px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: s.color + '18' }}>
                <span className="font-['Oswald'] text-lg font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
              <p className="text-sm text-slate-500 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_280px] max-[900px]:grid-cols-1 gap-6">
          {/* Main table */}
          <div>
            {/* Tabs */}
            <div className="flex gap-1 flex-wrap mb-4">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-[0.78rem] font-medium capitalize cursor-pointer border transition-all ${activeTab === tab ? 'bg-[#14B8A6] text-[var(--theme-primary)] border-[#14B8A6]' : 'bg-white text-slate-500 border-[#e0ecf0] hover:border-[#14B8A6] hover:text-[#14B8A6]'}`}>
                  {tab === 'all' ? `${tabLabels.all} (${maintenanceItems.length})` : `${tabLabels[tab]} (${maintenanceItems.filter(i => i.status === tab).length})`}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#e0ecf0] overflow-hidden">
              <div className="divide-y divide-[#f0f4f8]">
                {filtered.map(item => {
                  const s = statusConfig[item.status]
                  const p = priorityConfig[item.priority]
                  return (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#f9fbfc] transition-colors">
                      <img src={item.img} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[0.875rem] font-semibold text-foreground truncate">{item.name}</p>
                          <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full shrink-0 ${p.bg} ${p.color}`}>{p.label}</span>
                        </div>
                        <p className="text-[0.75rem] text-slate-400 truncate">{item.issue}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[0.68rem] text-slate-400">#{item.id}</span>
                          <span className="text-[0.68rem] text-slate-400">Bởi {item.technician}</span>
                          <span className="text-[0.68rem] text-slate-400">Hạn {item.expected}</span>
                        </div>
                      </div>
                      <span className={`text-[0.72rem] font-semibold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1.5 ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="py-14 text-center text-slate-400 text-sm">Không có mục nào trong danh mục này</div>
                )}
              </div>
            </div>
          </div>

          {/* Schedule sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#e0ecf0] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#f0f4f8] bg-[#f9fbfc]">
                <h2 className="font-['Oswald'] text-base font-bold text-foreground">Lịch bảo trì</h2>
              </div>
              <div className="divide-y divide-[#f0f4f8]">
                {schedule.map((s, i) => (
                  <div key={i} className="px-5 py-4">
                    <p className="text-[0.72rem] font-bold tracking-wider uppercase text-[#14B8A6] mb-2">{s.month}</p>
                    <ul className="flex flex-col gap-1.5">
                      {s.tasks.map((t, j) => (
                        <li key={j} className="text-[0.78rem] text-slate-500 flex items-start gap-2">
                          <span className="w-1 h-1 bg-slate-300 rounded-full mt-2 shrink-0"></span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Technicians */}
            <div className="bg-white rounded-2xl border border-[#e0ecf0] p-5">
              <h2 className="font-['Oswald'] text-base font-bold text-foreground mb-3">Kỹ thuật viên trực</h2>
              {[
                { name: 'Tuấn T.', role: 'Chuyên vợt', tasks: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80' },
                { name: 'Lan K.', role: 'Thiết bị chung', tasks: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80' },
                { name: 'Minh R.', role: 'Giày & trang phục', tasks: 1, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80' },
                { name: 'Hà M.', role: 'Phụ kiện sân', tasks: 1, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80' },
              ].map((tech, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#f0f4f8] last:border-0">
                  <img src={tech.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-[0.82rem] font-semibold text-foreground">{tech.name}</p>
                    <p className="text-[0.68rem] text-slate-400">{tech.role}</p>
                  </div>
                  <span className="text-[0.72rem] bg-[#14B8A6]/10 text-[#14B8A6] font-bold px-2 py-0.5 rounded-full">{tech.tasks} việc</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GearLayout>
  )
}
