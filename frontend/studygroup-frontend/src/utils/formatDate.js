/**
 * Ensure a date string from the .NET backend is treated as UTC.
 * .NET serializes DateTime as "2026-05-14T02:20:00" (no 'Z'),
 * so browsers incorrectly parse it as local time. We append 'Z' if needed.
 *
 * @param {string | number | Date | null | undefined} input
 * @returns {Date}
 */
function toDate(input) {
  if (input == null || input === "") return new Date(NaN);
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input);
  // If it's a string with no timezone info (no Z, no +, no -HH:MM at end), add Z
  const s = input.trim();
  const hasTimezone = /[Zz]$/.test(s) || /[+-]\d{2}:\d{2}$/.test(s);
  return new Date(hasTimezone ? s : s + "Z");
}

/**
 * Format an absolute date/time for display (e.g. materials list).
 *
 * @param {string | number | Date | null | undefined} input
 * @returns {string}
 */
export function formatDate(input) {
  const date = toDate(input);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Format a date as a short relative string (e.g. "2 minutes ago", "in 1 hour").
 *
 * @param {string | number | Date | null | undefined} input
 * @returns {string}
 */
export function formatRelativeTime(input) {
  const date = toDate(input);
  const ts = date.getTime();
  if (Number.isNaN(ts)) return "";

  const diffMs = ts - Date.now();
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  const abs = Math.abs(diffMs);
  const sec = 1000;
  const min = 60 * sec;
  const hr = 60 * min;
  const day = 24 * hr;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (abs < min) return rtf.format(Math.round(diffMs / sec), "second");
  if (abs < hr) return rtf.format(Math.round(diffMs / min), "minute");
  if (abs < day) return rtf.format(Math.round(diffMs / hr), "hour");
  if (abs < week) return rtf.format(Math.round(diffMs / day), "day");
  if (abs < month) return rtf.format(Math.round(diffMs / week), "week");
  if (abs < year) return rtf.format(Math.round(diffMs / month), "month");
  return rtf.format(Math.round(diffMs / year), "year");
}
