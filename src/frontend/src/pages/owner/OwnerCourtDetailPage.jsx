import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { useToast } from '../../components/Toast';
import {
  OwnerCard,
  OwnerFormField,
  OwnerBtn,
  ownerInputCls,
  OwnerErrorState,
  OwnerStatusBadge
} from '../../components/owner';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded-[4px] mb-4"></div>
        <div className="h-10 w-64 bg-gray-200 rounded-[8px]"></div>
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-8 h-96"></div>
      </div>
    );
  }

  if (error && !court) {
    return <OwnerErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 auth-animate-in pb-12">
      <div>
        <Link
          to="/owner/courts"
          className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-gray-500 hover:text-[#14b8a6] no-underline transition-colors mb-4"
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0">{court?.name}</h1>
          <OwnerStatusBadge status={court?.status} type="court" />
        </div>
      </div>

      {error && <OwnerErrorState message={error} />}

      <OwnerCard>
        <form onSubmit={save} className="grid gap-6">
          <OwnerFormField label="Tên sân" required>
            <input
              className={ownerInputCls}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </OwnerFormField>

          <OwnerFormField label="Mã sân">
            <input
              className={`${ownerInputCls} font-mono uppercase`}
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
              placeholder="Mã sân"
            />
          </OwnerFormField>

          <OwnerFormField label="Mô tả">
            <textarea
              className={`${ownerInputCls} h-auto py-3 resize-y`}
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </OwnerFormField>

          <div className="pt-4 border-t border-gray-100 mt-2">
            <OwnerBtn type="submit" disabled={saving} className="min-w-[120px]">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </OwnerBtn>
          </div>
        </form>
      </OwnerCard>

      <OwnerCard className="space-y-4">
        <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">Trạng thái vận hành</h3>
        <div className="flex flex-wrap gap-3">
          <OwnerBtn variant="secondary" onClick={() => setStatus('ACTIVE')}>Hoạt động</OwnerBtn>
          <OwnerBtn variant="secondary" onClick={() => setStatus('MAINTENANCE')}>Bảo trì</OwnerBtn>
          <OwnerBtn variant="secondary" onClick={() => setStatus('INACTIVE')}>Ngưng hoạt động</OwnerBtn>
          <OwnerBtn to={`/owner/pricing?courtId=${courtId}`} variant="primary">Quy tắc giá</OwnerBtn>
        </div>
      </OwnerCard>

      <OwnerCard className="bg-red-50/50 border-red-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-red-600">
              <AlertTriangle size={18} />
              <p className="font-bold text-sm uppercase tracking-wide m-0">Xóa sân</p>
            </div>
            <p className="text-sm text-red-500 m-0">Hành động này không thể hoàn tác. Sân có booking sắp tới sẽ bị từ chối xóa.</p>
          </div>
          <OwnerBtn variant="danger" onClick={removeCourt} className="shrink-0">
            Xóa sân
          </OwnerBtn>
        </div>
      </OwnerCard>
    </div>
  );
}
