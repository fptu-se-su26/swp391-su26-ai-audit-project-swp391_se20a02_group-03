import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import DashboardSkeleton from '../../components/owner/DashboardSkeleton';
import {
  OwnerPageHeader,
  OwnerBtn,
  OwnerStatCard,
  OwnerCard,
  OwnerFilterPills,
  OwnerTable,
  OwnerThead,
  OwnerTh,
  OwnerTd,
  OwnerStatusBadge,
  OwnerErrorState
} from '../../components/owner';
import {
  CircleDollarSign,
  CalendarDays,
  Percent,
  Clock,
  AlertTriangle
} from 'lucide-react';

function formatVnd(v) {
  return `${Number(v || 0).toLocaleString('vi-VN')} ₫`;
}

const RANGES = [
  { value: 'today', label: 'Hôm nay', days: 0 },
  { value: '7d', label: '7 ngày', days: 6 },
  { value: 'month', label: 'Tháng này', days: 29 },
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
      const selected = RANGES.find(r => r.value === range) || RANGES[1];
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

  const hasChartData = (data?.revenueByDate?.length ?? 0) > 0 || (data?.occupancyByCourt?.length ?? 0) > 0;

  return (
    <div className="space-y-8 auth-animate-in pb-12">
      <OwnerPageHeader
        title="Dashboard"
        description="Tổng quan doanh thu và vận hành tổ hợp sân."
      >
        <OwnerBtn to="/owner/courts" variant="secondary">Quản lý sân</OwnerBtn>
        <OwnerBtn to="/owner/courts/create" variant="primary">+ Thêm sân mới</OwnerBtn>
      </OwnerPageHeader>

      <div className="flex justify-end">
        <OwnerFilterPills
          tabs={RANGES}
          activeTab={range}
          onChange={setRange}
        />
      </div>

      {error && (
        <OwnerErrorState message={error} onRetry={load} />
      )}

      {!error && !hasChartData && data?.bookingCount === 0 && (
        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[16px] px-4 py-12 text-center text-gray-500 text-sm">
          Chưa có dữ liệu vận hành trong khoảng thời gian đã chọn.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <OwnerStatCard
          label="Tổng doanh thu"
          value={formatVnd(data?.totalRevenue)}
          icon={CircleDollarSign}
          color="teal"
        />
        <OwnerStatCard
          label="Doanh thu đặt sân"
          value={data?.bookingRevenue != null ? formatVnd(data.bookingRevenue) : formatVnd(data?.totalRevenue)}
          icon={CircleDollarSign}
          color="blue"
        />
        <OwnerStatCard
          label="Tổng lượt đặt"
          value={data?.bookingCount ?? 0}
          icon={CalendarDays}
          color="indigo"
        />
        <OwnerStatCard
          label="Tỷ lệ lấp sân"
          value={`${data?.occupancyRate ?? 0}%`}
          icon={Percent}
          color="teal"
        />
        <OwnerStatCard
          label="Booking chờ thanh toán"
          value={data?.pendingBookingCount ?? 0}
          icon={Clock}
          color="orange"
        />
        <OwnerStatCard
          label="Sản phẩm tồn kho thấp"
          value={data?.lowStockCount ?? 0}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Doanh thu theo ngày */}
        <OwnerCard noPad className="flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Doanh thu theo ngày</h3>
          </div>
          <div className="p-6">
            {data?.revenueByDate?.length ? (
              <ul className="space-y-4 m-0 p-0 list-none max-h-[300px] overflow-y-auto">
                {data.revenueByDate.map((row, idx) => (
                  <li key={row.label} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">{row.label}</span>
                    <span className="text-sm font-bold text-[#0f172a]">{formatVnd(row.amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 m-0 text-center py-8">Chưa có dữ liệu doanh thu.</p>
            )}
          </div>
        </OwnerCard>

        {/* Lấp sân theo sân */}
        <OwnerCard noPad className="flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Tỷ lệ lấp sân</h3>
          </div>
          <div className="p-6">
            {data?.occupancyByCourt?.length ? (
              <ul className="space-y-4 m-0 p-0 list-none max-h-[300px] overflow-y-auto">
                {data.occupancyByCourt.map(row => (
                  <li key={row.courtId} className="flex justify-between items-center gap-4">
                    <span className="text-sm font-medium text-gray-500 truncate">{row.courtName}</span>
                    <span className="text-sm font-bold text-[#14b8a6] bg-teal-50 px-2.5 py-1 rounded-[6px] shrink-0">
                      {row.occupancyRate}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 m-0 text-center py-8">Chưa có dữ liệu lấp sân.</p>
            )}
          </div>
        </OwnerCard>
      </div>

      {/* Upcoming Bookings */}
      <OwnerCard noPad>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Booking sắp tới</h3>
        </div>
        {!data?.upcomingBookings?.length ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Không có booking nào sắp diễn ra.
          </div>
        ) : (
          <OwnerTable>
            <OwnerThead>
              <OwnerTh>Mã Booking</OwnerTh>
              <OwnerTh>Khách hàng</OwnerTh>
              <OwnerTh>Sân</OwnerTh>
              <OwnerTh>Thời gian</OwnerTh>
              <OwnerTh center>Trạng thái</OwnerTh>
            </OwnerThead>
            <tbody className="divide-y divide-gray-50">
              {data.upcomingBookings.map(b => (
                <tr key={b.bookingId} className="hover:bg-gray-50/50 transition-colors">
                  <OwnerTd>
                    <span className="font-mono text-xs font-semibold text-gray-500">#{b.bookingId}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-semibold text-[#0f172a]">{b.customerName}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="text-gray-600">{b.courtName}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-medium text-gray-700">{b.startTime} – {b.endTime}</span>
                  </OwnerTd>
                  <OwnerTd center>
                    <OwnerStatusBadge status={b.status} />
                  </OwnerTd>
                </tr>
              ))}
            </tbody>
          </OwnerTable>
        )}
      </OwnerCard>
    </div>
  );
}
