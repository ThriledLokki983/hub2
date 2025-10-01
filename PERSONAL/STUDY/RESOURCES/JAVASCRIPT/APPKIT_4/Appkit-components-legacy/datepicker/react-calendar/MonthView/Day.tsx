import React from 'react';
import Tile from '../Tile';
import {
  getBeginOfDay,
  getDay,
  getEndOfDay,
  isWeekend,
} from '../shared/dates';
import { formatLongDate } from '../shared/dateFormatter';
import ClassNames from 'classnames';
import { isDayExcluded, isSame } from '../../utils/dateUtils';
type DayPropType = {
  activeStartDate?: any,
  classes: any,
  date: any,
  locale: string,
  maxDate: any,
  minDate: any,
  onClick: Function,
  onMouseOver: Function,
  style: any,
  tileClassName: any,
  tileContent: any,
  tileDisabled: any,
  disabledDates: any,
  disabledRanges?: Array<[Date, Date]>,
  disabledDays?: Array<number>,
  firstDayOfWeek: any,
  currentMonthIndex: any,
  showOtherMonths: any
  value: any
  calendarType?: string
}
const Day = ({
  calendarType,
  classes,
  currentMonthIndex,
  date,
  locale,
  showOtherMonths,
  tileDisabled,
  disabledDates,
  disabledRanges,
  disabledDays,
  value,
  activeStartDate,
  ...otherProps
}: DayPropType) => {
  const isNeighboringMonth = date.getMonth() !== currentMonthIndex;
  const text = isNeighboringMonth && !showOtherMonths ? "" : getDay(date);
  const isExcluded = isDayExcluded(date, { disabledDates, disabledDays, disabledRanges });
  const isInExcluded = isSame(value, date) && isDayExcluded(value, { disabledDates, disabledDays, disabledRanges });

  const cn = ClassNames(...classes, 'r-c-single-day', {
    "r-c-single-day--weekend": isWeekend(date, calendarType),
    "r-c-single-day--neighboringMonth": isNeighboringMonth,
    "r-c-single-day--excluded": isExcluded,
    "r-c-single-day-init--excluded": isInExcluded
  }).split(" ");

  return (
    <Tile
      {...otherProps}
      classes={cn}
      date={date}
      formatAbbr={locale && formatLongDate}
      maxDateTransform={getEndOfDay}
      minDateTransform={getBeginOfDay}
      view="month"
      tileDisabled={isNeighboringMonth || isExcluded || tileDisabled}
    >
      {text}
    </Tile>);
}

export default Day;
