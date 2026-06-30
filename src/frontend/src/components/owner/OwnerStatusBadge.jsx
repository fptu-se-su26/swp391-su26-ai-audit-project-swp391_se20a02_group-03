const COURT = {
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  MAINTENANCE: 'bg-amber-100 text-amber-800',
  INACTIVE: 'bg-slate-200 text-slate-600',
  Available: 'bg-emerald-100 text-emerald-800',
  Maintenance: 'bg-amber-100 text-amber-800',
  Inactive: 'bg-slate-200 text-slate-600',
};

const BOOKING = {
  Pending: 'bg-yellow-100 text-yellow-800',
  PendingPayment: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  CheckedIn: 'bg-purple-100 text-purple-800',
  Completed: 'bg-slate-200 text-slate-700',
  Cancelled: 'bg-red-100 text-red-700',
  NoShow: 'bg-red-100 text-red-700',
  Expired: 'bg-red-100 text-red-700',
};

export default function OwnerStatusBadge({ status, type = 'booking' }) {
  const map = type === 'court' ? COURT : BOOKING;
  const cls = map[status] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
