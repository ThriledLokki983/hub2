import React, { PureComponent } from 'react';
import Days from './MonthView/Days';
import Weekdays from './MonthView/Weekdays';
import WeekNumbers from './MonthView/WeekNumbers';
import ClassNames from 'classnames';

type MonthViewType = {
  activeStartDate?: any,
  calendarType?: any,
  formatShortWeekday?: Function,
  locale?: string,
  maxDate?: any,
  minDate?: any,
  onChange?: Function,
  onClickWeekNumber?: Function,
  setActiveRange?: Function,
  showFixedNumberOfWeeks?: boolean,
  showOtherMonths?: boolean,
  showWeekNumbers?: boolean,
  value?: any,
  valueType?: string,
  keyboradHighlight?: any,
  disabledDates?: any,
  onClick: any,
  firstDayOfWeek?: number
}

export default class MonthView extends PureComponent<MonthViewType> {
  //convert locale to week type
  //in different locale, the first day of a week can be Monday or Sunday
  get calendarType() {
    const { calendarType, locale, firstDayOfWeek } = this.props;

    if (calendarType) {
      return calendarType;
    }

    switch (locale) {
      case 'en-CA':
      case 'en-US':
      case 'es-AR':
      case 'es-BO':
      case 'es-CL':
      case 'es-CO':
      case 'es-CR':
      case 'es-DO':
      case 'es-EC':
      case 'es-GT':
      case 'es-HN':
      case 'es-MX':
      case 'es-NI':
      case 'es-PA':
      case 'es-PE':
      case 'es-PR':
      case 'es-SV':
      case 'es-VE':
      case 'pt-BR':
        return 'US';
      // ar-LB, ar-MA intentionally missing
      case 'ar':
      case 'ar-AE':
      case 'ar-BH':
      case 'ar-DZ':
      case 'ar-EG':
      case 'ar-IQ':
      case 'ar-JO':
      case 'ar-KW':
      case 'ar-LY':
      case 'ar-OM':
      case 'ar-QA':
      case 'ar-SA':
      case 'ar-SD':
      case 'ar-SY':
      case 'ar-YE':
      case 'dv':
      case 'dv-MV':
      case 'ps':
      case 'ps-AR':
        return 'Arabic';
      case 'he':
      case 'he-IL':
        return 'Hebrew';
      default:
        return 'ISO 8601';
    }
  }

  renderWeekdays() {
    const { activeStartDate, formatShortWeekday, locale, firstDayOfWeek } = this.props;

    return (
      <Weekdays
        calendarType={this.calendarType}
        locale={locale}
        activeStartDate={activeStartDate}
        formatShortWeekday={formatShortWeekday}
        firstDayOfWeek={firstDayOfWeek}
      />
    );
  }

  renderWeekNumbers() {
    const { showWeekNumbers } = this.props;

    if (!showWeekNumbers) {
      return null;
    }

    const {
      activeStartDate,
      onClickWeekNumber,
      showFixedNumberOfWeeks,
    } = this.props;

    return (
      <WeekNumbers
        activeStartDate={activeStartDate}
        calendarType={this.calendarType}
        onClickWeekNumber={onClickWeekNumber}
        showFixedNumberOfWeeks={showFixedNumberOfWeeks}
      />
    );
  }

  renderDays() {

    const {
      calendarType,
      onClickWeekNumber,
      showWeekNumbers,
      keyboradHighlight,
      disabledDates,
      ...childProps
    } = this.props;

    return (
      <Days
        calendarType={this.calendarType}
        disabledDates={disabledDates}
        {...childProps}
      />
    );
  }

  render() {
    const { showWeekNumbers, keyboradHighlight } = this.props;

    const className = ClassNames('react-calendar__month-view',
      {
        "react-calendar__month-view--weekNumbers": showWeekNumbers,
        "keyboard-date-view-inner-highlight": keyboradHighlight
      }
    );

    return (
      <div className={className}>
        <div>
          {this.renderWeekNumbers()}
          <div
            style={{
              flexGrow: 1,
              width: '100%',
            }}
          >
            {this.renderWeekdays()}
            {this.renderDays()}
          </div>
        </div>
      </div>
    );
  }
}
