import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { 
  OwnerCard, 
  OwnerBtn, 
  OwnerStatusBadge,
  OwnerErrorState,
  ownerInputCls
} from '../../components/owner';
import { ChevronLeft } from 'lucide-react';

function formatTime(value) {
  if (!value) return '—';
  const text = String(value);
  return text.length >= 5 ? text.slice(0, 5) : text;
}

const CANCELLABLE = new Set(['Pending', 'PendingPayment', 'Confirmed']);
const CHECKINABLE = new Set(['Confirmed']);
const CONFIRMABLE = new Set(['Pending', 'PendingPayment']);

export default function OwnerBookingDetailPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkInCode, setCheckInCode] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getBooking(bookingId);
      if (res.statusCode === 200) setBooking(res.data);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải booking.');
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [bookingId]);

  async function runAction(action) {
    try {
      setActionLoading(true);
      setError(null);
      let res;
      if (action === 'confirm') res = await ownerApi.updateBookingStatus(bookingId, 'Confirmed');
      else if (action === 'checkIn') res = await ownerApi.checkInBooking(bookingId, checkInCode || booking?.checkInCode);
      else if (action === 'cancel') res = await ownerApi.cancelBooking(bookingId);
      else return;

      if (res.statusCode === 200 || res.statusCode === 201) load();
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Thao tác thất bại.');
    } finally {
      setActionLoading(false);
    }
  }

  async function confirm() {
    if (!window.confirm('Xác nhận booking này?')) return;
    await runAction('confirm');
  }

  async function checkIn() {
    await runAction('checkIn');
  }

  async function cancel() {
    if (!window.confirm('Hủy booking này?')) return;
    await runAction('cancel');
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded-[4px] mb-4"></div>
        <div className="h-10 w-64 bg-gray-200 rounded-[8px]"></div>
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-8 h-64"></div>
      </div>
    );
  }

  if (!booking && error) return <OwnerErrorState message={error} onRetry={load} />;
  if (!booking) return <OwnerErrorState message="Không tìm thấy booking." />;

  const details = booking.details || [];
  const canConfirm = CONFIRMABLE.has(booking.status);
  const canCheckIn = CHECKINABLE.has(booking.status);
  const canCancel = CANCELLABLE.has(booking.status);

  return (
    <div className="max-w-2xl mx-auto space-y-6 auth-animate-in pb-12">
      <div>
        <Link 
          to="/owner/bookings" 
          className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-gray-500 hover:text-[#14b8a6] no-underline transition-colors mb-4"
        >
          <ChevronLeft size={16} /> Danh sách booking
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0">
            Booking #{booking.bookingId}
          </h1>
          <OwnerStatusBadge status={booking.status} type="booking" />
        </div>
      </div>

      {error && <OwnerErrorState message={error} />}

      <OwnerCard noPad>
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0">Thông tin chi tiết</h3>
        </div>
        <div className="p-6 flex flex-col gap-4 text-sm">
          {details.map((detail, idx) => (
            <div key={`${detail.courtId}-${idx}`} className={idx > 0 ? 'pt-4 border-t border-gray-100 flex flex-col gap-3' : 'flex flex-col gap-3'}>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 uppercase tracking-wide text-[11px] font-bold">Sân</span>
                <strong className="text-[#0f172a]">{detail.courtName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 uppercase tracking-wide text-[11px] font-bold">Ngày chơi</span>
                <span className="text-[#0f172a] font-medium">{detail.bookingDate ? new Date(detail.bookingDate).toLocaleDateString('vi-VN') : '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 uppercase tracking-wide text-[11px] font-bold">Thời gian</span>
                <span className="text-[#0f172a] font-medium">{formatTime(detail.startTime)} – {formatTime(detail.endTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 uppercase tracking-wide text-[11px] font-bold">Giá slot</span>
                <span className="text-[#0f172a] font-medium">{Number(detail.price).toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 uppercase tracking-wide text-[11px] font-bold">Phương thức thanh toán</span>
              <span className="text-[#0f172a] font-medium">
                {booking.paymentStatus || '—'} {booking.paymentMethod ? `(${booking.paymentMethod})` : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 uppercase tracking-wide text-[11px] font-bold">Mã Check-in</span>
              <span className="font-mono text-[#0f172a] bg-gray-50 px-2 py-1 rounded-[4px]">{booking.checkInCode || '—'}</span>
            </div>
            {booking.paymentDeadline && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 uppercase tracking-wide text-[11px] font-bold">Hạn thanh toán</span>
                <span className="text-red-500 font-medium">{new Date(booking.paymentDeadline).toLocaleString('vi-VN')}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-2">
            <span className="text-gray-500 uppercase tracking-widest text-[12px] font-bold">Tổng tiền</span>
            <strong className="text-[#14b8a6] text-xl">{Number(booking.totalAmount).toLocaleString('vi-VN')} ₫</strong>
          </div>
        </div>
      </OwnerCard>

      {(canConfirm || canCheckIn || canCancel) && (
        <OwnerCard>
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">Thao tác</h3>
          <div className="flex flex-wrap gap-3 items-center">
            {canConfirm && (
              <OwnerBtn
                disabled={actionLoading}
                onClick={confirm}
              >
                Xác nhận Booking
              </OwnerBtn>
            )}
            {canCheckIn && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  className={`${ownerInputCls} max-w-[150px] font-mono`}
                  placeholder="Mã check-in"
                  value={checkInCode}
                  onChange={e => setCheckInCode(e.target.value)}
                />
                <OwnerBtn
                  disabled={actionLoading}
                  onClick={checkIn}
                >
                  Check-in
                </OwnerBtn>
              </div>
            )}
            {canCancel && (
              <OwnerBtn
                variant="danger"
                disabled={actionLoading}
                onClick={cancel}
                className="ml-auto"
              >
                Hủy booking
              </OwnerBtn>
            )}
          </div>
        </OwnerCard>
      )}
    </div>
  );
}
