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
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-2">Chính sách hủy &amp; hoàn tiền</h1>
      <p className="text-xs text-foreground-subtle mb-7">Áp dụng khi khách hủy đặt sân tại tổ hợp này.</p>

      <form onSubmit={handleSubmit} className="border-2 border-border-strong bg-surface p-8 flex flex-col gap-5">
        {error && <div className="text-sm text-danger bg-danger-bg border border-danger px-3 py-2 rounded-[2px]">{error}</div>}
        {message && <div className="text-sm text-accent bg-surface border border-accent px-3 py-2 rounded-[2px]">{message}</div>}

        <div>
          <label className="block label-mono text-foreground mb-1.5">Hoàn 100% nếu hủy trước (giờ)</label>
          <input type="number" min={0} className="input-base" value={form.fullRefundHoursBefore} onChange={e => setForm({ ...form, fullRefundHoursBefore: +e.target.value })} />
        </div>
        <div>
          <label className="block label-mono text-foreground mb-1.5">Hoàn một phần nếu hủy trước (giờ)</label>
          <input type="number" min={0} className="input-base" value={form.partialRefundHoursBefore} onChange={e => setForm({ ...form, partialRefundHoursBefore: +e.target.value })} />
        </div>
        <div>
          <label className="block label-mono text-foreground mb-1.5">% hoàn khi hủy muộn (partial window)</label>
          <input type="number" min={0} max={100} className="input-base" value={form.partialRefundPercent} onChange={e => setForm({ ...form, partialRefundPercent: +e.target.value })} />
        </div>
        <div>
          <label className="block label-mono text-foreground mb-1.5">% phạt sau partial window</label>
          <input type="number" min={0} max={100} className="input-base" value={form.penaltyPercentAfterPartial} onChange={e => setForm({ ...form, penaltyPercentAfterPartial: +e.target.value })} />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <input type="checkbox" checked={form.weatherFullRefundEnabled} onChange={e => setForm({ ...form, weatherFullRefundEnabled: e.target.checked })} className="w-[18px] h-[18px] accent-[var(--theme-primary)]" />
          <span>Hoàn 100% khi thời tiết xấu (nếu bật)</span>
        </label>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Đang lưu...' : 'Lưu chính sách'}
        </button>
      </form>
    </div>
  );
}
