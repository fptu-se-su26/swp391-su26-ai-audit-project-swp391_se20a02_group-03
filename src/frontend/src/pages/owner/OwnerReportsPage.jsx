import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export default function OwnerReportsPage() {
  const { complexId } = useOutletContext();
  const [range, setRange] = useState(defaultRange);
  const [occupancy, setOccupancy] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportError, setExportError] = useState(null);

  async function load() {
    if (!complexId) return;
    try {
      setLoading(true);
      setError(null);
      const [o, i] = await Promise.all([
        ownerApi.getOccupancyReport(complexId, range.from, range.to),
        ownerApi.getInventoryReport(complexId),
      ]);
      if (o.statusCode === 200) setOccupancy(o.data);
      else setError(o.message);
      if (i.statusCode === 200) setInventory(i.data);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải được báo cáo.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [complexId, range.from, range.to]);

  async function handleExport() {
    setExportError(null);
    try {
      const blob = await ownerApi.exportReport(complexId, range.from, range.to);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-${complexId}-${range.from}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(typeof err === 'string' ? err : 'Xuất CSV thất bại.');
    }
  }

  if (loading && !occupancy) return <PageLoader label="Đang tải báo cáo..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-end gap-3">
        <h2 className="text-xl font-bold">Báo cáo vận hành</h2>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <input type="date" className="rounded-lg border px-2 py-1" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} />
          <span>→</span>
          <input type="date" className="rounded-lg border px-2 py-1" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} />
          <button type="button" onClick={handleExport} className="px-4 py-2 border rounded-lg text-sm cursor-pointer bg-white">Xuất CSV</button>
        </div>
      </div>
      {error && <div className="text-sm text-red-700 bg-red-50 border rounded-lg px-3 py-2">{error}</div>}
      {exportError && <div className="text-sm text-red-700 bg-red-50 border rounded-lg px-3 py-2">{exportError}</div>}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-slate-500">Tỷ lệ thuê thiết bị</p><p className="text-2xl font-bold">{occupancy?.rentalUtilization ?? 0}%</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-slate-500">Tỷ lệ hư hỏng</p><p className="text-2xl font-bold">{occupancy?.damageRate ?? 0}%</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-slate-500">SP tồn thấp</p><p className="text-2xl font-bold">{inventory?.lowStockCount ?? 0}</p></div>
      </div>
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-2">Lấp sân theo sân</h3>
        {!occupancy?.courts?.length ? (
          <p className="text-sm text-slate-500">Chưa có dữ liệu.</p>
        ) : (
          <ul className="text-sm space-y-1">{occupancy.courts.map(c => (
            <li key={c.courtId}>{c.courtName}: {c.occupancyPercent}% ({c.bookedSlots}/{c.totalSlots})</li>
          ))}</ul>
        )}
      </div>
    </div>
  );
}
