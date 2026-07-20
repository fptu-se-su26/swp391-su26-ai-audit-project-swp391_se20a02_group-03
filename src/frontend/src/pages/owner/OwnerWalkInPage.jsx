import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import { ownerApi } from '../../api/ownerApi';
import {
  OwnerCard,
  OwnerBtn,
  OwnerFormField,
  ownerInputCls,
  OwnerEmptyState,
  OwnerErrorState
} from '../../components/owner';
import { ChevronLeft } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded-[4px] mb-4"></div>
        <div className="h-10 w-64 bg-gray-200 rounded-[8px]"></div>
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-8 h-96"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 auth-animate-in pb-12">
      <div>
        <Link
          to="/owner/bookings"
          className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-gray-500 hover:text-[#14b8a6] no-underline transition-colors mb-4"
        >
          <ChevronLeft size={16} /> Danh sách booking
        </Link>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0 mb-2">Đặt sân walk-in</h1>
        <p className="text-sm text-gray-500 m-0">Tạo booking tại quầy, thu tiền mặt và xác nhận ngay lập tức.</p>
      </div>

      {error && <OwnerErrorState message={error} />}

      {!courts.length ? (
        <OwnerEmptyState title="Chưa có sân" description="Tổ hợp chưa có sân nào. Bạn cần tạo sân trước khi nhận đặt sân." />
      ) : (
        <div className="grid gap-6">
          {/* Section 1: Chọn sân và ngày */}
          <OwnerCard>
            <div className="grid sm:grid-cols-2 gap-6">
              <OwnerFormField label="Chọn Sân">
                <select
                  className={ownerInputCls}
                  value={selectedCourtId}
                  onChange={e => setSelectedCourtId(e.target.value)}
                >
                  {courts.map(c => (
                    <option key={c.courtId} value={c.courtId}>{c.name}</option>
                  ))}
                </select>
              </OwnerFormField>
              <OwnerFormField label="Ngày đặt">
                <input
                  type="date"
                  min={minDate}
                  className={ownerInputCls}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </OwnerFormField>
            </div>
          </OwnerCard>

          {/* Section 2: Chọn giờ */}
          <OwnerCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Chọn khung giờ</h3>
              {slotsLoading && <span className="text-xs text-gray-400">Đang tải...</span>}
            </div>

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
                    className={`h-10 px-4 rounded-[8px] font-mono text-sm font-semibold transition-all border cursor-pointer ${
                      booked
                        ? 'bg-gray-50 text-gray-400 border-transparent cursor-not-allowed'
                        : selected
                          ? 'bg-[#14b8a6] text-white border-[#14b8a6] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#14b8a6] hover:text-[#14b8a6]'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {selectedSlots.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Ước tính giá</span>
                <span className="text-xl font-bold text-[#14b8a6]">{estimatedTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
          </OwnerCard>

          {/* Section 3: Thông tin khách hàng */}
          <OwnerCard>
            <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">Thông tin khách hàng</h3>

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 text-sm text-[#0f172a] cursor-pointer">
                <input
                  type="radio"
                  checked={customerMode === 'guest'}
                  onChange={() => setCustomerMode('guest')}
                  className="accent-[#14b8a6]"
                />
                Khách lẻ
              </label>
              <label className="flex items-center gap-2 text-sm text-[#0f172a] cursor-pointer">
                <input
                  type="radio"
                  checked={customerMode === 'email'}
                  onChange={() => setCustomerMode('email')}
                  className="accent-[#14b8a6]"
                />
                Tài khoản User (Email)
              </label>
            </div>

            <div className="grid gap-6">
              {customerMode === 'email' ? (
                <OwnerFormField label="Email khách hàng">
                  <input
                    className={ownerInputCls}
                    placeholder="VD: nguyenvanb@example.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                  />
                </OwnerFormField>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  <OwnerFormField label="Tên khách hàng">
                    <input
                      className={ownerInputCls}
                      placeholder="VD: Anh Tuấn"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                    />
                  </OwnerFormField>
                  <OwnerFormField label="Số điện thoại (Tuỳ chọn)">
                    <input
                      className={ownerInputCls}
                      placeholder="VD: 0901234567"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                    />
                  </OwnerFormField>
                </div>
              )}

              <OwnerFormField label="Ghi chú (Tuỳ chọn)">
                <input
                  className={ownerInputCls}
                  placeholder="Yêu cầu thêm..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </OwnerFormField>

              <div className="pt-2 border-t border-gray-100">
                <OwnerBtn
                  disabled={submitting || selectedSlots.length === 0}
                  onClick={handleBook}
                  className="w-full sm:w-auto mt-2"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo Booking Walk-in'}
                </OwnerBtn>
              </div>
            </div>
          </OwnerCard>
        </div>
      )}
    </div>
  );
}
