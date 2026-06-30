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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500">Tổng quan doanh thu và vận hành tổ hợp.</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Link to="/owner/courts" className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 bg-white text-slate-700 no-underline hover:border-emerald-300">
            Quản lý sân
          </Link>
          <Link to="/owner/courts/create" className="px-3 py-1.5 rounded-lg text-sm bg-emerald-600 text-white no-underline hover:bg-emerald-700">
            + Tạo sân
          </Link>
          {RANGES.map(r => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${range === r.key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={load}
            className="text-sm font-semibold text-red-700 underline bg-transparent border-none cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {!error && !hasChartData && data?.bookingCount === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-slate-500">
          Chưa có dữ liệu vận hành trong khoảng thời gian đã chọn.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">{c.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Doanh thu theo ngày</h3>
          {data?.revenueByDate?.length ? (
            <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
              {data.revenueByDate.map(row => (
                <li key={row.label} className="flex justify-between">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-medium">{formatVnd(row.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Chưa có dữ liệu doanh thu.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Lấp sân theo sân</h3>
          {data?.occupancyByCourt?.length ? (
            <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
              {data.occupancyByCourt.map(row => (
                <li key={row.courtId} className="flex justify-between gap-2">
                  <span className="text-slate-600 truncate">{row.courtName}</span>
                  <span className="font-medium shrink-0">{row.occupancyRate}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Chưa có dữ liệu lấp sân.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-4">Booking sắp tới</h3>
        {!data?.upcomingBookings?.length ? (
          <p className="text-sm text-slate-500">Không có booking sắp tới.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">Mã</th>
                  <th className="py-2 pr-4">Khách</th>
                  <th className="py-2 pr-4">Sân</th>
                  <th className="py-2 pr-4">Giờ</th>
                  <th className="py-2">TT</th>
                </tr>
              </thead>
              <tbody>
                {data.upcomingBookings.map(b => (
                  <tr key={b.bookingId} className="border-b border-slate-50">
                    <td className="py-2 pr-4">#{b.bookingId}</td>
                    <td className="py-2 pr-4">{b.customerName}</td>
                    <td className="py-2 pr-4">{b.courtName}</td>
                    <td className="py-2 pr-4">{b.startTime}–{b.endTime}</td>
                    <td className="py-2">{b.status}</td>
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
