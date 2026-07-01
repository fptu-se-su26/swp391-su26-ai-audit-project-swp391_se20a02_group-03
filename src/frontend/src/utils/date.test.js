import { describe, it, expect } from 'vitest';
import { formatLocalDate, defaultDateRange, addMinutesToTimeLabel } from './date';

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
