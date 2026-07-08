import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

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

  useEffect(() => {
    if (!complexId) return;
    ownerApi.getOperatingHours(complexId)
      .then(res => {
        if (res.statusCode !== 200 || !res.data) return;
        setSlotDurationMinutes(res.data.slotDurationMinutes || 60);
        if (res.data.weeklySchedule?.length) setWeeklySchedule(res.data.weeklySchedule);
        setClosures(res.data.closures || []);
        setMaintenanceWindows(res.data.maintenanceWindows || []);
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được lịch.'))
      .finally(() => setLoading(false));
  }, [complexId]);

  async function handleSubmit(e) {
    e.preventDefault();
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
      if (res.statusCode === 200) {
        setMessage(res.message || 'Đã lưu. Booking trùng lịch đóng cửa/bảo trì sẽ được hủy và hoàn tiền tự động.');
        if (res.data?.weeklySchedule?.length) setWeeklySchedule(res.data.weeklySchedule);
        setClosures(res.data?.closures || closures);
        setMaintenanceWindows(res.data?.maintenanceWindows || maintenanceWindows);
      } else setError(res.message || 'Lưu thất bại.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader label="Đang tải giờ mở cửa..." />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Giờ mở cửa &amp; lịch đặc biệt</h1>
        <p className="text-sm text-foreground-muted mt-2">Thay đổi ngày nghỉ hoặc bảo trì có thể tự động hủy booking trùng và hoàn tiền khách.</p>
      </div>
      {error && <div className="text-sm text-danger bg-danger-bg border-2 border-danger px-3 py-2 rounded-[2px]">{error}</div>}
      {message && <div className="text-sm text-accent bg-surface border-2 border-accent px-3 py-2 rounded-[2px]">{message}</div>}

      <div className="border-2 border-border-strong bg-surface p-6 space-y-3">
        <label className="block text-sm">
          <span className="label-mono text-foreground">Độ dài slot (phút)</span>
          <input type="number" min={30} step={30} className="input-base mt-2 w-32" value={slotDurationMinutes} onChange={e => setSlotDurationMinutes(+e.target.value)} />
        </label>
        <p className="label-mono text-foreground pt-2">Lịch tuần</p>
        <div className="flex flex-col gap-2.5">
          {weeklySchedule.map((row, idx) => (
            <div key={row.dayOfWeek} className="flex flex-wrap items-center gap-2.5 text-sm">
              <span className="w-20 font-bold text-foreground">{DAY_NAMES[row.dayOfWeek]}</span>
              <input type="time" className="input-base w-auto h-[38px]" value={row.openTime} onChange={e => {
                const next = [...weeklySchedule];
                next[idx] = { ...next[idx], openTime: e.target.value };
                setWeeklySchedule(next);
              }} />
              <span className="text-foreground-muted">–</span>
              <input type="time" className="input-base w-auto h-[38px]" value={row.closeTime} onChange={e => {
                const next = [...weeklySchedule];
                next[idx] = { ...next[idx], closeTime: e.target.value };
                setWeeklySchedule(next);
              }} />
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-border-strong bg-surface p-6 space-y-3">
        <div className="flex justify-between items-center">
          <p className="label-mono text-foreground">Ngày đóng cửa</p>
          <button type="button" className="label-mono text-foreground underline bg-transparent border-none cursor-pointer" onClick={() => setClosures([...closures, { closureDate: '', reason: '' }])}>+ Thêm</button>
        </div>
        {closures.map((c, i) => (
          <div key={i} className="flex flex-wrap gap-2.5">
            <input type="date" className="input-base w-auto h-10 text-sm" value={c.closureDate?.slice?.(0, 10) || c.closureDate || ''} onChange={e => {
              const next = [...closures]; next[i] = { ...next[i], closureDate: e.target.value }; setClosures(next);
            }} />
            <input className="input-base flex-1 h-10 text-sm" placeholder="Lý do" value={c.reason || ''} onChange={e => {
              const next = [...closures]; next[i] = { ...next[i], reason: e.target.value }; setClosures(next);
            }} />
            <button type="button" className="text-danger text-sm underline bg-transparent border-none cursor-pointer" onClick={() => setClosures(closures.filter((_, j) => j !== i))}>Xóa</button>
          </div>
        ))}
      </div>

      <div className="border-2 border-border-strong bg-surface p-6 space-y-3">
        <div className="flex justify-between items-center">
          <p className="label-mono text-foreground">Cửa sổ bảo trì</p>
          <button type="button" className="label-mono text-foreground underline bg-transparent border-none cursor-pointer" onClick={() => setMaintenanceWindows([...maintenanceWindows, { startAt: '', endAt: '', reason: '', courtId: null }])}>+ Thêm</button>
        </div>
        {maintenanceWindows.map((m, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-2.5">
            <input type="datetime-local" className="input-base h-10 text-sm" value={m.startAt?.slice?.(0, 16) || ''} onChange={e => {
              const next = [...maintenanceWindows]; next[i] = { ...next[i], startAt: e.target.value }; setMaintenanceWindows(next);
            }} />
            <input type="datetime-local" className="input-base h-10 text-sm" value={m.endAt?.slice?.(0, 16) || ''} onChange={e => {
              const next = [...maintenanceWindows]; next[i] = { ...next[i], endAt: e.target.value }; setMaintenanceWindows(next);
            }} />
            <input className="input-base h-10 text-sm md:col-span-2" placeholder="Lý do" value={m.reason || ''} onChange={e => {
              const next = [...maintenanceWindows]; next[i] = { ...next[i], reason: e.target.value }; setMaintenanceWindows(next);
            }} />
            <button type="button" className="text-danger text-sm text-left underline bg-transparent border-none cursor-pointer md:col-span-2" onClick={() => setMaintenanceWindows(maintenanceWindows.filter((_, j) => j !== i))}>Xóa</button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Đang lưu...' : 'Lưu lịch vận hành'}
      </button>
    </form>
  );
}
