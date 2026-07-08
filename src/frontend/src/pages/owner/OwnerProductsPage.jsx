import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';
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
      <div className="flex flex-wrap justify-between items-end gap-5">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Kho sản phẩm</h1>
        <button type="button" onClick={() => { setEditId(null); setShowForm(v => !v); }} className="btn-primary">
          + Thêm sản phẩm
        </button>
      </div>
      {error && <div className="text-sm text-danger bg-danger-bg border-2 border-danger px-3 py-2 rounded-[2px]">{error}</div>}
      <div className="flex gap-2">
        <input className="input-base flex-1 min-w-[200px]" placeholder="Tìm SKU/tên..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        <button type="button" onClick={load} className="btn-outline">Tìm</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="border-2 border-border-strong bg-surface p-6 grid md:grid-cols-3 gap-3">
          <input required className="input-base" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} disabled={!!editId} />
          <input required className="input-base" placeholder="Tên sản phẩm" value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} />
          <input className="input-base" placeholder="Danh mục" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input type="number" className="input-base" placeholder="Số lượng" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} />
          <input type="number" className="input-base" placeholder="Ngưỡng cảnh báo" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: +e.target.value })} />
          <input type="number" className="input-base" placeholder="Giá bán" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: +e.target.value })} />
          <button type="submit" className="md:col-span-3 btn-primary">{editId ? 'Cập nhật' : 'Lưu'}</button>
        </form>
      )}
      {!items.length ? <EmptyState title="Chưa có sản phẩm" subtitle="Thêm sản phẩm đầu tiên vào kho." /> : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-4 py-3.5 label-mono">SKU</th>
                <th className="text-left px-4 py-3.5 label-mono">Sản phẩm</th>
                <th className="text-left px-4 py-3.5 label-mono">Tồn</th>
                <th className="text-left px-4 py-3.5 label-mono">Giá</th>
                <th className="text-left px-4 py-3.5 label-mono">Trạng thái</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>{items.map(p => (
              <tr key={p.productStockId} className="border-t border-border-default">
                <td className="px-4 py-3.5 font-mono text-xs text-foreground-muted">{p.sku}</td>
                <td className="px-4 py-3.5 font-bold text-foreground">{p.productName}</td>
                <td className="px-4 py-3.5 text-foreground">{p.quantity}{p.isLowStock && <span className="ml-2 text-warning text-xs">Tồn thấp</span>}</td>
                <td className="px-4 py-3.5 text-foreground">{Number(p.sellingPrice).toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3.5"><OwnerStatusBadge status={p.status} /></td>
                <td className="px-4 py-3.5 text-right">
                  <button type="button" onClick={() => startEdit(p)} className="text-xs text-foreground underline bg-transparent border-none cursor-pointer">Sửa</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
