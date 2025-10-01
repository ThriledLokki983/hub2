import React, { PureComponent } from 'react';
import TileGroup from '../TileGroup';
import Day from './Day';
import {
  getDayOfWeek,
  getDaysInMonth,
  getMonthIndex,
  getYear,
  getFullDate,
} from '../shared/dates';
import { startOf } from '../../utils/dateUtils';
import moment from 'moment';


type DaysPropsType = {
  calendarType?: any,
  showFixedNumberOfWeeks?: boolean,
  showOtherMonths?: boolean,
  disabledDates?: any,
  disabledRanges?: Array<[Date, Date]>,
  disabledDays?: Array<number>,
  activeStartDate?: any,
  hover?: any,
  locale?: string,
  maxDate?: any,
  minDate?: any,
  onClick?: any,
  onMouseOver?: any,
  tileClassName?: any,
  tileContent?: any,
  value?: any,
  valueType?: string,
  formatMonth?: any,
  firstDayOfWeek?: number
}
export default class Days extends PureComponent<DaysPropsType> {
  get offset() {
    return 0;
  }

  /**
   * Defines on which day of the month the grid shall start. If we simply show current
   * month, we obviously start on day one, but if showOtherMonths is set to
   * true, we need to find the beginning of the week the first day of the month is in.
   */
  get start() {
    const { activeStartDate, calendarType, firstDayOfWeek } = this.props;
    let _activeStartDate = startOf("month", activeStartDate);
    _activeStartDate = moment(_activeStartDate).toDate();
    let res = -getDayOfWeek(_activeStartDate, calendarType, firstDayOfWeek);
    if (res === -6) res = 1;
    return res;
  }

  /**
   * Defines on which day of the month the grid shall end. If we simply show current
   * month, we need to stop on the last day of the month, but if showOtherMonths
   * is set to true, we need to find the end of the week the last day of the month is in.
   */
  get end() {
    const { activeStartDate, firstDayOfWeek } = this.props;
    const daysInMonth = getDaysInMonth(activeStartDate);
    const { year, monthIndex } = this;
    const { calendarType } = this.props;
    const activeEndDate = getFullDate(year, monthIndex, daysInMonth);
    return daysInMonth + (7 - getDayOfWeek(activeEndDate, calendarType, firstDayOfWeek) - 2) < daysInMonth ? daysInMonth + (7 - getDayOfWeek(activeEndDate, calendarType, firstDayOfWeek) + 5) : daysInMonth + (7 - getDayOfWeek(activeEndDate, calendarType, firstDayOfWeek) - 2);
  }

  get year() {
    const { activeStartDate } = this.props;
    return getYear(activeStartDate);
  }

  get monthIndex() {
    const { activeStartDate } = this.props;
    return getMonthIndex(activeStartDate);
  }

  render() {
    const { monthIndex } = this;

    const {
      showFixedNumberOfWeeks,
      showOtherMonths,
      activeStartDate,
      ...otherProps
    } = this.props;

    return (
      <TileGroup
        {...otherProps}
        activeStartDate={activeStartDate}
        containerClassName="r-c-days"
        count={7}
        dateTransform={(day: any) => getFullDate(this.year, monthIndex, day)}
        dateType="day"
        end={this.end}
        offset={this.offset}
        start={this.start}
        showOtherMonths={showOtherMonths}
        tile={Day}
        currentMonthIndex={monthIndex}
      />
    );
  }
}
