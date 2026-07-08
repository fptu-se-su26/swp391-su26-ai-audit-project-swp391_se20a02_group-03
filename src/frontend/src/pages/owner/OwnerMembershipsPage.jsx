import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

export default function OwnerMembershipsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    tier: 'Standard',
    discountPercent: 10,
    validFrom: '',
    validTo: '',
  });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getMemberships(complexId);
      if (res.statusCode === 200) setItems(res.data || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải được membership.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (complexId) load(); }, [complexId]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await ownerApi.createMembership(complexId, {
        userId: +form.userId,
        tier: form.tier,
        discountPercent: +form.discountPercent,
        validFrom: new Date(form.validFrom).toISOString(),
        validTo: new Date(form.validTo).toISOString(),
      });
      if (res.statusCode === 201) {
        setShowForm(false);
        load();
      } else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Tạo membership thất bại.');
    }
  }

  async function toggleStatus(m) {
    const next = m.status === 'Active' ? 'Suspended' : 'Active';
    if (!window.confirm(`Đổi trạng thái membership #${m.membershipId} sang ${next}?`)) return;
    try {
      const res = await ownerApi.updateMembershipStatus(m.membershipId, complexId, next);
      if (res.statusCode === 200) load();
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Cập nhật thất bại.');
    }
  }

  if (loading) return <PageLoader label="Đang tải membership..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-5">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Gói hội viên</h1>
          <p className="text-sm text-foreground-muted">Khách có membership active được giảm giá khi đặt sân.</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)} className="btn-primary">
          + Thêm membership
        </button>
      </div>
      {error && <div className="text-sm text-danger">{error}</div>}
      {showForm && (
        <form onSubmit={handleCreate} className="card-base p-5 grid md:grid-cols-3 gap-3">
          <input required type="number" min={1} className="input-base" placeholder="User ID khách" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} />
          <input className="input-base" placeholder="Hạng (Standard/VIP)" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} />
          <input type="number" min={0} max={100} className="input-base" placeholder="% giảm" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />
          <input type="date" required className="input-base" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} />
          <input type="date" required className="input-base" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })} />
          <button type="submit" className="md:col-span-3 btn-primary">Tạo</button>
        </form>
      )}
      {!items.length ? (
        <EmptyState title="Chưa có gói hội viên" subtitle="Chưa có gói hội viên nào." />
      ) : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-4 py-3.5 label-mono">Khách</th>
                <th className="text-left px-4 py-3.5 label-mono">Hạng</th>
                <th className="text-left px-4 py-3.5 label-mono">Giảm</th>
                <th className="text-left px-4 py-3.5 label-mono">Hiệu lực</th>
                <th className="text-left px-4 py-3.5 label-mono">Trạng thái</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.membershipId} className="border-t border-border-default hover:bg-surface-hover">
                  <td className="px-4 py-3.5 text-foreground font-extrabold">{m.userName} <span className="text-xs text-foreground-subtle font-normal">#{m.userId}</span></td>
                  <td className="px-4 py-3.5 text-foreground">{m.tier}</td>
                  <td className="px-4 py-3.5 text-foreground">{m.discountPercent}%</td>
                  <td className="px-4 py-3.5 text-foreground text-xs">{m.validFrom?.slice?.(0, 10)} → {m.validTo?.slice?.(0, 10)}</td>
                  <td className="px-4 py-3.5"><OwnerStatusBadge status={m.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    <button type="button" className="text-xs font-extrabold uppercase text-accent underline bg-transparent border-none cursor-pointer" onClick={() => toggleStatus(m)}>
                      {m.status === 'Active' ? 'Tạm dừng' : 'Kích hoạt'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
