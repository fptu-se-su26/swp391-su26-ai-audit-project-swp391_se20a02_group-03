import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'

const statusConfig = {
  active:   { label: 'Active',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  overdue:  { label: 'Overdue',  bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     border: 'border-red-200' },
  pending:  { label: 'Pending',  bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   border: 'border-amber-200' },
  returned: { label: 'Returned', bg: 'bg-slate-50',   text: 'text-slate-500',   dot: 'bg-slate-400',   border: 'border-slate-200' },
  Rented:   { label: 'Active',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  Returned: { label: 'Returned', bg: 'bg-slate-50',   text: 'text-slate-500',   dot: 'bg-slate-400',   border: 'border-slate-200' },
}

const depositStatusConfig = {
  Held:     { label: 'Đang giữ',  bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Refunded: { label: 'Đã hoàn',   bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Deducted: { label: 'Đã trừ phí', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
}

const tabs = ['all', 'active', 'overdue', 'pending', 'returned']

export default function GearRentalPage() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      const response = await equipmentApi.getMyRentals()
      if (response.statusCode === 200) {
        const mappedData = response.data.map(r => ({
          ...r,
          id: `R-${String(r.equipmentRentalId).padStart(3, '0')}`,
          item: r.equipmentName,
          status: r.rentalStatus === 'Rented' ? 'active' : (r.rentalStatus === 'Returned' ? 'returned' : r.rentalStatus?.toLowerCase()),
          total: `${Number(r.totalPrice).toLocaleString('vi-VN')} VND`,
          price: `${Number(r.unitPrice).toLocaleString('vi-VN')} VND / đơn vị`,
          deposit: `${Number(r.depositAmount).toLocaleString('vi-VN')} VND`,
          depositStatusLabel: depositStatusConfig[r.depositStatus]?.label || r.depositStatus,
          start: new Date(r.rentedAt).toLocaleDateString('vi-VN'),
          due: 'N/A',
          customer: 'Me',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80'
        }))
        setRentals(mappedData)
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (rentalId) => {
    try {
      const response = await equipmentApi.return({ equipmentRentalId: rentalId })
      if (response.statusCode === 200) {
        alert('Equipment returned successfully!')
        fetchRentals() // Refresh list
      }
    } catch (error) {
      alert('Error returning equipment: ' + error)
    }
  }

  const filtered = rentals.filter(r => {
    const matchTab = activeTab === 'all' || r.status === activeTab
    const matchSearch = r.item.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <GearLayout>
      <div className="flex min-h-[calc(100vh-56px-80px)]">

        {/* Rental List */}
        <div className="flex-1 px-7 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-['Oswald'] text-2xl font-bold text-[#0d2d3a]">Rental Management</h1>
              <p className="text-sm text-slate-400 mt-0.5">{rentals.length} total rentals</p>
            </div>
            <Link to="/gear/catalog" className="btn-primary text-sm py-2 px-4 no-underline flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Rental
            </Link>
          </div>

          {/* Search + Tabs */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-white border border-[#e0ecf0] rounded-full py-2 px-4 flex-1 max-w-xs focus-within:border-[#0d8a8a] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Tìm kiếm customer or item..." className="border-none bg-transparent text-sm outline-none text-[#0d2d3a] placeholder:text-slate-400 flex-1" />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#e0ecf0] rounded-lg bg-white text-slate-500 hover:border-[#0d8a8a] hover:text-[#0d8a8a] transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#e0ecf0] rounded-lg bg-white text-slate-500 hover:border-[#0d8a8a] hover:text-[#0d8a8a] transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {tabs.map(tab => {
                const count = tab === 'all' ? rentals.length : rentals.filter(r => r.status === tab).length
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-[0.78rem] font-medium capitalize cursor-pointer border transition-all flex items-center gap-1.5 ${activeTab === tab ? 'bg-[#0d8a8a] text-white border-[#0d8a8a]' : 'bg-white text-slate-500 border-[#e0ecf0] hover:border-[#0d8a8a] hover:text-[#0d8a8a]'}`}>
                    {tab}
                    <span className={`text-[0.65rem] font-bold rounded-full px-1.5 py-0 ${activeTab === tab ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#e0ecf0] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f4f8] bg-[#f9fbfc]">
                  <th className="text-left px-5 py-3 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Thiết bị</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Period</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Tổng cộng</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Tiền cọc</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Trạng thái</th>
                  <th className="text-left px-4 py-3 text-[0.7rem] font-bold tracking-wider text-slate-400 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f8]">
                {filtered.map(r => {
                  const s = statusConfig[r.status]
                  return (
                    <tr key={r.id} onClick={() => setSelected(r)} className="hover:bg-[#f9fbfc] transition-colors cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-[0.875rem] font-semibold text-[#0d2d3a]">{r.customer}</p>
                            <p className="text-[0.7rem] text-slate-400">{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[0.875rem] text-[#0d2d3a] font-medium">{r.item}</p>
                        <p className="text-[0.7rem] text-slate-400">{r.category}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[0.78rem] text-[#0d2d3a]">{r.start}</p>
                        <p className="text-[0.7rem] text-slate-400">→ {r.due}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[0.875rem] font-bold text-[#0d2d3a]">{r.total}</p>
                        <p className="text-[0.7rem] text-slate-400">{r.price}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[0.875rem] font-bold text-[#0d2d3a]">{r.deposit}</p>
                        <span className={`inline-flex items-center text-[0.68rem] font-semibold px-2 py-0.5 rounded-full border mt-1 ${depositStatusConfig[r.depositStatus]?.bg || 'bg-slate-50'} ${depositStatusConfig[r.depositStatus]?.text || 'text-slate-500'} ${depositStatusConfig[r.depositStatus]?.border || 'border-slate-200'}`}>
                          {r.depositStatusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1">
                          {r.status === 'active' && (
                            <button onClick={(e) => { e.stopPropagation(); handleReturn(r.equipmentRentalId); }} className="px-2.5 py-1.5 text-[0.72rem] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">Return</button>
                          )}
                          {r.status === 'overdue' && (
                            <button className="px-2.5 py-1.5 text-[0.72rem] font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">Contact</button>
                          )}
                          {r.status === 'pending' && (
                            <button className="px-2.5 py-1.5 text-[0.72rem] font-semibold bg-[#0d8a8a]/10 text-[#0d8a8a] border border-[#0d8a8a]/20 rounded-lg hover:bg-[#0d8a8a]/20 transition-colors cursor-pointer">Xác nhận</button>
                          )}
                          <button className="px-2.5 py-1.5 text-[0.72rem] font-semibold bg-white text-slate-500 border border-[#e0ecf0] rounded-lg hover:border-[#0d8a8a] hover:text-[#0d8a8a] transition-colors cursor-pointer">Xem chi tiết</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <p className="text-sm">No rentals found</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <aside className="w-[320px] shrink-0 border-l border-[#e0ecf0] bg-white p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-['Oswald'] text-lg font-bold text-[#0d2d3a]">Rental Detail</h2>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-full bg-[#f0f4f8] border-none cursor-pointer text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors">✕</button>
            </div>
            <img src={selected.img} alt={selected.item} className="w-full h-36 object-cover rounded-xl" />
            <div>
              <p className="text-[0.72rem] text-slate-400 mb-0.5 uppercase tracking-wider">{selected.category}</p>
              <h3 className="font-bold text-[#0d2d3a] text-base">{selected.item}</h3>
            </div>
            <div className="flex items-center gap-3">
              <img src={selected.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-[0.875rem] font-semibold text-[#0d2d3a]">{selected.customer}</p>
                <p className="text-[0.72rem] text-slate-400">Rental ID: {selected.id}</p>
              </div>
            </div>
            <div className="bg-[#f5f9fc] rounded-xl p-4 flex flex-col gap-3">
              {[
                { label: 'Start', value: selected.start },
                { label: 'Due Return', value: selected.due },
                { label: 'Rate', value: selected.price },
                { label: 'Total Charge', value: selected.total },
                { label: 'Deposit', value: selected.deposit },
                { label: 'Deposit Status', value: selected.depositStatusLabel },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[0.78rem] text-slate-400">{item.label}</span>
                  <span className="text-[0.82rem] font-semibold text-[#0d2d3a]">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              {selected.status === 'active' && <button onClick={() => handleReturn(selected.equipmentRentalId)} className="btn-primary w-full justify-center">Mark as Returned</button>}
              {selected.status === 'overdue' && <button className="w-full py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm border-none cursor-pointer hover:bg-red-600 transition-colors">Send Overdue Notice</button>}
              {selected.status === 'pending' && <button className="btn-primary w-full justify-center">Confirm Rental</button>}
              <button className="btn-outline w-full justify-center">Print Receipt</button>
            </div>
          </aside>
        )}
      </div>
    </GearLayout>
  )
}