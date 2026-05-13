/**
 * Format an absolute date/time for display (e.g. materials list).
 *
 * @param {string | number | Date | null | undefined} input
 * @returns {string}
 */
export function formatDate(input) {
  if (input == null || input === "") return "";

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Format a date as a short relative string (e.g. "2 minutes ago", "in 1 hour").
 * Uses Intl.RelativeTimeFormat (supported in browsers targeted by CRA).
 *
 * @param {string | number | Date | null | undefined} input
 * @returns {string}
 */
export function formatRelativeTime(input) {
  if (input == null || input === "") return "";

  const date = input instanceof Date ? input : new Date(input);
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
