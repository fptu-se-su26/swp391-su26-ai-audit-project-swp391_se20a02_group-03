import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

export default function OwnerComplexPage() {
  const { complexId } = useOutletContext();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!complexId) return;
    let active = true;
    ownerApi.getComplex(complexId).then(res => {
      if (!active) return;
      if (res.statusCode === 200) setForm(res.data);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [complexId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await ownerApi.updateComplex(complexId, form);
      setMessage(res.message || 'Đã lưu.');
    } catch (err) {
      setMessage(typeof err === 'string' ? err : 'Lỗi lưu.');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <PageLoader label="Đang tải thông tin tổ hợp..." />;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white rounded-2xl p-6 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900">Thông tin tổ hợp</h2>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {['name', 'address', 'phone', 'email', 'openingTime', 'closingTime'].map(field => (
        <label key={field} className="block">
          <span className="text-sm font-medium text-slate-700 capitalize">{field}</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form[field] || ''}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
          />
        </label>
      ))}
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Mô tả</span>
        <textarea
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[100px]"
          value={form.description || ''}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </label>
      <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60">
        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </form>
  );
}
