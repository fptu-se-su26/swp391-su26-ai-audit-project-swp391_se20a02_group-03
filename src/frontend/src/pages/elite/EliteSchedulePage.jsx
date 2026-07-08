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
  booked: 'bg-ink text-paper hover:ring-2 hover:ring-accent',
  'in-use': 'bg-danger text-paper hover:ring-2 hover:ring-accent',
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
        <div className="mb-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-2">Lịch thời gian thực</h1>
              <p className="text-sm text-foreground-muted">Nhấn slot đã đặt để check-in nhanh hoặc mở POS cho slot trống.</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              min={todayIso()}
              onChange={e => setSelectedDate(e.target.value)}
              className="input-base h-11 w-auto"
            />
          </div>

          <div className="flex justify-between items-center mt-5 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {sportFilters.map(f => (
                <button
                  key={f.key}
                  type="button"
                  className={`label-mono h-[38px] px-[18px] rounded-[2px] border-2 cursor-pointer transition-colors ${
                    sport === f.key ? 'border-ink bg-ink text-paper' : 'border-border-hover text-foreground-muted bg-transparent hover:border-foreground'
                  }`}
                  onClick={() => setSport(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-4 label-mono text-foreground-subtle">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px] bg-surface border-2 border-border-strong"></span> Trống</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px] bg-ink"></span> Đã đặt</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px] bg-danger"></span> Đang sử dụng</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger rounded-[2px]">{error}</div>
        )}

        {selected && (
          <div className="border-2 border-accent bg-surface px-5 py-4 flex flex-wrap items-center justify-between gap-4 rounded-[2px]">
            <div>
              <p className="text-sm font-extrabold text-foreground">{selected.courtName} · {selected.slot.time}</p>
              <p className="text-sm text-foreground-muted mt-0.5">{selected.slot.label || selected.slot.customerName || `Đơn #${selected.slot.bookingId}`}</p>
              {selected.slot.checkInCode && (
                <p className="text-xs text-foreground-subtle mt-1 font-mono">Mã: {selected.slot.checkInCode}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.slot.checkInCode && (
                <>
                  <button
                    type="button"
                    onClick={() => copyCheckInCode(selected.slot.checkInCode)}
                    className="btn-outline h-9 px-3.5 text-xs"
                  >
                    Sao chép mã
                  </button>
                  <Link
                    to={`/elite/scanner?code=${encodeURIComponent(selected.slot.checkInCode)}`}
                    className="btn-primary h-9 px-3.5 text-xs no-underline"
                  >
                    Check-in
                  </Link>
                </>
              )}
              <Link
                to="/elite/bookings"
                className="btn-outline h-9 px-3.5 text-xs no-underline"
              >
                Danh sách đơn
              </Link>
              <button type="button" onClick={() => setSelected(null)} className="label-mono text-foreground-subtle hover:text-foreground px-2">
                Đóng
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <PageLoader label="Đang tải lịch sân..." />
        ) : (
          <div className="border-2 border-border-strong bg-surface overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="flex border-b-2 border-border-strong">
                <div className="w-[130px] shrink-0"></div>
                {timeHeaders.map(time => (
                  <div key={time} className="flex-1 label-mono text-foreground py-3 pl-2.5">{time}</div>
                ))}
              </div>

              <div className="relative bg-background-base">
                <div className="absolute top-0 left-[130px] right-0 bottom-0 flex pointer-events-none z-0">
                  {timeHeaders.map((_, i) => (
                    <div key={i} className="flex-1 border-l border-border-default"></div>
                  ))}
                </div>

                {courts.length === 0 && (
                  <div className="py-12 text-center text-sm text-foreground-subtle">Chưa có sân hoặc lịch trống cho ngày đã chọn.</div>
                )}

                {courts.map((court, idx) => (
                  <div key={court.courtId} className={`flex min-h-[80px] relative z-[1] ${idx < courts.length - 1 ? 'border-b border-border-default' : ''}`}>
                    <div className="w-[130px] shrink-0 bg-surface flex flex-col justify-center px-4 text-sm font-extrabold text-foreground border-r border-border-default">
                      <span>{court.courtName}</span>
                      <span className="label-mono text-foreground-subtle mt-0.5 font-normal">{court.sportType}</span>
                      <Link
                        to={posUrl(court.courtId)}
                        className="mt-2 label-mono text-accent hover:underline no-underline"
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
                          className={`absolute top-0 bottom-0 rounded-[2px] px-3 py-2.5 overflow-hidden flex flex-col justify-center text-left cursor-pointer transition-shadow ${slotStyles[slot.status] || slotStyles.booked} ${selected?.courtId === court.courtId && selected?.slot?.bookingId === slot.bookingId ? 'ring-2 ring-accent' : ''}`}
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
