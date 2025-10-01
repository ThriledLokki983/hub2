import React, { Component } from "react";
import ClassNames from "classnames";
import moment from "moment";
import DatePicker from "./DatePicker";
import DateRangePicker from "./DateRangePicker";
import { DEFAULT_RANGE_MENU, DATE_FORMAT } from "./utils/constants";
import {
  getTodayObject,
  manipulate,
  startOf,
  endOf,
  isSame,
  isValidFormatDate,
} from "./utils/dateUtils";

import { getKeyTable } from "./utils/NavUtils";
type CalendarPickerPropsType = {
  style?: any,
  className?: string,
  onChange?: any,
  onValueChange?: any,
  placeholder?: string,
  editable?: boolean,
  disabled?: boolean,
  navigationLayoutMode?: string,
  showOtherMonths?: boolean,
  selectRange?: boolean,
  enforceTwoValue?: boolean,
  cleanSingleSelection?: boolean,
  locale?: string,
  format?: string,
  rangeConnecterFormat?: string,
  defaultValue?: any,
  value?: any,
  maxDate?: any,
  minDate?: any,
  minDetail?: any,
  maxDetail?: any,
  fieldTitle?: any,
  rangeMenuItems?: any,
  mode?: any,
  disabledDates?: any,
  formatMonth?: any,
  navigationLabel?: any,
  required?: boolean,
  readonly?: boolean,
  disabledRanges?: Array<[Date, Date]>,
  disabledDays?: Array<number>,
  firstDayOfWeek?: number,
  autoClose?: boolean,
}

type CalendarPickerStateType = {
  value: any,
  menuChecked: any,
  tabOrder: any
}


class CalendarPicker extends Component<CalendarPickerPropsType, CalendarPickerStateType> {
  dataRangePicker: any;
  datePicker: any;
  constructor(props: any) {
    super(props);
    this.state = {
      value: this.props.defaultValue || this.props.value,
      menuChecked: "",
      tabOrder: ""
    };
  }

  static defaultProps = {
    navigationLayoutMode: "default",
    showOtherMonths: true,
    maxDetail: "month",
    minDetail: "decade",
    rangeMenuItems: DEFAULT_RANGE_MENU,
    autoClose: true,
    editable: true
  };

  onChange(value: any) {
    if (this.showPanel()) {
      this.setState({
        value,
        menuChecked: this.getMenuChecked(value)
      });
    } else {
      this.setState({
        value
      });
    }

    this.props.onChange && this.props.onChange(value);
  }

  UNSAFE_componentWillReceiveProps(nextProps: CalendarPickerPropsType) {
    const { minDate, maxDate, disabledDays, disabledDates, disabledRanges } = this.props;
    if (nextProps.hasOwnProperty("value")) {
      if (this.props.editable) {
        if (
          this.props.value !== nextProps.value &&
          isValidFormatDate(nextProps.value, minDate, maxDate, disabledDays, disabledDates, disabledRanges)
        ) {
          this.setState({
            value: nextProps.value
          });
        }
      } else {
        if (!nextProps.value) {
          this.setState({ value: "" });
        } else if (this.props.value !== nextProps.value) {
          this.setState({
            value: nextProps.value
          });
          if (
            (this.props.mode === "showRangePanel" ||
              this.props.mode === "showDoubleLargeCalendarWithRangePanel" ||
              this.props.mode === "showDoubleCalendarWithRangePanel") &&
            nextProps.value.length > 1
          ) {
            this.setState({
              menuChecked: this.getMenuChecked(nextProps.value)
            });
          }
        }
      }
    }
  }

  clearValue() {
    if (this.showDoubleCalendar()) {
      this.dataRangePicker.__wrappedInstance.clearValue();
    } else if (this.datePicker) {
      this.datePicker.__wrappedInstance.calendar.resetActiveStartDate();
    } else if (this.dataRangePicker) {
      this.dataRangePicker.__wrappedInstance.singleCalendar.resetActiveStartDate();
    }
    this.cleanValueFunc();
  }

  cleanValueFunc() {
    this.setState({
      value: null,
      menuChecked: null
    });
  }

  getDateString(valueFrom: any, valueTo: any) {
    const { rangeConnecterFormat } = this.props;
    let result: any = [];
    if (valueFrom) {
      result.push(moment(valueFrom).format(DATE_FORMAT));
    }

    if (valueTo) {
      result.push(moment(valueTo).format(DATE_FORMAT));
    }

    return result.join(` ${rangeConnecterFormat || 'to'} `);
  }

  handleRangeChange(index: any) {

    let { autoClose } = this.props;
    const rangeTable: any = this.props.rangeMenuItems;
    const newRange: any = rangeTable[index].dates;

    this.setState({
      value: newRange,
      menuChecked: index
    });
    
    let dateStr = newRange && this.getDateString(newRange[0], newRange[1]);
    this.props.onValueChange && this.props.onValueChange(true, dateStr);
    this.props.onChange && this.props.onChange(newRange);
    if (autoClose) this.dataRangePicker && this.dataRangePicker.__wrappedInstance.toggleCalendar()
    if (autoClose) this.datePicker && this.datePicker.__wrappedInstance.toggleCalendar()
  }

  //handle tab when there is range menu
  onKeyDownForMenuMode(e: any) {
    if (!this.showPanel()) {
      return;
    }
    let { tabOrder } = this.state;
    const { isTab, isShift, isEnter, isDown, isUp } = getKeyTable(e);
    const items = this.props.rangeMenuItems.map((e: any) => {
      return typeof e === "object" ? e.name : e;
    });
    const index = items.indexOf(tabOrder);

    if (isTab || isUp || isDown) {
      if (!tabOrder) {
        tabOrder = isShift ? items[items.length - 1] : items[0];
        this.setState({
          tabOrder
        });
      } else {
        let nextIndex;
        if (isTab) {
          nextIndex = isShift ? index - 1 : index + 1;
        } else {
          nextIndex = isUp ? index - 1 : index + 1;
        }

        if (nextIndex < 0 || nextIndex >= items.length) {
          this.setState({
            tabOrder: ""
          });
          return "switch_to_calendar";
        } else {
          this.setState({
            tabOrder: items[nextIndex]
          });
        }
      }
    } else if (isEnter && tabOrder) {
      this.handleRangeChange(tabOrder);
    }
  }

  getMenuChecked(value: any) {
    if (!value) return;
    const rangeTable = this.props.rangeMenuItems;
    let newMenuChecked = "";
    for (let index = 0; index < rangeTable.length; index++) {
      const _index = String(index);
      const tempRange = rangeTable[index].dates;
      if (!tempRange) {
        continue;
      }
      const isSameDayRange = isSame(tempRange[0], tempRange[1]);
      const isSameDayValue = isSame(value[0], value[1]);

      if (value.length === 2 && !isSameDayValue) {
        if (
          !isSameDayRange &&
          isSame(tempRange[0], value[0]) &&
          isSame(tempRange[1], value[1])
        ) {
          newMenuChecked = _index;
        }
      } else {
        const tempValue = value[0] || value;
        if (isSameDayRange && isSame(tempValue, tempRange[0])) {
          newMenuChecked = _index;
          break;
        }
      }
    }
    return newMenuChecked;
  }

  renderLeftMenu() {
    const childs = this.props.rangeMenuItems.map((e: any, index: number) => {
      const _name = e.name;
      const _index = String(index);
      const cn = ClassNames("a-clendar-left-menu-content-item", {
        checked: this.state.menuChecked === _index,
        "keyboard-inner-highlight": this.state.tabOrder === _index
      });

      return (
        <div
          key={_index}
          className={cn}
          onClick={this.handleRangeChange.bind(this, _index)}
        >
          {_name}
        </div>
      );
    });
    return (
      <div className="a-clendar-left-menu">
        <div className="a-calenar-menu-header">Date range</div>
        <div className="a-clendar-left-menu-content">{childs}</div>
      </div>
    );
  }

  showDoubleCalendar() {
    const { mode } = this.props;
    return (
      mode === "showDoubleCalendar" ||
      mode === "showDoubleCalendarWithRangePanel"
    );
  }

  showPanel() {
    const { mode } = this.props;
    return (
      mode === "showRangePanel" ||
      mode === "showDoubleCalendarWithRangePanel"
    );
  }

  render() {
    const {
      disabled,
      selectRange,
      className,
      style,
      navigationLayoutMode,
      showOtherMonths,
      placeholder,
      maxDate,
      minDate,
      mode,
      format,
      rangeConnecterFormat,
      locale,
      enforceTwoValue,
      cleanSingleSelection,
      rangeMenuItems,
      minDetail,
      maxDetail,
      editable,
      onValueChange,
      disabledDates,
      formatMonth,
      navigationLabel,
      fieldTitle,
      required,
      readonly,
      disabledRanges,
      disabledDays,
      firstDayOfWeek,
      autoClose,
      ...otherProps
    } = this.props;

    const showRangePanel = this.showPanel();
    const showDoubleCalendar = this.showDoubleCalendar();
    const cn = ClassNames("a-calendar", className, {});

    const calendarIcon = (
      <span className="Appkit4-icon icon-calendar-outline a-calendar-pick-right-icon" />
    );

    if (selectRange || showDoubleCalendar || showRangePanel) {
      return (
        <div className={cn} style={style} {...otherProps}>
          <DateRangePicker
            fieldTitle={fieldTitle}
            enforceTwoValue={enforceTwoValue}
            cleanSingleSelection={cleanSingleSelection}
            format={format}
            rangeConnecterFormat={rangeConnecterFormat || 'to'}
            ref={(ref: any) => (this.dataRangePicker = ref)}
            navigationLayoutMode={navigationLayoutMode}
            showOtherMonths={showOtherMonths}
            leftPanel={showRangePanel && this.renderLeftMenu()}
            onKeyDownForMenuMode={
              showRangePanel && this.onKeyDownForMenuMode.bind(this)
            }
            placeholder={placeholder}
            disabled={disabled}
            maxDate={maxDate}
            minDate={minDate}
            showDoubleCalendar={showDoubleCalendar}
            value={this.state.value}
            menuChecked={this.state.menuChecked}
            calendarIcon={calendarIcon}
            clearIcon={null}
            locale={locale}
            cleanValueFunc={this.cleanValueFunc.bind(this)}
            onChange={this.onChange.bind(this)}
            minDetail={minDetail}
            editable={editable}
            maxDetail={maxDetail}
            onValueChange={onValueChange}
            formatMonth={formatMonth}
            navigationLabel={navigationLabel}
            selectRange={selectRange}
            disabledDates={disabledDates}
            required={required}
            readonly={readonly}
            disabledRanges={disabledRanges}
            disabledDays={disabledDays}
            firstDayOfWeek={firstDayOfWeek}
            autoClose={autoClose}
          />
        </div>
      );
    } else {
      return (
        <div className={cn} style={style} {...otherProps}>
          <DatePicker
            firstDayOfWeek={firstDayOfWeek}
            fieldTitle={fieldTitle}
            format={format}
            ref={(ref: any) => (this.datePicker = ref)}
            placeholder={placeholder}
            navigationLayoutMode={navigationLayoutMode}
            showOtherMonths={showOtherMonths}
            disabled={disabled}
            maxDate={maxDate}
            minDate={minDate}
            value={this.state.value}
            calendarIcon={calendarIcon}
            clearIcon={null}
            locale={locale}
            onChange={this.onChange.bind(this)}
            minDetail={minDetail}
            editable={editable}
            maxDetail={maxDetail}
            onValueChange={onValueChange}
            disabledDates={disabledDates}
            disabledRanges={disabledRanges}
            disabledDays={disabledDays}
            formatMonth={formatMonth}
            navigationLabel={navigationLabel}
            required={required}
            readonly={readonly}
            autoClose={autoClose}
          />
        </div>
      );
    }
  }
}

export default CalendarPicker;
