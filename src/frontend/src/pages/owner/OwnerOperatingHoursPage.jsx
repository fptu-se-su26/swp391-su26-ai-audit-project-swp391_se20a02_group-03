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
import { Calendar, Clock, AlertTriangle, Plus, Trash2 } from 'lucide-react';

const DAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function emptySchedule() {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    openTime: '06:00',
    closeTime: '22:00',
  }));
}

export default function OwnerOperatingHoursPage() {
  const { complexId } = useOutletContext();
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(60);
  const [weeklySchedule, setWeeklySchedule] = useState(emptySchedule);
  const [closures, setClosures] = useState([]);
  const [maintenanceWindows, setMaintenanceWindows] = useState([]);
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
      const res = await ownerApi.getOperatingHours(complexId);
      if (requestId !== requestIdRef.current) return;
      if (res.statusCode !== 200 || !res.data) {
        throw new Error(res.message || 'Không tải được lịch.');
      }

      setSlotDurationMinutes(res.data.slotDurationMinutes ?? 60);
      setWeeklySchedule(res.data.weeklySchedule?.length ? res.data.weeklySchedule : emptySchedule());
      setClosures(res.data.closures || []);
      setMaintenanceWindows(res.data.maintenanceWindows || []);
      setLoadedComplexId(complexId);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(typeof err === 'string' ? err : err?.message || 'Không tải được lịch.');
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
      const res = await ownerApi.saveOperatingHours(complexId, {
        slotDurationMinutes,
        weeklySchedule,
        closures: closures.map(c => ({
          ...c,
          closureDate: c.closureDate?.slice?.(0, 10) || c.closureDate,
        })),
        maintenanceWindows,
      });
      if (res.statusCode === 200 || res.statusCode === 204) {
        setMessage(res.message || 'Đã lưu. Booking trùng lịch đóng cửa/bảo trì sẽ được hủy và hoàn tiền tự động.');
        setTimeout(() => setMessage(null), 5000);
        if (res.data?.weeklySchedule?.length) setWeeklySchedule(res.data.weeklySchedule);
        if (res.data?.closures) setClosures(res.data.closures);
        if (res.data?.maintenanceWindows) setMaintenanceWindows(res.data.maintenanceWindows);
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
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-32 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6"></div>
        <div className="h-64 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6"></div>
      </div>
    );
  }

  if (loadedComplexId !== complexId) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 auth-animate-in pb-12">
        <OwnerPageHeader
          title="Lịch vận hành"
          description="Thay đổi giờ hoạt động, ngày nghỉ lễ hoặc thời gian bảo trì sân."
        />
        <OwnerErrorState message={error || 'Không tải được lịch.'} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Lịch vận hành" 
        description="Thay đổi giờ hoạt động, ngày nghỉ lễ hoặc thời gian bảo trì sân."
      />

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-[16px] px-6 py-4 flex items-center justify-between">
          <p className="text-sm font-medium text-red-600 m-0">{error}</p>
        </div>
      )}

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
            <Clock size={20} className="text-[#14b8a6]" />
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Độ dài Slot & Lịch cố định</h3>
          </div>

          <div className="mb-8">
            <OwnerFormField label="Độ dài mỗi Slot (phút)">
              <div className="w-full sm:max-w-xs relative">
                <select 
                  className={ownerInputCls} 
                  value={slotDurationMinutes} 
                  onChange={e => setSlotDurationMinutes(+e.target.value)}
                >
                  <option value={30}>30 phút</option>
                  <option value={60}>60 phút (1 giờ)</option>
                  <option value={90}>90 phút (1.5 giờ)</option>
                  <option value={120}>120 phút (2 giờ)</option>
                </select>
              </div>
            </OwnerFormField>
          </div>

          <div className="space-y-4">
            <label className="block text-[12px] font-bold uppercase tracking-wide text-gray-500 mb-2">Giờ mở cửa theo ngày</label>
            <div className="grid gap-3">
              {weeklySchedule.map((row, idx) => (
                <div key={row.dayOfWeek} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-gray-50 rounded-[8px] border border-gray-100">
                  <span className="w-24 font-bold text-[#0f172a] shrink-0 text-sm">{DAY_NAMES[row.dayOfWeek]}</span>
                  <div className="flex items-center gap-3 flex-1">
                  <input 
                    type="time" 
                    aria-label={`Giờ mở cửa ${DAY_NAMES[row.dayOfWeek]}`}
                      className={`${ownerInputCls} font-mono`} 
                      value={row.openTime} 
                      onChange={e => {
                        const next = [...weeklySchedule];
                        next[idx] = { ...next[idx], openTime: e.target.value };
                        setWeeklySchedule(next);
                      }} 
                    />
                    <span className="text-gray-400 font-bold shrink-0">–</span>
                  <input 
                    type="time" 
                    aria-label={`Giờ đóng cửa ${DAY_NAMES[row.dayOfWeek]}`}
                      className={`${ownerInputCls} font-mono`} 
                      value={row.closeTime} 
                      onChange={e => {
                        const next = [...weeklySchedule];
                        next[idx] = { ...next[idx], closeTime: e.target.value };
                        setWeeklySchedule(next);
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </OwnerCard>

        <OwnerCard>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" />
              <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Ngày đóng cửa (Lễ, Tết)</h3>
            </div>
            <button 
              type="button" 
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#14b8a6] hover:text-[#0d9488] transition-colors bg-transparent border-0 cursor-pointer p-0" 
              onClick={() => setClosures([...closures, { closureDate: '', reason: '' }])}
            >
              <Plus size={14} /> Thêm ngày
            </button>
          </div>

          {closures.length === 0 ? (
            <p className="text-sm text-gray-500 italic m-0">Chưa có ngày đóng cửa nào được thiết lập.</p>
          ) : (
            <div className="space-y-3">
              {closures.map((c, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input 
                    type="date" 
                    className={`${ownerInputCls} sm:w-48`} 
                    value={c.closureDate?.slice?.(0, 10) || c.closureDate || ''} 
                    onChange={e => {
                      const next = [...closures]; 
                      next[i] = { ...next[i], closureDate: e.target.value }; 
                      setClosures(next);
                    }} 
                  />
                  <input 
                    className={`${ownerInputCls} flex-1`} 
                    placeholder="Lý do (VD: Nghỉ Tết Nguyên Đán)" 
                    value={c.reason || ''} 
                    onChange={e => {
                      const next = [...closures]; 
                      next[i] = { ...next[i], reason: e.target.value }; 
                      setClosures(next);
                    }} 
                  />
                  <button 
                    type="button" 
                    aria-label={`Xóa ngày đóng cửa ${i + 1}`}
                    className="w-11 h-11 inline-flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[8px] transition-colors bg-transparent border-0 cursor-pointer self-end sm:self-auto" 
                    onClick={() => setClosures(closures.filter((_, j) => j !== i))}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </OwnerCard>

        <OwnerCard>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Bảo trì sân</h3>
            </div>
            <button 
              type="button" 
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#14b8a6] hover:text-[#0d9488] transition-colors bg-transparent border-0 cursor-pointer p-0" 
              onClick={() => setMaintenanceWindows([...maintenanceWindows, { startAt: '', endAt: '', reason: '', courtId: null }])}
            >
              <Plus size={14} /> Thêm bảo trì
            </button>
          </div>

          {maintenanceWindows.length === 0 ? (
            <p className="text-sm text-gray-500 italic m-0">Chưa có lịch bảo trì nào được thiết lập.</p>
          ) : (
            <div className="space-y-6">
              {maintenanceWindows.map((m, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-[12px] border border-gray-100 relative group">
                  <button 
                    type="button" 
                    aria-label={`Xóa lịch bảo trì ${i + 1}`}
                    className="absolute top-3 right-3 w-11 h-11 inline-flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 focus-visible:text-red-500 focus-visible:ring-2 focus-visible:ring-red-500 rounded-[8px] transition-colors bg-white border border-gray-200 cursor-pointer" 
                    onClick={() => setMaintenanceWindows(maintenanceWindows.filter((_, j) => j !== i))}
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <div className="grid sm:grid-cols-2 gap-4 pr-10">
                    <OwnerFormField label="Bắt đầu lúc">
                      <input 
                        type="datetime-local" 
                        className={ownerInputCls} 
                        value={m.startAt?.slice?.(0, 16) || ''} 
                        onChange={e => {
                          const next = [...maintenanceWindows]; 
                          next[i] = { ...next[i], startAt: e.target.value }; 
                          setMaintenanceWindows(next);
                        }} 
                      />
                    </OwnerFormField>
                    <OwnerFormField label="Hoàn thành lúc">
                      <input 
                        type="datetime-local" 
                        className={ownerInputCls} 
                        value={m.endAt?.slice?.(0, 16) || ''} 
                        onChange={e => {
                          const next = [...maintenanceWindows]; 
                          next[i] = { ...next[i], endAt: e.target.value }; 
                          setMaintenanceWindows(next);
                        }} 
                      />
                    </OwnerFormField>
                    <div className="sm:col-span-2">
                      <OwnerFormField label="Lý do bảo trì">
                        <input 
                          className={ownerInputCls} 
                          placeholder="VD: Sửa chữa lưới bảo vệ" 
                          value={m.reason || ''} 
                          onChange={e => {
                            const next = [...maintenanceWindows]; 
                            next[i] = { ...next[i], reason: e.target.value }; 
                            setMaintenanceWindows(next);
                          }} 
                        />
                      </OwnerFormField>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </OwnerCard>

        <div className="flex justify-end pt-4">
          <OwnerBtn type="submit" disabled={saving || loadedComplexId !== complexId} className="px-8 py-3">
            {saving ? 'Đang lưu...' : 'Lưu lịch vận hành'}
          </OwnerBtn>
        </div>
      </form>
    </div>
  );
}
