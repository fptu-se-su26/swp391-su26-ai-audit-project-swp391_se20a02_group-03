import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

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

  if (loading && !rules.length) return <PageLoader label="Đang tải giá sân..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Quy tắc giá</h2>
          <p className="text-sm text-slate-500">Ưu tiên: SpecialDate → Court → Peak → Weekend → Base</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">
          {showForm ? 'Đóng' : '+ Thêm rule'}
        </button>
      </div>

      <select className="rounded-lg border px-3 py-2 text-sm" value={courtId} onChange={e => setCourtId(e.target.value)}>
        {courts.map(c => <option key={c.courtId} value={c.courtId}>{c.name}</option>)}
      </select>

      {error && <div className="text-sm text-red-600 rounded-lg border border-red-200 bg-red-50 p-3">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border p-4 grid md:grid-cols-3 gap-3">
          <select value={form.ruleType} onChange={e => setForm({ ...form, ruleType: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
            {RULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Mọi ngày</option>
            {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select>
          <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
          <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
          <input type="number" value={form.pricePerHour} onChange={e => setForm({ ...form, pricePerHour: parseInt(e.target.value, 10) })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Giá/giờ" />
          <input type="number" step="0.1" value={form.multiplier} onChange={e => setForm({ ...form, multiplier: parseFloat(e.target.value) })} className="rounded-lg border px-3 py-2 text-sm" placeholder="Hệ số" />
          <button type="submit" className="md:col-span-3 rounded-lg bg-emerald-600 text-white py-2 text-sm">Lưu rule</button>
        </form>
      )}

      {!rules.length ? (
        <p className="text-sm text-slate-500">Chưa có quy tắc giá cho sân này.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3 text-left">Loại</th>
                <th className="p-3 text-left">Ngày</th>
                <th className="p-3 text-left">Khung giờ</th>
                <th className="p-3 text-left">Giá/giờ</th>
                <th className="p-3 text-left">Hệ số</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.pricingRuleId} className="border-t">
                  <td className="p-3">{r.ruleType || 'BasePrice'}</td>
                  <td className="p-3">{r.dayOfWeek != null ? DAYS[r.dayOfWeek] : 'All'}</td>
                  <td className="p-3">{String(r.startTime).slice(0, 5)}–{String(r.endTime).slice(0, 5)}</td>
                  <td className="p-3">{Number(r.pricePerHour).toLocaleString('vi-VN')} ₫</td>
                  <td className="p-3">{r.multiplier ?? 1}</td>
                  <td className="p-3 text-right">
                    <button type="button" className="text-red-600 text-xs underline bg-transparent border-none cursor-pointer" onClick={() => removeRule(r.pricingRuleId)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
