import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

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
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gói hội viên</h2>
          <p className="text-sm text-slate-500">Khách có membership active được giảm giá khi đặt sân.</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm border-none cursor-pointer">
          + Thêm membership
        </button>
      </div>
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border rounded-xl p-4 grid md:grid-cols-3 gap-3">
          <input required type="number" min={1} className="border rounded-lg px-3 py-2 text-sm" placeholder="User ID khách" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Hạng (Standard/VIP)" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} />
          <input type="number" min={0} max={100} className="border rounded-lg px-3 py-2 text-sm" placeholder="% giảm" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />
          <input type="date" required className="border rounded-lg px-3 py-2 text-sm" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} />
          <input type="date" required className="border rounded-lg px-3 py-2 text-sm" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })} />
          <button type="submit" className="md:col-span-3 px-4 py-2 bg-emerald-600 text-white rounded-lg border-none cursor-pointer">Tạo</button>
        </form>
      )}
      {!items.length ? (
        <p className="text-sm text-slate-500">Chưa có gói hội viên nào.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Khách</th>
                <th className="text-left p-3">Hạng</th>
                <th className="text-left p-3">Giảm</th>
                <th className="text-left p-3">Hiệu lực</th>
                <th className="text-left p-3">TT</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.membershipId} className="border-t">
                  <td className="p-3">{m.userName} <span className="text-xs text-slate-400">#{m.userId}</span></td>
                  <td className="p-3">{m.tier}</td>
                  <td className="p-3">{m.discountPercent}%</td>
                  <td className="p-3 text-xs">{m.validFrom?.slice?.(0, 10)} → {m.validTo?.slice?.(0, 10)}</td>
                  <td className="p-3"><OwnerStatusBadge status={m.status} /></td>
                  <td className="p-3 text-right">
                    <button type="button" className="text-xs text-emerald-700 underline bg-transparent border-none cursor-pointer" onClick={() => toggleStatus(m)}>
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
