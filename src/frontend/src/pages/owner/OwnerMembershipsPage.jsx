import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { 
  OwnerPageHeader, 
  OwnerCard, 
  OwnerTable,
  OwnerThead,
  OwnerTh,
  OwnerTd,
  OwnerEmptyState,
  OwnerErrorState,
  OwnerTableLoader,
  OwnerBtn,
  OwnerFormField,
  ownerInputCls,
  OwnerStatusBadge
} from '../../components/owner';

export default function OwnerMembershipsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    tier: 'Standard',
    discountPercent: 10,
    validFrom: '',
    validTo: '',
  });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getMemberships(complexId);
      if (res.statusCode === 200) setItems(res.data || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải được membership.');
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (complexId) load(); }, [complexId]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await ownerApi.createMembership(complexId, {
        userId: +form.userId,
        tier: form.tier,
        discountPercent: +form.discountPercent,
        validFrom: new Date(form.validFrom).toISOString(),
        validTo: new Date(form.validTo).toISOString(),
      });
      if (res.statusCode === 201 || res.statusCode === 200) {
        setShowForm(false);
        setForm({ userId: '', tier: 'Standard', discountPercent: 10, validFrom: '', validTo: '' });
        load();
      } else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Tạo membership thất bại.');
    }
  }

  async function toggleStatus(m) {
    const next = m.status === 'Active' ? 'Suspended' : 'Active';
    if (!window.confirm(`Đổi trạng thái thẻ hội viên #${m.membershipId} sang ${next}?`)) return;
    try {
      const res = await ownerApi.updateMembershipStatus(m.membershipId, complexId, next);
      if (res.statusCode === 200 || res.statusCode === 204) load();
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Cập nhật thất bại.');
    }
  }

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Gói hội viên" 
        description="Quản lý khách hàng thân thiết, cấp thẻ membership và ưu đãi giảm giá."
      >
        <OwnerBtn variant="primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Đóng form' : '+ Cấp thẻ hội viên'}
        </OwnerBtn>
      </OwnerPageHeader>

      {error && <OwnerErrorState message={error} onRetry={load} />}

      {showForm && (
        <OwnerCard className="border-[#14b8a6] border-t-4 mb-6">
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">Cấp thẻ hội viên mới</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <OwnerFormField label="ID Khách hàng" required>
              <input required type="number" min={1} className={ownerInputCls} placeholder="VD: 125" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} />
            </OwnerFormField>
            
            <OwnerFormField label="Hạng thẻ" required>
              <select required className={ownerInputCls} value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                <option value="Standard">Tiêu chuẩn (Standard)</option>
                <option value="Silver">Bạc (Silver)</option>
                <option value="Gold">Vàng (Gold)</option>
                <option value="VIP">Đặc biệt (VIP)</option>
              </select>
            </OwnerFormField>
            
            <OwnerFormField label="Tỷ lệ giảm giá">
              <div className="relative">
                <input type="number" min={0} max={100} className={ownerInputCls} placeholder="VD: 10" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 font-bold">%</div>
              </div>
            </OwnerFormField>

            <OwnerFormField label="Hiệu lực từ" required>
              <input type="date" required className={ownerInputCls} value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} />
            </OwnerFormField>
            
            <OwnerFormField label="Hiệu lực đến" required>
              <input type="date" required className={ownerInputCls} value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })} />
            </OwnerFormField>
            
            <div className="sm:col-span-2 md:col-span-3 flex justify-end pt-4 border-t border-gray-100">
              <OwnerBtn type="submit">Cấp thẻ</OwnerBtn>
            </div>
          </form>
        </OwnerCard>
      )}

      <OwnerCard noPad>
        <OwnerTable>
          <OwnerThead>
            <OwnerTh>Khách hàng</OwnerTh>
            <OwnerTh>Hạng thẻ</OwnerTh>
            <OwnerTh>Giảm giá</OwnerTh>
            <OwnerTh>Thời hạn hiệu lực</OwnerTh>
            <OwnerTh>Trạng thái</OwnerTh>
            <OwnerTh right>Thao tác</OwnerTh>
          </OwnerThead>

          {loading && <OwnerTableLoader cols={6} rows={4} />}

          {!loading && !error && !items.length && (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <OwnerEmptyState 
                    icon={Users} 
                    title="Chưa có khách hàng nào được cấp thẻ hội viên. Bắt đầu tạo mới ngay." 
                    action={!showForm && (
                      <OwnerBtn variant="secondary" onClick={() => setShowForm(true)} className="mt-4">
                        Cấp thẻ đầu tiên
                      </OwnerBtn>
                    )}
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && items.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {items.map(m => (
                <tr key={m.membershipId} className="hover:bg-gray-50/50 transition-colors">
                  <OwnerTd>
                    <span className="font-bold text-[#0f172a] block">{m.userName || 'Không rõ'}</span>
                    <span className="font-mono text-[11px] text-gray-400">ID: {m.userId}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-bold uppercase tracking-widest text-xs text-[#14b8a6]">
                      {m.tier}
                    </span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-medium text-gray-700">{m.discountPercent}%</span>
                  </OwnerTd>
                  <OwnerTd>
                    <div className="flex flex-col text-xs text-gray-600">
                      <span>Từ: {m.validFrom?.slice?.(0, 10)}</span>
                      <span>Đến: {m.validTo?.slice?.(0, 10)}</span>
                    </div>
                  </OwnerTd>
                  <OwnerTd>
                    <OwnerStatusBadge status={m.status} type="general" />
                  </OwnerTd>
                  <OwnerTd right>
                    <button 
                      type="button" 
                      className={`text-[11px] font-bold uppercase tracking-widest bg-transparent border-0 cursor-pointer transition-colors p-0 ${m.status === 'Active' ? 'text-gray-400 hover:text-red-500' : 'text-[#14b8a6] hover:text-[#0d9488]'}`} 
                      onClick={() => toggleStatus(m)}
                    >
                      {m.status === 'Active' ? 'Tạm ngưng' : 'Kích hoạt'}
                    </button>
                  </OwnerTd>
                </tr>
              ))}
            </tbody>
          )}
        </OwnerTable>
      </OwnerCard>
    </div>
  );
}
