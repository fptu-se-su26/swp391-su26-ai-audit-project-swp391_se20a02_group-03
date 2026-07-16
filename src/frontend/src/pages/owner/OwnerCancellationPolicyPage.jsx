import { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { 
  OwnerPageHeader, 
  OwnerCard, 
  OwnerBtn,
  OwnerFormField,
  OwnerErrorState,
  ownerInputCls
} from '../../components/owner';
import { ShieldCheck, CloudRain, Clock, AlertCircle } from 'lucide-react';

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
  const [loadedComplexId, setLoadedComplexId] = useState(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!complexId) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setMessage(null);
    setLoadedComplexId(null);

    try {
      const res = await ownerApi.getCancellationPolicy(complexId);
      if (requestId !== requestIdRef.current) return;
      if (res.statusCode !== 200 || !res.data) {
        throw new Error(res.message || 'Không tải được chính sách.');
      }
      setForm({ ...DEFAULT, ...res.data });
      setLoadedComplexId(complexId);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(typeof err === 'string' ? err : err?.message || 'Không tải được chính sách.');
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [complexId]);

  useEffect(() => {
    load();
    return () => {
      requestIdRef.current += 1;
    };
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loadedComplexId !== complexId || saving) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await ownerApi.saveCancellationPolicy(complexId, { ...form, complexId });
      if (res.statusCode === 200 || res.statusCode === 204) {
        setMessage(res.message || 'Đã lưu chính sách hủy.');
        setTimeout(() => setMessage(null), 5000);
      } else {
        setError(res.message || 'Lưu thất bại.');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-20 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6"></div>
        <div className="h-64 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6"></div>
      </div>
    );
  }

  if (loadedComplexId !== complexId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 auth-animate-in pb-12">
        <OwnerPageHeader
          title="Chính sách hủy sân"
          description="Thiết lập các quy định hoàn tiền khi khách hàng hủy hoặc vắng mặt."
        />
        <OwnerErrorState message={error || 'Không tải được chính sách.'} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Chính sách hủy sân" 
        description="Thiết lập các quy định hoàn tiền khi khách hàng hủy hoặc vắng mặt."
      />

      {error && <OwnerErrorState message={error} onRetry={load} />}

      {message && (
        <div className="bg-teal-50 border border-teal-100 rounded-[16px] px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#14b8a6] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <p className="text-sm font-medium text-teal-700 m-0">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <OwnerCard>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <ShieldCheck size={20} className="text-[#14b8a6]" />
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Hoàn tiền theo thời gian</h3>
          </div>

          <div className="space-y-6">
            <OwnerFormField label="Hoàn tiền 100% nếu hủy trước (Giờ)">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Clock size={16} />
                </div>
                <input 
                  type="number" 
                  min={0} 
                  className={`${ownerInputCls} pl-10`} 
                  value={form.fullRefundHoursBefore} 
                  onChange={e => setForm({ ...form, fullRefundHoursBefore: +e.target.value })} 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-sm text-gray-500 font-bold">
                  Giờ
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 ml-1">Khoảng thời gian khách được phép hủy và nhận lại toàn bộ tiền.</p>
            </OwnerFormField>

            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-[12px] border border-gray-100">
              <OwnerFormField label="Hoàn một phần nếu hủy trước">
                <div className="relative">
                  <input 
                    type="number" 
                    min={0} 
                    className={ownerInputCls} 
                    value={form.partialRefundHoursBefore} 
                    onChange={e => setForm({ ...form, partialRefundHoursBefore: +e.target.value })} 
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-sm text-gray-500 font-bold">
                    Giờ
                  </div>
                </div>
              </OwnerFormField>

              <OwnerFormField label="Tỷ lệ hoàn tiền">
                <div className="relative">
                  <input 
                    type="number" 
                    min={0} 
                    max={100} 
                    className={ownerInputCls} 
                    value={form.partialRefundPercent} 
                    onChange={e => setForm({ ...form, partialRefundPercent: +e.target.value })} 
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-sm text-gray-500 font-bold">
                    %
                  </div>
                </div>
              </OwnerFormField>
            </div>

            <OwnerFormField label="Phí phạt hủy sát giờ / Vắng mặt">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-400">
                  <AlertCircle size={16} />
                </div>
                <input 
                  type="number" 
                  min={0} 
                  max={100} 
                  className={`${ownerInputCls} pl-10`} 
                  value={form.penaltyPercentAfterPartial} 
                  onChange={e => setForm({ ...form, penaltyPercentAfterPartial: +e.target.value })} 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-sm text-gray-500 font-bold">
                  %
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 ml-1">Tỷ lệ phí giữ lại khi khách hủy sau thời hạn "hoàn một phần" hoặc không đến.</p>
            </OwnerFormField>
          </div>
        </OwnerCard>

        <OwnerCard>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="flex items-center h-5 mt-0.5">
              <input 
                type="checkbox" 
                checked={form.weatherFullRefundEnabled} 
                onChange={e => setForm({ ...form, weatherFullRefundEnabled: e.target.checked })} 
                className="w-4 h-4 text-[#14b8a6] border-gray-300 rounded focus:ring-[#14b8a6]" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CloudRain size={16} className="text-blue-500" />
                <span className="text-sm font-bold text-[#0f172a] group-hover:text-[#14b8a6] transition-colors">Bảo vệ khách hàng khi thời tiết xấu</span>
              </div>
              <p className="text-sm text-gray-500 m-0 leading-relaxed">
                Khi kích hoạt, khách hàng sẽ được hoàn tiền 100% nếu họ hủy do điều kiện thời tiết khắc nghiệt (mưa bão, ngập lụt) bất kể thời gian hủy. Bạn sẽ cần duyệt thủ công các yêu cầu này.
              </p>
            </div>
          </label>
        </OwnerCard>

        <div className="flex justify-end pt-4">
          <OwnerBtn type="submit" disabled={saving || loadedComplexId !== complexId} className="px-8 py-3">
            {saving ? 'Đang lưu...' : 'Lưu chính sách'}
          </OwnerBtn>
        </div>
      </form>
    </div>
  );
}
