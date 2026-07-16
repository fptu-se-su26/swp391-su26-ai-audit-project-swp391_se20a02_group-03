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
import { ArrowRight, Download, PackageOpen, AlertTriangle } from 'lucide-react';

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
  const [exporting, setExporting] = useState(false);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [complexId, range.from, range.to]);

  async function handleExport() {
    setExportError(null);
    setExporting(true);
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
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Báo cáo vận hành" 
        description="Theo dõi tỷ lệ lấp đầy sân và tình trạng tồn kho hàng hóa."
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
          <OwnerBtn variant="secondary" onClick={handleExport} disabled={loading || exporting} className="ml-auto sm:ml-0">
            <span className="flex items-center gap-1.5"><Download size={14} /> {exporting ? 'Đang xuất...' : 'Xuất CSV'}</span>
          </OwnerBtn>
        </div>
      </OwnerToolbar>

      {error && <OwnerErrorState message={error} onRetry={load} />}
      {exportError && (
        <div className="bg-red-50 border border-red-100 rounded-[16px] px-6 py-4 flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-red-600 m-0">{exportError}</p>
          <button type="button" onClick={() => setExportError(null)} className="text-sm text-red-500 underline bg-transparent border-none cursor-pointer">Ẩn</button>
        </div>
      )}

      {loading && !occupancy ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="h-32 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
            <div className="h-32 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
          </div>
          <div className="h-64 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Report */}
          <div className="grid sm:grid-cols-2 gap-6">
            <OwnerCard className="border-l-4 border-l-[#0f172a]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Tổng SP trong kho</p>
                  <p className="font-heading text-4xl text-[#0f172a] m-0">{inventory?.totalProducts ?? 0}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-50 text-gray-400">
                  <PackageOpen size={24} strokeWidth={2} />
                </div>
              </div>
            </OwnerCard>
            
            <OwnerCard className={inventory?.lowStockCount > 0 ? "border-l-4 border-l-orange-500" : ""}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Sản phẩm tồn thấp</p>
                  <p className={`font-heading text-4xl m-0 ${inventory?.lowStockCount > 0 ? 'text-orange-500' : 'text-[#0f172a]'}`}>
                    {inventory?.lowStockCount ?? 0}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${inventory?.lowStockCount > 0 ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'}`}>
                  <AlertTriangle size={24} strokeWidth={2} />
                </div>
              </div>
            </OwnerCard>
          </div>

          {/* Occupancy Report */}
          <OwnerCard>
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-6">Tỷ lệ lấp đầy theo sân</h3>
            {!occupancy?.courts?.length ? (
              <p className="text-sm text-gray-500 italic">Chưa có dữ liệu đặt sân trong khoảng thời gian này.</p>
            ) : (
              <div className="space-y-5">
                {occupancy.courts.map((c) => (
                  <div key={c.courtId} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-[#0f172a]">{c.courtName}</span>
                      <div className="text-right">
                        <span className="font-heading text-xl text-[#14b8a6]">{c.occupancyPercent}%</span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-2">({c.bookedSlots}/{c.totalSlots} slot)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${c.occupancyPercent >= 80 ? 'bg-[#14b8a6]' : c.occupancyPercent >= 40 ? 'bg-blue-500' : 'bg-orange-400'}`} 
                        style={{ width: `${Math.min(100, c.occupancyPercent)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </OwnerCard>
        </div>
      )}
    </div>
  );
}
