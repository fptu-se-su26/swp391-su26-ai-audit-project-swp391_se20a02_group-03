import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import StatusBadge from '../../components/ui/StatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

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
  }, [complexId]);

  useEffect(() => {
    if (complexId) load();
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

  if (loading && !items.length) return <PageLoader label="Đang tải lịch..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-5 items-end">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Lịch đặt sân</h1>
          <p className="text-sm text-foreground-muted">Xem booking theo ngày và từng sân.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/owner/bookings/walk-in?date=${date}${courtId ? `&courtId=${courtId}` : ''}`}
            className="btn-primary no-underline"
          >
            + Walk-in
          </Link>
          <Link to="/owner/bookings" className="btn-outline no-underline">
            ← Danh sách
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <input type="date" className="input-base w-auto" value={date} onChange={e => setDate(e.target.value)} />
        <select className="input-base w-auto" value={courtId} onChange={e => setCourtId(e.target.value)}>
          <option value="">Tất cả sân</option>
          {courts.map(c => (
            <option key={c.courtId} value={c.courtId}>{c.name}</option>
          ))}
        </select>
        <select className="input-base w-auto" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      {Object.keys(byCourt).length === 0 ? (
        <EmptyState title="Không có booking" subtitle="Không có booking trong ngày này." />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {Object.entries(byCourt).map(([courtName, bookings]) => (
            <div key={courtName} className="border-2 border-border-strong bg-surface p-6">
              <h3 className="font-heading text-base uppercase tracking-tight text-foreground mb-4">{courtName}</h3>
              <ul className="space-y-3 text-sm">
                {bookings.map(b => (
                  <li key={`${b.bookingId}-${b.startTime}`} className="flex justify-between items-center border-b border-border-default pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <Link to={`/owner/bookings/${b.bookingId}`} className="text-foreground font-extrabold underline underline-offset-2">
                        #{b.bookingId}
                      </Link>
                      <p className="text-foreground-muted text-xs mt-1">{b.startTime}–{b.endTime} · {b.customerName || 'Khách'}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
