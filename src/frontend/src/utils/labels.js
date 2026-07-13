/** Nhãn hiển thị tiếng Việt cho enum/API — dùng chung toàn frontend */

export const statusLabels = {
  Confirmed: 'Đã xác nhận',
  Pending: 'Đang xử lý',
  Cancelled: 'Đã hủy',
  Open: 'Đang mở',
  Completed: 'Đã hoàn thành',
  Available: 'Khả dụng',
  Rented: 'Đang thuê',
  Returned: 'Đã trả',
  Finished: 'Đã kết thúc',
  Investigating: 'Đang điều tra',
  Resolved: 'Đã xử lý',
  Rejected: 'Đã từ chối',
  Approved: 'Đã duyệt',
  Verified: 'Đã xác minh',
  Active: 'Đang hoạt động',
  Inactive: 'Ngưng hoạt động',
  Locked: 'Đã khóa',
  Paid: 'Đã thanh toán',
  Unpaid: 'Chưa thanh toán',
  Refunded: 'Đã hoàn tiền',
  Scheduled: 'Đã lên lịch',
  Maintenance: 'Bảo trì',
  Booked: 'Đã đặt',
  Closed: 'Đóng',
  'in-progress': 'Đang xử lý',
  overdue: 'Quá hạn',
  completed: 'Hoàn tất',
  scheduled: 'Đã lên lịch',
}

export const paymentLabels = {
  Paid: 'Đã thanh toán',
  Pending: 'Chờ thanh toán',
  Refunded: 'Đã hoàn tiền',
  Unpaid: 'Chưa thanh toán',
}

export const transactionTypeLabels = {
  Deposit: 'Nạp tiền',
  EscrowHold: 'Khóa ký quỹ',
  EscrowRelease: 'Hoàn ký quỹ',
  Withdraw: 'Rút tiền',
  Payment: 'Thanh toán',
  Refund: 'Hoàn tiền',
}

export const itemTypeLabels = {
  Racket: 'Vợt',
  Footwear: 'Giày',
  Apparel: 'Trang phục',
  'Ball / Birdie': 'Cầu / Bóng',
  Accessories: 'Phụ kiện',
  Protection: 'Bảo hộ',
}

export const sportLabels = {
  Badminton: 'Cầu lông',
  Pickleball: 'Pickleball',
  Multi: 'Đa môn',
  Any: 'Mọi môn',
}

export const roleLabels = {
  Admin: 'QUẢN TRỊ',
  Staff: 'NHÂN VIÊN',
  Customer: 'THÀNH VIÊN',
  PRO: 'THÀNH VIÊN',
  ADMIN: 'QUẢN TRỊ',
}

export const levelLabels = {
  Pro: 'Chuyên nghiệp',
  Advanced: 'Nâng cao',
  Intermediate: 'Trung bình',
  Beginner: 'Người mới',
}

export const matchFormatLabels = {
  Competitive: 'Cạnh tranh',
  Friendly: 'Giao hữu',
}

// Lookup không phân biệt hoa thường: API có nơi trả 'ACTIVE'/'AVAILABLE' (uppercase)
// trong khi key ở đây là PascalCase — tránh rơi về 'Không rõ' oan.
const statusLabelsLower = Object.fromEntries(
  Object.entries(statusLabels).map(([k, v]) => [k.toLowerCase(), v])
)

export function translateStatus(status, fallback = 'Không rõ') {
  if (!status) return fallback
  return statusLabels[status] || statusLabelsLower[String(status).toLowerCase()] || fallback
}

export function translatePayment(status, fallback = 'Không rõ') {
  if (!status) return fallback
  return paymentLabels[status] || fallback
}

export function translateTransactionType(type) {
  if (!type) return 'Giao dịch'
  return transactionTypeLabels[type] || type
}

export function translateItemType(type) {
  if (!type) return ''
  return itemTypeLabels[type] || type
}

export function translateSport(sport) {
  if (!sport) return ''
  return sportLabels[sport] || sport
}

export function translateRole(role) {
  if (!role) return 'THÀNH VIÊN'
  return roleLabels[role] || role
}

export function translateLevel(level, fallback = '') {
  if (!level) return fallback
  return levelLabels[level] || level
}

export function translateMatchFormat(isCompetitive) {
  return isCompetitive ? matchFormatLabels.Competitive : matchFormatLabels.Friendly
}

export function translateCourtTypeName(name, fallback = 'Chưa phân loại') {
  if (!name) return fallback
  const n = String(name).trim()
  if (sportLabels[n]) return sportLabels[n]
  const lower = n.toLowerCase()
  if (lower.includes('badminton') || lower.includes('cầu lông')) return 'Cầu lông'
  if (lower.includes('pickleball')) return 'Pickleball'
  if (lower.includes('indoor') || lower.includes('trong nhà')) return 'Trong nhà'
  if (lower.includes('outdoor') || lower.includes('ngoài trời')) return 'Ngoài trời'
  return n
}
