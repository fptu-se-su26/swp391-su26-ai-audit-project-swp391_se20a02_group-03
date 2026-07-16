import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { 
  OwnerPageHeader, 
  OwnerCard, 
  OwnerToolbar,
  OwnerBtn,
  OwnerErrorState,
  ownerInputCls
} from '../../components/owner';
import { defaultDateRange } from '../../utils/date';
import { ArrowRight, RefreshCw, DollarSign, Activity, TrendingUp, CreditCard } from 'lucide-react';

const fmt = n => Number(n || 0).toLocaleString('vi-VN');

export default function OwnerFinancePage() {
  const { complexId } = useOutletContext();
  const [range, setRange] = useState(defaultDateRange);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    if (!complexId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getRevenueReport(complexId, range.from, range.to);
      if (res.statusCode === 200) setData(res.data);
      else setError(res.message || 'Không tải được báo cáo.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải được báo cáo.');
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [complexId, range.from, range.to]);

  const kpis = [
    { label: 'Doanh thu đặt sân', value: data?.bookingRevenue, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Doanh thu ròng', value: data?.netRevenue, icon: DollarSign, highlight: true },
    { label: 'Hoàn tiền', value: data?.refundAmount, icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Escrow giữ', value: data?.escrowHeld, icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Tài chính" 
        description="Theo dõi doanh thu, dòng tiền và các khoản hoàn trả."
      />

      <OwnerToolbar>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-gray-500 shrink-0">Từ ngày:</span>
            <input type="date" className={ownerInputCls} value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} />
          </div>
          <ArrowRight className="text-gray-300 hidden sm:block" size={16} />
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-gray-500 shrink-0">Đến ngày:</span>
            <input type="date" className={ownerInputCls} value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} />
          </div>
          <OwnerBtn variant="secondary" onClick={load} disabled={loading} className="ml-auto sm:ml-0">
            <span className="flex items-center gap-1.5"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Làm mới</span>
          </OwnerBtn>
        </div>
      </OwnerToolbar>

      {error && <OwnerErrorState message={error} onRetry={load} />}

      {loading && !data ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 h-32"></div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map(({ label, value, highlight, icon: Icon, color, bg }) => (
            <OwnerCard key={label} className={highlight ? 'bg-[#14b8a6] border-[#14b8a6]' : ''}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${highlight ? 'text-teal-100' : 'text-gray-500'}`}>
                    {label}
                  </p>
                  <p className={`font-heading text-3xl m-0 ${highlight ? 'text-white' : 'text-[#0f172a]'}`}>
                    {fmt(value)} <span className={`text-xl ${highlight ? 'text-teal-200' : 'text-gray-400'}`}>₫</span>
                  </p>
                </div>
                <div className={`p-2.5 rounded-full ${highlight ? 'bg-white/20 text-white' : `${bg} ${color}`}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
              </div>
            </OwnerCard>
          ))}
        </div>
      )}

      {/* Placeholder for future charts or detailed tables */}
      {!loading && data && (
        <OwnerCard className="mt-8 opacity-50 flex items-center justify-center p-12 border-dashed">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest m-0">Biểu đồ chi tiết đang được cập nhật</p>
        </OwnerCard>
      )}
    </div>
  );
}
