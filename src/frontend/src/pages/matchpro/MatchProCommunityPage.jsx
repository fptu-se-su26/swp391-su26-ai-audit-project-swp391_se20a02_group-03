import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Users, Trophy, Swords, Heart, MessageCircle, Share2, Calendar, MapPin, Camera, Sparkles, MessageSquare, Flame } from 'lucide-react'
import MatchProLayout from '../../layouts/MatchProLayout'

const posts = [
  { id: 1, user: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', time: '2 min ago', content: 'Vừa lập kỷ lục cá nhân mới tại Pro-Sport Badminton Center! 🏸 Ai muốn đánh đôi cuối tuần này không?', likes: 24, comments: 8, sport: 'Badminton' },
  { id: 2, user: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', time: '15 min ago', content: 'Buổi Pickleball hôm nay tuyệt vời quá! Đang tìm partner level advanced cho tối thứ 5. Inbox mình nhé!', likes: 18, comments: 5, sport: 'Pickleball' },
  { id: 3, user: 'Alex M.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', time: '1 hr ago', content: 'Sân cầu lông mới ở Đà Nẵng (Hòa Xuân Complex) quá xịn! Mặt sàn BWF, đèn LED 800 lux. Rất recommend!', likes: 42, comments: 14, sport: 'Badminton' },
]

const events = [
  { id: 1, name: 'Pro-Sport Badminton Open', date: 'Jun 15', sport: 'Badminton', participants: 48, maxParticipants: 64, prize: '5.000.000đ', img: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=400&q=80' },
  { id: 2, name: 'Summer Pickleball League', date: 'Jun 20', sport: 'Pickleball', participants: 32, maxParticipants: 32, prize: 'Trophy + Gear', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80' },
  { id: 3, name: 'Cầu lông Đôi Hè 2026', date: 'Jul 4', sport: 'Badminton', participants: 24, maxParticipants: 48, prize: '10.000.000đ', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80' },
]

const groups = [
  { id: 1, name: 'Cầu lông Trung cấp ĐN', members: 234, sport: 'Badminton', icon: <Swords size={24} />, joined: false },
  { id: 2, name: 'Pickleball Warriors ĐN', members: 189, sport: 'Pickleball', icon: <Swords size={24} className="text-green-400" />, joined: true },
  { id: 3, name: 'Badminton Masters VN', members: 456, sport: 'Badminton', icon: <Swords size={24} />, joined: false },
  { id: 4, name: 'Đà Nẵng Pickleball Club', members: 312, sport: 'Pickleball', icon: <Swords size={24} className="text-green-400" />, joined: false },
]

const challenges = [
  { id: 1, title: 'Đánh 10 trận trong tháng', sport: 'Any', progress: 7, total: 10, reward: '500 pts', icon: <Trophy size={24} className="text-yellow-400" />, color: 'from-amber-400 to-amber-600' },
  { id: 2, title: 'Thắng 5 trận liên tiếp', sport: 'Badminton', progress: 3, total: 5, reward: 'Badge', icon: <Sparkles size={24} className="text-blue-400" />, color: 'from-[#5E6AD2] to-[#6872D9]' },
  { id: 3, title: 'Chơi cả 2 môn thể thao', sport: 'Multi', progress: 1, total: 2, reward: '300 pts', icon: <Sparkles size={24} className="text-purple-400" />, color: 'from-blue-500 to-indigo-600' },
]

const sportColors = { Badminton: '#5E6AD2', Pickleball: '#6366f1', Multi: '#8b5cf6', Any: '#f59e0b' }

export default function MatchProCommunityPage() {
  const [activeTab, setActiveTab] = useState('Feed')
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [joinedGroups, setJoinedGroups] = useState(new Set(groups.filter(g => g.joined).map(g => g.id)))
  const [newPostText, setNewPostText] = useState('')
  const pageRef = useRef(null)

  function toggleLike(id) {
    const newLikes = new Set(likedPosts)
    if (newLikes.has(id)) newLikes.delete(id)
    else newLikes.add(id)
    setLikedPosts(newLikes)
  }

  function toggleGroup(id) {
    const newJoined = new Set(joinedGroups)
    if (newJoined.has(id)) newJoined.delete(id)
    else newJoined.add(id)
    setJoinedGroups(newJoined)
  }

  function handlePost() {
    if (newPostText.trim()) {
      alert("Post created successfully!")
      setNewPostText('')
    }
  }

  return (
    <MatchProLayout>
      <div className="flex gap-6 max-lg:flex-col items-start w-full max-w-[1400px] mx-auto pb-12" ref={pageRef}>
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col">
          
          {/* Hero Banner */}
          <div className="mp-comm-hero bg-gradient-to-br from-[#5E6AD2]/20 to-[#020203] p-8 md:p-10 rounded-[2rem] mb-8 text-[var(--theme-primary)] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
               <h1 className="font-['Oswald'] text-3xl md:text-4xl font-bold mb-3 tracking-wide"><Users size={32} className="inline mr-2 text-[#5E6AD2]" /> Community Hub</h1>
               <p className="text-[var(--theme-primary)]/80 text-base md:text-lg max-w-lg">Kết nối, chia sẻ kinh nghiệm và tranh tài cùng cộng đồng đam mê thể thao quanh bạn.</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 card-base/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 right-10 w-40 h-40 bg-[#5E6AD2]/20 rounded-full blur-2xl translate-y-1/2"></div>
            <div className="absolute -bottom-10 -right-10 text-9xl opacity-5"><Swords size={120} className="text-[var(--theme-primary)]/5" /></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border-default pb-0 mb-8 overflow-x-auto scrollbar-hide fade-up">
            {['Feed', 'Events', 'Groups', 'Challenges'].map(tab => (
              <button 
                key={tab} 
                className={`px-6 py-3.5 font-bold text-[0.95rem] transition-all whitespace-nowrap border-b-[3px] ${activeTab === tab ? 'border-[#5E6AD2] text-[var(--theme-primary)]' : 'border-transparent text-foreground-muted hover:text-[var(--theme-primary)] hover:bg-[var(--theme-surface)] rounded-t-xl'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'Feed' ? 'Tin tức' : tab === 'Events' ? 'Sự kiện' : tab === 'Groups' ? 'Hội nhóm' : 'Thử thách'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {/* ================= FEED TAB ================= */}
            {activeTab === 'Feed' && (
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
            {activeTab === 'Events' && (
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
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
            {activeTab === 'Groups' && (
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
                {groups.map(group => {
                  const isJoined = joinedGroups.has(group.id)
                  return (
                    <div key={group.id} className="fade-up card-base rounded-3xl p-6 border border-border-default shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-md transition-all flex flex-col">
                      <div className="flex gap-4 items-start mb-5">
                        <div className="w-14 h-14 bg-[var(--theme-surface)] rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-border-default shrink-0">
                          {group.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-[var(--theme-primary)] text-lg leading-tight mb-1">{group.name}</h3>
                          <p className="text-xs font-semibold px-2 py-1 bg-[var(--theme-surface-hover)] rounded-md text-foreground-muted inline-block">{group.sport} • {group.members} thành viên</p>
                        </div>
                      </div>
                      <button 
                        className={`w-full mt-auto py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)] ${isJoined ? 'card-base border-2 border-border-default text-foreground-muted hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/20' : 'bg-[#5E6AD2] text-white border-2 border-[#5E6AD2] hover:bg-[#6872D9] hover:border-[#6872D9]'}`}
                        onClick={() => toggleGroup(group.id)}
                      >
                        {isJoined ? 'Đã tham gia (Rời nhóm)' : 'Tham gia nhóm'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ================= CHALLENGES TAB ================= */}
            {activeTab === 'Challenges' && (
              <div className="flex flex-col gap-4">
                {challenges.map(ch => {
                  const percent = Math.min(100, Math.round((ch.progress / ch.total) * 100))
                  return (
                    <div key={ch.id} className="fade-up card-base rounded-3xl p-6 border border-border-default shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-md transition-all flex gap-5 items-center max-sm:flex-col max-sm:text-center">
                      <div className="w-16 h-16 bg-[var(--theme-surface)] rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-border-default shrink-0">
                        {ch.icon}
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-1 max-sm:flex-col max-sm:items-center">
                          <h3 className="font-bold text-[var(--theme-primary)] text-[1.05rem]">{ch.title}</h3>
                          <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/20 text-amber-600 rounded-lg border border-amber-500/20 max-sm:mt-2">{ch.reward}</span>
                        </div>
                        <p className="text-xs text-foreground-muted mb-3 font-semibold">{ch.sport} Challenge</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-3 bg-[var(--theme-surface-hover)] rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${ch.color} transition-all duration-1000 ease-out`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-[var(--theme-primary)] min-w-[45px] text-right">{ch.progress} / {ch.total}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
                  <p className="text-[0.7rem] font-medium text-foreground-muted">Badminton</p>
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
