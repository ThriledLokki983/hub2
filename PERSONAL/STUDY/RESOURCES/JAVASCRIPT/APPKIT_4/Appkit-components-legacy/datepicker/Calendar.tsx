import React from 'react';
import ClassNames from 'classnames';
import { Calendar as RCalendar } from './react-calendar';
import DoubleCalendar from './DoubleCalendar';

type CalendarProps = {
  style: any,
  className: any,
  onChange: Function,
  locale: string,
  showDoubleCalendar: boolean,
  selectRange: boolean,
  showOtherMonths: boolean,
  enforceTwoValue: boolean,
  disabled: boolean,
  isLarge: boolean,
  navigationLayoutMode: string,
  defaultValue: any,
  value: any,
  maxDate: Date,
  minDate: Date,
  minDetail: string,
  maxDetail: string,
  formatMonth: Function,
  navigationLabel: Function
};
type CalendarState = {
  value: any;
};
class Calendar extends React.Component<CalendarProps, CalendarState> {
  doubleCalendar: any;
  constructor(props: any) {
    super(props);
    this.state = {
      value: this.props.defaultValue || this.props.value,
    }
  }

  static defaultProps = {
    navigationLayoutMode: "default",
    showOtherMonths: true,
    maxDetail: "month",
    minDetail: 'decade'
  }

  onChange(value: any) {
    this.setState({
      value
    });
    this.props.onChange && this.props.onChange(value);
  }


  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  clearValue() {
    this.doubleCalendar && this.doubleCalendar.clearValue();
    this.setState({
      value: null
    });
  }

  render() {
    const {
      selectRange,
      className,
      isLarge,
      showDoubleCalendar,
      style,
      navigationLayoutMode,
      showOtherMonths,
      maxDate,
      minDate,
      disabled,
      locale,
      enforceTwoValue,
      minDetail,
      maxDetail,
      formatMonth,
      navigationLabel,
      children,
      onChange,
      ...otherProps
    } = this.props;

    const cn = ClassNames("a-calendar", className, {
    });

    if (showDoubleCalendar) {
      return (
        <div className={cn} style={style} {...otherProps}>
          <DoubleCalendar
            enforceTwoValue={enforceTwoValue}
            ref={ref => this.doubleCalendar = ref}
            disabled={disabled}
            locale={locale}
            value={this.state.value}
            navigationLayoutMode={navigationLayoutMode}
            showOtherMonths={showOtherMonths}
            onChange={this.onChange.bind(this)}
            minDetail={minDetail}
            maxDetail={maxDetail}
            formatMonth={formatMonth}
            navigationLabel={navigationLabel}
          />
        </div>
      );
    } else {
      return (
        <div className={cn} style={style} {...otherProps}>
          <RCalendar
            enforceTwoValue={enforceTwoValue}
            disabled={disabled}
            locale={locale}
            maxDate={maxDate}
            minDate={minDate}
            showOtherMonths={showOtherMonths}
            navigationLayoutMode={navigationLayoutMode}
            selectRange={selectRange}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            minDetail={minDetail}
            maxDetail={maxDetail}
            formatMonth={formatMonth}
            navigationLabel={navigationLabel}
          />
        </div>
      );
    }
  }
}

export default Calendar;
