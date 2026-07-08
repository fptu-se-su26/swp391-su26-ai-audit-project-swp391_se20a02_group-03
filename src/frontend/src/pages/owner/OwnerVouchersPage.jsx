import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

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
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-5">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Voucher</h1>
        <button type="button" onClick={() => setShowForm(v => !v)} className="btn-primary">+ Tạo voucher</button>
      </div>
      {error && <div className="text-sm text-danger">{error}</div>}
      {showForm && (
        <form onSubmit={handleCreate} className="card-base p-5 grid md:grid-cols-3 gap-3">
          <input required className="input-base" placeholder="Mã" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          <input required className="input-base" placeholder="Tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <select className="input-base" value={form.voucherType} onChange={e => setForm({ ...form, voucherType: e.target.value })}>
            <option value="Percent">Phần trăm</option>
            <option value="TryBeforeYouBuy">Dùng thử</option>
          </select>
          <input type="number" className="input-base" placeholder="% giảm" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />
          <input type="number" className="input-base" placeholder="Số lượng" value={form.totalQuantity} onChange={e => setForm({ ...form, totalQuantity: e.target.value })} />
          <input type="date" required className="input-base" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          <input type="date" required className="input-base md:col-span-2" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          <button type="submit" className="md:col-span-3 btn-primary">Lưu</button>
        </form>
      )}
      {!items.length ? (
        <EmptyState title="Chưa có voucher" subtitle="Chưa có voucher nào được tạo." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(v => (
            <div key={v.voucherId} className="border-2 border-border-strong bg-surface p-6">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg text-foreground">{v.code}</span>
                  <OwnerStatusBadge status={v.status} />
                </div>
                <button type="button" onClick={() => toggleStatus(v)} className="text-xs font-extrabold uppercase text-accent underline bg-transparent border-none cursor-pointer">
                  {v.status === 'Active' ? 'Tắt' : 'Bật'}
                </button>
              </div>
              <p className="text-sm text-foreground-muted mb-2.5">{v.name} · {v.voucherType}</p>
              <p className="label-mono text-foreground-subtle">Đã dùng {v.usedQuantity}/{v.totalQuantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
