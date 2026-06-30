import { useEffect, useState } from 'react';
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

function formatTime(value) {
  if (!value) return '—';
  const text = String(value);
  return text.length >= 5 ? text.slice(0, 5) : text;
}

export default function OwnerBookingsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [courtId, setCourtId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
      const res = await ownerApi.getBookings({
        complexId,
        status: status || undefined,
        courtId: courtId ? Number(courtId) : undefined,
        keyword: keyword.trim() || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: 1,
        size: 50,
      });
      if (res.statusCode === 200) setItems(res.data?.items || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải booking.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (complexId) loadCourts();
  }, [complexId]);

  useEffect(() => {
    if (complexId) load();
  }, [complexId, status, courtId]);

  if (loading && !items.length) return <PageLoader label="Đang tải booking..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý đặt sân</h2>
          <p className="text-sm text-slate-500">Theo dõi, lọc và xử lý booking trong tổ hợp.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/owner/bookings/walk-in" className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm no-underline hover:bg-emerald-700">
            + Walk-in
          </Link>
          <Link to="/owner/bookings/calendar" className="px-3 py-2 rounded-lg border text-sm no-underline text-slate-700 hover:bg-slate-50">
            Lịch
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-lg border px-3 py-2 text-sm min-w-[180px]"
          placeholder="Tìm mã/khách..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
        />
        <select className="rounded-lg border px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={courtId} onChange={e => setCourtId(e.target.value)}>
          <option value="">Tất cả sân</option>
          {courts.map(c => (
            <option key={c.courtId} value={c.courtId}>{c.name}</option>
          ))}
        </select>
        <input type="date" className="rounded-lg border px-3 py-2 text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="Từ ngày" />
        <input type="date" className="rounded-lg border px-3 py-2 text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} title="Đến ngày" />
        <button type="button" onClick={load} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">
          Lọc
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {!items.length ? (
        <p className="text-sm text-slate-500">Không có booking phù hợp bộ lọc.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3 text-left">Mã</th>
                <th className="p-3 text-left">Sân</th>
                <th className="p-3 text-left">Ngày</th>
                <th className="p-3 text-left">Giờ</th>
                <th className="p-3 text-left">TT</th>
                <th className="p-3 text-left">Thanh toán</th>
                <th className="p-3 text-left">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map(b => {
                const d = b.details?.[0];
                return (
                  <tr key={b.bookingId} className="border-t hover:bg-slate-50">
                    <td className="p-3">
                      <Link to={`/owner/bookings/${b.bookingId}`} className="text-emerald-700 no-underline font-medium">
                        #{b.bookingId}
                      </Link>
                    </td>
                    <td className="p-3">{d?.courtName || '—'}</td>
                    <td className="p-3">{d?.bookingDate ? new Date(d.bookingDate).toLocaleDateString('vi-VN') : '—'}</td>
                    <td className="p-3">{d ? `${formatTime(d.startTime)}–${formatTime(d.endTime)}` : '—'}</td>
                    <td className="p-3"><OwnerStatusBadge status={b.status} /></td>
                    <td className="p-3">{b.paymentStatus || '—'}</td>
                    <td className="p-3">{Number(b.totalAmount).toLocaleString('vi-VN')} ₫</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
