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
      <div className="flex flex-wrap justify-between items-end gap-5">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Báo cáo vận hành</h1>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <input type="date" className="input-base w-auto h-[42px]" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} />
          <span className="text-foreground-muted">→</span>
          <input type="date" className="input-base w-auto h-[42px]" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} />
          <button type="button" onClick={handleExport} className="btn-primary h-[42px]">Xuất CSV</button>
        </div>
      </div>
      {error && <div className="text-sm text-danger bg-danger-bg border-2 border-danger px-3 py-2 rounded-[2px]">{error}</div>}
      {exportError && <div className="text-sm text-danger bg-danger-bg border-2 border-danger px-3 py-2 rounded-[2px]">{exportError}</div>}
      <div className="grid md:grid-cols-2 gap-[2px] bg-border-strong border-2 border-border-strong">
        <div className="bg-surface p-6">
          <p className="label-mono text-foreground-subtle mb-2.5">Tổng sản phẩm</p>
          <p className="font-heading text-3xl text-foreground">{inventory?.totalProducts ?? 0}</p>
        </div>
        <div className="bg-[var(--theme-primary)] p-6">
          <p className="label-mono text-foreground-muted mb-2.5">SP tồn thấp</p>
          <p className="font-heading text-3xl text-[var(--theme-secondary)]">{inventory?.lowStockCount ?? 0}</p>
        </div>
      </div>
      <div className="border-2 border-border-strong bg-surface p-6">
        <h3 className="font-heading text-base uppercase text-foreground mb-4">Lấp sân theo sân</h3>
        {!occupancy?.courts?.length ? (
          <p className="text-sm text-foreground-muted">Chưa có dữ liệu.</p>
        ) : (
          <div className="flex flex-col gap-2.5 text-sm">
            {occupancy.courts.map((c, idx) => (
              <div key={c.courtId} className={`flex justify-between text-foreground ${idx < occupancy.courts.length - 1 ? 'pb-2.5 border-b border-border-default' : ''}`}>
                <span>{c.courtName}</span>
                <strong>{c.occupancyPercent}% ({c.bookedSlots}/{c.totalSlots})</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
