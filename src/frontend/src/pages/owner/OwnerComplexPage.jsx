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
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-7">Thông tin tổ hợp</h1>

      <form onSubmit={handleSubmit} className="border-2 border-border-strong bg-surface p-8 flex flex-col gap-5">
        {message && <p className="text-sm text-accent">{message}</p>}

        <div>
          <label className="block label-mono text-foreground mb-1.5">Name</label>
          <input
            className="input-base"
            value={form.name || ''}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block label-mono text-foreground mb-1.5">Address</label>
          <input
            className="input-base"
            value={form.address || ''}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block label-mono text-foreground mb-1.5">Phone</label>
            <input
              className="input-base"
              value={form.phone || ''}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block label-mono text-foreground mb-1.5">Email</label>
            <input
              className="input-base"
              value={form.email || ''}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block label-mono text-foreground mb-1.5">OpeningTime</label>
            <input
              className="input-base"
              value={form.openingTime || ''}
              onChange={e => setForm({ ...form, openingTime: e.target.value })}
            />
          </div>
          <div>
            <label className="block label-mono text-foreground mb-1.5">ClosingTime</label>
            <input
              className="input-base"
              value={form.closingTime || ''}
              onChange={e => setForm({ ...form, closingTime: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block label-mono text-foreground mb-1.5">Mô tả</label>
          <textarea
            rows={3}
            className="input-base h-auto py-3.5 resize-y min-h-[100px]"
            value={form.description || ''}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
}
