/** Format Date as YYYY-MM-DD in local timezone (avoids UTC shift from toISOString). */
export function formatLocalDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function defaultDateRange(daysBack = 29) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - daysBack);
  return { from: formatLocalDate(from), to: formatLocalDate(to) };
}

/** Add minutes to HH:mm and return HH:mm (24h). */
export function addMinutesToTimeLabel(timeLabel, minutes) {
  if (!timeLabel || !/^\d{1,2}:\d{2}$/.test(timeLabel)) return null;
  const [h, m] = timeLabel.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

/**
 * BUG 2: Giờ nghiệp vụ nằm ở field startTime/endTime dạng "HH:mm[:ss]" (TimeSpan backend),
 * KHÔNG được lấy từ matchDate/bookingDate (phần giờ luôn 00:00).
 * Trả "HH:mm"; null/invalid -> "—" (không bao giờ "Invalid Date").
 */
export function formatSlotTime(time) {
  if (typeof time !== 'string') return '—';
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '—';
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

/**
 * Ghép chuỗi ngày ("YYYY-MM-DD" hoặc ISO datetime) với giờ "HH:mm[:ss]" thành Date
 * bằng constructor số — không parse chuỗi hỗn hợp theo locale trình duyệt.
 * Ngày/giờ đã là giờ nghiệp vụ (VN local), không cộng thêm offset.
 */
export function buildEventDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  const dm = String(dateStr).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dm) return null;
  const tm = typeof timeStr === 'string' ? timeStr.match(/^(\d{1,2}):(\d{2})/) : null;
  const hours = tm ? Number(tm[1]) : 0;
  const minutes = tm ? Number(tm[2]) : 0;
  return new Date(Number(dm[1]), Number(dm[2]) - 1, Number(dm[3]), hours, minutes, 0);
}

/**
 * BUG 3: sự kiện coi là ĐÃ KẾT THÚC khi qua endTime; nếu không có endTime thì
 * quy tắc là qua startTime. Sự kiện đang diễn ra KHÔNG tính là kết thúc (vẫn hiển thị).
 */
export function isEventFinished(event, now = new Date()) {
  const boundary = buildEventDateTime(event?.date, event?.endTime || event?.startTime);
  if (!boundary) return false;
  return boundary <= now;
}

/**
 * Countdown thật cho "SỰ KIỆN SẮP TỚI" (thay chuỗi hardcode "Bắt đầu sau 2 giờ"):
 * đã bắt đầu -> "Đang diễn ra"; <1 phút -> "Sắp bắt đầu"; <60 phút -> X phút;
 * <24 giờ -> X giờ; còn lại -> X ngày. Thiếu dữ liệu -> "Sắp diễn ra".
 */
export function formatTimeUntil(event, now = new Date()) {
  const start = buildEventDateTime(event?.date, event?.startTime);
  if (!start) return 'Sắp diễn ra';
  const diffMin = Math.floor((start - now) / 60000);
  if (diffMin < 0) return 'Đang diễn ra';
  if (diffMin < 1) return 'Sắp bắt đầu';
  if (diffMin < 60) return `Bắt đầu sau ${diffMin} phút`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Bắt đầu sau ${diffHours} giờ`;
  return `Bắt đầu sau ${Math.floor(diffHours / 24)} ngày`;
}
