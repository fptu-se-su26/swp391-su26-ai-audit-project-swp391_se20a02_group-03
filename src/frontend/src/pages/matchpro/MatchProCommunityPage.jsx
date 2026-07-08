import { useState, useEffect } from 'react'
import { Users, Trophy, Swords, Calendar, MapPin, Camera, MessageSquare, Flame } from 'lucide-react'
import MatchProLayout from '../../layouts/MatchProLayout'
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

export default function MatchProCommunityPage() {
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
    <MatchProLayout>
      <div className="flex gap-8 max-lg:flex-col items-start w-full max-w-[1440px] mx-auto px-4 md:px-10 pb-16 pt-8">
        {error && (
          <div className="w-full border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger">{error}</div>
        )}
        {loading && <PageLoader label="Đang tải kèo mở..." />}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col">

          {/* Hero Banner */}
          <div className="bg-ink p-8 md:p-11 mb-7 border-2 border-ink">
            <h1 className="font-heading text-3xl md:text-4xl uppercase text-paper mb-3 flex items-center gap-2">
              <Users size={30} /> Trung tâm cộng đồng
            </h1>
            <p className="text-paper/70 text-sm max-w-lg">Kết nối, chia sẻ kinh nghiệm và tranh tài cùng cộng đồng đam mê thể thao quanh bạn.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b-2 border-border-strong mb-7 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`px-6 py-3.5 font-extrabold text-[13px] uppercase tracking-[0.03em] transition-colors whitespace-nowrap border-b-[3px] -mb-[2px] ${
                  activeTab === tab ? 'border-ink text-foreground' : 'border-transparent text-foreground-subtle hover:text-foreground'
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
                <div className="card-base">
                  <textarea
                    placeholder="Bạn có muốn chia sẻ trận đấu hôm nay hoặc tìm đồng đội không?"
                    className="input-base !h-auto resize-y p-3.5 mb-3.5"
                    rows="2"
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button className="w-10 h-10 flex items-center justify-center bg-background-base border border-border-default rounded-[2px] text-foreground-muted hover:text-foreground transition-colors"><Camera size={18} /></button>
                      <button className="w-10 h-10 flex items-center justify-center bg-background-base border border-border-default rounded-[2px] text-foreground-muted hover:text-foreground transition-colors"><MapPin size={18} /></button>
                    </div>
                    <button
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePost}
                      disabled={!newPostText.trim()}
                    >
                      Đăng bài
                    </button>
                  </div>
                </div>

                {posts.length === 0 && !loading && (
                  <div className="text-center py-10 text-foreground-muted text-sm">Chưa có ghi chú kèo nào. Tạo kèo mới để xuất hiện trên bảng tin.</div>
                )}
                {/* Feed Posts */}
                {posts.map(post => {
                  const isLiked = likedPosts.has(post.id)
                  return (
                    <div key={post.id} className="card-base !pl-7 relative">
                      {/* Sport accent line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-ink"></div>

                      <div className="flex gap-3.5 items-center mb-3.5">
                        <img src={post.avatar} alt={post.user} className="w-11 h-11 rounded-full object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-foreground text-sm leading-tight">{post.user}</p>
                          <p className="text-xs text-foreground-muted mt-0.5">
                            {post.time} · <span className="label-mono border border-border-strong px-1.5 py-0.5 ml-1">{post.sport}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-foreground mb-4 text-[13.5px] leading-relaxed">{post.content}</p>

                      <div className="flex gap-2.5 border-t border-border-default pt-3.5">
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-[2px] font-bold text-xs transition-colors border-2 ${isLiked ? 'border-danger text-danger' : 'border-border-default text-foreground-muted hover:border-foreground hover:text-foreground'}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          {isLiked ? '❤️' : '🤍'} {post.likes + (isLiked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-[2px] font-bold text-xs border-2 border-border-default text-foreground-muted hover:border-foreground hover:text-foreground transition-colors">
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
                  <div className="col-span-2 text-center py-10 text-foreground-muted text-sm">Hiện chưa có kèo mở.</div>
                )}
                {events.map(ev => (
                  <div key={ev.id} className="card-base !p-0 overflow-hidden">
                    <div className="relative w-full h-40 border-b-2 border-border-strong overflow-hidden">
                      <span className="absolute top-3 left-3 label-mono bg-paper text-ink px-2.5 py-1.5">{ev.sport}</span>
                      <span className="absolute top-3 right-3 label-mono bg-ink text-paper px-2.5 py-1.5 flex items-center gap-1">
                        <Calendar size={12} /> {ev.date}
                      </span>
                      <img src={ev.img} alt={ev.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-foreground text-base mb-3.5">{ev.name}</h3>
                      <div className="flex flex-col gap-1.5 mb-5 text-[13px] text-foreground-muted">
                        <span className="flex items-center gap-2"><Users size={14} /> {ev.participants}/{ev.maxParticipants} người tham gia</span>
                        <span className="flex items-center gap-2 font-bold text-warning"><Trophy size={14} /> Giải thưởng: {ev.prize}</span>
                      </div>
                      <button className="btn-primary w-full">Đăng ký ngay</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ================= GROUPS TAB ================= */}
            {activeTab === 'Hội nhóm' && (
              <div className="text-center py-16 card-base">
                <p className="text-foreground-muted">Hội nhóm đang phát triển — tham gia kèo mở để kết nối người chơi.</p>
              </div>
            )}

            {activeTab === 'Thử thách' && (
              <div className="text-center py-16 card-base">
                <p className="text-foreground-muted">Thử thách sẽ dựa trên lịch sử kèo và bảng xếp hạng — sắp ra mắt.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="w-[320px] max-lg:w-full shrink-0 flex flex-col gap-5 sticky top-[100px]">

          {/* Trending Topics */}
          <div className="card-base">
            <h3 className="font-heading text-[15px] uppercase text-foreground mb-4 flex items-center gap-2">
               <Flame size={18} /> Chủ đề thịnh hành
            </h3>
            <div className="flex flex-col gap-3.5">
              <div className="cursor-pointer">
                <p className="text-sm font-bold text-foreground">#BadmintonDaNang</p>
                <p className="label-mono text-foreground-subtle mt-1">124 bài viết</p>
              </div>
              <div className="cursor-pointer">
                <p className="text-sm font-bold text-foreground">#PickleballMienTrung</p>
                <p className="label-mono text-foreground-subtle mt-1">89 bài viết</p>
              </div>
              <div className="cursor-pointer">
                <p className="text-sm font-bold text-foreground">#TimDongDoi</p>
                <p className="label-mono text-foreground-subtle mt-1">45 bài viết</p>
              </div>
            </div>
          </div>

          {/* Suggested Friends */}
          <div className="card-base">
            <h3 className="font-heading text-[15px] uppercase text-foreground mb-4 flex items-center gap-2">
               <Users size={16} /> Gợi ý kết bạn
            </h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 py-2 border-b border-border-default last:border-0">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80" alt="Jae" className="w-11 h-11 rounded-full object-cover" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-bold text-foreground">Jae K.</p>
                  <p className="text-xs text-foreground-muted">Cầu lông</p>
                </div>
                <button className="w-8 h-8 rounded-[2px] border border-border-default flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-foreground transition-colors">
                  <MessageSquare size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-border-default last:border-0">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80" alt="Mia" className="w-11 h-11 rounded-full object-cover" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-bold text-foreground">Mia S.</p>
                  <p className="text-xs text-foreground-muted">Pickleball</p>
                </div>
                <button className="w-8 h-8 rounded-[2px] border border-border-default flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-foreground transition-colors">
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </MatchProLayout>
  )
}
