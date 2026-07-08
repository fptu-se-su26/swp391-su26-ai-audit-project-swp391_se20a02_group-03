import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import DashboardSkeleton from '../../components/owner/DashboardSkeleton';

function formatVnd(v) {
  return `${Number(v || 0).toLocaleString('vi-VN')} ₫`;
}

const RANGES = [
  { key: 'today', label: 'Hôm nay', days: 0 },
  { key: '7d', label: '7 ngày', days: 6 },
  { key: 'month', label: 'Tháng này', days: 29 },
];

export default function OwnerDashboardPage() {
  const { complexId } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('7d');

  const load = useCallback(async () => {
    if (!complexId) return;
    try {
      setLoading(true);
      setError(null);
      const today = new Date();
      const selected = RANGES.find(r => r.key === range) || RANGES[1];
      const from = new Date(today);
      from.setDate(today.getDate() - selected.days);
      const res = await ownerApi.getDashboard(
        complexId,
        from.toISOString().slice(0, 10),
        today.toISOString().slice(0, 10),
      );
      if (res.statusCode === 200) setData(res.data);
      else setError(res.message || 'Không tải được dashboard.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải dashboard.');
    } finally {
      setLoading(false);
    }
  }, [complexId, range]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <DashboardSkeleton />;

  const cards = [
    { label: 'Doanh thu', value: formatVnd(data?.totalRevenue) },
    { label: 'Đặt sân', value: data?.bookingRevenue != null ? formatVnd(data.bookingRevenue) : formatVnd(data?.totalRevenue) },
    { label: 'Lượt đặt', value: data?.bookingCount ?? 0 },
    { label: 'Lấp sân', value: `${data?.occupancyRate ?? 0}%` },
    { label: 'Thuê TB', value: data?.activeRentalCount ?? 0 },
    { label: 'Chờ TT', value: data?.pendingBookingCount ?? 0 },
    { label: 'TB hỏng', value: data?.damagedAssetCount ?? 0 },
    { label: 'Tồn thấp', value: data?.lowStockCount ?? 0 },
  ];

  const hasChartData = (data?.revenueByDate?.length ?? 0) > 0 || (data?.occupancyByCourt?.length ?? 0) > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Dashboard</h1>
          <p className="text-sm text-foreground-muted">Tổng quan doanh thu và vận hành tổ hợp.</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Link to="/owner/courts" className="btn-outline no-underline">
            Quản lý sân
          </Link>
          <Link to="/owner/courts/create" className="btn-primary no-underline">
            + Tạo sân
          </Link>
          {RANGES.map(r => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={range === r.key ? 'btn-primary' : 'btn-outline'}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="border border-danger bg-danger-bg px-4 py-4 flex flex-wrap items-center justify-between gap-3 rounded-[2px]">
          <p className="text-sm text-danger">{error}</p>
          <button
            type="button"
            onClick={load}
            className="text-sm font-semibold text-danger underline bg-transparent border-none cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {!error && !hasChartData && data?.bookingCount === 0 && (
        <div className="border-2 border-dashed border-border-hover px-4 py-8 text-center text-foreground-muted rounded-[2px]">
          Chưa có dữ liệu vận hành trong khoảng thời gian đã chọn.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-[var(--theme-border-strong)] border-2 border-border-strong">
        {cards.map(c => (
          <div key={c.label} className="bg-surface p-6">
            <p className="label-mono text-foreground-subtle mb-2.5">{c.label}</p>
            <p className="font-heading text-2xl text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border-2 border-border-strong bg-surface p-7">
          <h3 className="font-heading text-base uppercase tracking-tight text-foreground mb-5">Doanh thu theo ngày</h3>
          {data?.revenueByDate?.length ? (
            <ul className="space-y-2.5 text-sm max-h-64 overflow-y-auto">
              {data.revenueByDate.map(row => (
                <li key={row.label} className="flex justify-between pb-2.5 border-b border-border-default last:border-b-0">
                  <span className="text-foreground-muted">{row.label}</span>
                  <span className="font-extrabold text-foreground">{formatVnd(row.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground-muted">Chưa có dữ liệu doanh thu.</p>
          )}
        </div>

        <div className="border-2 border-border-strong bg-surface p-7">
          <h3 className="font-heading text-base uppercase tracking-tight text-foreground mb-5">Lấp sân theo sân</h3>
          {data?.occupancyByCourt?.length ? (
            <ul className="space-y-2.5 text-sm max-h-64 overflow-y-auto">
              {data.occupancyByCourt.map(row => (
                <li key={row.courtId} className="flex justify-between gap-2 pb-2.5 border-b border-border-default last:border-b-0">
                  <span className="text-foreground-muted truncate">{row.courtName}</span>
                  <span className="font-extrabold text-foreground shrink-0">{row.occupancyRate}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground-muted">Chưa có dữ liệu lấp sân.</p>
          )}
        </div>
      </div>

      <div className="border-2 border-border-strong bg-surface p-7">
        <h3 className="font-heading text-base uppercase tracking-tight text-foreground mb-5">Booking sắp tới</h3>
        {!data?.upcomingBookings?.length ? (
          <p className="text-sm text-foreground-muted">Không có booking sắp tới.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-foreground-muted border-b border-border-default">
                  <th className="py-2 pr-4 label-mono">Mã</th>
                  <th className="py-2 pr-4 label-mono">Khách</th>
                  <th className="py-2 pr-4 label-mono">Sân</th>
                  <th className="py-2 pr-4 label-mono">Giờ</th>
                  <th className="py-2 label-mono">TT</th>
                </tr>
              </thead>
              <tbody>
                {data.upcomingBookings.map(b => (
                  <tr key={b.bookingId} className="border-b border-border-default last:border-b-0">
                    <td className="py-2.5 pr-4 text-foreground">#{b.bookingId}</td>
                    <td className="py-2.5 pr-4 text-foreground">{b.customerName}</td>
                    <td className="py-2.5 pr-4 text-foreground">{b.courtName}</td>
                    <td className="py-2.5 pr-4 text-foreground">{b.startTime}–{b.endTime}</td>
                    <td className="py-2.5 text-foreground">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
