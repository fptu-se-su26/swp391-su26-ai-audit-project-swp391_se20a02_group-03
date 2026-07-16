import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { 
  OwnerPageHeader, 
  OwnerBtn, 
  OwnerCard, 
  OwnerToolbar,
  OwnerStatusBadge,
  OwnerEmptyState,
  OwnerErrorState,
  ownerInputCls
} from '../../components/owner';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Calendar } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'Pending', label: 'Pending' },
  { value: 'PendingPayment', label: 'PendingPayment' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'CheckedIn', label: 'CheckedIn' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export default function OwnerBookingCalendarPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [courtId, setCourtId] = useState('');
  const [status, setStatus] = useState('');

  async function loadCourts() {
    try {
      const res = await ownerApi.getCourts(complexId, { pageNumber: 1, pageSize: 100 });
      if (res.statusCode === 200) setCourts(res.data?.items || []);
    } catch {
      setCourts([]);
    }
  }

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getCalendarBookings({
        complexId,
        dateFrom: date,
        dateTo: date,
        courtId: courtId ? Number(courtId) : undefined,
        status: status || undefined,
      });
      if (res.statusCode === 200) setItems(Array.isArray(res.data) ? res.data : []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải lịch.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (complexId) loadCourts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexId]);

  useEffect(() => {
    if (complexId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexId, date, courtId, status]);

  const byCourt = useMemo(() => {
    const map = {};
    items.forEach(b => {
      const key = b.courtName || `Court ${b.courtId}`;
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    Object.values(map).forEach(list => list.sort((a, b) => String(a.startTime).localeCompare(String(b.startTime))));
    return map;
  }, [items]);

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Lịch đặt sân" 
        description="Xem danh sách đặt sân theo ngày và theo từng sân."
      >
        <OwnerBtn to="/owner/bookings" variant="secondary">
          <span className="flex items-center gap-1"><ChevronLeft size={16} /> Quay lại danh sách</span>
        </OwnerBtn>
        <OwnerBtn
          to={`/owner/bookings/walk-in?date=${date}${courtId ? `&courtId=${courtId}` : ''}`}
          variant="primary"
        >
          + Đặt sân tại quầy
        </OwnerBtn>
      </OwnerPageHeader>

      <OwnerToolbar>
        <div className="flex flex-wrap items-center gap-3 w-full">
          <input 
            type="date" 
            className={ownerInputCls} 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            title="Chọn ngày"
          />
          <select className={ownerInputCls} value={courtId} onChange={e => setCourtId(e.target.value)}>
            <option value="">Tất cả sân</option>
            {courts.map(c => (
              <option key={c.courtId} value={c.courtId}>{c.name}</option>
            ))}
          </select>
          <select className={ownerInputCls} value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </OwnerToolbar>

      {error && <OwnerErrorState message={error} onRetry={load} />}

      {loading && !items.length && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-64 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
          <div className="h-64 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
        </div>
      )}

      {!loading && !error && Object.keys(byCourt).length === 0 && (
        <OwnerEmptyState 
          icon={Calendar} 
          title="Không có booking nào trong ngày này." 
        />
      )}

      {!loading && !error && Object.keys(byCourt).length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(byCourt).map(([courtName, bookings]) => (
            <OwnerCard key={courtName} className="flex flex-col h-full">
              <div className="pb-4 mb-4 border-b border-gray-100">
                <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">{courtName}</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide m-0 mt-1">{bookings.length} Booking</p>
              </div>
              <ul className="space-y-4 m-0 p-0 list-none flex-1 overflow-y-auto">
                {bookings.map(b => (
                  <li key={`${b.bookingId}-${b.startTime}`} className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-4">
                      <Link to={`/owner/bookings/${b.bookingId}`} className="font-mono text-[13px] font-bold text-[#0f172a] hover:text-[#14b8a6] no-underline transition-colors block mb-1">
                        #{b.bookingId}
                      </Link>
                      <p className="text-gray-500 text-xs m-0 truncate">
                        <span className="font-bold text-gray-700">{b.startTime}–{b.endTime}</span>
                        <span className="mx-1.5 text-gray-300">•</span>
                        {b.customerName || 'Khách'}
                      </p>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      <OwnerStatusBadge status={b.status} type="booking" />
                    </div>
                  </li>
                ))}
              </ul>
            </OwnerCard>
          ))}
        </div>
      )}
    </div>
  );
}
