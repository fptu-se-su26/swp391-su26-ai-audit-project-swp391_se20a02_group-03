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
import { Store, MapPin, Phone, Mail, Clock, AlignLeft } from 'lucide-react';

export default function OwnerComplexPage() {
  const { complexId } = useOutletContext();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
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
      const res = await ownerApi.getComplex(complexId);
      if (requestId !== requestIdRef.current) return;
      if (res.statusCode === 200) {
        setForm(res.data);
        setLoadedComplexId(complexId);
      } else {
        throw new Error(res.message || 'Lỗi tải thông tin tổ hợp.');
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(typeof err === 'string' ? err : err?.message || 'Lỗi tải thông tin tổ hợp.');
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
    if (!form.name?.trim() || !form.address?.trim() || !form.phone?.trim() || !form.email?.trim()) {
      setError('Vui lòng nhập đầy đủ tên, địa chỉ, số điện thoại và email hỗ trợ.');
      return;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        openingTime: form.openingTime ? String(form.openingTime).substring(0, 5) : form.openingTime,
        closingTime: form.closingTime ? String(form.closingTime).substring(0, 5) : form.closingTime,
      };
      const res = await ownerApi.updateComplex(complexId, payload);
      if (res.statusCode === 200 || res.statusCode === 204) {
        setMessage('Đã lưu thông tin thành công.');
        // clear message after 3s
        setTimeout(() => setMessage(null), 3000);
      } else {
        setError(res.message || 'Lỗi lưu thông tin.');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi lưu thông tin.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-20 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6"></div>
        <div className="h-96 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6"></div>
      </div>
    );
  }

  if (loadedComplexId !== complexId || !form) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 auth-animate-in pb-12">
        <OwnerPageHeader
          title="Thông tin tổ hợp"
          description="Cập nhật thông tin cơ bản, địa chỉ và thông tin liên hệ của tổ hợp."
        />
        <OwnerErrorState message={error || 'Không tải được thông tin tổ hợp.'} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Thông tin tổ hợp" 
        description="Cập nhật thông tin cơ bản, địa chỉ và thông tin liên hệ của tổ hợp."
      />

      {message && (
        <div className="bg-teal-50 border border-teal-100 rounded-[16px] px-6 py-4 flex items-center justify-between">
          <p className="text-sm font-medium text-teal-700 m-0">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-[16px] px-6 py-4 flex items-center justify-between">
          <p className="text-sm font-medium text-red-600 m-0">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <OwnerCard>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Store size={20} className="text-[#14b8a6]" />
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Thông tin cơ bản</h3>
          </div>
          
          <div className="space-y-6">
            <OwnerFormField label="Tên tổ hợp" required>
              <input
                required
                className={ownerInputCls}
                placeholder="VD: ProSport Center Quận 1"
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </OwnerFormField>

            <OwnerFormField label="Địa chỉ chi tiết" required>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={16} />
                </div>
                <input
                  required
                  className={`${ownerInputCls} pl-10`}
                  placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                  value={form.address || ''}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </OwnerFormField>

            <OwnerFormField label="Mô tả">
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400">
                  <AlignLeft size={16} />
                </div>
                <textarea
                  rows={4}
                  className={`${ownerInputCls} pl-10 py-3 resize-y`}
                  placeholder="Giới thiệu về tổ hợp của bạn..."
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </OwnerFormField>
          </div>
        </OwnerCard>

        <OwnerCard>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Phone size={20} className="text-[#14b8a6]" />
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Liên hệ & Hoạt động</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <OwnerFormField label="Số điện thoại" required>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={16} />
                </div>
                <input
                  required
                  className={`${ownerInputCls} pl-10`}
                  placeholder="VD: 0901234567"
                  value={form.phone || ''}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </OwnerFormField>

            <OwnerFormField label="Email hỗ trợ" required>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  required
                  type="email"
                  className={`${ownerInputCls} pl-10`}
                  placeholder="VD: hotro@prosport.com"
                  value={form.email || ''}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </OwnerFormField>

            <OwnerFormField label="Giờ mở cửa (Mặc định)">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Clock size={16} />
                </div>
                <input
                  type="time"
                  className={`${ownerInputCls} pl-10 font-mono`}
                  value={(form.openingTime || '').substring(0, 5)}
                  onChange={e => setForm({ ...form, openingTime: e.target.value })}
                />
              </div>
            </OwnerFormField>

            <OwnerFormField label="Giờ đóng cửa (Mặc định)">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Clock size={16} />
                </div>
                <input
                  type="time"
                  className={`${ownerInputCls} pl-10 font-mono`}
                  value={(form.closingTime || '').substring(0, 5)}
                  onChange={e => setForm({ ...form, closingTime: e.target.value })}
                />
              </div>
            </OwnerFormField>
          </div>
        </OwnerCard>

        <div className="flex justify-end pt-4">
          <OwnerBtn type="submit" disabled={saving || loadedComplexId !== complexId} className="px-8 py-3">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </OwnerBtn>
        </div>
      </form>
    </div>
  );
}
