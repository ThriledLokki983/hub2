const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_YEAR = 365.25;
const DAYS_IN_MONTH = 30; // Approximation for simplicity

interface FormatDateResponse {
  value: number;
  label: string;
}

export const getRelativeDateTime = (date: string, { includeTime = false } = {}): FormatDateResponse => {
  if (!date) return { value: 0, label: '' };

  // Get the minutes integer, leaving timezone intact (Django, saves as 'Europe/Amsterdam')
  const secondsDiff = Math.round((Date.parse(date) - Date.now()) / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const absSecondsDiff = Math.abs(secondsDiff);
  const absMinutesDiff = Math.abs(minutesDiff);

  if (includeTime) {
    const toYears = (minutes: number) => Math.abs(Math.round(minutes / (MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_YEAR)));
    const toMonths = (minutes: number) => Math.abs(Math.round(minutes / (MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_MONTH)));
    const toDays = (minutes: number) => Math.abs(Math.round(minutes / (MINUTES_IN_HOUR * HOURS_IN_DAY)));
    const toHours = (minutes: number) => Math.abs(Math.round(minutes / MINUTES_IN_HOUR));
    const toMinutes = (minutes: number) => Math.abs(minutes);

    const isYears = (minutes: number) => absMinutesDiff >= (MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_YEAR);
    const isDays = (minutes: number) => absMinutesDiff >= (MINUTES_IN_HOUR * HOURS_IN_DAY);
    const isHours = (minutes: number) => absMinutesDiff >= MINUTES_IN_HOUR;

    if (isYears(minutesDiff)) {
      return { value: toYears(minutesDiff), label: toYears(minutesDiff) > 0 ? 'years' : 'year' };
    }
    if (minutesDiff < -(MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_MONTH * 1.5)) {
      return { value: toMonths(minutesDiff), label: toMonths(minutesDiff) > 1 ? 'months' : 'month' };
    }
    if (isDays(minutesDiff)) {
      return { value: toDays(minutesDiff), label: toDays(minutesDiff) > 1 ? 'days' : 'day' };
    }
    if (isHours(minutesDiff)) {
      return { value: toHours(minutesDiff), label: toHours(minutesDiff) > 1 ? 'hours' : 'hour' };
    }

    // For minutes and seconds
    if (absMinutesDiff > 0) {
      return { value: toMinutes(minutesDiff), label: toMinutes(minutesDiff) > 1 ? 'mins' : 'min' };
    }
    return { value: absSecondsDiff, label: absSecondsDiff > 1 ? 'secs' : 'sec' };
  }

  // Fallback for non-time-inclusive scenarios or unhandled cases
  return { value: 0, label: ''};
};

export const formatDateString = (value: string, locale: string = navigator.language || 'nl-NL') => {
  if (!value) return 'Not known yet';

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    console.warn('Invalid date format');
    return 'Not known yet';
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  const formattedDate = Intl.DateTimeFormat(locale, options).format(date);

  // Add suffix to the day part
  const day = date.getUTCDate();
  const daySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // Covers 4-20
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  // Replace the numeric day part with the day + suffix
  const formattedWithSuffix = formattedDate.replace(
    /\b\d{1,2}\b/, // Match the day part (1-31)
    `${day}${daySuffix(day)}`
  );

  return formattedWithSuffix;
}
