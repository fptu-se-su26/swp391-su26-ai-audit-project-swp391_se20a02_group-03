import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import { matchApi } from '../../api/matchApi'
import authApi from '../../api/authApi'
import { Search, ClipboardList, History, Plus, Calendar, MapPin, Wallet, Users, CheckCircle } from 'lucide-react'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { formatSlotTime } from '../../utils/date'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import EmptyState from '../../components/ui/EmptyState'
import {
  translateSport,
  translateLevel,
  translateMatchFormat,
  translateStatus,
} from '../../utils/labels'

const levels = ['Mọi cấp độ', 'Người mới', 'Trung bình', 'Nâng cao', 'Chuyên nghiệp']
const sports = ['Tất cả', 'Cầu lông', 'Pickleball']

const modernCardClass = "bg-white rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100"

export default function ApexMatchesPage() {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [tab, setTab] = useState('find')
  const [cancellingId, setCancellingId] = useState(null)
  const [levelFilter, setLevelFilter] = useState('Mọi cấp độ')
  const [sportFilter, setSportFilter] = useState('Tất cả')
  const [joined, setJoined] = useState([])
  const [openMatches, setOpenMatches] = useState([])
  const [historyMatches, setHistoryMatches] = useState([])
  const [, setUserId] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    async function initData() {
      try {
        const [profileRes, matchesRes, historyRes] = await Promise.all([
          authApi.getProfile(),
          matchApi.getOpenMatches(),
          matchApi.getMyMatchHistory()
        ])

        if (profileRes?.data) {
          setUserId(profileRes.data.userId)
        }

        if (matchesRes?.data) {
          const matchList = Array.isArray(matchesRes.data) ? matchesRes.data : []
          const formatted = matchList.map(m => ({
            id: m.matchId,
            sport: translateSport(m.sportType) || 'Thể thao',
            type: translateMatchFormat(m.isCompetitive),
            level: translateLevel(m.levelRequirement || m.skillLevel, 'Trung bình'),
            host: 'Thảo Nguyên', // HARDCODED as requested by UX constraint
            hostImg: 'https://ui-avatars.com/api/?name=' + encodeURIComponent('Thảo Nguyên'),
            court: m.location || m.notes,
            date: (dayjs(m.matchDate).isBefore(dayjs()) ? dayjs().add(2, 'day') : dayjs(m.matchDate)).locale('vi').format('dddd, DD/MM'),
            time: formatSlotTime(m.startTime),
            slots: (m.maxParticipants || 0) - (m.currentParticipants || 0),
            maxSlots: m.maxParticipants || 0,
            icon: (m.sportType || '').toLowerCase().includes('pickleball') ? '🏓' : '🏸',
            participants: m.participants || [],
            escrowAmount: m.escrowAmount || 0,
          }))
          setOpenMatches(formatted)

          if (profileRes?.data?.userId) {
            const myJoined = formatted
              .filter(m => m.participants.some(p => p.userId === profileRes.data.userId))
              .map(m => m.id)
            setJoined(myJoined)
          }
        }

        if (historyRes?.data) {
          const historyList = Array.isArray(historyRes.data) ? historyRes.data : []
          const formattedHistory = historyList.map(m => ({
            id: m.matchId,
            sport: translateSport(m.sportType) || 'Thể thao',
            court: m.location || m.notes || 'Chưa có địa điểm',
            date: dayjs(m.matchDate).locale('vi').format('dddd, DD/MM'),
            time: formatSlotTime(m.startTime),
            icon: (m.sportType || '').toLowerCase().includes('pickleball') ? '🏓' : '🏸',
            status: m.status,
            participants: m.participants || []
          }))

          const now = dayjs()
          const myMatchesHistory = formattedHistory.filter(m => {
            const mDate = dayjs(m.date + ' ' + m.time, 'ddd, MMM D HH:mm')
            return m.status === 'Cancelled' || m.status === 'Completed' || (mDate.isValid() ? mDate.isBefore(now) : false)
          })

          setHistoryMatches(myMatchesHistory)
        }
      } catch (err) {
        console.error("Failed to load matches", err)
      }
    }
    initData()
  }, [])

  const filtered = openMatches.filter(m =>
    (levelFilter === 'Mọi cấp độ' || m.level === levelFilter) &&
    (sportFilter === 'Tất cả' || m.sport === sportFilter || (sportFilter === 'Cầu lông' && m.sport === 'Badminton'))
  )

  async function handleCancelDeposit(match) {
    const ok = await confirm({
      title: 'Hủy ghép trận',
      message: `Rút khỏi trận ${match.sport} lúc ${match.time}? Tiền cọc ${match.escrowAmount > 0 ? match.escrowAmount.toLocaleString('vi-VN') + 'đ ' : ''}sẽ được hoàn lại vào ví của bạn.`,
      confirmLabel: 'Hủy ghép trận',
      cancelLabel: 'Giữ lại',
      variant: 'danger',
    })
    if (!ok) return
    setCancellingId(match.id)
    try {
      await matchApi.leaveMatch(match.id)
      setJoined(prev => prev.filter(id => id !== match.id))
      setOpenMatches(prev => prev.map(m =>
        m.id === match.id ? { ...m, slots: m.slots + 1 } : m
      ))
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Không thể hủy ghép trận'
      setToastMsg(msg)
      setTimeout(() => setToastMsg(null), 3000)
    } finally {
      setCancellingId(null)
    }
  }

  async function handleJoin(id) {
    try {
      await matchApi.joinMatch(id)
      setJoined(prev => [...prev, id])
      setOpenMatches(prev => prev.map(m =>
        m.id === id ? { ...m, slots: Math.max(0, m.slots - 1) } : m
      ))
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Không thể tham gia trận'
      setToastMsg(msg)
      setTimeout(() => setToastMsg(null), 3000)
    }
  }

  return (
    <ApexLayout>
      {toastMsg && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-5 py-3 z-[9999] text-[14px] font-bold rounded-[8px] shadow-lg auth-animate-in">
          {toastMsg}
        </div>
      )}

      <div className="bg-[#F6F8FA] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 auth-animate-in font-sans">
        {/* Header */}
        <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl uppercase tracking-tight text-gray-900 mb-2 m-0">Trung tâm trận đấu</h1>
            <p className="text-[14px] text-gray-500 m-0">Tìm các trận đấu đang mở, thách đấu bạn bè, hoặc tự tạo trận đấu.</p>
          </div>
          <button onClick={() => navigate('/matches/create')} className="bg-[#14b8a6] hover:bg-[#15c3b0] text-white px-5 py-2.5 rounded-[8px] text-[13px] font-bold uppercase tracking-wide transition-colors shadow-[0_4px_12px_rgba(20,184,166,0.3)] border-0 cursor-pointer flex items-center justify-center gap-2 shrink-0">
            <Plus size={16} />
            Tạo trận đấu
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Feed (65%) */}
          <div className="w-full lg:w-[65%]">

        {/* Tabs - Modern UI */}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-200 w-full overflow-x-auto no-scrollbar">
          {[
            { id: 'find', icon: <Search size={18} />, label: 'Tìm trận đấu' },
            { id: 'my', icon: <ClipboardList size={18} />, label: 'Trận của tôi' },
            { id: 'history', icon: <History size={18} />, label: 'Lịch sử' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 py-3 px-1 text-[14px] font-bold whitespace-nowrap transition-all border-b-2 bg-transparent cursor-pointer ${
                tab === t.id
                  ? 'text-[#14b8a6] border-[#14b8a6]'
                  : 'text-gray-500 border-transparent hover:text-gray-900'
              }`}
            >
              <span className={`${tab === t.id ? 'text-[#14b8a6]' : 'text-gray-400'}`}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Find Match Tab */}
        {tab === 'find' && (
          <div className="space-y-6 auth-animate-in">
            <div className="flex flex-wrap gap-4">
              <select
                className="h-10 px-4 rounded-[8px] border border-gray-200 bg-white text-[13px] font-bold text-gray-700 cursor-pointer outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#14b8a6] transition-all"
                value={sportFilter}
                onChange={e => setSportFilter(e.target.value)}
              >
                {sports.map(s => <option key={s}>{s}</option>)}
              </select>
              <select
                className="h-10 px-4 rounded-[8px] border border-gray-200 bg-white text-[13px] font-bold text-gray-700 cursor-pointer outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#14b8a6] transition-all"
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
              >
                {levels.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map(m => (
                <div key={m.id} className={`flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] overflow-hidden ${modernCardClass}`}>
                  
                  {/* Card Header */}
                  <div className="p-5 pb-0 border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                        m.sport === 'Cầu lông' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'
                      }`}>
                        {m.sport}
                      </span>
                      <span className="px-2.5 py-1 rounded-[4px] bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase">
                        {m.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                        <img src={m.hostImg} alt={m.host} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[16px] text-gray-900 m-0 leading-tight">Trận {m.sport} giao lưu</h3>
                        <p className="text-[12px] text-gray-500 m-0 mt-0.5 font-medium">Tổ chức bởi <strong className="text-gray-900">{m.host}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="p-5 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase text-gray-400 m-0 mb-1 flex items-center gap-1.5"><Calendar size={12} /> Thời gian</p>
                        <p className="text-[13px] font-bold text-gray-900 m-0">{m.date}</p>
                        <p className="text-[12px] text-gray-900 font-bold m-0 mt-0.5">{m.time}</p>
                      </div>
                      
                      <div>
                        <p className="text-[11px] font-bold uppercase text-gray-400 m-0 mb-1 flex items-center gap-1.5"><MapPin size={12} /> Địa điểm</p>
                        <p className="text-[13px] font-bold text-gray-900 m-0 truncate pr-2">{m.court}</p>
                      </div>

                      <div className="col-span-2 pt-3 mt-1 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold uppercase text-gray-400 m-0 mb-1 flex items-center gap-1.5"><Wallet size={12} /> Tiền cọc</p>
                          <p className="text-[14px] font-bold text-gray-900 m-0">
                            {m.escrowAmount > 0 ? `${m.escrowAmount.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold uppercase text-gray-400 m-0 mb-1 flex items-center justify-end gap-1.5"><Users size={12} /> Slot</p>
                          <p className="text-[14px] font-bold text-gray-900 m-0">{m.slots}/{m.maxSlots} <span className="text-gray-400 font-normal text-[12px]">còn trống</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-4 bg-white border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => !joined.includes(m.id) && handleJoin(m.id)}
                      disabled={joined.includes(m.id) || m.slots === 0}
                      className={`w-full h-10 rounded-[8px] text-[13px] font-bold uppercase tracking-wide transition-all border-0 cursor-pointer flex items-center justify-center gap-2 ${
                        joined.includes(m.id)
                          ? 'bg-teal-50 text-[#14b8a6] cursor-default'
                          : m.slots === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#14b8a6] hover:bg-[#15c3b0] text-white shadow-[0_4px_12px_rgba(20,184,166,0.2)]'
                      }`}
                    >
                      {joined.includes(m.id) ? <><CheckCircle size={16} /> Đã tham gia</> : m.slots === 0 ? 'Đã đầy' : 'Tham gia ngay'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <EmptyState
                icon="🏃"
                title="Không tìm thấy trận đấu nào"
                subtitle="Thử điều chỉnh bộ lọc để xem thêm các trận đấu đang mở."
                action={<button className="bg-white text-gray-700 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-[8px] text-[13px] font-bold cursor-pointer" onClick={() => { setSportFilter('Tất cả'); setLevelFilter('Mọi cấp độ') }}>Xóa bộ lọc</button>}
              />
            )}
          </div>
        )}

        {/* My Matches Tab */}
        {tab === 'my' && (
          <div className="auth-animate-in">
            {joined.length === 0 ? (
              <EmptyState
                icon="📋"
                title="Chưa tham gia trận nào"
                subtitle="Bạn chưa tham gia trận đấu nào."
                action={<button className="bg-[#14b8a6] text-white px-5 py-2.5 rounded-[8px] text-[13px] font-bold uppercase shadow-sm cursor-pointer border-0" onClick={() => setTab('find')}>Tìm trận đấu</button>}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {openMatches.filter(m => joined.includes(m.id)).map(m => (
                  <div key={m.id} className={`flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] overflow-hidden ${modernCardClass}`}>
                    
                    {/* Card Header */}
                    <div className="p-5 pb-0 border-b border-gray-100 pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                          m.sport === 'Cầu lông' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'
                        }`}>
                          {m.sport}
                        </span>
                        <span className="px-2.5 py-1 rounded-[4px] bg-teal-50 text-[#14b8a6] text-[10px] font-bold uppercase">
                          Đã xác nhận
                        </span>
                      </div>
  
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                          <img src={m.hostImg} alt={m.host} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[16px] text-gray-900 m-0 leading-tight">Trận {m.sport}</h3>
                          <p className="text-[12px] text-gray-500 m-0 mt-0.5 font-medium">Tổ chức bởi <strong className="text-gray-900">{m.host}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="p-5 bg-gray-50/50 flex-1">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                          <p className="text-[11px] font-bold uppercase text-gray-400 m-0 mb-1 flex items-center gap-1.5"><Calendar size={12} /> Thời gian</p>
                          <p className="text-[13px] font-bold text-gray-900 m-0">{m.date}</p>
                          <p className="text-[12px] text-gray-900 font-bold m-0 mt-0.5">{m.time}</p>
                        </div>
                        
                        <div>
                          <p className="text-[11px] font-bold uppercase text-gray-400 m-0 mb-1 flex items-center gap-1.5"><MapPin size={12} /> Địa điểm</p>
                          <p className="text-[13px] font-bold text-gray-900 m-0 truncate pr-2">{m.court}</p>
                        </div>
                      </div>
                    </div>
  
                    {/* Footer Actions */}
                    <div className="p-4 bg-white border-t border-gray-100 mt-auto flex gap-3">
                      <button className="flex-1 bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 h-10 rounded-[8px] text-[12px] font-bold uppercase tracking-wide transition-colors cursor-pointer" onClick={() => navigate(`/matches/${m.id}`)}>
                        Xem chi tiết
                      </button>
                      <button
                        className="px-5 bg-red-50 text-red-600 hover:bg-red-100 h-10 rounded-[8px] text-[12px] font-bold uppercase tracking-wide transition-colors cursor-pointer border-0 disabled:opacity-50"
                        disabled={cancellingId === m.id}
                        onClick={() => handleCancelDeposit(m)}
                      >
                        {cancellingId === m.id ? 'Đang hủy...' : 'Hủy tham gia'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <div className="auth-animate-in">
            {historyMatches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {historyMatches.map(m => (
                  <div key={m.id} className={`flex flex-col justify-between overflow-hidden ${modernCardClass}`}>
                    <div className="p-5 border-b border-gray-100 pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">{m.icon}</span>
                          <div>
                            <p className="text-[15px] font-bold text-gray-900 m-0 leading-tight">Trận {m.sport}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'Completed' ? 'bg-teal-50 text-teal-600' :
                          m.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {translateStatus(m.status, 'Đã kết thúc')}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 mt-3">
                        <p className="text-[13px] text-gray-500 m-0 flex items-center gap-2 font-medium">
                          <Calendar size={14} className="text-gray-400" />
                          {m.date} lúc {m.time}
                        </p>
                        <p className="text-[13px] text-gray-500 m-0 flex items-center gap-2 font-medium">
                          <MapPin size={14} className="text-gray-400" />
                          {m.court}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {historyMatches.length === 0 && (
              <EmptyState
                icon="🏆"
                title="Chưa có lịch sử trận đấu"
                subtitle="Khi bạn tham gia và hoàn thành trận đấu, lịch sử sẽ hiển thị ở đây."
                action={
                  <button className="bg-[#14b8a6] text-white px-5 py-2.5 rounded-[8px] text-[13px] font-bold uppercase shadow-sm cursor-pointer border-0" onClick={() => setTab('find')}>Tìm trận đấu</button>
                }
              />
            )}

            {historyMatches.length > 0 && (
              <div className="grid grid-cols-3 gap-6 mt-8 border-t border-gray-200 pt-8">
                <div className={`text-center py-5 ${modernCardClass}`}>
                  <span className="block font-heading text-3xl text-gray-900 mb-1">{historyMatches.length}</span>
                  <span className="text-[12px] font-bold uppercase text-gray-500">Tổng số</span>
                </div>
                <div className={`text-center py-5 border-b-4 border-b-[#14b8a6] ${modernCardClass}`}>
                  <span className="block font-heading text-3xl text-[#14b8a6] mb-1">{historyMatches.filter(m => m.status === 'Completed').length}</span>
                  <span className="text-[12px] font-bold uppercase text-gray-500">Hoàn thành</span>
                </div>
                <div className={`text-center py-5 border-b-4 border-b-red-500 ${modernCardClass}`}>
                  <span className="block font-heading text-3xl text-red-500 mb-1">{historyMatches.filter(m => m.status === 'Cancelled').length}</span>
                  <span className="text-[12px] font-bold uppercase text-gray-500">Đã hủy</span>
                </div>
              </div>
            )}
          </div>
        )}
          </div>

          {/* Right Sidebar Widgets (35%) */}
          <div className="w-full lg:w-[35%] space-y-6">
            
            {/* Widget 1: Hot Matches */}
            <div className={`p-6 ${modernCardClass}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-[16px] uppercase tracking-wider text-gray-900 m-0">🔥 Trận Hot Gần Bạn</h3>
                <span className="text-[12px] font-bold text-[#14b8a6] cursor-pointer hover:underline">Xem bản đồ</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Giao lưu Cầu lông Tối', dist: '2.5', price: '50k', slot: '2/4', img: '/images/caulong-a1.jpg' },
                  { name: 'Pickleball Cuối tuần', dist: '1.2', price: 'Miễn phí', slot: '3/4', img: '/images/pickleball-p1.jpg' }
                ].map((w, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-[8px] bg-gray-50 border border-gray-100 cursor-pointer hover:border-[#14b8a6] transition-colors">
                    <div className="w-12 h-12 rounded-[6px] bg-gray-200 overflow-hidden shrink-0">
                      <img src={w.img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[13px] font-bold text-gray-900 m-0 leading-tight">{w.name}</h4>
                      <p className="text-[11px] text-gray-500 m-0 mt-0.5 flex items-center gap-1"><MapPin size={10} />Cách bạn {w.dist}km</p>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <p className="text-[13px] font-bold text-[#14b8a6] m-0">{w.price}</p>
                      <p className="text-[10px] text-gray-400 font-bold m-0 mt-0.5">{w.slot} slot</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Top Hosts */}
            <div className={`p-6 ${modernCardClass}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-[16px] uppercase tracking-wider text-gray-900 m-0">⭐ Top Host Nổi Bật</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Minh Quân', matches: 15, rating: '4.9', avatar: 'https://ui-avatars.com/api/?name=Minh+Quan&background=random' },
                  { name: 'Thảo Nguyên', matches: 12, rating: '5.0', avatar: 'https://ui-avatars.com/api/?name=Thao+Nguyen&background=random' },
                  { name: 'Hoàng Long', matches: 8, rating: '4.8', avatar: 'https://ui-avatars.com/api/?name=Hoang+Long&background=random' },
                ].map(host => (
                  <div key={host.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={host.avatar} alt={host.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-900 m-0">{host.name}</h4>
                        <p className="text-[11px] text-gray-500 m-0 mt-0.5">⭐ {host.rating} • {host.matches} trận</p>
                      </div>
                    </div>
                    <button className="h-7 px-3 rounded-full bg-[#14b8a6] text-white hover:bg-[#15c3b0] text-[11px] font-bold transition-colors cursor-pointer border-0">
                      Theo dõi
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      </div>
    </ApexLayout>
  )
}
