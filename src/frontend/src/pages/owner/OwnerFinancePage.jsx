import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

const fmt = n => Number(n || 0).toLocaleString('vi-VN');

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 29);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export default function OwnerFinancePage() {
  const { complexId } = useOutletContext();
  const [range, setRange] = useState(defaultRange);
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
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-end gap-3">
        <div>
          <h2 className="text-xl font-bold">Tài chính</h2>
          <p className="text-xs text-slate-500">Chỉ xem báo cáo — không sửa ledger.</p>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <input type="date" className="rounded-lg border px-2 py-1" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} />
          <span>→</span>
          <input type="date" className="rounded-lg border px-2 py-1" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} />
          <button type="button" onClick={load} className="px-3 py-1 border rounded-lg bg-white cursor-pointer">Làm mới</button>
        </div>
      </div>
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Doanh thu đặt sân', data?.bookingRevenue],
          ['Doanh thu thuê', data?.rentalRevenue],
          ['Doanh thu SP', data?.productRevenue],
          ['Phụ phí thuê', data?.surchargeRevenue],
          ['Hoàn tiền', data?.refundAmount],
          ['Escrow giữ', data?.escrowHeld],
          ['Doanh thu ròng', data?.netRevenue],
        ].map(([label, val]) => (
          <div key={label} className="bg-white border rounded-xl p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-lg font-bold text-slate-900">{fmt(val)} ₫</p>
          </div>
        ))}
      </div>
    </div>
  );
}
