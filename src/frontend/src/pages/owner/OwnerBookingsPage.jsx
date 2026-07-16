import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { 
  OwnerPageHeader, 
  OwnerBtn, 
  OwnerCard, 
  OwnerToolbar,
  OwnerSearchInput,
  OwnerTable,
  OwnerThead,
  OwnerTh,
  OwnerTd,
  OwnerStatusBadge,
  OwnerEmptyState,
  OwnerErrorState,
  OwnerTableLoader,
  ownerInputCls
} from '../../components/owner';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexId]);

  useEffect(() => {
    if (complexId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexId, status, courtId, debouncedKeyword, dateFrom, dateTo]);

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Quản lý đặt sân" 
        description="Theo dõi, lọc và xử lý danh sách đặt sân trong tổ hợp."
      >
        <OwnerBtn to="/owner/bookings/calendar" variant="secondary">Xem lịch (Calendar)</OwnerBtn>
        <OwnerBtn to="/owner/bookings/walk-in" variant="primary">+ Đặt sân tại quầy</OwnerBtn>
      </OwnerPageHeader>

      <OwnerCard className="space-y-4">
        <OwnerToolbar className="!mb-0">
          <div className="flex-1 min-w-[200px]">
            <OwnerSearchInput 
              placeholder="Tìm mã booking, tên khách..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select className={ownerInputCls} value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select className={ownerInputCls} value={courtId} onChange={e => setCourtId(e.target.value)}>
              <option value="">Tất cả sân</option>
              {courts.map(c => (
                <option key={c.courtId} value={c.courtId}>{c.name}</option>
              ))}
            </select>
            <input type="date" className={ownerInputCls} value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="Từ ngày" />
            <input type="date" className={ownerInputCls} value={dateTo} onChange={e => setDateTo(e.target.value)} title="Đến ngày" />
          </div>
        </OwnerToolbar>
      </OwnerCard>

      {error && <OwnerErrorState message={error} onRetry={load} />}

      <OwnerCard noPad>
        <OwnerTable>
          <OwnerThead>
            <OwnerTh>Mã</OwnerTh>
            <OwnerTh>Sân</OwnerTh>
            <OwnerTh>Ngày</OwnerTh>
            <OwnerTh>Giờ</OwnerTh>
            <OwnerTh>Khách hàng</OwnerTh>
            <OwnerTh>Trạng thái</OwnerTh>
            <OwnerTh right>Số tiền</OwnerTh>
          </OwnerThead>

          {loading && <OwnerTableLoader cols={7} rows={5} />}

          {!loading && !error && !items.length && (
            <tbody>
              <tr>
                <td colSpan={7}>
                  <OwnerEmptyState title="Không có booking nào phù hợp với bộ lọc." />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && items.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {items.map(b => {
                const d = b.details?.[0];
                return (
                  <tr key={b.bookingId} className="hover:bg-gray-50/50 transition-colors">
                    <OwnerTd>
                      <Link to={`/owner/bookings/${b.bookingId}`} className="font-mono text-[13px] font-extrabold text-[#0f172a] hover:text-[#14b8a6] no-underline transition-colors">
                        #{b.bookingId}
                      </Link>
                    </OwnerTd>
                    <OwnerTd>
                      <span className="font-semibold text-gray-700">{d?.courtName || '—'}</span>
                    </OwnerTd>
                    <OwnerTd>
                      <span className="text-gray-500">{d?.bookingDate ? new Date(d.bookingDate).toLocaleDateString('vi-VN') : '—'}</span>
                    </OwnerTd>
                    <OwnerTd>
                      <span className="font-medium text-[#0f172a]">{d ? `${formatTime(d.startTime)} – ${formatTime(d.endTime)}` : '—'}</span>
                    </OwnerTd>
                    <OwnerTd>
                      <span className="text-[#0f172a] font-medium">{b.customerName || '—'}</span>
                    </OwnerTd>
                    <OwnerTd>
                      <OwnerStatusBadge status={b.status} type="booking" />
                    </OwnerTd>
                    <OwnerTd right>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-[#0f172a]">{Number(b.totalAmount).toLocaleString('vi-VN')} ₫</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wide ${b.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {b.paymentStatus || 'Chưa TT'}
                        </span>
                      </div>
                    </OwnerTd>
                  </tr>
                );
              })}
            </tbody>
          )}
        </OwnerTable>
      </OwnerCard>
    </div>
  );
}

