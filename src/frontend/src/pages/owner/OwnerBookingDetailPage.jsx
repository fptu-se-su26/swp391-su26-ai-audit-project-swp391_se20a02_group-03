import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

function formatTime(value) {
  if (!value) return '—';
  const text = String(value);
  return text.length >= 5 ? text.slice(0, 5) : text;
}

const CANCELLABLE = new Set(['Pending', 'PendingPayment', 'Confirmed']);
const CHECKINABLE = new Set(['Confirmed', 'PendingPayment']);
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
  if (!booking) return <div className="text-red-600">{error || 'Không tìm thấy.'}</div>;

  const details = booking.details || [];
  const canConfirm = CONFIRMABLE.has(booking.status);
  const canCheckIn = CHECKINABLE.has(booking.status);
  const canCancel = CANCELLABLE.has(booking.status);

  return (
    <div className="max-w-2xl space-y-4">
      <Link to="/owner/bookings" className="text-sm text-emerald-700 no-underline">← Danh sách booking</Link>
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-900">Booking #{booking.bookingId}</h2>
        <OwnerStatusBadge status={booking.status} />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="bg-white rounded-xl border p-5 space-y-3 text-sm">
        {details.map((detail, idx) => (
          <div key={`${detail.courtId}-${idx}`} className={idx > 0 ? 'pt-3 border-t border-slate-100' : ''}>
            <p><span className="text-slate-500">Sân:</span> {detail.courtName}</p>
            <p><span className="text-slate-500">Ngày:</span> {detail.bookingDate ? new Date(detail.bookingDate).toLocaleDateString('vi-VN') : '—'}</p>
            <p><span className="text-slate-500">Giờ:</span> {formatTime(detail.startTime)}–{formatTime(detail.endTime)}</p>
            <p><span className="text-slate-500">Giá slot:</span> {Number(detail.price).toLocaleString('vi-VN')} ₫</p>
          </div>
        ))}
        <p><span className="text-slate-500">Thanh toán:</span> {booking.paymentStatus || '—'} ({booking.paymentMethod || '—'})</p>
        <p><span className="text-slate-500">Tổng tiền:</span> {Number(booking.totalAmount).toLocaleString('vi-VN')} ₫</p>
        <p><span className="text-slate-500">Mã check-in:</span> {booking.checkInCode || '—'}</p>
        {booking.paymentDeadline && (
          <p><span className="text-slate-500">Hạn thanh toán:</span> {new Date(booking.paymentDeadline).toLocaleString('vi-VN')}</p>
        )}
      </div>

      {(canConfirm || canCheckIn || canCancel) && (
        <div className="bg-white rounded-xl border p-4 space-y-3">
          <h3 className="font-semibold text-slate-900">Thao tác</h3>
          <div className="flex flex-wrap gap-2">
            {canConfirm && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={confirm}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm disabled:opacity-60"
              >
                Xác nhận
              </button>
            )}
            {canCheckIn && (
              <>
                <input
                  className="rounded-lg border px-3 py-2 text-sm"
                  placeholder="Mã check-in"
                  value={checkInCode}
                  onChange={e => setCheckInCode(e.target.value)}
                />
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={checkIn}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm disabled:opacity-60"
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
                className="px-4 py-2 rounded-lg border border-red-300 text-red-700 text-sm disabled:opacity-60"
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
