import { useState } from 'react'
import { Link } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'

const stats = [
  { label: 'Active Rentals', value: '24', change: '+3 today', color: '#0d8a8a', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { label: 'Overdue Returns', value: '3', change: '!  Needs attention', color: '#ef4444', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { label: 'Revenue (Month)', value: '$4,280', change: '+12.4% vs last month', color: '#6366f1', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { label: 'Total Inventory', value: '142', change: '12 in maintenance', color: '#f59e0b', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
]

const activeRentals = [
  { id: 'R-001', customer: 'Alex Mercer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', item: 'Wilson Pro Staff RF97', category: 'Tennis Racket', start: 'Today, 14:00', due: 'Today, 20:00', status: 'active', price: '$15' },
  { id: 'R-002', customer: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80', item: 'Babolat Technical Viper', category: 'Padel Racket', start: 'Today, 09:00', due: 'Today, 17:00', status: 'active', price: '$18' },
  { id: 'R-003', customer: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', item: 'TaylorMade P790 Irons', category: 'Golf Set', start: 'Yesterday, 10:00', due: 'Yesterday, 18:00', status: 'overdue', price: '$45' },
  { id: 'R-004', customer: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80', item: 'Head Tour Balls (3-Pack)', category: 'Tennis Balls', start: 'Today, 11:00', due: 'Today, 19:00', status: 'active', price: '$8' },
  { id: 'R-005', customer: 'David K.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80', item: 'Pickleball Premium Set', category: 'Pickleball', start: 'Today, 16:00', due: 'Tomorrow, 10:00', status: 'pending', price: '$22' },
]

const inventoryAlerts = [
  { item: 'Wilson Pro Staff RF97', stock: 2, total: 8, status: 'low' },
  { item: 'TaylorMade P790 Irons', stock: 0, total: 3, status: 'out' },
  { item: 'Badminton Racket Set', stock: 1, total: 5, status: 'low' },
]

const statusConfig = {
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  overdue: { label: 'Overdue', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
}

export default function GearDashboardPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = activeTab === 'all' ? activeRentals : activeRentals.filter(r => r.status === activeTab)

  return (
    <GearLayout>
      <div className="px-7 py-6 max-w-[1200px] mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Oswald'] text-2xl font-bold text-[#0d2d3a]">Equipment Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Real-time overview of all rental operations</p>
          </div>
          <div className="flex gap-2">
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
        <div className="grid grid-cols-4 max-[1000px]:grid-cols-2 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e0ecf0] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '18', color: s.color }}>
                  {s.icon}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <div>
                <p className="text-[0.75rem] text-slate-400 mb-0.5">{s.label}</p>
                <p className="font-['Oswald'] text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[0.72rem] text-slate-400 mt-0.5">{s.change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_300px] max-[900px]:grid-cols-1 gap-5">

          {/* Active Rentals Table */}
          <div className="bg-white rounded-2xl border border-[#e0ecf0] overflow-hidden">
            <div className="p-5 border-b border-[#f0f4f8]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Oswald'] text-lg font-bold text-[#0d2d3a]">Active Rentals</h2>
                <Link to="/gear/rentals" className="text-[0.8rem] text-[#0d8a8a] font-semibold no-underline hover:underline">View All →</Link>
              </div>
              <div className="flex gap-1">
                {['all','active','overdue','pending'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-[0.78rem] font-medium capitalize cursor-pointer border transition-all ${activeTab === tab ? 'bg-[#0d8a8a] text-white border-[#0d8a8a]' : 'bg-white text-slate-500 border-[#e0ecf0] hover:border-[#0d8a8a] hover:text-[#0d8a8a]'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-[#f0f4f8]">
              {filtered.map(r => {
                const s = statusConfig[r.status]
                return (
                  <div key={r.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#f9fbfc] transition-colors">
                    <img src={r.avatar} alt={r.customer} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.875rem] font-semibold text-[#0d2d3a] truncate">{r.customer}</p>
                      <p className="text-[0.75rem] text-slate-400 truncate">{r.item}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.8rem] font-bold text-[#0d2d3a]">{r.price}/hr</p>
                      <p className="text-[0.7rem] text-slate-400">Due {r.due}</p>
                    </div>
                    <span className={`text-[0.7rem] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">

            {/* Revenue Chart placeholder */}
            <div className="bg-white rounded-2xl border border-[#e0ecf0] p-5">
              <h2 className="font-['Oswald'] text-base font-bold text-[#0d2d3a] mb-4">Weekly Revenue</h2>
              <div className="flex items-end gap-1.5 h-28">
                {[40,65,45,80,55,90,72].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? '#0d8a8a' : '#e0f2f2' }}></div>
                    <span className="text-[0.6rem] text-slate-400">{'SMTWTFS'[i]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-[#f0f4f8]">
                <div>
                  <p className="text-[0.7rem] text-slate-400">This Week</p>
                  <p className="font-bold text-[#0d8a8a] text-sm">$1,240</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.7rem] text-slate-400">Last Week</p>
                  <p className="font-bold text-slate-500 text-sm">$980</p>
                </div>
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-2xl border border-[#e0ecf0] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Oswald'] text-base font-bold text-[#0d2d3a]">Inventory Alerts</h2>
                <span className="bg-red-100 text-red-600 text-[0.7rem] font-bold px-2 py-0.5 rounded-full">{inventoryAlerts.length} Issues</span>
              </div>
              <div className="flex flex-col gap-3">
                {inventoryAlerts.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[0.82rem] font-medium text-[#0d2d3a] truncate flex-1">{item.item}</p>
                      <span className={`text-[0.68rem] font-bold ml-2 ${item.status === 'out' ? 'text-red-500' : 'text-amber-500'}`}>
                        {item.status === 'out' ? 'OUT OF STOCK' : 'LOW STOCK'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#f0f4f8] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(item.stock / item.total) * 100}%`, background: item.status === 'out' ? '#ef4444' : '#f59e0b' }}></div>
                    </div>
                    <p className="text-[0.68rem] text-slate-400 mt-0.5">{item.stock}/{item.total} available</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </GearLayout>
  )
}
