import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

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
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Lịch đặt sân</h2>
          <p className="text-sm text-slate-500">Xem booking theo ngày và từng sân.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/owner/bookings/walk-in?date=${date}${courtId ? `&courtId=${courtId}` : ''}`}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm no-underline hover:bg-emerald-700"
          >
            + Walk-in
          </Link>
          <Link to="/owner/bookings" className="px-3 py-2 rounded-lg border text-sm no-underline text-slate-700 hover:bg-slate-50">
            ← Danh sách
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input type="date" className="rounded-lg border px-3 py-2 text-sm" value={date} onChange={e => setDate(e.target.value)} />
        <select className="rounded-lg border px-3 py-2 text-sm" value={courtId} onChange={e => setCourtId(e.target.value)}>
          <option value="">Tất cả sân</option>
          {courts.map(c => (
            <option key={c.courtId} value={c.courtId}>{c.name}</option>
          ))}
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {Object.keys(byCourt).length === 0 ? (
        <p className="text-sm text-slate-500">Không có booking trong ngày này.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(byCourt).map(([courtName, bookings]) => (
            <div key={courtName} className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3 text-slate-900">{courtName}</h3>
              <ul className="space-y-2 text-sm">
                {bookings.map(b => (
                  <li key={`${b.bookingId}-${b.startTime}`} className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <div>
                      <Link to={`/owner/bookings/${b.bookingId}`} className="text-emerald-700 no-underline font-medium">
                        #{b.bookingId}
                      </Link>
                      <p className="text-slate-500">{b.startTime}–{b.endTime} · {b.customerName || 'Khách'}</p>
                    </div>
                    <OwnerStatusBadge status={b.status} />
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
