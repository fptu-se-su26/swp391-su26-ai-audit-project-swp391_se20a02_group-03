import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EliteLayout from '../../layouts/EliteLayout'
import { dashboardApi } from '../../api/dashboardApi'
import PageLoader from '../../components/ui/PageLoader'
import { useToast } from '../../components/Toast'

const sportFilters = [
  { key: 'all', label: 'Tất cả môn' },
  { key: 'Badminton', label: 'Cầu lông' },
  { key: 'Pickleball', label: 'Pickleball' },
]

const slotStyles = {
  booked: 'bg-blue-100 border-l-blue-500 text-blue-900 hover:ring-2 hover:ring-blue-300',
  'in-use': 'bg-red-100 border-l-red-500 text-red-900 hover:ring-2 hover:ring-red-300',
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function EliteSchedulePage() {
  const { addToast } = useToast()
  const [sport, setSport] = useState('all')
  const [selectedDate, setSelectedDate] = useState(todayIso)
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        setSelected(null)
        const res = await dashboardApi.getSchedule(selectedDate, sport === 'all' ? undefined : sport)
        if (!active) return
        if (res.statusCode === 200 && res.data) setSchedule(res.data)
        else setError(res.message || 'Không tải được lịch sân.')
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được lịch sân.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [sport, selectedDate])

  const timeHeaders = schedule?.timeHeaders ?? ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
  const courts = schedule?.courts ?? []

  function posUrl(courtId, startTime) {
    const params = new URLSearchParams({ courtId: String(courtId), date: selectedDate })
    if (startTime) params.set('start', startTime)
    return `/elite/pos?${params.toString()}`
  }

  async function copyCheckInCode(code) {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      addToast('Đã sao chép mã check-in', 'success')
    } catch {
      addToast(code, 'info')
    }
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#006070] mb-1">Lịch thời gian thực</h1>
              <p className="text-sm text-slate-500">Nhấn slot đã đặt để check-in nhanh hoặc mở POS cho slot trống.</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              Ngày
              <input
                type="date"
                value={selectedDate}
                min={todayIso()}
                onChange={e => setSelectedDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#00c2ff]"
              />
            </label>
          </div>

          <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {sportFilters.map(f => (
                <button
                  key={f.key}
                  type="button"
                  className={`px-4 py-1.5 rounded-full border bg-white text-[0.8125rem] font-medium cursor-pointer ${sport === f.key ? 'border-[#00c2ff] text-[#00c2ff]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  onClick={() => setSport(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-slate-800"><span className="w-3 h-3 rounded-sm bg-slate-50 border border-slate-300"></span> Trống</span>
              <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-slate-800"><span className="w-3 h-3 rounded-sm bg-blue-100"></span> Đã đặt</span>
              <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-slate-800"><span className="w-3 h-3 rounded-sm bg-red-100"></span> Đang sử dụng</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {selected && (
          <div className="rounded-xl border border-[#00c2ff]/30 bg-cyan-50/60 px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#006070]">{selected.courtName} · {selected.slot.time}</p>
              <p className="text-sm text-slate-600 mt-0.5">{selected.slot.label || selected.slot.customerName || `Đơn #${selected.slot.bookingId}`}</p>
              {selected.slot.checkInCode && (
                <p className="text-xs text-slate-500 mt-1 font-mono">Mã: {selected.slot.checkInCode}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.slot.checkInCode && (
                <>
                  <button
                    type="button"
                    onClick={() => copyCheckInCode(selected.slot.checkInCode)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50"
                  >
                    Sao chép mã
                  </button>
                  <Link
                    to={`/elite/scanner?code=${encodeURIComponent(selected.slot.checkInCode)}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 no-underline"
                  >
                    Check-in
                  </Link>
                </>
              )}
              <Link
                to="/elite/bookings"
                className="px-3 py-1.5 rounded-lg border border-[#00c2ff] text-[#006070] text-sm font-semibold hover:bg-white no-underline"
              >
                Danh sách đơn
              </Link>
              <button type="button" onClick={() => setSelected(null)} className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800">
                Đóng
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <PageLoader label="Đang tải lịch sân..." />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="flex border-b border-slate-200 py-4">
                <div className="w-[120px] shrink-0"></div>
                {timeHeaders.map(time => (
                  <div key={time} className="flex-1 text-left text-[0.8125rem] font-semibold text-slate-500 pl-2.5">{time}</div>
                ))}
              </div>

              <div className="relative bg-slate-50">
                <div className="absolute top-0 left-[120px] right-0 bottom-0 flex pointer-events-none z-0">
                  {timeHeaders.map((_, i) => (
                    <div key={i} className="flex-1 border-l border-dashed border-slate-200"></div>
                  ))}
                </div>

                {courts.length === 0 && (
                  <div className="py-12 text-center text-sm text-slate-500">Chưa có sân hoặc lịch trống cho ngày đã chọn.</div>
                )}

                {courts.map((court, idx) => (
                  <div key={court.courtId} className={`flex min-h-[80px] relative z-[1] ${idx < courts.length - 1 ? 'border-b border-slate-200' : ''}`}>
                    <div className="w-[120px] shrink-0 bg-white flex flex-col justify-center px-4 text-sm font-bold text-slate-800 border-r border-slate-200">
                      <span>{court.courtName}</span>
                      <span className="text-[0.7rem] font-medium text-slate-400 mt-0.5">{court.sportType}</span>
                      <Link
                        to={posUrl(court.courtId)}
                        className="mt-2 text-[0.65rem] font-semibold text-[#00c2ff] hover:underline no-underline"
                      >
                        + Khách lẻ
                      </Link>
                    </div>
                    <div className="flex-1 relative my-2.5 min-h-[56px]">
                      {(court.slots ?? []).map((slot, i) => (
                        <button
                          key={`${court.courtId}-${i}`}
                          type="button"
                          onClick={() => setSelected({ courtId: court.courtId, courtName: court.courtName, slot })}
                          className={`absolute top-0 bottom-0 border-l-4 rounded-md px-3 py-2.5 overflow-hidden flex flex-col justify-center text-left cursor-pointer transition-shadow ${slotStyles[slot.status] || slotStyles.booked} ${selected?.courtId === court.courtId && selected?.slot?.bookingId === slot.bookingId ? 'ring-2 ring-[#00c2ff]' : ''}`}
                          style={{ left: `${slot.startPercent}%`, width: `${slot.widthPercent}%` }}
                        >
                          <p className="text-[0.8125rem] font-bold whitespace-nowrap text-ellipsis overflow-hidden">{slot.label}</p>
                          <p className="text-[0.75rem] opacity-80 mt-1">{slot.time}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </EliteLayout>
  )
}
