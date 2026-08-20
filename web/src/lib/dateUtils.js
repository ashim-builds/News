/**
 * Converts English numbers to Nepali digits (e.g., 15 -> १५)
 */
export function toNepaliDigits(num) {
  if (num === null || num === undefined) return "०";
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(num).replace(/\d/g, (digit) => nepaliDigits[parseInt(digit, 10)]);
}

/**
 * Formats a Date/Timestamp to humanized Nepali relative time
 * e.g., "भर्खरै", "५ मिनेट अघि", "२ घण्टा अघि", "३ दिन अघि", "१ महिना अघि", "२ वर्ष अघि"
 */
export function getRelativeTimeNepali(dateInput) {
  if (!dateInput) return "भर्खरै";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "भर्खरै";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // If time is slightly in future (clock skew) or under 30 seconds
  if (diffInSeconds < 30) {
    return "भर्खरै";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${toNepaliDigits(diffInMinutes)} मिनेट अघि`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${toNepaliDigits(diffInHours)} घण्टा अघि`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${toNepaliDigits(diffInDays)} दिन अघि`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${toNepaliDigits(diffInMonths)} महिना अघि`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${toNepaliDigits(Math.max(1, diffInYears))} वर्ष अघि`;
}
