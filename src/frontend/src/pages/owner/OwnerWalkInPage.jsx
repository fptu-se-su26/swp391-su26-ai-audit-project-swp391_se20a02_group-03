import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

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
    <div className="max-w-3xl space-y-4">
      <Link to="/owner/bookings" className="text-sm text-emerald-700 no-underline">← Danh sách booking</Link>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Đặt sân walk-in</h2>
        <p className="text-sm text-slate-500">Tạo booking tại quầy, thanh toán tiền mặt và xác nhận ngay.</p>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {!courts.length ? (
        <p className="text-sm text-slate-500">Chưa có sân trong tổ hợp. Tạo sân trước khi nhận walk-in.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border p-4 grid sm:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="text-slate-500 block mb-1">Sân</span>
              <select className="w-full rounded-lg border px-3 py-2 text-sm" value={selectedCourtId} onChange={e => setSelectedCourtId(e.target.value)}>
                {courts.map(c => (
                  <option key={c.courtId} value={c.courtId}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-slate-500 block mb-1">Ngày</span>
              <input type="date" min={minDate} className="w-full rounded-lg border px-3 py-2 text-sm" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </label>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm font-semibold text-slate-900 mb-3">Chọn khung giờ {slotsLoading && <span className="text-slate-400 font-normal">(đang tải...)</span>}</p>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map(slot => {
                const booked = bookedSlots.includes(slot);
                const selected = selectedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={booked || slotsLoading}
                    onClick={() => toggleSlot(slot)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      booked ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : selected ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-slate-500 mt-3">Ước tính: {estimatedTotal.toLocaleString('vi-VN')} ₫</p>
          </div>

          <div className="bg-white rounded-xl border p-4 space-y-3">
            <div className="flex gap-4 text-sm">
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
              <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Email khách" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Tên khách lẻ" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <input className="rounded-lg border px-3 py-2 text-sm" placeholder="SĐT (tuỳ chọn)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
            )}
            <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Ghi chú (tuỳ chọn)" value={notes} onChange={e => setNotes(e.target.value)} />
            <button
              type="button"
              disabled={submitting}
              onClick={handleBook}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm disabled:opacity-60"
            >
              {submitting ? 'Đang tạo...' : 'Tạo booking walk-in'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
