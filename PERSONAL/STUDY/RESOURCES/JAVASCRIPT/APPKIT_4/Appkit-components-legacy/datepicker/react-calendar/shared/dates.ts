
const [
  // eslint-disable-next-line no-unused-vars
  SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY,
] = [...Array(7)].map((el, index) => index);

/* Simple getters - getting a property of a given point in time */

export const getYear = (date:Date|number|string) => {
  if (date instanceof Date) {
    return date.getFullYear();
  }

  if (typeof date === 'number') {
    return date;
  }

  const year = parseInt(date, 10);

  if (typeof date === 'string' && !isNaN(year)) {
    return year;
  }

  throw new Error(`Failed to get year from date: ${date}.`);
};

export const getMonth = (date:Date) => {
  return date && (date.getMonth() + 1);
}

export const getMonthIndex = (date:Date|string) => {
  let tempDate = date;
  if (typeof tempDate == 'string') {
    tempDate = new Date(date)
  }
  return tempDate && tempDate.getMonth();
}

export const getDay = (date:Date|string) => {
  let tempDate = date;
  if (typeof tempDate == 'string') {
    tempDate = new Date(date)
  }
  return tempDate && tempDate.getDate();
}

export const getDayOfWeek = (date:Date, calendarType:string = 'ISO 8601',firstDayOfWeek:number = 0) => {
  const weekday = date.getDay();

  switch (calendarType) {
    case 'ISO 8601':
      // Shifts days of the week so that Monday is 0, Sunday is 6
      return (weekday + 6 - firstDayOfWeek) % 7;
    case 'Arabic':
      return (weekday + 1) % 7;
    case 'Hebrew':
    case 'US':
      return weekday;
    default:
      throw new Error('Unsupported calendar type.');
  }
};

/* Complex getters - getting a property somehow related to a given point in time */
export function getFullDate(year?:any, month?:any, day?:any, hour?:any, min?:any, sec?:any, milsec?:any){
  const a = new Date(2000, 0, 1, 0, 0, 0, 0);
  //Values from 0 to 99 map to the years 1900 to 1999
  if(typeof year === "number"){
    a.setFullYear(year);
  }

  if(typeof month === "number"){
    a.setMonth(month);
  }

  if(typeof day === "number"){
    a.setDate(day);
  }


  if(typeof hour === "number"){
    a.setHours(hour);
  }

  if(typeof min === "number"){
    a.setMinutes(min);
  }

  if(typeof sec === "number"){
    a.setSeconds(sec);
  }

  if(typeof milsec === "number"){
    a.setMilliseconds(milsec);
  }

  return a;
}

export const getBeginOfCenturyYear = (date:Date|number) => {
  const year = getYear(date) - 1;
  return year + (-year % 100) + 1;
};

export const getBeginOfCentury = (date:Date|number) => {
  const beginOfCenturyYear = getBeginOfCenturyYear(date);
  return getFullDate(beginOfCenturyYear, 0, 1);
};

export const getEndOfCentury = (date:Date|number) => {
  const beginOfCenturyYear = getBeginOfCenturyYear(date);
  return getFullDate(beginOfCenturyYear + 100, 0, 1, 0, 0, 0, -1);
};

export const getCenturyRange = (date:Date) => [
  getBeginOfCentury(date),
  getEndOfCentury(date),
];

export const getBeginOfPreviousCentury = (date:Date) => {
  const previousCenturyYear = getYear(date) - 100;
  return getBeginOfCentury(previousCenturyYear);
};

export const getEndOfPreviousCentury = (date: number | Date) => {
  const previousCenturyYear = getYear(date) - 100;
  return getEndOfCentury(previousCenturyYear);
};

export const getBeginOfNextCentury = (date: number | Date) => {
  const nextCenturyYear = getYear(date) + 100;
  return getBeginOfCentury(nextCenturyYear);
};

export const getBeginOfDecadeYear = (date: number | Date) => {
  const year = getYear(date) - 1;
  return year + (-year % 12) + 1;
};

export const getBeginOfDecade = (date: number | Date) => {
  const beginOfDecadeYear = getBeginOfDecadeYear(date);
  return getFullDate(beginOfDecadeYear, 0, 1);
};

export const getEndOfDecade = (date: number | Date) => {
  const beginOfDecadeYear = getBeginOfDecadeYear(date);
  return getFullDate(beginOfDecadeYear + 10, 0, 1, 0, 0, 0, -1);
};

export const getDecadeRange = (date: any) => [
  getBeginOfDecade(date),
  getEndOfDecade(date),
];

export const getBeginOfPreviousDecade = (date:Date, offset = 10) => {
  const previousDecadeYear = getBeginOfDecadeYear(date) - offset;
  return getBeginOfDecade(previousDecadeYear);
};

export const getEndOfPreviousDecade = (date:Date, offset = 10) => {
  const previousDecadeYear = getBeginOfDecadeYear(date) - offset;
  return getEndOfDecade(previousDecadeYear);
};

export const getBeginOfNextDecade = (date:Date, offset = 12) => {
  const nextDecadeYear = getBeginOfDecadeYear(date) + offset;
  return getBeginOfDecade(nextDecadeYear);
};

/**
 * Returns the beginning of a given year.
 *
 * @param {Date} date Date.
 */
export const getBeginOfYear = (date:Date|number) => {
  const year = getYear(date);
  return getFullDate(year, 0, 1);
};

/**
 * Returns the end of a given year.
 *
 * @param {Date} date Date.
 */
export const getEndOfYear = (date:Date|number) => {
  const year = getYear(date);
  return getFullDate(year + 1, 0, 1, 0, 0, 0, -1);
};

/**
 * Returns an array with the beginning and the end of a given year.
 *
 * @param {Date} date Date.
 */
export const getYearRange = (date:Date) => [
  getBeginOfYear(date),
  getEndOfYear(date),
];

export const getBeginOfPreviousYear = (date:Date, offset = 1) => {
  const previousYear = getYear(date) - offset;
  return getBeginOfYear(previousYear);
};

export const getEndOfPreviousYear = (date:Date, offset = 1) => {
  const previousYear = getYear(date) - offset;
  return getEndOfYear(previousYear);
};

export const getBeginOfNextYear = (date:Date, offset = 1) => {
  const nextYear = getYear(date) + offset;
  return getBeginOfYear(nextYear);
};

/**
 * Returns the beginning of a given month.
 *
 * @param {Date} date Date.
 */
export const getBeginOfMonth = (date:Date) => {
  const year = getYear(date);
  const monthIndex = getMonthIndex(date);
  return getFullDate(year, monthIndex, 1);
};

/**
 * Returns the end of a given month.
 *
 * @param {Date} date Date.
 */
export const getEndOfMonth = (date:Date) => {
  const year = getYear(date);
  const monthIndex = getMonthIndex(date);
  return getFullDate(year, monthIndex + 1, 1, 0, 0, 0, -1);
};

/**
 * Returns the beginning of a given week.
 *
 * @param {Date} date Date.
 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
 */
export const getBeginOfWeek = (date:Date, calendarType:string = 'ISO 8601',firstDayOfWeek:number = 0) => {
  const year = getYear(date);
  const monthIndex = getMonthIndex(date);
  const day = date.getDate() - getDayOfWeek(date, calendarType, firstDayOfWeek);
  return getFullDate(year, monthIndex, day);
};

/**
 * Returns an array with the beginning and the end of a given month.
 *
 * @param {Date} date Date.
 */
export const getMonthRange = (date:Date) => [
  getBeginOfMonth(date),
  getEndOfMonth(date),
];

const getDifferentMonth = (date:Date, offset:number) => {
  const year = getYear(date);
  const previousMonthIndex = getMonthIndex(date) + offset;
  return getFullDate(year, previousMonthIndex, 1);
};

export const getBeginOfPreviousMonth = (date:Date, offset = 1) => {
  const previousMonth = getDifferentMonth(date, -offset);
  return getBeginOfMonth(previousMonth);
};

export const getEndOfPreviousMonth = (date:Date, offset = 1) => {
  const previousMonth = getDifferentMonth(date, -offset);
  return getEndOfMonth(previousMonth);
};

export const getBeginOfNextMonth = (date:Date, offset = 1) => {
  const nextMonth = getDifferentMonth(date, offset);
  return getBeginOfMonth(nextMonth);
};

export const getBeginOfDay = (date:Date) => {
  const year = getYear(date);
  const monthIndex = getMonthIndex(date);
  const day = getDay(date);
  return getFullDate(year, monthIndex, day);
};

export const getEndOfDay = (date:Date) => {
  const year = getYear(date);
  const monthIndex = getMonthIndex(date);
  const day = getDay(date);
  return getFullDate(year, monthIndex, day + 1, 0, 0, 0, -1);
};

/**
 * Returns an array with the beginning and the end of a given day.
 *
 * @param {Date} date Date.
 */
export const getDayRange = (date:Date) => [
  getBeginOfDay(date),
  getEndOfDay(date),
];

/**
 * Gets week number according to ISO 8601 or US standard.
 * In ISO 8601, Arabic and Hebrew week 1 is the one with January 4.
 * In US calendar week 1 is the one with January 1.
 *
 * @param {Date} date Date.
 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
 */
export const getWeekNumber = (date:Date, calendarType:string = 'ISO 8601', firstDayOfWeek:number = 0) => {
  const calendarTypeForWeekNumber = calendarType === 'US' ? 'US' : 'ISO 8601';
  const beginOfWeek = getBeginOfWeek(date, calendarTypeForWeekNumber, firstDayOfWeek);
  let year = getYear(date) + 1;
  let dayInWeekOne;
  let beginOfFirstWeek;

  // Look for the first week one that does not come after a given date
  do {
    dayInWeekOne = getFullDate(year, 0, calendarTypeForWeekNumber === 'ISO 8601' ? 4 : 1);
    beginOfFirstWeek = getBeginOfWeek(dayInWeekOne, calendarTypeForWeekNumber, firstDayOfWeek);
    year -= 1;
  } while (Number(date) - Number(beginOfFirstWeek) < 0);
  return Math.round((Number(beginOfWeek) - Number(beginOfFirstWeek)) / (8.64e7 * 7)) + 1;
};


export const getBegin = (rangeType:string, date:Date) => {
  switch (rangeType) {
    case 'century':
      return getBeginOfCentury(date);
    case 'decade':
      return getBeginOfDecade(date);
    case 'year':
      return getBeginOfYear(date);
    case 'month':
      return getBeginOfMonth(date);
    case 'day':
      return getBeginOfDay(date);
    default:
      throw new Error(`Invalid rangeType: ${rangeType}`);
  }
};

export const getBeginPrevious = (rangeType:string, date:Date) => {
  switch (rangeType) {
    case 'century':
      return getBeginOfPreviousCentury(date);
    case 'decade':
      return getBeginOfPreviousDecade(date);
    case 'year':
      return getBeginOfPreviousYear(date);
    case 'month':
      return getBeginOfPreviousMonth(date);
    default:
      throw new Error(`Invalid rangeType: ${rangeType}`);
  }
};

export const getBeginNext = (rangeType:string, date:Date) => {
  switch (rangeType) {
    case 'century':
      return getBeginOfNextCentury(date);
    case 'decade':
      return getBeginOfNextDecade(date);
    case 'year':
      return getBeginOfNextYear(date);
    case 'month':
      return getBeginOfNextMonth(date);
    default:
      throw new Error(`Invalid rangeType: ${rangeType}`);
  }
};


export const getEnd = (rangeType:string, date:Date) => {
  switch (rangeType) {
    case 'century':
      return getEndOfCentury(date);
    case 'decade':
      return getEndOfDecade(date);
    case 'year':
      return getEndOfYear(date);
    case 'month':
      return getEndOfMonth(date);
    case 'day':
      return getEndOfDay(date);
    default:
      throw new Error(`Invalid rangeType: ${rangeType}`);
  }
};

export const getEndPrevious = (rangeType: string, date: Date) => {
  switch (rangeType) {
    case 'century':
      return getEndOfPreviousCentury(date);
    case 'decade':
      return getEndOfPreviousDecade(date);
    case 'year':
      return getEndOfPreviousYear(date);
    case 'month':
      return getEndOfPreviousMonth(date);
    default:
      throw new Error(`Invalid rangeType: ${rangeType}`);
  }
};

/**
 * Returns an array with the beginning and the end of a given range.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */
export const getRange = (rangeType: any, date: Date) => {
  switch (rangeType) {
    case 'century':
      return getCenturyRange(date);
    case 'decade':
      return getDecadeRange(date);
    case 'year':
      return getYearRange(date);
    case 'month':
      return getMonthRange(date);
    case 'day':
      return getDayRange(date);
    default:
      throw new Error(`Invalid rangeType: ${rangeType}`);
  }
};

/**
 * Creates a range out of two values, ensuring they are in order and covering entire period ranges.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date1 First date.
 * @param {Date} date2 Second date.
 */
export const getValueRange = (rangeType: string, date1: any, date2: any) => {
  const rawNextValue = [date1, date2].sort((a, b) => a - b);
  return [
    getBegin(rangeType, rawNextValue[0]),
    getEnd(rangeType, rawNextValue[1]),
  ];
};

/**
 * Returns a number of days in a month of a given date.
 *
 * @param {Date} date Date.
 */
export const getDaysInMonth = (date: string | Date) => {
  const year = getYear(date);
  const monthIndex = getMonthIndex(date);
  return getFullDate(year, monthIndex + 1, 0).getDate();
};

const toYearLabel = ([start, end]:any) => `${getYear(start)} – ${getYear(end)}`;

/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2001-2100.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */
export const getCenturyLabel = (date: Date) => toYearLabel(getCenturyRange(date));

/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2011-2020.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */
export const getDecadeLabel = (date: any) => toYearLabel(getDecadeRange(date));

/**
 * Returns a boolean determining whether a given date is on Saturday or Sunday.
 *
 * @param {Date} date Date.
 */
export const isWeekend = (date: { getDay: () => any; }, calendarType = 'ISO 8601') => {
  const weekday = date.getDay();
  switch (calendarType) {
    case 'Arabic':
    case 'Hebrew':
      return weekday === FRIDAY || weekday === SATURDAY;
    case 'ISO 8601':
    case 'US':
      return weekday === SATURDAY || weekday === SUNDAY;
    default:
      throw new Error('Unsupported calendar type.');
  }
};


