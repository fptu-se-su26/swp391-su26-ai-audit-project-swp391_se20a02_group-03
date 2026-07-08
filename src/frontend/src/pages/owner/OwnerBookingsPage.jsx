import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import StatusBadge from '../../components/ui/StatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';
import { useDebouncedValue } from '../../utils/useDebouncedValue';

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
  const debouncedKeyword = useDebouncedValue(keyword, 400);
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
        keyword: debouncedKeyword.trim() || undefined,
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
  }, [complexId, status, courtId, debouncedKeyword, dateFrom, dateTo]);

  if (loading && !items.length) return <PageLoader label="Đang tải booking..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-5 items-end">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Quản lý đặt sân</h1>
          <p className="text-sm text-foreground-muted">Theo dõi, lọc và xử lý booking trong tổ hợp.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/owner/bookings/walk-in" className="btn-primary no-underline">
            + Walk-in
          </Link>
          <Link to="/owner/bookings/calendar" className="btn-outline no-underline">
            Lịch
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <input
          className="input-base w-auto min-w-[200px]"
          placeholder="Tìm mã/khách..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
        />
        <select className="input-base w-auto" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select className="input-base w-auto" value={courtId} onChange={e => setCourtId(e.target.value)}>
          <option value="">Tất cả sân</option>
          {courts.map(c => (
            <option key={c.courtId} value={c.courtId}>{c.name}</option>
          ))}
        </select>
        <input type="date" className="input-base w-auto" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="Từ ngày" />
        <input type="date" className="input-base w-auto" value={dateTo} onChange={e => setDateTo(e.target.value)} title="Đến ngày" />
        <button type="button" onClick={load} className="btn-primary">
          Lọc
        </button>
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      {!items.length ? (
        <EmptyState title="Không có booking" subtitle="Không có booking phù hợp bộ lọc." />
      ) : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-4 py-3.5 label-mono">Mã</th>
                <th className="text-left px-4 py-3.5 label-mono">Sân</th>
                <th className="text-left px-4 py-3.5 label-mono">Ngày</th>
                <th className="text-left px-4 py-3.5 label-mono">Giờ</th>
                <th className="text-left px-4 py-3.5 label-mono">Trạng thái</th>
                <th className="text-left px-4 py-3.5 label-mono">Thanh toán</th>
                <th className="text-left px-4 py-3.5 label-mono">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map(b => {
                const d = b.details?.[0];
                return (
                  <tr key={b.bookingId} className="border-t border-border-default hover:bg-surface-hover">
                    <td className="px-4 py-3.5">
                      <Link to={`/owner/bookings/${b.bookingId}`} className="text-foreground font-extrabold underline underline-offset-2">
                        #{b.bookingId}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-foreground">{d?.courtName || '—'}</td>
                    <td className="px-4 py-3.5 text-foreground">{d?.bookingDate ? new Date(d.bookingDate).toLocaleDateString('vi-VN') : '—'}</td>
                    <td className="px-4 py-3.5 text-foreground">{d ? `${formatTime(d.startTime)}–${formatTime(d.endTime)}` : '—'}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3.5 text-foreground">{b.paymentStatus || '—'}</td>
                    <td className="px-4 py-3.5 text-foreground">{Number(b.totalAmount).toLocaleString('vi-VN')} ₫</td>
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
