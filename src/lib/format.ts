/** Display helpers. All dates use South African conventions. */

const DATE_FORMAT = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TIME_FORMAT = new Intl.DateTimeFormat("en-ZA", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "14 November 2026" */
export function formatDate(isoTimestamp: string): string {
  return DATE_FORMAT.format(new Date(isoTimestamp));
}

/** "21:48" */
export function formatTime(isoTimestamp: string): string {
  return TIME_FORMAT.format(new Date(isoTimestamp));
}

/** "14 November 2026 at 21:48" */
export function formatDateAndTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return `${DATE_FORMAT.format(date)} at ${TIME_FORMAT.format(date)}`;
}

/** 75 seconds becomes "01:15". */
export function formatRecordingClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** 75 seconds becomes "1 minute 15 seconds", for screen readers and summaries. */
export function formatDurationInWords(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const minutesText = minutes === 1 ? "1 minute" : `${minutes} minutes`;
  const secondsText = seconds === 1 ? "1 second" : `${seconds} seconds`;
  if (minutes === 0) return secondsText;
  if (seconds === 0) return minutesText;
  return `${minutesText} ${secondsText}`;
}

/** Simple shape check. The real proof an address works is a delivered email. */
export function looksLikeEmailAddress(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
}

/**
 * Accepts South African and international numbers, written with or without
 * spaces, dashes or brackets: "082 123 4567", "+27 82 123 4567".
 */
export function looksLikePhoneNumber(text: string): boolean {
  const digitsAndPlus = text.replace(/[\s\-()]/g, "");
  return /^\+?\d{10,15}$/.test(digitsAndPlus);
}
