import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import StatusBadge from '../../components/ui/StatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import { useToast } from '../../components/Toast';

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="label-mono text-foreground">{label}</span>
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
      <div className="text-danger">
        {error}{' '}
        <button type="button" className="underline bg-transparent border-none cursor-pointer" onClick={load}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/owner/courts" className="inline-block text-sm font-bold text-foreground no-underline border-b-2 border-foreground pb-0.5">← Danh sách sân</Link>
      <div className="flex flex-wrap items-center gap-3.5">
        <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground">{court?.name}</h1>
        <StatusBadge status={court?.status} />
      </div>
      {error && <div className="text-sm text-danger bg-danger-bg border border-danger p-3 rounded-[2px]">{error}</div>}

      <form onSubmit={save} className="border-2 border-border-strong bg-surface p-8 grid gap-5">
        <Field label="Tên sân">
          <input
            className="input-base"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Mã sân">
          <input
            className="input-base font-mono uppercase"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
            placeholder="Mã sân"
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            className="input-base h-auto py-3.5 resize-y"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>

      <div className="border-2 border-border-strong bg-surface p-6 space-y-4">
        <h3 className="font-heading text-base uppercase tracking-tight text-foreground">Trạng thái vận hành</h3>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className="btn-outline" onClick={() => setStatus('ACTIVE')}>Hoạt động</button>
          <button type="button" className="btn-outline" onClick={() => setStatus('MAINTENANCE')}>Bảo trì</button>
          <button type="button" className="btn-outline" onClick={() => setStatus('INACTIVE')}>Ngưng hoạt động</button>
          <Link to={`/owner/pricing?courtId=${courtId}`} className="btn-primary no-underline">Quy tắc giá</Link>
        </div>
      </div>

      <div className="border-2 border-danger bg-danger-bg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-extrabold text-sm text-foreground mb-1">Xóa sân</p>
          <p className="text-xs text-danger">Hành động này không thể hoàn tác. Sân có booking sắp tới sẽ bị từ chối xóa.</p>
        </div>
        <button
          type="button"
          onClick={removeCourt}
          className="inline-flex items-center justify-center gap-2 px-5 h-10 font-sans text-sm font-extrabold uppercase tracking-[0.04em] rounded-[2px] border-2 border-danger bg-danger text-paper transition-colors duration-150 hover:opacity-90"
        >
          Xóa sân
        </button>
      </div>
    </div>
  );
}
