import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

const STATUSES = ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'DAMAGED'];

export default function OwnerRentalAssetsPage() {
  const { complexId } = useOutletContext();
  const [assets, setAssets] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ productStockId: '', assetCode: '', condition: 'Good' });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [a, p] = await Promise.all([
        ownerApi.getRentalAssets(complexId, { page: 1, size: 50 }),
        ownerApi.getProducts(complexId, { page: 1, size: 100 }),
      ]);
      if (a.statusCode === 200) setAssets(a.data?.items || []);
      else setError(a.message);
      if (p.statusCode === 200) setProducts(p.data?.items || []);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải thiết bị.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (complexId) load(); }, [complexId]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await ownerApi.createRentalAsset({ ...form, complexId, productStockId: +form.productStockId });
      if (res.statusCode === 201) load();
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tạo được asset.');
    }
  }

  async function changeStatus(asset, status) {
    try {
      const res = await ownerApi.updateRentalAssetStatus(asset.rentalAssetId, complexId, { status });
      if (res.statusCode === 200) load();
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Cập nhật trạng thái thất bại.');
    }
  }

  if (loading) return <PageLoader label="Đang tải thiết bị cho thuê..." />;

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Thiết bị cho thuê</h1>
      {error && <div className="text-sm text-danger bg-danger-bg border-2 border-danger px-3 py-2 rounded-[2px]">{error}</div>}
      <form onSubmit={handleCreate} className="border-2 border-border-strong bg-surface p-5 flex flex-wrap gap-2.5 items-center">
        <select required className="input-base w-auto" value={form.productStockId} onChange={e => setForm({ ...form, productStockId: e.target.value })}>
          <option value="">Chọn sản phẩm</option>
          {products.map(p => <option key={p.productStockId} value={p.productStockId}>{p.productName}</option>)}
        </select>
        <input className="input-base w-auto" placeholder="Mã asset (tùy chọn)" value={form.assetCode} onChange={e => setForm({ ...form, assetCode: e.target.value })} />
        <button type="submit" className="btn-primary">Thêm asset</button>
      </form>
      {!assets.length ? <EmptyState title="Chưa có asset" subtitle="Thêm thiết bị cho thuê đầu tiên." /> : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-4 py-3.5 label-mono">Mã</th>
                <th className="text-left px-4 py-3.5 label-mono">Sản phẩm</th>
                <th className="text-left px-4 py-3.5 label-mono">Tình trạng</th>
                <th className="text-left px-4 py-3.5 label-mono">Lượt thuê</th>
                <th className="text-left px-4 py-3.5 label-mono">Trạng thái</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>{assets.map(a => (
              <tr key={a.rentalAssetId} className="border-t border-border-default">
                <td className="px-4 py-3.5 font-mono text-xs text-foreground-muted">{a.assetCode}</td>
                <td className="px-4 py-3.5 font-bold text-foreground">{a.productName}</td>
                <td className="px-4 py-3.5 text-foreground">{a.condition}</td>
                <td className="px-4 py-3.5 text-foreground">{a.rentCount}</td>
                <td className="px-4 py-3.5"><OwnerStatusBadge status={a.status} /></td>
                <td className="px-4 py-3.5">
                  <select className="input-base w-auto h-8 text-xs" value={a.status} onChange={e => changeStatus(a, e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
