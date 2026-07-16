import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { 
  OwnerPageHeader, 
  OwnerCard, 
  OwnerBtn,
  OwnerStatusBadge,
  OwnerEmptyState,
  OwnerErrorState,
  OwnerFormField,
  ownerInputCls
} from '../../components/owner';

export default function OwnerVouchersPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', voucherType: 'Percent', discountPercent: 10, totalQuantity: 100, startDate: '', endDate: '' });

  async function load() {
    try {
      setError(null);
      const res = await ownerApi.getVouchers(complexId);
      if (res.statusCode === 200) setItems(res.data || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải voucher.');
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (complexId) load(); }, [complexId]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await ownerApi.createVoucher(complexId, {
        ...form,
        totalQuantity: +form.totalQuantity,
        discountPercent: +form.discountPercent,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      });
      if (res.statusCode === 201) { 
        setShowForm(false); 
        setForm({ code: '', name: '', voucherType: 'Percent', discountPercent: 10, totalQuantity: 100, startDate: '', endDate: '' });
        load(); 
      }
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Tạo voucher thất bại.');
    }
  }

  async function toggleStatus(v) {
    const next = v.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await ownerApi.updateVoucherStatus(v.voucherId, complexId, { status: next });
      if (res.statusCode === 200) load();
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Cập nhật thất bại.');
    }
  }

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Mã khuyến mãi" 
        description="Tạo và quản lý voucher giảm giá, mã khuyến mãi cho khách hàng."
      >
        <OwnerBtn variant="primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Đóng form' : '+ Tạo voucher mới'}
        </OwnerBtn>
      </OwnerPageHeader>

      {error && <OwnerErrorState message={error} onRetry={load} />}

      {showForm && (
        <OwnerCard className="border-[#14b8a6] border-t-4">
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">Tạo mã khuyến mãi mới</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <OwnerFormField label="Mã Voucher" required>
              <input required className={ownerInputCls} placeholder="VD: SUMMER2024" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            </OwnerFormField>
            
            <OwnerFormField label="Tên chương trình" required>
              <input required className={ownerInputCls} placeholder="VD: Khuyến mãi Hè" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </OwnerFormField>
            
            <OwnerFormField label="Loại Voucher">
              <select className={ownerInputCls} value={form.voucherType} onChange={e => setForm({ ...form, voucherType: e.target.value })}>
                <option value="Percent">Giảm phần trăm (%)</option>
                <option value="TryBeforeYouBuy">Dùng thử (Try before buy)</option>
              </select>
            </OwnerFormField>
            
            <OwnerFormField label="Phần trăm giảm (%)">
              <input type="number" min="0" max="100" className={ownerInputCls} placeholder="VD: 10" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />
            </OwnerFormField>
            
            <OwnerFormField label="Số lượng phát hành">
              <input type="number" min="1" className={ownerInputCls} placeholder="VD: 100" value={form.totalQuantity} onChange={e => setForm({ ...form, totalQuantity: e.target.value })} />
            </OwnerFormField>

            <div className="hidden md:block"></div>
            
            <OwnerFormField label="Ngày bắt đầu" required>
              <input type="date" required className={ownerInputCls} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </OwnerFormField>
            
            <OwnerFormField label="Ngày kết thúc" required>
              <input type="date" required className={ownerInputCls} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </OwnerFormField>
            
            <div className="sm:col-span-2 md:col-span-3 flex justify-end pt-4 border-t border-gray-100">
              <OwnerBtn type="submit">Tạo Voucher</OwnerBtn>
            </div>
          </form>
        </OwnerCard>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-40 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
          <div className="h-40 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
          <div className="h-40 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]"></div>
        </div>
      ) : !items.length ? (
        <OwnerEmptyState 
          title="Chưa có mã khuyến mãi" 
          description="Tạo mã khuyến mãi đầu tiên để thu hút thêm khách hàng." 
          action={!showForm && (
            <OwnerBtn variant="primary" onClick={() => setShowForm(true)} className="mt-4">
              Tạo voucher ngay
            </OwnerBtn>
          )}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(v => (
            <OwnerCard key={v.voucherId} className="flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#14b8a6]/10 to-transparent -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150"></div>
              
              <div className="flex justify-between items-start gap-4 mb-4 relative">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading text-xl uppercase tracking-tight text-[#14b8a6]">{v.code}</span>
                  </div>
                  <h3 className="font-semibold text-[#0f172a] m-0 text-sm">{v.name}</h3>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <OwnerStatusBadge status={v.status} type="general" />
                  <button 
                    type="button" 
                    onClick={() => toggleStatus(v)} 
                    className={`text-[10px] font-bold uppercase tracking-widest ${v.status === 'Active' ? 'text-gray-400 hover:text-red-500' : 'text-[#14b8a6] hover:text-[#0d9488]'} bg-transparent border-none cursor-pointer transition-colors px-0`}
                  >
                    {v.status === 'Active' ? 'Tạm ngưng' : 'Kích hoạt'}
                  </button>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Loại ưu đãi</span>
                  <span className="text-[#0f172a] font-bold">{v.voucherType === 'Percent' ? `Giảm ${v.discountPercent}%` : 'Dùng thử'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Đã dùng / Tổng</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#14b8a6]" style={{ width: `${Math.min(100, (v.usedQuantity / v.totalQuantity) * 100)}%` }}></div>
                    </div>
                    <span className="text-[#0f172a] font-mono text-[13px]">
                      {v.usedQuantity}<span className="text-gray-400 mx-1">/</span>{v.totalQuantity}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium tracking-wide">
                  <span>HSD: {new Date(v.endDate).toLocaleDateString('vi-VN')}</span>
                  {v.usedQuantity >= v.totalQuantity && <span className="text-red-500">Đã hết lượt</span>}
                </div>
              </div>
            </OwnerCard>
          ))}
        </div>
      )}
    </div>
  );
}
