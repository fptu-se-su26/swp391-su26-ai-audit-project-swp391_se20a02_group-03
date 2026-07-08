import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { useToast } from '../../components/Toast';

const COURT_TYPES = [
  { id: 1, label: 'Cầu lông' },
  { id: 2, label: 'Pickleball' },
];

function Field({ label, children, hint }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="label-mono text-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-foreground-subtle">{hint}</span>}
    </label>
  );
}

export default function OwnerCourtCreatePage() {
  const { complexId } = useOutletContext();
  const navigate = useNavigate();
  const addToast = useToast();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', courtTypeId: 1, basePrice: 100000, description: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên sân.');
      return;
    }
    if (form.basePrice < 0) {
      setError('Giá cơ bản không hợp lệ.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.createCourt({ ...form, name: form.name.trim(), complexId });
      if (res.statusCode === 201) {
        addToast('Tạo sân thành công.', 'success');
        navigate(`/owner/courts/${res.data.courtId}`);
      } else {
        setError(res.message || 'Không tạo được sân.');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tạo sân.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <Link to="/owner/courts" className="inline-block text-sm font-bold text-foreground no-underline border-b-2 border-foreground pb-0.5">← Danh sách sân</Link>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mt-3 mb-2">Tạo sân mới</h1>
        <p className="text-sm text-foreground-muted">Sân sẽ được gán vào tổ hợp đang chọn.</p>
      </div>
      {error && <div className="text-sm text-danger bg-danger-bg border border-danger p-3 rounded-[2px]">{error}</div>}
      <form onSubmit={handleSubmit} className="border-2 border-border-strong bg-surface p-8 grid gap-5">
        <Field label="Tên sân *">
          <input
            required
            className="input-base"
            placeholder="VD: Sân cầu lông A1"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Mã sân" hint="Để trống sẽ tự sinh mã duy nhất trong tổ hợp.">
          <input
            className="input-base font-mono uppercase"
            placeholder="VD: CL-A1"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
          />
        </Field>
        <Field label="Loại sân">
          <select
            className="input-base"
            value={form.courtTypeId}
            onChange={e => setForm({ ...form, courtTypeId: parseInt(e.target.value, 10) })}
          >
            {COURT_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Giá cơ bản / giờ (VND)">
          <input
            type="number"
            min={0}
            step={1000}
            className="input-base"
            value={form.basePrice}
            onChange={e => setForm({ ...form, basePrice: parseInt(e.target.value, 10) || 0 })}
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            className="input-base h-auto py-3.5 resize-y"
            placeholder="Ghi chú về sân, thiết bị, vị trí..."
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <div className="flex gap-2.5 pt-1">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Đang tạo...' : 'Tạo sân'}
          </button>
          <Link to="/owner/courts" className="btn-outline no-underline">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
