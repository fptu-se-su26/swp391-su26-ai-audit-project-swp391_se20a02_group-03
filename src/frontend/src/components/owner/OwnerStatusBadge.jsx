export default function OwnerStatusBadge({ status, type = 'general' }) {
  let variant = 'neutral';

  const s = String(status || '').toLowerCase().replace(/_/g, '').replace(/\s+/g, '');

  const successStates = ['active', 'available', 'confirmed', 'paid', 'success', 'open', 'working', 'online', 'valid', 'instock'];
  const warningStates = ['maintenance', 'underrepair', 'pending', 'pendingpayment', 'draft', 'unpaid', 'onleave', 'busy', 'expiringsoon', 'lowstock', 'scheduled'];
  const dangerStates = ['inactive', 'closed', 'cancelled', 'noshow', 'expired', 'failed', 'suspended', 'terminated', 'outofstock', 'discontinued'];
  const infoStates = ['checkedin', 'inprogress', 'used', 'redeemed'];
  const neutralStates = ['completed', 'unknown'];

  // Nếu type được chỉ định rõ, có thể phân nhánh logic ở đây trong tương lai.
  // Hiện tại dùng chung một danh sách map tổng hợp rất hiệu quả vì tên trạng thái thường khác biệt.

  if (successStates.includes(s)) variant = 'success';
  else if (warningStates.includes(s)) variant = 'warning';
  else if (dangerStates.includes(s)) variant = 'danger';
  else if (infoStates.includes(s)) variant = 'info';
  else if (neutralStates.includes(s)) variant = 'neutral';
  else {
    // Fallback guess
    if (s.includes('fail') || s.includes('error') || s.includes('cancel')) variant = 'danger';
    else if (s.includes('wait') || s.includes('pend')) variant = 'warning';
  }

  const variants = {
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    warning: 'bg-orange-50 text-orange-600 border border-orange-100',
    danger: 'bg-red-50 text-red-600 border border-red-100',
    info: 'bg-blue-50 text-blue-600 border border-blue-100',
    neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
  };

  const v = variants[variant] || variants.neutral;

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${v}`}>
      {status || 'Unknown'}
    </span>
  );
}
