import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

// Fallback khi chưa tải được giờ mở cửa của tổ hợp
const DEFAULT_HOURS = { open: 6, close: 23 };

function parseHour(time, fallback) {
  const h = parseInt(String(time ?? '').split(':')[0], 10);
  return Number.isNaN(h) ? fallback : h;
}

function buildTimeSlots(openHour, closeHour) {
  const slots = [];
  for (let h = openHour; h < closeHour; h++) slots.push(`${String(h).padStart(2, '0')}:00`);
  return slots;
}

function slotEndTime(lastSlot) {
  const h = parseInt(lastSlot.split(':')[0], 10);
  return `${String(h + 1).padStart(2, '0')}:00`;
}

export default function OwnerWalkInPage() {
  const { complexId } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillCourtId = searchParams.get('courtId');
  const prefillDate = searchParams.get('date');

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [customerMode, setCustomerMode] = useState('guest');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [complexHours, setComplexHours] = useState(DEFAULT_HOURS);

  useEffect(() => {
    if (!complexId) return;
    ownerApi.getComplex(complexId)
      .then(res => {
        if (res.statusCode === 200 && res.data) {
          setComplexHours({
            open: parseHour(res.data.openingTime, DEFAULT_HOURS.open),
            close: parseHour(res.data.closingTime, DEFAULT_HOURS.close),
          });
        }
      })
      .catch(() => setComplexHours(DEFAULT_HOURS));
  }, [complexId]);

  const timeSlots = useMemo(
    () => buildTimeSlots(complexHours.open, complexHours.close),
    [complexHours],
  );

  useEffect(() => {
    if (!complexId) return;
    ownerApi.getCourts(complexId, { pageNumber: 1, pageSize: 100 })
      .then(res => {
        if (res.statusCode === 200) {
          const list = res.data?.items || [];
          setCourts(list);
          if (list.length) {
            const fromQuery = prefillCourtId ? Number(prefillCourtId) : null;
            const match = fromQuery && list.some(c => c.courtId === fromQuery);
            setSelectedCourtId(String(match ? fromQuery : list[0].courtId));
          }
        } else {
          setError(res.message || 'Không tải được danh sách sân.');
        }
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được danh sách sân.'))
      .finally(() => setLoading(false));
  }, [complexId, prefillCourtId]);

  useEffect(() => {
    if (prefillDate && /^\d{4}-\d{2}-\d{2}$/.test(prefillDate)) {
      setSelectedDate(prefillDate);
    }
  }, [prefillDate]);

  useEffect(() => {
    if (!selectedCourtId || !selectedDate) return;
    setSlotsLoading(true);
    setSelectedSlots([]);
    bookingApi.getBookedSlots(Number(selectedCourtId), selectedDate)
      .then(res => {
        const slots = Array.isArray(res.data) ? res.data : [];
        setBookedSlots(slots.map(s => (typeof s === 'string' ? s.substring(0, 5) : s)));
      })
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedCourtId, selectedDate]);

  const selectedCourt = courts.find(c => String(c.courtId) === String(selectedCourtId));
  const hourlyRate = selectedCourt?.basePrice ?? 100000;
  const estimatedTotal = selectedSlots.length * hourlyRate;

  function toggleSlot(slot) {
    if (bookedSlots.includes(slot)) return;
    setSelectedSlots(prev => {
      if (prev.includes(slot)) return prev.filter(s => s !== slot);
      if (prev.length > 0) {
        const slotHour = parseInt(slot.split(':')[0], 10);
        const prevHours = prev.map(s => parseInt(s.split(':')[0], 10));
        const minHour = Math.min(...prevHours);
        const maxHour = Math.max(...prevHours);
        if (slotHour !== minHour - 1 && slotHour !== maxHour + 1) return prev;
      }
      return [...prev, slot].sort();
    });
  }

  async function handleBook() {
    if (!selectedCourt) return;
    if (selectedSlots.length === 0) {
      setError('Chọn ít nhất 1 khung giờ.');
      return;
    }
    if (customerMode === 'email' && !customerEmail.trim()) {
      setError('Nhập email khách hàng.');
      return;
    }
    if (customerMode === 'guest' && !customerName.trim()) {
      setError('Nhập tên khách lẻ.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const startTime = `${selectedSlots[0]}:00`;
      const endTime = `${slotEndTime(selectedSlots[selectedSlots.length - 1])}:00`;
      const payload = {
        details: [{
          courtId: selectedCourt.courtId,
          bookingDate: selectedDate,
          startTime,
          endTime,
        }],
        notes: notes.trim() || undefined,
      };

      if (customerMode === 'email') payload.customerEmail = customerEmail.trim();
      else {
        payload.customerName = customerName.trim();
        payload.customerPhone = customerPhone.trim() || undefined;
      }

      const res = await ownerApi.createWalkIn(payload);
      if ((res.statusCode === 200 || res.statusCode === 201) && res.data?.bookingId) {
        navigate(`/owner/bookings/${res.data.bookingId}`);
      } else {
        setError(res.message || 'Đặt sân thất bại.');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Đặt sân thất bại.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Đang tải sân..." />;

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/owner/bookings" className="inline-block text-sm font-extrabold text-foreground border-b-2 border-border-strong no-underline">← Danh sách booking</Link>
      <div>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Đặt sân walk-in</h1>
        <p className="text-sm text-foreground-muted">Tạo booking tại quầy, thanh toán tiền mặt và xác nhận ngay.</p>
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      {!courts.length ? (
        <EmptyState title="Chưa có sân" subtitle="Chưa có sân trong tổ hợp. Tạo sân trước khi nhận walk-in." />
      ) : (
        <>
          <div className="border-2 border-border-strong bg-surface p-6 grid sm:grid-cols-2 gap-3.5">
            <label className="text-sm">
              <span className="label-mono text-foreground-muted block mb-1.5">Sân</span>
              <select className="input-base w-full" value={selectedCourtId} onChange={e => setSelectedCourtId(e.target.value)}>
                {courts.map(c => (
                  <option key={c.courtId} value={c.courtId}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="label-mono text-foreground-muted block mb-1.5">Ngày</span>
              <input type="date" min={minDate} className="input-base w-full" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </label>
          </div>

          <div className="border-2 border-border-strong bg-surface p-6">
            <p className="text-sm font-extrabold text-foreground mb-3.5">Chọn khung giờ {slotsLoading && <span className="text-foreground-subtle font-normal">(đang tải...)</span>}</p>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map(slot => {
                const booked = bookedSlots.includes(slot);
                const selected = selectedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={booked || slotsLoading}
                    onClick={() => toggleSlot(slot)}
                    className={`px-4 py-2.5 rounded-[2px] label-mono border-2 ${
                      booked ? 'bg-background-base text-foreground-subtle border-border-default cursor-not-allowed'
                        : selected ? 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] border-[var(--theme-primary)]'
                          : 'bg-surface text-foreground border-border-strong hover:bg-surface-hover'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-foreground-muted mt-3.5">Ước tính: <strong className="text-foreground">{estimatedTotal.toLocaleString('vi-VN')} ₫</strong></p>
          </div>

          <div className="border-2 border-border-strong bg-surface p-6 space-y-3.5">
            <div className="flex gap-6 text-sm text-foreground">
              <label className="flex items-center gap-2">
                <input type="radio" checked={customerMode === 'guest'} onChange={() => setCustomerMode('guest')} />
                Khách lẻ
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={customerMode === 'email'} onChange={() => setCustomerMode('email')} />
                Email đã đăng ký
              </label>
            </div>
            {customerMode === 'email' ? (
              <input className="input-base w-full" placeholder="Email khách" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
            ) : (
              <div className="grid sm:grid-cols-2 gap-2.5">
                <input className="input-base" placeholder="Tên khách lẻ" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <input className="input-base" placeholder="SĐT (tuỳ chọn)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
            )}
            <input className="input-base w-full" placeholder="Ghi chú (tuỳ chọn)" value={notes} onChange={e => setNotes(e.target.value)} />
            <button
              type="button"
              disabled={submitting}
              onClick={handleBook}
              className="btn-primary disabled:opacity-60"
            >
              {submitting ? 'Đang tạo...' : 'Tạo booking walk-in'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
