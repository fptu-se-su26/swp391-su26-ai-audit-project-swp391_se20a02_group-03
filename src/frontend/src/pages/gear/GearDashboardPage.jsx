import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'

const statusConfig = {
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  overdue: { label: 'Overdue', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  Rented: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  Returned: { label: 'Returned', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400' },
}

export default function GearDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Auto-refresh every 30s
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [dashRes, rentalsRes] = await Promise.all([
        equipmentApi.getDashboard(),
        equipmentApi.getMyRentals()
      ])

      if (dashRes.success) {
        setDashboardData(dashRes.data)
      }

      if (rentalsRes.statusCode === 200) {
        setRentals(rentalsRes.data.map(r => ({
          ...r,
          id: `R-${String(r.equipmentRentalId).padStart(3, '0')}`,
          customer: 'Me',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
          item: r.equipmentName,
          status: r.rentalStatus === 'Rented' ? 'active' : (r.rentalStatus === 'Returned' ? 'returned' : r.rentalStatus),
          price: formatVND(r.unitPrice),
          due: 'N/A'
        })))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { 
      label: 'Active Rentals', 
      value: dashboardData?.activeRentals?.toString() || '0', 
      change: 'Units currently out', 
      color: '#0d8a8a', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> 
    },
    { 
      label: 'Pending Inspection', 
      value: dashboardData?.pendingInspections?.toString() || '0', 
      change: 'Requires staff review', 
      color: '#f59e0b', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> 
    },
    { 
      label: 'Total Revenue', 
      value: formatVND(dashboardData?.totalRevenue || 0), 
      change: 'Accumulated total', 
      color: '#6366f1', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 
    },
    { 
      label: 'Equipment Value', 
      value: formatVND(dashboardData?.totalEquipmentValue || 0), 
      change: 'Asset valuation', 
      color: '#ef4444', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> 
    },
  ]

  return (
    <GearLayout>
      <div className="px-7 py-6 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-900">Equipment Dashboard</h1>
            <p className="text-sm text-brand-500 mt-1">Real-time overview of all rental operations</p>
          </div>
          <div className="flex gap-3">
            <Link to="/gear/rentals" className="btn-outline text-sm py-2 px-4 no-underline flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Manage Rentals
            </Link>
            <Link to="/gear/catalog" className="btn-primary text-sm py-2 px-4 no-underline flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Rental
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-brand-200 p-5 flex flex-col gap-3 shadow-sm hover:border-brand-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '18', color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="font-heading text-3xl font-bold text-brand-900 mb-1">{s.value}</p>
                <p className="text-xs font-medium text-brand-500">{s.change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Active Rentals Table */}
          <div className="bg-white rounded-2xl border border-brand-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-brand-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-brand-900">Active Rentals</h2>
                <Link to="/gear/rentals" className="text-sm text-accent font-semibold hover:underline">View All →</Link>
              </div>
              <div className="flex gap-2">
                {['all','active','overdue','pending'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-brand-100">
              {(activeTab === 'all' ? rentals : rentals.filter(r => r.status === activeTab)).map(r => {
                const s = statusConfig[r.status] || statusConfig['active']
                return (
                  <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-brand-50/50 transition-colors">
                    <img src={r.avatar} alt={r.customer} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-900 truncate">{r.customer}</p>
                      <p className="text-xs text-brand-500 truncate mt-0.5">{r.item}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-brand-900">{r.price}/hr</p>
                      <p className="text-xs text-brand-400 mt-0.5">Due {r.due}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ml-2 ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Units Status */}
            <div className="bg-white rounded-2xl border border-brand-200 p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-brand-900 mb-6">Units Status</h2>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Available', count: dashboardData?.unitsByStatus?.available, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                  { label: 'Rented', count: dashboardData?.unitsByStatus?.rented, color: 'bg-blue-500', bg: 'bg-blue-50' },
                  { label: 'Maintenance', count: dashboardData?.unitsByStatus?.maintenance, color: 'bg-amber-500', bg: 'bg-amber-50' },
                  { label: 'Liquidated', count: dashboardData?.unitsByStatus?.liquidated, color: 'bg-red-500', bg: 'bg-red-50' },
                ].map((status, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-brand-600">{status.label}</span>
                      <span className="text-sm font-bold text-brand-900">{status.count || 0}</span>
                    </div>
                    <div className="h-2 bg-brand-50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${status.color}`} 
                        style={{ width: `${((status.count || 0) / (Object.values(dashboardData?.unitsByStatus || {}).reduce((a,b) => a+b, 0) || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Rented Equipment */}
            <div className="bg-white rounded-2xl border border-brand-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg font-bold text-brand-900">Top Equipment</h2>
              </div>
              <div className="flex flex-col gap-5">
                {(dashboardData?.topRentedEquipment || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-900 truncate">{item.equipmentName}</p>
                      <p className="text-xs text-brand-400">{item.totalRentals} rentals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent">{formatVND(item.revenue)}</p>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.topRentedEquipment?.length) && (
                  <p className="text-sm text-brand-400 text-center py-4">No rental data yet</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </GearLayout>
  )
}
