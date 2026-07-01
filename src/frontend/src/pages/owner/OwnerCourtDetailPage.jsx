import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import { useToast } from '../../components/Toast';

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function OwnerCourtDetailPage() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const addToast = useToast();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getCourt(courtId);
      if (res.statusCode === 200) {
        setCourt(res.data);
        setForm({ name: res.data.name, code: res.data.code || '', description: res.data.description || '' });
      } else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải sân.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [courtId]);

  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Tên sân không được để trống.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await ownerApi.updateCourt(courtId, { ...form, name: form.name.trim() });
      if (res.statusCode === 200) {
        addToast('Đã lưu thay đổi.', 'success');
        load();
      } else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi cập nhật.');
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(status) {
    try {
      setError(null);
      const res = await ownerApi.updateCourtStatus(courtId, status);
      if (res.statusCode === 200) {
        addToast('Đã cập nhật trạng thái sân.', 'success');
        load();
      } else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi cập nhật trạng thái.');
    }
  }

  async function removeCourt() {
    if (!window.confirm(`Xóa sân "${court?.name}"? Sân có lịch đặt trong tương lai sẽ không thể xóa.`)) return;
    try {
      setError(null);
      const res = await ownerApi.deleteCourt(courtId);
      if (res.statusCode === 200) {
        addToast('Đã xóa sân.', 'success');
        navigate('/owner/courts');
      } else setError(res.message || 'Không xóa được sân.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không xóa được sân.');
    }
  }

  if (loading) return <PageLoader label="Đang tải sân..." />;
  if (error && !court) {
    return (
      <div className="text-red-600">
        {error}{' '}
        <button type="button" className="underline bg-transparent border-none cursor-pointer" onClick={load}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link to="/owner/courts" className="text-sm text-emerald-700 no-underline">← Danh sách sân</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-slate-900">{court?.name}</h2>
        <OwnerStatusBadge status={court?.status} type="court" />
      </div>
      {error && <div className="text-sm text-red-600 rounded-lg border border-red-200 bg-red-50 p-3">{error}</div>}

      <form onSubmit={save} className="bg-white rounded-xl border p-5 grid gap-4">
        <Field label="Tên sân">
          <input
            className="rounded-lg border px-3 py-2 text-sm"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Mã sân">
          <input
            className="rounded-lg border px-3 py-2 text-sm font-mono uppercase"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
            placeholder="Mã sân"
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            className="rounded-lg border px-3 py-2 text-sm"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 text-white py-2 text-sm disabled:opacity-50">
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>

      <div className="bg-white rounded-xl border p-5 space-y-3">
        <p className="text-sm font-medium text-slate-700">Trạng thái vận hành</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="px-3 py-1.5 rounded-lg border text-sm hover:bg-emerald-50" onClick={() => setStatus('ACTIVE')}>Hoạt động</button>
          <button type="button" className="px-3 py-1.5 rounded-lg border text-sm hover:bg-amber-50" onClick={() => setStatus('MAINTENANCE')}>Bảo trì</button>
          <button type="button" className="px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-100" onClick={() => setStatus('INACTIVE')}>Ngưng hoạt động</button>
          <Link to={`/owner/pricing?courtId=${courtId}`} className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm no-underline text-slate-700">Quy tắc giá</Link>
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-red-800">Xóa sân</p>
          <p className="text-xs text-red-600 mt-1">Hành động này không thể hoàn tác. Sân có booking sắp tới sẽ bị từ chối xóa.</p>
        </div>
        <button type="button" onClick={removeCourt} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm border-none cursor-pointer">
          Xóa sân
        </button>
      </div>
    </div>
  );
}
