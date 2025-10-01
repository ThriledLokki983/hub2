import React, { Component } from 'react';
import {
  getBeginOfMonth,
  getDayOfWeek,
  getMonthIndex,
  getYear,
} from '../shared/dates';

type WeekdaysPropsType = {
  calendarType?: any,
  formatShortWeekday?: Function,
  locale?: string,
  activeStartDate?: any,
  firstDayOfWeek?: number
}
export default class Weekdays extends Component<WeekdaysPropsType> {
  shouldComponentUpdate(nextProps: any) {
    const { calendarType, locale } = this.props;

    return (
      nextProps.calendarType !== calendarType
      || nextProps.locale !== locale
    );
  }

  get beginOfMonth() {
    const { activeStartDate } = this.props;

    return getBeginOfMonth(activeStartDate);
  }

  get year() {
    const { beginOfMonth } = this;

    return getYear(beginOfMonth);
  }

  get monthIndex() {
    const { beginOfMonth } = this;

    return getMonthIndex(beginOfMonth);
  }

  render() {
    const { calendarType, formatShortWeekday, locale, firstDayOfWeek } = this.props;
    const { beginOfMonth, year, monthIndex } = this;

    const weekdays = [];

    for (let weekday = 0; weekday < 7; weekday += 1) {

      const weekdayDate = new Date(
        year, monthIndex, weekday - getDayOfWeek(beginOfMonth, calendarType, firstDayOfWeek),
      );
      let weekdayName = formatShortWeekday && formatShortWeekday(locale, weekdayDate).replace('.', '');
      weekdays.push(
        <div
          className="r-c-single-weekday"
          key={weekday}
        >
          {weekdayName}
        </div>,
      );
    }

    return (
      <div className="r-c-weekdays">
        {weekdays}
      </div>
    );
  }
}
