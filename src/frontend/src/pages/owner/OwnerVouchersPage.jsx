import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

export default function OwnerVouchersPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', voucherType: 'Percent', discountPercent: 10, totalQuantity: 100, startDate: '', endDate: '' });

  async function load() {
    try {
      setError(null);
      const res = await ownerApi.getVouchers(complexId);
      if (res.statusCode === 200) setItems(res.data || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải voucher.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (complexId) load(); }, [complexId]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await ownerApi.createVoucher(complexId, {
        ...form,
        totalQuantity: +form.totalQuantity,
        discountPercent: +form.discountPercent,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      });
      if (res.statusCode === 201) { setShowForm(false); load(); }
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Tạo voucher thất bại.');
    }
  }

  async function toggleStatus(v) {
    const next = v.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await ownerApi.updateVoucherStatus(v.voucherId, complexId, { status: next });
      if (res.statusCode === 200) load();
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Cập nhật thất bại.');
    }
  }

  if (loading) return <PageLoader label="Đang tải voucher..." />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Voucher</h2>
        <button type="button" onClick={() => setShowForm(v => !v)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg border-none cursor-pointer text-sm">+ Tạo voucher</button>
      </div>
      {error && <div className="text-sm text-red-700 bg-red-50 border rounded-lg px-3 py-2">{error}</div>}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border rounded-xl p-4 grid md:grid-cols-3 gap-3">
          <input required className="border rounded-lg px-3 py-2 text-sm" placeholder="Mã" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          <input required className="border rounded-lg px-3 py-2 text-sm" placeholder="Tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <select className="border rounded-lg px-3 py-2 text-sm" value={form.voucherType} onChange={e => setForm({ ...form, voucherType: e.target.value })}>
            <option value="Percent">Phần trăm</option>
            <option value="TryBeforeYouBuy">Dùng thử</option>
          </select>
          <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="% giảm" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />
          <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Số lượng" value={form.totalQuantity} onChange={e => setForm({ ...form, totalQuantity: e.target.value })} />
          <input type="date" required className="border rounded-lg px-3 py-2 text-sm" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          <input type="date" required className="border rounded-lg px-3 py-2 text-sm md:col-span-2" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          <button type="submit" className="md:col-span-3 px-4 py-2 bg-emerald-600 text-white rounded-lg border-none cursor-pointer">Lưu</button>
        </form>
      )}
      <div className="grid md:grid-cols-2 gap-3">
        {items.map(v => (
          <div key={v.voucherId} className="bg-white border rounded-xl p-4">
            <div className="flex justify-between items-start gap-2">
              <div><strong>{v.code}</strong><OwnerStatusBadge status={v.status} /></div>
              <button type="button" onClick={() => toggleStatus(v)} className="text-xs text-emerald-700 underline bg-transparent border-none cursor-pointer">
                {v.status === 'Active' ? 'Tắt' : 'Bật'}
              </button>
            </div>
            <p className="text-sm text-slate-600 mt-1">{v.name} · {v.voucherType}</p>
            <p className="text-xs text-slate-500 mt-2">Đã dùng {v.usedQuantity}/{v.totalQuantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
