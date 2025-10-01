import getUserLocale from 'get-user-locale';

const formatterCache:any = {};

/**
 * Gets Intl-based date formatter from formatter cache. If it doesn't exist in cache
 * just yet, it will be created on the fly.
 */
const getFormatter = (locale:any, options:any) => {
  if (!locale) {
    // Default parameter is not enough as it does not protect us from null values
    // eslint-disable-next-line no-param-reassign
    locale = getUserLocale();
  }

  const stringifiedOptions = JSON.stringify(options);

  if (!formatterCache[locale]) {
    formatterCache[locale] = {};
  }

  if (!formatterCache[locale][stringifiedOptions]) {
    formatterCache[locale][stringifiedOptions] = (n:any) => n.toLocaleString(locale, options);
  }

  return formatterCache[locale][stringifiedOptions];
};

/**
 * Changes the hour in a Date to ensure right date formatting even if DST is messed up.
 * Workaround for bug in WebKit and Firefox with historical dates.
 * For more details, see:
 * https://bugs.chromium.org/p/chromium/issues/detail?id=750465
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1385643
 *
 * @param {Date} date Date.
 */
const toSafeHour = (date:any) => {
  const safeDate = new Date(date);
  return new Date(safeDate.setHours(12));
};

export const formatDate = (locale:any, date:any) => getFormatter(
  locale,
  { day: 'numeric', month: 'numeric', year: 'numeric' },
)(toSafeHour(date));

export const formatLongDate = (locale:any, date:any) => getFormatter(
  locale,
  { day: 'numeric', month: 'long', year: 'numeric' },
)(toSafeHour(date));

export const formatMonthYear = (locale:any, date:any) => {
  return [getFormatter(
  locale,
  { year: 'numeric' },
)(toSafeHour(date)),getFormatter(
  locale,
  { month: 'long' },
)(toSafeHour(date)),]};

export const formatYear = (locale:any, date:any) => getFormatter(
  locale,
  {year: 'numeric' },
)(toSafeHour(date));

export const formatMonth = (locale:any, date:any) => getFormatter(
  locale,
  { month: 'long' },
)(toSafeHour(date));

export const formatWeekday = (locale:any, date:any) => getFormatter(
  locale,
  { weekday: 'long' },
)(toSafeHour(date));

export const formatShortWeekday = (locale:any, date:any) => getFormatter(
  locale,
  { weekday: 'short' },
)(toSafeHour(date));
