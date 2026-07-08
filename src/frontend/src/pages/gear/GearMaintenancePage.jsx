import { useState, useEffect, useMemo } from 'react'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'
import PageLoader from '../../components/ui/PageLoader'
import { Plus } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80'

function mapEquipmentToMaintenance(e) {
  let status = 'scheduled'
  let priority = 'medium'
  let issue = 'Kiểm tra định kỳ thiết bị'

  if (e.status === 'Out of Stock') {
    status = 'in-progress'
    priority = 'high'
    issue = 'Hết hàng — cần bổ sung / bảo trì'
  } else if (e.status === 'Discontinued') {
    status = 'overdue'
    priority = 'high'
    issue = 'Ngừng kinh doanh — cần thay thế'
  } else if (e.stockQuantity <= 3) {
    status = 'scheduled'
    priority = 'medium'
    issue = `Tồn kho thấp (${e.stockQuantity}) — kiểm tra sớm`
  } else {
    status = 'completed'
    priority = 'low'
    issue = 'Tình trạng tốt — không cần xử lý'
  }

  return {
    id: `EQ-${e.equipmentId}`,
    name: e.name,
    type: e.category,
    issue,
    technician: 'Đội Gear',
    submitted: new Date().toISOString().slice(0, 10),
    expected: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    status,
    priority,
    img: e.imageUrl || FALLBACK_IMG,
  }
}

const statusConfig = {
  'in-progress': { label: 'Đang xử lý' },
  'overdue': { label: 'Quá hạn' },
  'scheduled': { label: 'Đã lên lịch' },
  'completed': { label: 'Hoàn tất' },
}

const priorityConfig = {
  high: { label: 'Cao' },
  medium: { label: 'Trung bình' },
  low: { label: 'Thấp' },
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
  const [maintenanceItems, setMaintenanceItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await equipmentApi.getAll()
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setMaintenanceItems(res.data.map(mapEquipmentToMaintenance))
        } else {
          setError(res.message || 'Không tải được danh sách thiết bị.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được danh sách thiết bị.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const filtered = useMemo(
    () => (activeTab === 'all' ? maintenanceItems : maintenanceItems.filter(i => i.status === activeTab)),
    [activeTab, maintenanceItems]
  )

  const stats = useMemo(() => [
    { label: 'Đang bảo trì', value: maintenanceItems.filter(i => i.status === 'in-progress').length },
    { label: 'Quá hạn', value: maintenanceItems.filter(i => i.status === 'overdue').length },
    { label: 'Đã lên lịch', value: maintenanceItems.filter(i => i.status === 'scheduled').length },
    { label: 'Hoàn tất', value: maintenanceItems.filter(i => i.status === 'completed').length },
  ], [maintenanceItems])

  return (
    <GearLayout>
      <div className="font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="label-mono text-foreground-muted mb-2.5">{'// Vận hành thiết bị'}</p>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Theo dõi bảo trì</h1>
            <p className="text-sm text-foreground-muted mt-2">Giám sát bảo dưỡng thiết bị và lịch bảo trì</p>
          </div>
          <button className="btn-primary">
            <Plus size={14} />
            Ghi nhận bảo trì
          </button>
        </div>

        {error && (
          <div className="mb-6 border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger">{error}</div>
        )}

        {loading ? (
          <PageLoader message="Đang tải thiết bị..." />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="border-2 border-border-strong bg-surface px-5 py-4 flex items-center gap-4">
                  <span className="font-heading text-2xl text-foreground shrink-0">{s.value}</span>
                  <p className="label-mono text-foreground-muted leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
              {/* Main table */}
              <div>
                {/* Tabs */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 h-9 text-xs font-extrabold uppercase tracking-[0.04em] rounded-[2px] border-2 transition-colors ${activeTab === tab ? 'bg-ink text-paper border-ink' : 'bg-transparent text-foreground border-border-hover hover:border-foreground'}`}
                    >
                      {tab === 'all' ? `${tabLabels.all} (${maintenanceItems.length})` : `${tabLabels[tab]} (${maintenanceItems.filter(i => i.status === tab).length})`}
                    </button>
                  ))}
                </div>

                <div className="border-2 border-border-strong bg-surface">
                  <div className="divide-y-2 divide-border-default">
                    {filtered.map(item => {
                      const s = statusConfig[item.status]
                      const p = priorityConfig[item.priority]
                      return (
                        <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors">
                          <div className="w-12 h-12 border-2 border-border-strong overflow-hidden shrink-0">
                            <img src={item.img} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="text-[14px] font-extrabold text-foreground truncate">{item.name}</p>
                              <span className="label-mono border border-border-strong px-1.5 py-0.5 shrink-0">{p.label}</span>
                            </div>
                            <p className="text-[13px] text-foreground-muted truncate">{item.issue}</p>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className="label-mono text-foreground-subtle">#{item.id}</span>
                              <span className="label-mono text-foreground-subtle">Bởi {item.technician}</span>
                              <span className="label-mono text-foreground-subtle">Hạn {item.expected}</span>
                            </div>
                          </div>
                          <span className="label-mono border-2 border-border-strong px-2.5 py-1.5 shrink-0">
                            {s.label}
                          </span>
                        </div>
                      )
                    })}
                    {filtered.length === 0 && (
                      <div className="py-14 text-center text-foreground-muted text-sm">Không có mục nào trong danh mục này</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule sidebar */}
              <div className="flex flex-col gap-5">
                <div className="border-2 border-border-strong bg-surface">
                  <div className="px-5 py-4 border-b-2 border-border-strong">
                    <h2 className="font-heading text-base uppercase text-foreground">Lịch bảo trì</h2>
                  </div>
                  <div className="divide-y-2 divide-border-default">
                    {schedule.map((s, i) => (
                      <div key={i} className="px-5 py-4">
                        <p className="label-mono text-accent mb-2">{s.month}</p>
                        <ul className="flex flex-col gap-1.5">
                          {s.tasks.map((t, j) => (
                            <li key={j} className="text-[13px] text-foreground-muted flex items-start gap-2">
                              <span className="w-1 h-1 bg-foreground-subtle rounded-full mt-2 shrink-0"></span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="card-base">
                  <h2 className="font-heading text-base uppercase text-foreground mb-3">Tóm tắt</h2>
                  <p className="text-sm text-foreground-muted">Dữ liệu bảo trì được suy ra từ trạng thái và tồn kho thiết bị thực tế trong hệ thống.</p>
                  <p className="text-sm font-extrabold text-accent mt-3">{maintenanceItems.length} thiết bị đang theo dõi</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </GearLayout>
  )
}
