import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

const DEFAULT = {
  fullRefundHoursBefore: 48,
  partialRefundHoursBefore: 24,
  partialRefundPercent: 50,
  penaltyPercentAfterPartial: 80,
  weatherFullRefundEnabled: true,
};

export default function OwnerCancellationPolicyPage() {
  const { complexId } = useOutletContext();
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!complexId) return;
    ownerApi.getCancellationPolicy(complexId)
      .then(res => {
        if (res.statusCode === 200 && res.data) setForm({ ...DEFAULT, ...res.data });
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được chính sách.'))
      .finally(() => setLoading(false));
  }, [complexId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await ownerApi.saveCancellationPolicy(complexId, { ...form, complexId });
      if (res.statusCode === 200) setMessage(res.message || 'Đã lưu chính sách hủy.');
      else setError(res.message || 'Lưu thất bại.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader label="Đang tải chính sách hủy..." />;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white rounded-2xl p-6 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900">Chính sách hủy & hoàn tiền</h2>
      <p className="text-sm text-slate-500">Áp dụng khi khách hủy đặt sân tại tổ hợp này.</p>
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
      {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{message}</div>}
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Hoàn 100% nếu hủy trước (giờ)</span>
        <input type="number" min={0} className="mt-1 w-full rounded-lg border px-3 py-2" value={form.fullRefundHoursBefore} onChange={e => setForm({ ...form, fullRefundHoursBefore: +e.target.value })} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Hoàn một phần nếu hủy trước (giờ)</span>
        <input type="number" min={0} className="mt-1 w-full rounded-lg border px-3 py-2" value={form.partialRefundHoursBefore} onChange={e => setForm({ ...form, partialRefundHoursBefore: +e.target.value })} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">% hoàn khi hủy muộn (partial window)</span>
        <input type="number" min={0} max={100} className="mt-1 w-full rounded-lg border px-3 py-2" value={form.partialRefundPercent} onChange={e => setForm({ ...form, partialRefundPercent: +e.target.value })} />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">% phạt sau partial window</span>
        <input type="number" min={0} max={100} className="mt-1 w-full rounded-lg border px-3 py-2" value={form.penaltyPercentAfterPartial} onChange={e => setForm({ ...form, penaltyPercentAfterPartial: +e.target.value })} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.weatherFullRefundEnabled} onChange={e => setForm({ ...form, weatherFullRefundEnabled: e.target.checked })} />
        <span>Hoàn 100% khi thời tiết xấu (nếu bật)</span>
      </label>
      <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60">
        {saving ? 'Đang lưu...' : 'Lưu chính sách'}
      </button>
    </form>
  );
}
