import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import ApexLayout from '../../layouts/ApexLayout'
import { matchApi } from '../../api/matchApi'
import authApi from '../../api/authApi'
import dayjs from 'dayjs'
import './ApexMatchesPage.css'

// History data is now fetched from the server.

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Pro']
const sports = ['All Sports', 'Badminton', 'Pickleball']

export default function ApexMatchesPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('find')
  const [levelFilter, setLevelFilter] = useState('All Levels')
  const [sportFilter, setSportFilter] = useState('All Sports')
  const [joined, setJoined] = useState([])
  const [openMatches, setOpenMatches] = useState([])
  const [historyMatches, setHistoryMatches] = useState([])
  const [userId, setUserId] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    async function initData() {
      try {
        const [profileRes, matchesRes, historyRes] = await Promise.all([
          authApi.getProfile(),
          matchApi.getOpenMatches(),
          matchApi.getMyMatchHistory()
        ])
        
        // BUG-24 FIX: axiosClient returns response.data (the envelope), so profileRes IS the envelope
        // envelope = { statusCode, data: { userId, ... }, message }
        if (profileRes?.data) {
          setUserId(profileRes.data.userId)
        }
        
        // BUG-24 FIX: matchesRes IS the envelope, matchesRes.data is the payload
        if (matchesRes?.data) {
          const matchList = Array.isArray(matchesRes.data) ? matchesRes.data : []
          const formatted = matchList.map(m => ({
            id: m.matchId,
            sport: m.sportType,
            type: m.isCompetitive ? 'Competitive' : 'Friendly',
            level: m.levelRequirement || m.skillLevel,
            host: m.hostName,
            hostImg: m.hostAvatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.hostName || 'Host'),
            court: m.location || m.notes,
            date: dayjs(m.matchDate || m.startTime).format('ddd, MMM D'),
            time: dayjs(m.matchDate || m.startTime).format('HH:mm'),
            slots: (m.maxParticipants || 0) - (m.currentParticipants || 0),
            maxSlots: m.maxParticipants || 0,
            icon: (m.sportType || '').toLowerCase().includes('pickleball') ? '🏓' : '🏸',
            participants: m.participants || []
          }))
          setOpenMatches(formatted)
          
          // Find matches the user has already joined
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
            sport: m.sportType || 'Sport',
            court: m.location || m.notes || 'No location',
            date: dayjs(m.matchDate || m.startTime).format('ddd, MMM D'),
            time: dayjs(m.matchDate || m.startTime).format('HH:mm'),
            icon: (m.sportType || '').toLowerCase().includes('pickleball') ? '🏓' : '🏸',
            status: m.status,
            participants: m.participants || []
          }))
          
          // Separate upcoming "My Matches" and past "History" matches
          // History matches are those that are Completed, Cancelled, or their date has passed
          const now = dayjs()
          const myMatchesUpcoming = formattedHistory.filter(m => {
            const mDate = dayjs(m.date + ' ' + m.time, 'ddd, MMM D HH:mm')
            return m.status !== 'Cancelled' && m.status !== 'Completed' && (mDate.isValid() ? mDate.isAfter(now) : true)
          })
          
          const myMatchesHistory = formattedHistory.filter(m => {
            const mDate = dayjs(m.date + ' ' + m.time, 'ddd, MMM D HH:mm')
            return m.status === 'Cancelled' || m.status === 'Completed' || (mDate.isValid() ? mDate.isBefore(now) : false)
          })
          
          // Add myMatchesUpcoming to joined/open matches to show in "My Matches" tab
          // To keep it simple, we use the original setJoined logic for upcoming matches,
          // but we populate history tab with myMatchesHistory
          setHistoryMatches(myMatchesHistory)
        }
      } catch (err) {
        console.error("Failed to load matches", err)
      }
    }
    initData()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.match-hero', { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' })
      gsap.from('.match-card', { opacity: 0, y: 40, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 })
    }, pageRef)
    return () => ctx.revert()
  }, [tab])

  const filtered = openMatches.filter(m =>
    (levelFilter === 'All Levels' || m.level === levelFilter) &&
    (sportFilter === 'All Sports' || m.sport === sportFilter)
  )

  async function handleJoin(id) {
    try {
      await matchApi.joinMatch(id)
      setJoined(prev => [...prev, id])
      // BUG-20 FIX: Update slot count in UI immediately after joining
      setOpenMatches(prev => prev.map(m =>
        m.id === id ? { ...m, slots: Math.max(0, m.slots - 1) } : m
      ))
      gsap.from(`#match-join-${id}`, { scale: 0.8, duration: 0.3, ease: 'back.out(1.7)' })
    } catch (err) {
      // BUG-08 FIX: axiosClient rejects with string error message, not error object
      const msg = typeof err === 'string' ? err : 'Failed to join match'
      setToastMsg(msg)
      setTimeout(() => setToastMsg(null), 3000)
    }
  }

  return (
    <ApexLayout title="Matches">
      {/* Toast notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#ef4444', color: '#fff', padding: '12px 20px', borderRadius: 10, zIndex: 9999, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toastMsg}
        </div>
      )}
      <div className="apex-matches" ref={pageRef}>
        {/* Hero */}
        <div className="match-hero">
          <div>
            <h1 className="match-hero__title">Match Center</h1>
            <p className="match-hero__sub">Find open matches, challenge friends, or host your own game.</p>
          </div>
          {/* BUG-09 FIX: Add onClick handler to Host a Match button */}
          <button className="btn-primary match-hero__create" onClick={() => navigate('/matches/create')}>+ Host a Match</button>
        </div>

        {/* Tabs */}
        <div className="match-tabs">
          <button className={`match-tab ${tab === 'find' ? 'active' : ''}`} onClick={() => setTab('find')}>🔍 Find Match</button>
          <button className={`match-tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>📋 My Matches</button>
          <button className={`match-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>📊 History</button>
        </div>

        {/* Find Match */}
        {tab === 'find' && (
          <div>
            <div className="match-filters">
              <select className="match-filter-select" value={sportFilter} onChange={e => setSportFilter(e.target.value)} id="sport-filter">
                {sports.map(s => <option key={s}>{s}</option>)}
              </select>
              <select className="match-filter-select" value={levelFilter} onChange={e => setLevelFilter(e.target.value)} id="level-filter">
                {levels.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div className="matches-list">
              {filtered.map(m => (
                <div key={m.id} className="match-card">
                  <div className="match-card__sport">{m.icon}</div>
                  <div className="match-card__info">
                    <div className="match-card__top">
                      <span className="match-card__name">{m.sport} — {m.type}</span>
                      <span className={`match-level match-level--${m.level?.toLowerCase() || 'intermediate'}`}>{m.level || 'Intermediate'}</span>
                    </div>
                    <div className="match-card__meta">
                      <span>📅 {m.date} at {m.time}</span>
                      <span>📍 {m.court}</span>
                    </div>
                    <div className="match-card__host">
                      <img src={m.hostImg} alt={m.host} className="match-host__avatar" />
                      <span>Hosted by <strong>{m.host}</strong></span>
                    </div>
                  </div>
                  <div className="match-card__right">
                    <div className="match-slots">
                      <span className="match-slots__num">{m.slots}/{m.maxSlots}</span>
                      <span className="match-slots__label">slots left</span>
                    </div>
                    <button
                      id={`match-join-${m.id}`}
                      className={`btn-primary match-join-btn ${joined.includes(m.id) ? 'joined' : ''}`}
                      onClick={() => !joined.includes(m.id) && handleJoin(m.id)}
                    >
                      {joined.includes(m.id) ? '✓ Joined' : 'Join Match'}
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="match-empty">
                  <span>🏃</span>
                  <p>No matches found for those filters.</p>
                  <button className="btn-primary" onClick={() => { setSportFilter('All Sports'); setLevelFilter('All Levels') }}>Reset Filters</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Matches */}
        {tab === 'my' && (
          <div className="my-matches">
            {joined.length === 0 ? (
              <div className="match-empty">
                <span>🏸</span>
                <p>You haven't joined any matches yet.</p>
                <button className="btn-primary" onClick={() => setTab('find')}>Find a Match</button>
              </div>
            ) : (
              <div className="matches-list">
                {openMatches.filter(m => joined.includes(m.id)).map(m => (
                  <div key={m.id} className="match-card">
                    <div className="match-card__sport">{m.icon}</div>
                    <div className="match-card__info">
                      <div className="match-card__top">
                        <span className="match-card__name">{m.sport} — {m.type}</span>
                        <span className="match-level match-level--confirmed">Confirmed</span>
                      </div>
                      <div className="match-card__meta">
                        <span>📅 {m.date} at {m.time}</span>
                        <span>📍 {m.court}</span>
                      </div>
                    </div>
                    <div className="match-card__right">
                      {/* BUG-10 FIX: Add onClick to View Details */}
                      <button className="btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => navigate(`/matches/${m.id}`)}>Xem chi tiết</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div>
            <div className="match-history">
              {historyMatches.map(m => (
                <div key={m.id} className="history-card match-card">
                  <div className="match-card__sport">{m.icon}</div>
                  <div className="match-card__info">
                    <div className="match-card__top">
                      <span className="match-card__name">{m.sport} Match</span>
                      <span className={`match-result ${m.status === 'Completed' ? 'result--won' : 'result--lost'}`}>{m.status || 'Finished'}</span>
                    </div>
                    <div className="match-card__meta">
                      <span>📍 {m.court}</span>
                      <span>🕐 {m.date} at {m.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {historyMatches.length === 0 && (
                <div className="match-empty" style={{ gridColumn: '1 / -1' }}>
                  <span>⏳</span>
                  <p>You have no past match history yet.</p>
                </div>
              )}
            </div>
            <div className="match-stats">
              <div className="stat-card"><span className="stat-card__num">{historyMatches.length}</span><span className="stat-card__label">Total Matches</span></div>
              <div className="stat-card stat-card--won"><span className="stat-card__num">{historyMatches.filter(m => m.status === 'Completed').length}</span><span className="stat-card__label">Completed</span></div>
              <div className="stat-card stat-card--lost"><span className="stat-card__num">{historyMatches.filter(m => m.status === 'Cancelled').length}</span><span className="stat-card__label">Cancelled</span></div>
            </div>
          </div>
        )}
      </div>
    </ApexLayout>
  )
}
