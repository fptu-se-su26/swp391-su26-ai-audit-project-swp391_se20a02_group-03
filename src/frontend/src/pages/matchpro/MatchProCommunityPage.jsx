import { useState, useEffect } from 'react'
import { Users, Trophy, Swords, Calendar, MapPin, Camera, MessageSquare, Flame } from 'lucide-react'
import ApexLayout from '../../layouts/ApexLayout'
import { useToast } from '../../components/Toast'
import { matchApi } from '../../api/matchApi'
import PageLoader from '../../components/ui/PageLoader'

function sportLabel(sportType) {
  if (!sportType) return 'Thể thao'
  return sportType.toLowerCase().includes('pickle') ? 'Pickleball' : 'Cầu lông'
}

function formatMatchTime(m) {
  const d = new Date(m.matchDate).toLocaleDateString('vi-VN')
  const start = String(m.startTime || '').slice(0, 5)
  return `${d} · ${start}`
}

const tabs = ['Bảng tin', 'Sự kiện', 'Hội nhóm', 'Thử thách']
const modernCardClass = "bg-white p-5 rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100"

export default function CommunityDashboard() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('Bảng tin')
  const [openMatches, setOpenMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [newPostText, setNewPostText] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await matchApi.getOpenMatches()
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) setOpenMatches(res.data)
        else setError(res.message || 'Không tải được kèo mở.')
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được kèo mở.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const posts = openMatches
    .filter(m => m.notes)
    .map(m => ({
      id: m.matchId,
      user: m.hostName || 'Host',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.hostName || 'Host')}&background=0d1b2a&color=f3f2ee`,
      time: formatMatchTime(m),
      content: m.notes,
      likes: m.currentParticipants,
      comments: m.maxParticipants - m.currentParticipants,
      sport: sportLabel(m.sportType),
    }))

  const events = openMatches.map(m => ({
    id: m.matchId,
    name: m.courtName ? `Kèo tại ${m.courtName}` : `Kèo #${m.matchId}`,
    date: new Date(m.matchDate).toLocaleDateString('vi-VN'),
    sport: sportLabel(m.sportType),
    participants: m.currentParticipants,
    maxParticipants: m.maxParticipants,
    prize: `${Number(m.escrowAmount).toLocaleString('vi-VN')}₫ cọc`,
    img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
  }))

  function toggleLike(id) {
    const newLikes = new Set(likedPosts)
    if (newLikes.has(id)) newLikes.delete(id)
    else newLikes.add(id)
    setLikedPosts(newLikes)
  }

  function handlePost() {
    if (newPostText.trim()) {
      addToast('Tạo kèo mới tại trang Gần bạn để chia sẻ với cộng đồng.', 'info')
      setNewPostText('')
    }
  }

  return (
    <ApexLayout>
      <div className="flex gap-8 max-lg:flex-col items-start w-full max-w-[1440px] mx-auto px-4 md:px-10 pb-16 pt-8 font-sans">
        {error && (
          <div className="w-full border border-red-200 bg-red-50 rounded-[12px] px-4 py-3 text-sm text-red-600 mb-6">{error}</div>
        )}
        {loading && <PageLoader label="Đang tải cộng đồng..." />}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col">

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#14b8a6] to-teal-700 p-8 md:p-11 mb-7 rounded-[12px] shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h1 className="font-heading text-3xl md:text-4xl uppercase text-white mb-3 flex items-center gap-2 m-0">
                <Users size={30} /> Trung tâm cộng đồng
              </h1>
              <p className="text-white/90 text-sm max-w-lg m-0">
                Kết nối, chia sẻ kinh nghiệm và tranh tài cùng cộng đồng đam mê thể thao quanh bạn.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-7 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`px-4 py-3.5 font-bold text-[14px] transition-colors whitespace-nowrap border-b-[3px] -mb-[1px] outline-none cursor-pointer ${
                  activeTab === tab 
                    ? 'border-[#14b8a6] text-[#14b8a6]' 
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {/* ================= FEED TAB ================= */}
            {activeTab === 'Bảng tin' && (
              <>
                {/* Post Composer */}
                <div className={modernCardClass}>
                  <textarea
                    placeholder="Bạn có muốn chia sẻ trận đấu hôm nay hoặc tìm đồng đội không?"
                    className="w-full border border-gray-200 rounded-[8px] p-4 mb-4 focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none transition-colors text-[14px] resize-y min-h-[100px]"
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-[8px] text-gray-500 hover:text-[#14b8a6] hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer outline-none">
                        <Camera size={18} />
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-[8px] text-gray-500 hover:text-[#14b8a6] hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer outline-none">
                        <MapPin size={18} />
                      </button>
                    </div>
                    <button
                      className="bg-[#14b8a6] hover:bg-[#15c3b0] text-white px-6 py-2.5 rounded-[8px] font-bold text-[13px] uppercase tracking-wide transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed outline-none border-0 cursor-pointer"
                      onClick={handlePost}
                      disabled={!newPostText.trim()}
                    >
                      Đăng bài
                    </button>
                  </div>
                </div>

                {posts.length === 0 && !loading && (
                  <div className="text-center py-10 text-gray-500 text-sm">Chưa có ghi chú kèo nào. Tạo kèo mới để xuất hiện trên bảng tin.</div>
                )}
                {/* Feed Posts */}
                {posts.map(post => {
                  const isLiked = likedPosts.has(post.id)
                  return (
                    <div key={post.id} className={modernCardClass}>
                      <div className="flex gap-3.5 items-center mb-4">
                        <img src={post.avatar} alt={post.user} className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900 text-[15px] m-0 leading-tight">{post.user}</p>
                          <p className="text-xs text-gray-500 mt-1 m-0 flex items-center gap-2">
                            {post.time} 
                            <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{post.sport}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-5 text-[14.5px] leading-relaxed m-0">{post.content}</p>

                      <div className="flex gap-3 border-t border-gray-100 pt-4">
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[13px] transition-colors border cursor-pointer outline-none ${
                            isLiked 
                              ? 'border-red-200 bg-red-50 text-red-500' 
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          onClick={() => toggleLike(post.id)}
                        >
                          {isLiked ? '❤️' : '🤍'} {post.likes + (isLiked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[13px] border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer outline-none">
                          💬 {post.comments}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {/* ================= EVENTS TAB ================= */}
            {activeTab === 'Sự kiện' && (
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
                {events.length === 0 && !loading && (
                  <div className="col-span-2 text-center py-10 text-gray-500 text-sm">Hiện chưa có kèo mở.</div>
                )}
                {events.map(ev => (
                  <div key={ev.id} className="bg-white rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col">
                    <div className="relative w-full h-40 border-b border-gray-100 overflow-hidden">
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-teal-700 px-3 py-1 rounded-full text-xs font-bold">{ev.sport}</span>
                      <span className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 font-medium">
                        <Calendar size={12} /> {ev.date}
                      </span>
                      <img src={ev.img} alt={ev.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-3.5 m-0">{ev.name}</h3>
                      <div className="flex flex-col gap-2 mb-6 text-[13px] text-gray-600 flex-1">
                        <span className="flex items-center gap-2"><Users size={16} className="text-gray-400" /> {ev.participants}/{ev.maxParticipants} người tham gia</span>
                        <span className="flex items-center gap-2 font-bold text-amber-600"><Trophy size={16} className="text-amber-500" /> Giải thưởng: {ev.prize}</span>
                      </div>
                      <button className="w-full bg-[#14b8a6] hover:bg-[#15c3b0] text-white py-2.5 rounded-[8px] font-bold text-[13px] uppercase tracking-wide transition-all shadow-sm outline-none border-0 cursor-pointer mt-auto">
                        Đăng ký ngay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ================= GROUPS TAB ================= */}
            {activeTab === 'Hội nhóm' && (
              <div className="text-center py-16 bg-white rounded-[12px] border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-[#14b8a6] mx-auto mb-4">
                  <Users size={32} />
                </div>
                <p className="text-gray-500 font-medium">Hội nhóm đang phát triển — tham gia kèo mở để kết nối người chơi.</p>
              </div>
            )}

            {activeTab === 'Thử thách' && (
              <div className="text-center py-16 bg-white rounded-[12px] border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4">
                  <Trophy size={32} />
                </div>
                <p className="text-gray-500 font-medium">Thử thách sẽ dựa trên lịch sử kèo và bảng xếp hạng — sắp ra mắt.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="w-[320px] max-lg:w-full shrink-0 flex flex-col gap-6 sticky top-[100px]">

          {/* Trending Topics */}
          <div className={modernCardClass}>
            <h3 className="text-[14px] uppercase text-gray-900 font-bold mb-4 flex items-center gap-2 m-0">
               <Flame size={18} className="text-[#14b8a6]" /> Chủ đề thịnh hành
            </h3>
            <div className="flex flex-col gap-4">
              <div className="cursor-pointer group">
                <p className="text-[14px] font-bold text-gray-800 group-hover:text-[#14b8a6] transition-colors m-0">#BadmintonDaNang</p>
                <p className="text-xs font-semibold text-gray-400 mt-1 m-0">124 bài viết</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-[14px] font-bold text-gray-800 group-hover:text-[#14b8a6] transition-colors m-0">#PickleballMienTrung</p>
                <p className="text-xs font-semibold text-gray-400 mt-1 m-0">89 bài viết</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-[14px] font-bold text-gray-800 group-hover:text-[#14b8a6] transition-colors m-0">#TimDongDoi</p>
                <p className="text-xs font-semibold text-gray-400 mt-1 m-0">45 bài viết</p>
              </div>
            </div>
          </div>

          {/* Suggested Friends */}
          <div className={modernCardClass}>
            <h3 className="text-[14px] uppercase text-gray-900 font-bold mb-4 flex items-center gap-2 m-0">
               <Users size={16} className="text-[#14b8a6]" /> Gợi ý kết bạn
            </h3>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 first:pt-0">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80" alt="Jae" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 m-0 truncate">Jae K.</p>
                  <p className="text-xs text-gray-500 m-0 truncate">Cầu lông</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#14b8a6] hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer outline-none">
                  <MessageSquare size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80" alt="Mia" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 m-0 truncate">Mia S.</p>
                  <p className="text-xs text-gray-500 m-0 truncate">Pickleball</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#14b8a6] hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer outline-none">
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </ApexLayout>
  )
}
