import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import StatusBadge from '../../components/ui/StatusBadge';
import PageLoader from '../../components/ui/PageLoader';

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

  if (loading) return <PageLoader label="Đang tải booking..." />;
  if (!booking) return <div className="text-danger">{error || 'Không tìm thấy.'}</div>;

  const details = booking.details || [];
  const canConfirm = CONFIRMABLE.has(booking.status);
  const canCheckIn = CHECKINABLE.has(booking.status);
  const canCancel = CANCELLABLE.has(booking.status);

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/owner/bookings" className="inline-block text-sm font-bold text-foreground no-underline border-b-2 border-foreground pb-0.5">
        ← Danh sách booking
      </Link>

      <div className="flex items-center gap-3.5">
        <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground">Booking #{booking.bookingId}</h1>
        <StatusBadge status={booking.status} />
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="border-2 border-border-strong bg-surface p-7 flex flex-col gap-3 text-sm">
        {details.map((detail, idx) => (
          <div key={`${detail.courtId}-${idx}`} className={idx > 0 ? 'pt-3 border-t border-border-default flex flex-col gap-3' : 'flex flex-col gap-3'}>
            <p><span className="text-foreground-subtle">Sân:</span> <strong className="text-foreground">{detail.courtName}</strong></p>
            <p><span className="text-foreground-subtle">Ngày:</span> <span className="text-foreground">{detail.bookingDate ? new Date(detail.bookingDate).toLocaleDateString('vi-VN') : '—'}</span></p>
            <p><span className="text-foreground-subtle">Giờ:</span> <span className="text-foreground">{formatTime(detail.startTime)}–{formatTime(detail.endTime)}</span></p>
            <p><span className="text-foreground-subtle">Giá slot:</span> <span className="text-foreground">{Number(detail.price).toLocaleString('vi-VN')} ₫</span></p>
          </div>
        ))}
        <p className="pt-3 border-t border-border-default"><span className="text-foreground-subtle">Thanh toán:</span> <span className="text-foreground">{booking.paymentStatus || '—'} ({booking.paymentMethod || '—'})</span></p>
        <p><span className="text-foreground-subtle">Tổng tiền:</span> <strong className="text-foreground">{Number(booking.totalAmount).toLocaleString('vi-VN')} ₫</strong></p>
        <p><span className="text-foreground-subtle">Mã check-in:</span> <span className="font-mono text-foreground">{booking.checkInCode || '—'}</span></p>
        {booking.paymentDeadline && (
          <p><span className="text-foreground-subtle">Hạn thanh toán:</span> <span className="text-foreground">{new Date(booking.paymentDeadline).toLocaleString('vi-VN')}</span></p>
        )}
      </div>

      {(canConfirm || canCheckIn || canCancel) && (
        <div className="border-2 border-border-strong bg-surface p-6 space-y-3.5">
          <h3 className="font-heading text-base uppercase tracking-tight text-foreground">Thao tác</h3>
          <div className="flex flex-wrap gap-2.5 items-center">
            {canConfirm && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={confirm}
                className="btn-primary disabled:opacity-60"
              >
                Xác nhận
              </button>
            )}
            {canCheckIn && (
              <>
                <input
                  className="input-base w-auto"
                  placeholder="Mã check-in"
                  value={checkInCode}
                  onChange={e => setCheckInCode(e.target.value)}
                />
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={checkIn}
                  className="btn-primary disabled:opacity-60"
                >
                  Check-in
                </button>
              </>
            )}
            {canCancel && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={cancel}
                className="inline-flex items-center justify-center gap-2 px-5 h-10 font-sans text-sm font-bold uppercase tracking-[0.04em] rounded-[2px] border-2 border-danger text-danger bg-transparent transition-colors duration-150 hover:bg-danger-bg disabled:opacity-60"
              >
                Hủy booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
