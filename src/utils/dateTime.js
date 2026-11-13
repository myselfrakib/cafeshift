/**
 * Date & Time Utilities for Calcutta Cafe Club
 * - All dates follow DD/MM/YYYY format (e.g. 15/11/2026)
 * - All times follow 12-hour AM/PM format (e.g. 04:00 PM)
 */

/**
 * Format any date input to DD/MM/YYYY
 * @param {string | Date} input - e.g. "2026-11-15", ISO string, or Date object
 * @returns {string} - "15/11/2026"
 */
export function formatDateDDMMYYYY(input) {
  if (!input) return '';

  // If already in DD/MM/YYYY or DD-MM-YYYY format
  if (typeof input === 'string') {
    const ddmmyyyyMatch = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (ddmmyyyyMatch) {
      const day = ddmmyyyyMatch[1].padStart(2, '0');
      const month = ddmmyyyyMatch[2].padStart(2, '0');
      const year = ddmmyyyyMatch[3];
      return `${day}/${month}/${year}`;
    }

    // If in YYYY-MM-DD format (standard HTML date input value)
    const yyyymmddMatch = input.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (yyyymmddMatch) {
      const year = yyyymmddMatch[1];
      const month = yyyymmddMatch[2].padStart(2, '0');
      const day = yyyymmddMatch[3].padStart(2, '0');
      return `${day}/${month}/${year}`;
    }
  }

  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return String(input);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(input);
  }
}

/**
 * Convert any time string (24h or 12h) to 12-hour format "hh:mm AM/PM"
 * @param {string} timeStr - e.g. "16:00", "4:00 PM", "09:30"
 * @returns {string} - "04:00 PM"
 */
export function formatTime12Hour(timeStr) {
  if (!timeStr) return '';

  const clean = String(timeStr).trim();

  // If already contains AM or PM
  const ampmMatch = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
  if (ampmMatch) {
    const h = ampmMatch[1].padStart(2, '0');
    const m = ampmMatch[2];
    const ampm = ampmMatch[3].toUpperCase();
    return `${h}:${m} ${ampm}`;
  }

  // If in 24-hour format "HH:mm" or "HH:mm:ss"
  const match24 = clean.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    let hours = parseInt(match24[1], 10);
    const minutes = match24[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  return clean;
}

/**
 * Parse a 12-hour or 24-hour time string into total minutes from midnight
 * @param {string} timeStr - e.g. "04:00 PM" or "16:00"
 * @returns {number} minutes from midnight (0 - 1439)
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;

  const ampmMatch = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const isPM = ampmMatch[3].toUpperCase() === 'PM';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  const match24 = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return 0;
}

/**
 * Calculate endTime in 12-hour format given startTime and duration in hours
 * @param {string} startTime - e.g. "16:00" or "04:00 PM"
 * @param {number} durationHours - e.g. 3 or 4
 * @returns {string} - e.g. "07:00 PM"
 */
export function calculateEndTime12Hour(startTime, durationHours = 3) {
  const startMinutes = parseTimeToMinutes(startTime);
  const totalMinutes = (startMinutes + Math.round(durationHours * 60)) % (24 * 60);

  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

/**
 * Helper to get tomorrow's date formatted as YYYY-MM-DD for HTML date picker
 */
export function getTomorrowYYYYMMDD() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

