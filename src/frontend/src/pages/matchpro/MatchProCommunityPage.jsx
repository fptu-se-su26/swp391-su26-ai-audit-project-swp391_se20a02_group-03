import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Users, Trophy, Swords, Calendar, MapPin, Camera, Sparkles, MessageSquare, Flame } from 'lucide-react'
import MatchProLayout from '../../layouts/MatchProLayout'
import { useToast } from '../../components/Toast'
import { matchApi } from '../../api/matchApi'
import PageLoader from '../../components/ui/PageLoader'

const sportColors = { Badminton: '#5E6AD2', Pickleball: '#6366f1', 'Cầu lông': '#5E6AD2', Multi: '#8b5cf6', Any: '#f59e0b' }

function sportLabel(sportType) {
  if (!sportType) return 'Thể thao'
  return sportType.toLowerCase().includes('pickle') ? 'Pickleball' : 'Cầu lông'
}

function formatMatchTime(m) {
  const d = new Date(m.matchDate).toLocaleDateString('vi-VN')
  const start = String(m.startTime || '').slice(0, 5)
  return `${d} · ${start}`
}

export default function MatchProCommunityPage() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('Bảng tin')
  const [openMatches, setOpenMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [newPostText, setNewPostText] = useState('')
  const pageRef = useRef(null)

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
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.hostName || 'Host')}&background=5E6AD2&color=fff`,
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
      <div className="flex gap-6 max-lg:flex-col items-start w-full max-w-[1400px] mx-auto pb-12" ref={pageRef}>
        {error && (
          <div className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        )}
        {loading && <PageLoader label="Đang tải kèo mở..." />}
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col">
          
          {/* Hero Banner */}
          <div className="mp-comm-hero bg-gradient-to-br from-[#5E6AD2]/20 to-[#020203] p-8 md:p-10 rounded-[2rem] mb-8 text-[var(--theme-primary)] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
               <h1 className="font-['Oswald'] text-3xl md:text-4xl font-bold mb-3 tracking-wide"><Users size={32} className="inline mr-2 text-[#5E6AD2]" /> Trung tâm cộng đồng</h1>
               <p className="text-[var(--theme-primary)]/80 text-base md:text-lg max-w-lg">Kết nối, chia sẻ kinh nghiệm và tranh tài cùng cộng đồng đam mê thể thao quanh bạn.</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 card-base/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 right-10 w-40 h-40 bg-[#5E6AD2]/20 rounded-full blur-2xl translate-y-1/2"></div>
            <div className="absolute -bottom-10 -right-10 text-9xl opacity-5"><Swords size={120} className="text-[var(--theme-primary)]/5" /></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border-default pb-0 mb-8 overflow-x-auto scrollbar-hide fade-up">
            {['Bảng tin', 'Sự kiện', 'Hội nhóm', 'Thử thách'].map(tab => (
              <button
                key={tab}
                className={`px-6 py-3.5 font-bold text-[0.95rem] transition-all whitespace-nowrap border-b-[3px] ${activeTab === tab ? 'border-[#5E6AD2] text-[var(--theme-primary)]' : 'border-transparent text-foreground-muted hover:text-[var(--theme-primary)] hover:bg-[var(--theme-surface)] rounded-t-xl'}`}
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
                <div className="fade-up card-base p-5 md:p-6 rounded-[2rem] border border-border-default shadow-[0_0_15px_rgba(0,0,0,0.3)] mb-2">
                  <div className="flex gap-4 items-start">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" alt="You" className="w-12 h-12 rounded-full object-cover shadow-[0_0_15px_rgba(0,0,0,0.3)] shrink-0 border border-border-default" />
                    <div className="flex-1">
                      <textarea 
                        placeholder="Bạn có muốn chia sẻ trận đấu hôm nay hoặc tìm đồng đội không?" 
                        className="w-full bg-background-elevated rounded-2xl p-4 outline-none resize-none text-[0.95rem] text-[var(--theme-primary)] border border-border-default focus:border-[#5E6AD2] focus:card-base transition-all placeholder:text-foreground-muted focus:ring-4 focus:ring-[#5E6AD2]/10" 
                        rows="2"
                        value={newPostText}
                        onChange={e => setNewPostText(e.target.value)}
                      ></textarea>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <button className="w-10 h-10 flex items-center justify-center bg-[var(--theme-surface)] text-xl rounded-xl hover:bg-[#5E6AD2]/10 transition-colors cursor-pointer border border-border-default"><Camera size={20} className="text-foreground-muted" /></button>
                          <button className="w-10 h-10 flex items-center justify-center bg-[var(--theme-surface)] text-xl rounded-xl hover:bg-[#5E6AD2]/10 transition-colors cursor-pointer border border-border-default"><MapPin size={20} className="text-foreground-muted" /></button>
                        </div>
                        <button 
                          className="bg-[var(--theme-primary)] hover:bg-[#5E6AD2] text-[var(--theme-primary)] px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5" 
                          onClick={handlePost} 
                          disabled={!newPostText.trim()}
                        >
                          Đăng bài
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {posts.length === 0 && !loading && (
                  <div className="text-center py-10 text-foreground-muted text-sm">Chưa có ghi chú kèo nào. Tạo kèo mới để xuất hiện trên bảng tin.</div>
                )}
                {/* Feed Posts */}
                {posts.map(post => {
                  const isLiked = likedPosts.has(post.id)
                  const sportColor = sportColors[post.sport] || '#5E6AD2'
                  return (
                    <div key={post.id} className="fade-up card-base p-6 rounded-[2rem] border border-border-default shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-md transition-shadow relative overflow-hidden">
                      {/* Sport accent line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: sportColor }}></div>
                      
                      <div className="flex gap-4 items-center mb-4 pl-2">
                        <img src={post.avatar} alt={post.user} className="w-12 h-12 rounded-full object-cover shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-border-default" />
                        <div>
                          <p className="font-bold text-[var(--theme-primary)] leading-tight">{post.user}</p>
                          <p className="text-xs text-foreground-muted mt-0.5">{post.time} • <span className="font-bold px-1.5 py-0.5 rounded-md ml-1" style={{color: sportColor, backgroundColor: `${sportColor}15`}}>{post.sport}</span></p>
                        </div>
                      </div>
                      
                      <p className="text-[var(--theme-primary)] mb-5 text-[0.95rem] leading-relaxed pl-2">{post.content}</p>
                      
                      <div className="flex gap-3 border-t border-border-default pt-4 pl-2">
                        <button 
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-[var(--theme-surface)] text-foreground-muted hover:bg-[var(--theme-surface-hover)]'}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          {isLiked ? '❤️' : '🤍'} {post.likes + (isLiked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-[var(--theme-surface)] text-foreground-muted hover:bg-[var(--theme-surface-hover)] transition-colors">
                          💬 {post.comments}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-[var(--theme-surface)] text-foreground-muted hover:bg-[var(--theme-surface-hover)] transition-colors ml-auto">
                          ↗️ Chia sẻ
                        </button>
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {/* ================= EVENTS TAB ================= */}
            {activeTab === 'Sự kiện' && (
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
                {events.length === 0 && !loading && (
                  <div className="col-span-2 text-center py-10 text-foreground-muted text-sm">Hiện chưa có kèo mở.</div>
                )}
                {events.map(ev => (
                  <div key={ev.id} className="fade-up card-base rounded-3xl overflow-hidden border border-border-default shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-xl hover:-translate-y-1.5 transition-all group">
                    <div className="relative w-full h-48 overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 card-base/95 backdrop-blur text-[var(--theme-primary)] text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)]" style={{color: sportColors[ev.sport]}}>
                        {ev.sport}
                      </div>
                      <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur text-[var(--theme-primary)] text-xs font-bold px-3 py-1.5 rounded-lg border border-border-hover">
                        <Calendar size={14} className="inline mr-1" /> {ev.date}
                      </div>
                      <img src={ev.img} alt={ev.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-[var(--theme-primary)] text-lg mb-4 leading-tight group-hover:text-[#5E6AD2] transition-colors">{ev.name}</h3>
                      <div className="flex flex-col gap-2 mb-6">
                        <span className="text-sm text-foreground-muted flex items-center gap-2"><Users size={14} className="inline mr-1" /> {ev.participants}/{ev.maxParticipants} người tham gia</span>
                        <span className="text-sm font-bold text-amber-500 flex items-center gap-2"><Trophy size={14} className="inline mr-1 text-yellow-500" /> Giải thưởng: {ev.prize}</span>
                      </div>
                      <button className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary)] font-bold text-sm py-3 rounded-xl hover:bg-[#5E6AD2] transition-colors shadow-md">Đăng ký ngay</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ================= GROUPS TAB ================= */}
            {activeTab === 'Hội nhóm' && (
              <div className="text-center py-16 card-base rounded-3xl border border-border-default">
                <p className="text-foreground-muted">Hội nhóm đang phát triển — tham gia kèo mở để kết nối người chơi.</p>
              </div>
            )}

            {activeTab === 'Thử thách' && (
              <div className="text-center py-16 card-base rounded-3xl border border-border-default">
                <p className="text-foreground-muted">Thử thách sẽ dựa trên lịch sử kèo và bảng xếp hạng — sắp ra mắt.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="w-[320px] max-lg:w-full shrink-0 flex flex-col gap-6 sticky top-[100px]">
          
          {/* Trending Topics */}
          <div className="fade-up card-base rounded-3xl border border-border-default p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <h3 className="text-base font-bold text-[var(--theme-primary)] mb-5 flex items-center gap-2">
               <Flame size={20} className="inline mr-2 text-orange-500" /> Chủ đề thịnh hành
            </h3>
            <div className="flex flex-col gap-4">
              <div className="group cursor-pointer">
                <p className="text-[0.95rem] font-bold text-[var(--theme-primary)] group-hover:text-[#5E6AD2] transition-colors">#BadmintonDaNang</p>
                <p className="text-xs text-foreground-muted mt-1">124 bài viết</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[0.95rem] font-bold text-[var(--theme-primary)] group-hover:text-[#5E6AD2] transition-colors">#PickleballMienTrung</p>
                <p className="text-xs text-foreground-muted mt-1">89 bài viết</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[0.95rem] font-bold text-[var(--theme-primary)] group-hover:text-[#5E6AD2] transition-colors">#TimDongDoi</p>
                <p className="text-xs text-foreground-muted mt-1">45 bài viết</p>
              </div>
            </div>
            <button className="w-full mt-6 text-sm font-bold text-[#5E6AD2] hover:text-[#6872D9] transition-colors text-left">Hiển thị thêm...</button>
          </div>

          {/* Suggested Friends */}
          <div className="fade-up card-base rounded-3xl border border-border-default p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <h3 className="text-base font-bold text-[var(--theme-primary)] mb-5 flex items-center gap-2">
               <Users size={14} className="inline mr-1" /> Gợi ý kết bạn
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80" alt="Jae" className="w-11 h-11 rounded-full object-cover shadow-[0_0_15px_rgba(0,0,0,0.3)] group-hover:ring-2 ring-[#5E6AD2] transition-all" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-bold text-[var(--theme-primary)] group-hover:text-[#5E6AD2] transition-colors">Jae K.</p>
                  <p className="text-[0.7rem] font-medium text-foreground-muted">Cầu lông</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-[var(--theme-surface)] flex items-center justify-center text-foreground-muted hover:bg-[#5E6AD2] hover:text-[var(--theme-primary)] transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                  <MessageSquare size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80" alt="Mia" className="w-11 h-11 rounded-full object-cover shadow-[0_0_15px_rgba(0,0,0,0.3)] group-hover:ring-2 ring-[#5E6AD2] transition-all" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-bold text-[var(--theme-primary)] group-hover:text-[#5E6AD2] transition-colors">Mia S.</p>
                  <p className="text-[0.7rem] font-medium text-foreground-muted">Pickleball</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-[var(--theme-surface)] flex items-center justify-center text-foreground-muted hover:bg-[#5E6AD2] hover:text-[var(--theme-primary)] transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
      
      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeUpAnim {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUpAnim 0.5s ease-out forwards;
        }
        .mp-comm-hero {
          animation: fadeInDown 0.6s ease-out forwards;
        }
      `}} />
    </MatchProLayout>
  )
}
