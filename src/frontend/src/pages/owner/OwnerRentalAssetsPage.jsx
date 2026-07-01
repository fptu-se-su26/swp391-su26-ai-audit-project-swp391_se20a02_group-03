import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

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
      <h2 className="text-xl font-bold text-slate-900">Thiết bị cho thuê</h2>
      {error && <div className="text-sm text-red-700 bg-red-50 border rounded-lg px-3 py-2">{error}</div>}
      <form onSubmit={handleCreate} className="bg-white border rounded-xl p-4 flex flex-wrap gap-2 items-end">
        <select required className="border rounded-lg px-3 py-2 text-sm" value={form.productStockId} onChange={e => setForm({ ...form, productStockId: e.target.value })}>
          <option value="">Chọn sản phẩm</option>
          {products.map(p => <option key={p.productStockId} value={p.productStockId}>{p.productName}</option>)}
        </select>
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Mã asset (tùy chọn)" value={form.assetCode} onChange={e => setForm({ ...form, assetCode: e.target.value })} />
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg border-none cursor-pointer text-sm">Thêm asset</button>
      </form>
      {!assets.length ? <p className="text-sm text-slate-500">Chưa có asset.</p> : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>
              <th className="text-left p-3">Mã</th><th className="text-left p-3">Sản phẩm</th><th className="text-left p-3">Tình trạng</th><th className="text-left p-3">Lượt thuê</th><th className="text-left p-3">Trạng thái</th><th className="p-3" />
            </tr></thead>
            <tbody>{assets.map(a => (
              <tr key={a.rentalAssetId} className="border-t">
                <td className="p-3 font-mono">{a.assetCode}</td>
                <td className="p-3">{a.productName}</td>
                <td className="p-3">{a.condition}</td>
                <td className="p-3">{a.rentCount}</td>
                <td className="p-3"><OwnerStatusBadge status={a.status} /></td>
                <td className="p-3">
                  <select className="text-xs border rounded px-1 py-0.5" value={a.status} onChange={e => changeStatus(a, e.target.value)}>
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
