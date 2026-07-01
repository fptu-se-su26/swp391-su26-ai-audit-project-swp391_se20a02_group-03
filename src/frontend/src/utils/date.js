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
