import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import {
  OwnerPageHeader,
  OwnerBtn,
  OwnerCard,
  OwnerToolbar,
  OwnerTable,
  OwnerThead,
  OwnerTh,
  OwnerTd,
  OwnerEmptyState,
  OwnerErrorState,
  OwnerTableLoader,
  OwnerFormField,
  ownerInputCls
} from '../../components/owner';

const RULE_TYPES = ['BasePrice', 'Weekend', 'PeakHour', 'CourtSpecific', 'SpecialDate'];
const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function OwnerPricingPage() {
  const { complexId } = useOutletContext();
  const [params] = useSearchParams();
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState(params.get('courtId') || '');
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    startTime: '08:00', endTime: '12:00', pricePerHour: 150000, multiplier: 1,
    dayOfWeek: '', ruleType: 'BasePrice', validFrom: '', validTo: '',
  });

  async function loadCourts() {
    const res = await ownerApi.getCourts(complexId, { pageNumber: 1, pageSize: 100 });
    if (res.statusCode === 200) {
      setCourts(res.data?.items || []);
      if (!courtId && res.data?.items?.[0]) setCourtId(String(res.data.items[0].courtId));
    }
  }

  async function loadRules(id = courtId) {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getPricingRules(complexId, parseInt(id, 10));
      if (res.statusCode === 200) setRules(res.data || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải quy tắc giá.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (complexId) loadCourts(); }, [complexId]);
  useEffect(() => { if (courtId) loadRules(courtId); }, [courtId, complexId]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const payload = {
        startTime: form.startTime,
        endTime: form.endTime,
        pricePerHour: form.pricePerHour,
        multiplier: form.multiplier,
        ruleType: form.ruleType,
        dayOfWeek: form.dayOfWeek === '' ? null : parseInt(form.dayOfWeek, 10),
        validFrom: form.validFrom || null,
        validTo: form.validTo || null,
      };
      const res = await ownerApi.createPricingRule(parseInt(courtId, 10), payload);
      if (res.statusCode === 201) { setShowForm(false); loadRules(); }
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tạo được rule.');
    }
  }

  async function removeRule(ruleId) {
    if (!window.confirm('Xóa quy tắc giá này?')) return;
    try {
      await ownerApi.deletePricingRule(parseInt(courtId, 10), ruleId);
      loadRules();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không xóa được rule.');
    }
  }

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader
        title="Quy tắc giá"
        description="Định giá sân linh hoạt theo giờ, theo thứ và ngày lễ."
      >
        <OwnerBtn variant="primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Đóng form' : '+ Thêm quy tắc mới'}
        </OwnerBtn>
      </OwnerPageHeader>

      <OwnerToolbar>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-[12px] font-bold uppercase tracking-wide text-gray-500 shrink-0">Chọn Sân:</span>
          <select
            className={`${ownerInputCls} min-w-[200px]`}
            value={courtId}
            onChange={e => setCourtId(e.target.value)}
          >
            {courts.map(c => <option key={c.courtId} value={c.courtId}>{c.name}</option>)}
          </select>
        </div>
      </OwnerToolbar>

      {error && <OwnerErrorState message={error} onRetry={() => loadRules(courtId)} />}

      {showForm && (
        <OwnerCard className="border-[#14b8a6] border-t-4">
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">Thêm quy tắc mới</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <OwnerFormField label="Loại quy tắc">
              <select value={form.ruleType} onChange={e => setForm({ ...form, ruleType: e.target.value })} className={ownerInputCls}>
                {RULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </OwnerFormField>

            <OwnerFormField label="Ngày trong tuần">
              <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })} className={ownerInputCls}>
                <option value="">Mọi ngày</option>
                {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </OwnerFormField>

            <OwnerFormField label="Giờ bắt đầu">
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className={ownerInputCls} />
            </OwnerFormField>

            <OwnerFormField label="Giờ kết thúc">
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className={ownerInputCls} />
            </OwnerFormField>

            <OwnerFormField label="Giá / giờ (VND)">
              <input type="number" value={form.pricePerHour} onChange={e => setForm({ ...form, pricePerHour: parseInt(e.target.value, 10) })} className={ownerInputCls} placeholder="VD: 150000" />
            </OwnerFormField>

            <OwnerFormField label="Hệ số (Multiplier)">
              <input type="number" step="0.1" value={form.multiplier} onChange={e => setForm({ ...form, multiplier: parseFloat(e.target.value) })} className={ownerInputCls} placeholder="VD: 1.2" />
            </OwnerFormField>

            <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-4 border-t border-gray-100">
              <OwnerBtn type="submit">Lưu quy tắc</OwnerBtn>
            </div>
          </form>
        </OwnerCard>
      )}

      <OwnerCard noPad>
        <OwnerTable>
          <OwnerThead>
            <OwnerTh>Loại</OwnerTh>
            <OwnerTh>Ngày</OwnerTh>
            <OwnerTh>Khung giờ</OwnerTh>
            <OwnerTh>Giá/giờ</OwnerTh>
            <OwnerTh>Hệ số</OwnerTh>
            <OwnerTh right>Thao tác</OwnerTh>
          </OwnerThead>

          {loading && <OwnerTableLoader cols={6} rows={3} />}

          {!loading && !error && !rules.length && (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <OwnerEmptyState title="Chưa có quy tắc giá"
                    description="Sân này chưa được thiết lập quy tắc giá nào. Sẽ áp dụng giá cơ bản của sân."
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && rules.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {rules.map(r => (
                <tr key={r.pricingRuleId} className="hover:bg-gray-50/50 transition-colors">
                  <OwnerTd>
                    <span className="font-bold text-[#0f172a]">{r.ruleType || 'BasePrice'}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="text-gray-500">{r.dayOfWeek != null ? DAYS[r.dayOfWeek] : 'Tất cả'}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="text-gray-700 font-mono text-[13px]">{String(r.startTime).slice(0, 5)} – {String(r.endTime).slice(0, 5)}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-medium text-[#14b8a6]">{Number(r.pricePerHour).toLocaleString('vi-VN')} ₫</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="text-gray-500">x{r.multiplier ?? 1}</span>
                  </OwnerTd>
                  <OwnerTd right>
                    <button
                      type="button"
                      className="text-[12px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide bg-transparent border-0 cursor-pointer transition-colors"
                      onClick={() => removeRule(r.pricingRuleId)}
                    >
                      Xóa
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
