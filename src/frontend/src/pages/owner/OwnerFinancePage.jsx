import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';
import { defaultDateRange } from '../../utils/date';

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

  useEffect(() => { load(); }, [complexId, range.from, range.to]);

  if (loading && !data) return <PageLoader label="Đang tải tài chính..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-5">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Tài chính</h1>
          <p className="text-sm text-foreground-muted">Chỉ xem báo cáo — không sửa ledger.</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <input type="date" className="input-base w-auto" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} />
          <span className="text-foreground-muted">→</span>
          <input type="date" className="input-base w-auto" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} />
          <button type="button" onClick={load} className="btn-outline">Làm mới</button>
        </div>
      </div>
      {error && <div className="text-sm text-danger">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-[var(--theme-border-strong)] border-2 border-border-strong">
        {[
          ['Doanh thu đặt sân', data?.bookingRevenue],
          ['Doanh thu thuê', data?.rentalRevenue],
          ['Doanh thu SP', data?.productRevenue],
          ['Doanh thu ròng', data?.netRevenue, true],
          ['Phụ phí thuê', data?.surchargeRevenue],
          ['Hoàn tiền', data?.refundAmount],
          ['Escrow giữ', data?.escrowHeld],
        ].map(([label, val, highlight]) => (
          <div key={label} className={highlight ? 'bg-[var(--theme-primary)] p-6' : 'bg-surface p-6'}>
            <p className={`label-mono mb-2.5 ${highlight ? 'text-[var(--theme-secondary)] opacity-80' : 'text-foreground-subtle'}`}>{label}</p>
            <p className={`font-heading text-2xl ${highlight ? 'text-[var(--theme-secondary)]' : 'text-foreground'}`}>{fmt(val)} ₫</p>
          </div>
        ))}
      </div>
    </div>
  );
}

