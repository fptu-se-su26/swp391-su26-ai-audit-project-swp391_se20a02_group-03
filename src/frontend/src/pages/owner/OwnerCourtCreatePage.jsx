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
      <span className="font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
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
    <div className="max-w-2xl space-y-4">
      <div>
        <Link to="/owner/courts" className="text-sm text-emerald-700 no-underline">← Danh sách sân</Link>
        <h2 className="text-xl font-bold text-slate-900 mt-2">Tạo sân mới</h2>
        <p className="text-sm text-slate-500 mt-1">Sân sẽ được gán vào tổ hợp đang chọn.</p>
      </div>
      {error && <div className="text-sm text-red-600 rounded-lg border border-red-200 bg-red-50 p-3">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-5 grid gap-4">
        <Field label="Tên sân *">
          <input
            required
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="VD: Sân cầu lông A1"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Mã sân" hint="Để trống sẽ tự sinh mã duy nhất trong tổ hợp.">
          <input
            className="rounded-lg border px-3 py-2 text-sm font-mono uppercase"
            placeholder="VD: CL-A1"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
          />
        </Field>
        <Field label="Loại sân">
          <select
            className="rounded-lg border px-3 py-2 text-sm"
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
            className="rounded-lg border px-3 py-2 text-sm"
            value={form.basePrice}
            onChange={e => setForm({ ...form, basePrice: parseInt(e.target.value, 10) || 0 })}
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="Ghi chú về sân, thiết bị, vị trí..."
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={loading} className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50">
            {loading ? 'Đang tạo...' : 'Tạo sân'}
          </button>
          <Link to="/owner/courts" className="rounded-lg border px-4 py-2 text-sm text-slate-600 no-underline">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
