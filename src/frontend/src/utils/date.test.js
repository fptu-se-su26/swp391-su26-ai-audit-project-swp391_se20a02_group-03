import { describe, it, expect } from 'vitest';
import {
  formatLocalDate, defaultDateRange, addMinutesToTimeLabel,
  formatSlotTime, buildEventDateTime, isEventFinished, formatTimeUntil,
} from './date';

describe('date utils', () => {
  it('formatLocalDate uses local calendar day', () => {
    const d = new Date(2026, 6, 1, 23, 30, 0); // July 1 local
    expect(formatLocalDate(d)).toBe('2026-07-01');
  });

  it('defaultDateRange returns local YYYY-MM-DD strings', () => {
    const { from, to } = defaultDateRange(7);
    expect(from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('addMinutesToTimeLabel advances slot end time', () => {
    expect(addMinutesToTimeLabel('09:00', 60)).toBe('10:00');
    expect(addMinutesToTimeLabel('21:00', 90)).toBe('22:30');
  });
});

// BUG 2 — giờ kèo lấy từ matchDate (luôn 00:00) thay vì startTime "HH:mm:ss" (TimeSpan).
describe('formatSlotTime', () => {
  it('formats "19:00" as-is', () => {
    expect(formatSlotTime('19:00')).toBe('19:00');
  });

  it('trims seconds from TimeSpan string "19:00:00"', () => {
    expect(formatSlotTime('19:00:00')).toBe('19:00');
  });

  it('keeps leading zeros: "07:05:00" -> 07:05', () => {
    expect(formatSlotTime('07:05:00')).toBe('07:05');
  });

  it('falls back to "—" for null/undefined/invalid (never from matchDate, never Invalid Date)', () => {
    expect(formatSlotTime(null)).toBe('—');
    expect(formatSlotTime(undefined)).toBe('—');
    expect(formatSlotTime('abc')).toBe('—');
    expect(formatSlotTime('')).toBe('—');
  });
});

describe('buildEventDateTime', () => {
  it('combines date-only string with HH:mm time (no locale-dependent parsing)', () => {
    const d = buildEventDateTime('2026-07-12', '19:00');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(12);
    expect(d.getHours()).toBe(19);
    expect(d.getMinutes()).toBe(0);
  });

  it('accepts ISO datetime date part and HH:mm:ss time', () => {
    const d = buildEventDateTime('2026-07-12T00:00:00', '09:30:00');
    expect(d.getDate()).toBe(12);
    expect(d.getHours()).toBe(9);
    expect(d.getMinutes()).toBe(30);
  });

  it('returns null when date missing', () => {
    expect(buildEventDateTime(null, '09:00')).toBeNull();
  });
});

// BUG 3 — sự kiện đã kết thúc không được nằm trong "SỰ KIỆN SẮP TỚI".
describe('isEventFinished', () => {
  const now = new Date(2026, 6, 13, 10, 0, 0); // 13/07/2026 10:00

  it('event ended (endTime past) is finished', () => {
    expect(isEventFinished({ date: '2026-07-12', startTime: '09:00', endTime: '10:00' }, now)).toBe(true);
  });

  it('event in progress (started, not ended) is NOT finished — still shown', () => {
    expect(isEventFinished({ date: '2026-07-13', startTime: '09:30', endTime: '11:00' }, now)).toBe(false);
  });

  it('future event is not finished', () => {
    expect(isEventFinished({ date: '2026-07-14', startTime: '09:00', endTime: '10:00' }, now)).toBe(false);
  });

  it('without endTime, falls back to startTime rule: past startTime => finished', () => {
    expect(isEventFinished({ date: '2026-07-13', startTime: '09:00' }, now)).toBe(true);
    expect(isEventFinished({ date: '2026-07-13', startTime: '11:00' }, now)).toBe(false);
  });
});

describe('formatTimeUntil', () => {
  const now = new Date(2026, 6, 13, 10, 0, 0);

  it('under 1 minute -> "Sắp bắt đầu"', () => {
    expect(formatTimeUntil({ date: '2026-07-13', startTime: '10:00' }, now)).toBe('Sắp bắt đầu');
  });

  it('30 minutes away -> "Bắt đầu sau 30 phút"', () => {
    expect(formatTimeUntil({ date: '2026-07-13', startTime: '10:30' }, now)).toBe('Bắt đầu sau 30 phút');
  });

  it('exactly 60 minutes -> hours unit (boundary)', () => {
    expect(formatTimeUntil({ date: '2026-07-13', startTime: '11:00' }, now)).toBe('Bắt đầu sau 1 giờ');
  });

  it('2 hours away -> "Bắt đầu sau 2 giờ"', () => {
    expect(formatTimeUntil({ date: '2026-07-13', startTime: '12:00' }, now)).toBe('Bắt đầu sau 2 giờ');
  });

  it('exactly 24 hours -> days unit (boundary)', () => {
    expect(formatTimeUntil({ date: '2026-07-14', startTime: '10:00' }, now)).toBe('Bắt đầu sau 1 ngày');
  });

  it('2 days away -> "Bắt đầu sau 2 ngày"', () => {
    expect(formatTimeUntil({ date: '2026-07-15', startTime: '10:00' }, now)).toBe('Bắt đầu sau 2 ngày');
  });

  it('already started but not ended -> "Đang diễn ra"', () => {
    expect(formatTimeUntil({ date: '2026-07-13', startTime: '09:30', endTime: '11:00' }, now)).toBe('Đang diễn ra');
  });

  it('missing data -> safe fallback, never "Invalid Date"', () => {
    expect(formatTimeUntil({ date: null, startTime: null }, now)).toBe('Sắp diễn ra');
  });
});
