import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { useToast } from '../../components/Toast';
import { 
  OwnerCard, 
  OwnerFormField, 
  OwnerBtn, 
  ownerInputCls,
  OwnerErrorState
} from '../../components/owner';
import { ChevronLeft } from 'lucide-react';

const COURT_TYPES = [
  { id: 1, label: 'Cầu lông' },
  { id: 2, label: 'Pickleball' },
];

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
    <div className="max-w-2xl mx-auto space-y-6 auth-animate-in pb-12">
      <div>
        <Link 
          to="/owner/courts" 
          className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-gray-500 hover:text-[#14b8a6] no-underline transition-colors mb-4"
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0 mb-2">Tạo sân mới</h1>
        <p className="text-sm text-gray-500 m-0">Sân sẽ được gán vào tổ hợp đang chọn.</p>
      </div>

      {error && <OwnerErrorState message={error} />}

      <OwnerCard>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <OwnerFormField label="Tên sân" required>
            <input
              required
              className={ownerInputCls}
              placeholder="VD: Sân cầu lông A1"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </OwnerFormField>
          
          <OwnerFormField 
            label="Mã sân" 
            helpText="Để trống sẽ tự sinh mã duy nhất trong tổ hợp."
          >
            <input
              className={`${ownerInputCls} font-mono uppercase`}
              placeholder="VD: CL-A1"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
            />
          </OwnerFormField>

          <OwnerFormField label="Loại sân">
            <select
              className={ownerInputCls}
              value={form.courtTypeId}
              onChange={e => setForm({ ...form, courtTypeId: parseInt(e.target.value, 10) })}
            >
              {COURT_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </OwnerFormField>

          <OwnerFormField label="Giá cơ bản / giờ (VND)">
            <input
              type="number"
              min={0}
              step={1000}
              className={ownerInputCls}
              value={form.basePrice}
              onChange={e => setForm({ ...form, basePrice: parseInt(e.target.value, 10) || 0 })}
            />
          </OwnerFormField>

          <OwnerFormField label="Mô tả">
            <textarea
              className={`${ownerInputCls} h-auto py-3 resize-y`}
              placeholder="Ghi chú về sân, thiết bị, vị trí..."
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </OwnerFormField>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
            <OwnerBtn type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? 'Đang lưu...' : 'Tạo sân'}
            </OwnerBtn>
            <OwnerBtn to="/owner/courts" variant="secondary" type="button">Hủy</OwnerBtn>
          </div>
        </form>
      </OwnerCard>
    </div>
  );
}
