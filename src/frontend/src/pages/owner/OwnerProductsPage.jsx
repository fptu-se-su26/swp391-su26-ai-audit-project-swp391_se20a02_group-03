import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import { useDebouncedValue } from '../../utils/useDebouncedValue';

export default function OwnerProductsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, 400);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ sku: '', productName: '', category: 'Racket', quantity: 0, lowStockThreshold: 5, sellingPrice: 0 });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getProducts(complexId, { keyword: debouncedKeyword, page: 1, size: 50 });
      if (res.statusCode === 200) setItems(res.data?.items || []);
      else setError(res.message);
    } catch (e) { setError(typeof e === 'string' ? e : 'Lỗi tải kho.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (complexId) load(); }, [complexId, debouncedKeyword]);

  function startEdit(p) {
    setEditId(p.productStockId);
    setForm({
      sku: p.sku,
      productName: p.productName,
      category: p.category || 'Racket',
      quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold,
      sellingPrice: p.sellingPrice,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = editId
        ? await ownerApi.updateProduct(editId, complexId, form)
        : await ownerApi.createProduct({ ...form, complexId });
      if (res.statusCode === 200 || res.statusCode === 201) {
        setShowForm(false);
        setEditId(null);
        setForm({ sku: '', productName: '', category: 'Racket', quantity: 0, lowStockThreshold: 5, sellingPrice: 0 });
        load();
      } else setError(res.message);
    } catch (e) { setError(typeof e === 'string' ? e : 'Lưu thất bại.'); }
  }

  if (loading) return <PageLoader label="Đang tải kho sản phẩm..." />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl font-bold text-slate-900">Kho sản phẩm</h2>
        <button type="button" onClick={() => { setEditId(null); setShowForm(v => !v); }} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm border-none cursor-pointer">
          + Thêm sản phẩm
        </button>
      </div>
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
      <div className="flex gap-2">
        <input className="rounded-lg border px-3 py-2 text-sm flex-1" placeholder="Tìm SKU/tên..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        <button type="button" onClick={load} className="px-3 py-2 rounded-lg border text-sm cursor-pointer">Tìm</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-4 grid md:grid-cols-3 gap-3">
          <input required className="border rounded-lg px-3 py-2 text-sm" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} disabled={!!editId} />
          <input required className="border rounded-lg px-3 py-2 text-sm" placeholder="Tên sản phẩm" value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Danh mục" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Số lượng" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} />
          <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Ngưỡng cảnh báo" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: +e.target.value })} />
          <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Giá bán" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: +e.target.value })} />
          <button type="submit" className="md:col-span-3 px-4 py-2 bg-emerald-600 text-white rounded-lg border-none cursor-pointer">{editId ? 'Cập nhật' : 'Lưu'}</button>
        </form>
      )}
      {!items.length ? <p className="text-sm text-slate-500">Chưa có sản phẩm.</p> : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>
              <th className="text-left p-3">SKU</th><th className="text-left p-3">Sản phẩm</th><th className="text-left p-3">Tồn</th><th className="text-left p-3">Giá</th><th className="text-left p-3">Trạng thái</th><th className="p-3" />
            </tr></thead>
            <tbody>{items.map(p => (
              <tr key={p.productStockId} className="border-t">
                <td className="p-3 font-mono text-xs">{p.sku}</td>
                <td className="p-3">{p.productName}</td>
                <td className="p-3">{p.quantity}{p.isLowStock && <span className="ml-2 text-amber-600 text-xs">Tồn thấp</span>}</td>
                <td className="p-3">{Number(p.sellingPrice).toLocaleString('vi-VN')} ₫</td>
                <td className="p-3"><OwnerStatusBadge status={p.status} /></td>
                <td className="p-3 text-right">
                  <button type="button" onClick={() => startEdit(p)} className="text-xs text-emerald-700 underline bg-transparent border-none cursor-pointer">Sửa</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

