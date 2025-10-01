import React, { Component, KeyboardEvent } from "react";
import ClassNames from "classnames";
import ClickOutside from "react-click-outside";
import Fit from "./utils/Fit";
import DoubleCalendar from "./DoubleCalendar";
import Calendar from "./react-calendar";
import { getKeyTable, checkTabForInline } from "./utils/NavUtils";
import {
  isValidFormatRangeDate,
  isInRange,
  onDatepickerInputChange,
  isValidFormatDate,
  isValidInput,
} from "./utils/dateUtils";
import moment from "moment";
import { Input } from '../field';
import { DATE_FORMAT } from './utils/constants';

type DateRangePickerPropsType = {
  calendarClassName?: any,
  calendarIcon?: any,
  className?: any,
  disabled?: boolean,
  onCalendarClose?: Function,
  onCalendarOpen?: Function,
  required?: boolean,
  showLeadingZeros?: boolean,
  showDoubleCalendar?: boolean,
  isLarge?: boolean,
  locale?: string,
  formatMonth?: Function,
  navigationLabel?: Function,
  siblingNode?: any,
  activeStartDate?: any,
  calendarType?: any,
  formatMonthYear?: Function,
  formatShortWeekday?: Function,
  maxDate?: any,
  maxDetail?: any,
  minDate?: any,
  minDetail?: any,
  navigationLayoutMode?: string,
  nextLabel?: any,
  onActiveDateChange?: Function,
  onActiveDateChangeNoDir?: Function,
  onChange?: Function,
  onClickDay?: Function,
  onClickDecade?: Function,
  onClickMonth?: Function,
  onClickWeekNumber?: Function,
  onClickYear?: Function,
  onDrillDown?: Function,
  onDrillUp?: Function,
  prevLabel?: any,
  renderChildren?: Function,
  selectRange?: boolean,
  showFixedNumberOfWeeks?: boolean,
  showNavigation?: boolean,
  showOtherMonths?: boolean,
  showWeekNumbers?: boolean,
  tileClassName?: any,
  tileContent?: any,
  tileDisabled?: Function,
  value?: any,
  hover?: any,
  view?: any,
  enforceTwoValue?: boolean,
  _onHover?: Function,
  _isInDoubleCalendar?: boolean,
  calendarPosition?: number,
  tabIndex?: number,
  showInPicker?: boolean,
  keyboardNavDate?: any,
  keyboardControlArea?: string,
  disabledDates?: any,
  disabledRanges?: Array<[Date, Date]>,
  disabledDays?: Array<number>,
  cleanSingleSelection?: any,
  cleanValueFunc?: any,
  rangeConnecterFormat?: any,
  onValueChange?: any,
  fieldTitle?: any,
  placeholder?: any,
  onKeyDownForMenuMode?: any,
  leftPanel?: any,
  editable?: boolean,
  menuChecked?: any,
  format: any,
  clearIcon: any,
  readonly?: any,
  firstDayOfWeek?: number,
  autoClose?: boolean,
}

type DateRangePickerStateType = {
  isOpen: boolean,
  inputValue: any,
  inputError: any
}

class DateRangePicker extends Component<DateRangePickerPropsType, DateRangePickerStateType> {
  doubleCalendar: any;
  eventProps: any;
  singleCalendar: any;

  constructor(props: any) {
    super(props);
    const value = this.getValue();
    const [valueFrom, valueTo] = [].concat(value);

    this.state = {
      isOpen: false,
      inputValue: this.getDateString(valueFrom, valueTo, this.props.selectRange) || "",
      inputError: false,
    };
  }

  shouldComponentUpdate(nextProps: DateRangePickerPropsType) {

    const { showDoubleCalendar, maxDetail, selectRange, leftPanel } = this.props;
    let activeStartDateLeft = this.getRef().state.activeStartDateLeft;
    let activeStartDateRight = this.getRef().state.activeStartDateRight;
    const [valueFrom, valueTo]: any = [].concat(nextProps.value);
    let originDoubleCalendarStartDate = moment(activeStartDateLeft).startOf('month').format(DATE_FORMAT);
    let originDoubleCalendarEndDate = moment(activeStartDateRight).endOf('month').format(DATE_FORMAT);
    let isInCurrentCalendar = moment(valueFrom, DATE_FORMAT).isBetween(originDoubleCalendarStartDate, originDoubleCalendarEndDate) && moment(valueTo).isBetween(originDoubleCalendarStartDate, originDoubleCalendarEndDate)

    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      // this.setState({
      //   inputValue: this.getDateString(valueFrom, valueTo, selectRange) || "",
      // });
      if (!!leftPanel) {
        this.setState({
          inputValue: this.getDateString(valueFrom, valueTo, selectRange) || "",
        });
      }
      if (showDoubleCalendar && valueFrom && valueTo) {
        this.getRef().onActiveDateChange(
          valueFrom,
          maxDetail,
          "activeStartDateLeft"
        );
        if (
          valueFrom.getMonth() === valueTo.getMonth() &&
          valueFrom.getUTCFullYear() === valueTo.getUTCFullYear() && !isInCurrentCalendar
        ) {
          this.getRef().onActiveDateChange(
            valueTo,
            maxDetail,
            "activeStartDateLeft"
          );
          const nextMonth = moment(valueTo, DATE_FORMAT)
            .add(1, "month")
            .toDate();
          this.getRef().onActiveDateChange(
            nextMonth,
            maxDetail,
            "activeStartDateRight"
          );
        } else {
          this.getRef().onActiveDateChange(
            valueTo,
            maxDetail,
            "activeStartDateRight"
          );
        }
      } else if (showDoubleCalendar && !selectRange) {
        if (!isInCurrentCalendar) {
          this.getRef().onActiveDateChange(valueFrom, maxDetail, "activeStartDateLeft");
          const nextMonth = moment(valueFrom, DATE_FORMAT)
            .add(1, "month")
            .toDate();
          this.getRef().onActiveDateChange(nextMonth, maxDetail, "activeStartDateRight");
        }
      } else if (!showDoubleCalendar) {
        this.getRef().setActiveStartDate(valueFrom);
      }
    }
    return true;
  }

  handleClickOutside() {
    const { disabled, readonly } = this.props;
 
    if (disabled || readonly) {
      return;
    };

    if (this.state.isOpen) {
      this.toggleCalendar();
    }
  }

  checkInputValue = () => {
    const { maxDate, minDate, selectRange, disabledDays, disabledDates, disabledRanges, rangeConnecterFormat } = this.props;
    const { inputValue } = this.state;
    //the first
    let isValid = (!selectRange && isValidFormatDate(inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges)) || //this is covered the situation of custom calendar with single selection
      (isValidFormatRangeDate(inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges, rangeConnecterFormat, selectRange)) || inputValue === ""; //this is covered the situation of normal range datepicker 
    return isValid;
  }

  checkSingleValue = () => {
    // const { maxDate, minDate, selectRange, disabledDays, disabledDates, disabledRanges, rangeConnecterFormat } = this.props;
    const { inputValue } = this.state;
    // const isValid = isValidFormatDate(inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges);
      
    const isValid = moment(inputValue, DATE_FORMAT, true).isValid();

    return isValid;
  }

  openCalendar = () => {
    const { disabled, readonly } = this.props;
    if (disabled || readonly) return;
    this.setState({ isOpen: true });
  };

  closeCalendar = () => {
    const { disabled, readonly } = this.props;
    if (disabled || readonly) return;
    
    if (!this.state.isOpen) {
      return;
    }

    this.getRef().cleanTempValue();

    if (this.props.cleanSingleSelection) {
      const value = this.getValue();
      if (value && (value instanceof Date || value.length === 1)) {
        this.props.cleanValueFunc();
      }
    }

    this.setState(prevState => {
      if (!prevState.isOpen) {
        return null;
      }
      return { isOpen: false };
    });
  };

  onTriggerKeydown = (event: KeyboardEvent) => {
    const { key } = event;
    if (key === 'Enter' || key === 'Space') {
      this.toggleCalendar();
    }
  }

  toggleCalendar = () => {
    const { disabled, readonly, onChange, showDoubleCalendar } = this.props;
    if (disabled || readonly) {
      return;
    }

    // const isValid = moment(this.state.inputValue, DATE_FORMAT).isValid();
    // if (showDoubleCalendar) {
    //   if (isValid && this.state.inputValue.length > 0) {
    //     this.onChange([moment(this.state.inputValue, DATE_FORMAT).toDate()]);
    //   }
    // }
   
    // this.setState({
    //   inputError: !isValid && !(this.state.inputValue === "")
    // })

    // if (!this.state.isOpen) {
    //   this.onBlur()
    // }

    this.getRef().cleanTempValue();
    if (this.state.isOpen) {
      this.closeCalendar();
    } else {
      this.openCalendar();
    }
  };

  rangeDateFormat = (dateString: string) => {
    const { rangeConnecterFormat } = this.props;
    let [valueFrom, valueTo] = dateString.split(rangeConnecterFormat || "to");
    valueFrom = valueFrom ? valueFrom.replace(/(\s*$)/g, "") : "";
    valueTo = valueTo ? valueTo.replace(/(^\s*)/g, "") : "";
    return [valueFrom, valueTo];
  };

  onInputBlur = () => {
    const { editable, rangeConnecterFormat, selectRange, onChange, onValueChange } = this.props;
    const { inputValue } = this.state;

    if (editable) {
    
      if (!this.state.isOpen) {
        const isValid = this.checkInputValue();

        if (!selectRange) {  
          if (!isValid && !(inputValue === "")) {
            this.setState({ inputError: true });
          }

          const formatValue = moment(inputValue || '', DATE_FORMAT, true);

          if (formatValue.isValid()) {
            onChange && onChange(formatValue.toDate());
          } else {
            onChange && onChange(null);
          }
        } else {
          
          if (inputValue === '') {
            onChange && onChange(null);
            return
          }

          if (isValid && !(inputValue === '')) {
            const formatValue = this.rangeDateFormat(inputValue).map(v => moment(v, DATE_FORMAT, true).toDate());
            
            this.setState({
              inputError: false
            }, () => {
              onChange && onChange(formatValue);
            })
            return;
          }

          const [valueFrom, valueTo] = this.rangeDateFormat(inputValue);
          if (valueFrom && valueTo) {
            this.setState({
              inputError: true
            });
            
            onChange && onChange(null);
            return;
          }

          // autocomplete

          if (valueFrom && !valueTo) {
            this.autoComplete();
          }
        }

        // onChange && onChange(moment(inputValue, DATE_FORMAT).toDate());

        // const isValid = this.checkInputValue();
        // this.setState({
        //   inputError: !isValid && !(inputValue === "")
        // })

        // if (selectRange) {
        //   this.autoComplete();
        //   return;
        // }

        // set panel according input date
        // const isValidInputDate = isValidInput(inputValue, rangeConnecterFormat, selectRange);

        // if (isValidInputDate) {
        //   const value = isValidInputDate.value;
        //   this.onChange(value);

        //   onValueChange &&
        //   onValueChange(true, value);

        // }

      }

      

    }
    

  }

  onValueChange = (inputValue: any, e: any) => {
    const {
      onChange,
      minDate,
      maxDate,
      onValueChange,
      selectRange,
      rangeConnecterFormat,
      disabledDays,
      disabledDates,
      disabledRanges,
    } = this.props;

    onDatepickerInputChange(e, selectRange, rangeConnecterFormat);
    if (e.target.value === "") {
      this.setState({
        isOpen: false,
        inputValue,
        inputError: false
      });
      this.onChange(null)
      return;
    }

    let formatedValue = this.rangeDateFormat(inputValue);

    if (
      isValidFormatRangeDate(inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges, rangeConnecterFormat, selectRange)
    ) {
      let inputValue =
        selectRange ? `${formatedValue[0]} ${rangeConnecterFormat} ${formatedValue[1]}` : formatedValue[0];
      this.setState({
        isOpen: false,
        inputValue,
      });

      let value = formatedValue.filter((str) => str !== '').map(date => {
        return moment(date, DATE_FORMAT).toDate();
      });
      /* if (showDoubleCalendar) {
        if (selectRange) {
          this.getRef().onActiveDateChange(
            value[0],
            maxDetail,
            "activeStartDateLeft"
          );
          if (
            value[0].getMonth() === value[1].getMonth() &&
            value[0].getUTCFullYear() === value[1].getUTCFullYear()
          ) {
            this.getRef().onActiveDateChange(
              value[1],
              maxDetail,
              "activeStartDateLeft"
            );
            const nextMonth = moment(value[1], DATE_FORMAT)
              .add(1, "month")
              .toDate();
            this.getRef().onActiveDateChange(
              nextMonth,
              maxDetail,
              "activeStartDateRight"
            );
          } else {
            this.getRef().onActiveDateChange(
              value[0],
              maxDetail,
              "activeStartDateLeft"
            );
          }

        } else {
          this.getRef().onActiveDateChange(
            value[1],
            maxDetail,
            "activeStartDateRight"
          );
        }
      } else {
        this.getRef().setActiveStartDate(value[0]);
      } */

      // if (onChange) {
      //   onChange(value);
      // }
      if (onValueChange) onValueChange(true, inputValue);
    } else {
      this.setState({
        isOpen: false,
        inputValue: e.target.value
      });
      if (onValueChange) onValueChange(false, e.target.value);
    }
  };

  onChange = (value: any) => {
    const { onChange, onValueChange, selectRange, autoClose } = this.props;


    const isValid = this.checkInputValue();

    // if (autoClose) this.closeCalendar();
    if (!value) { onChange && onChange(value); return; }
    if (value.length === 2) {
      
      this.setState({
        isOpen: autoClose ? false : true,
        inputValue: this.getDateString(value[0], value[1], true),
        inputError: !isValid && !this.state.inputValue
      });
      if (autoClose) this.closeCalendar();
      onValueChange &&
        onValueChange(true, this.getDateString(value[0], value[1], true));
    } else {
      if (!selectRange) {
        this.setState({
          isOpen: autoClose ? false : true,
          inputValue: this.getDateString(value),
          inputError: !isValid && !this.state.inputValue
        });
        if (autoClose) this.closeCalendar();
      }

      onValueChange && onValueChange(true, this.getDateString(value));
    }
    onChange && onChange(value);
  };

  stopPropagation = (event: any) => event.stopPropagation();

  clear = () => this.onChange(null);

  getDateString(valueFrom?: any, valueTo?: any, selectRange: boolean = false) {
    const { rangeConnecterFormat } = this.props;
    if (!valueFrom) return "";
    if (!selectRange && valueFrom) return moment(valueFrom).format(DATE_FORMAT);
    const result = [];
    if (valueFrom) {
      result.push(moment(valueFrom).format(DATE_FORMAT));
    }

    if (valueTo) {
      result.push(moment(valueTo).format(DATE_FORMAT));
    }

    return result.join(` ${rangeConnecterFormat} ` || " to ");
  }

  getValue() {
    return (
      this.props.value ||
      (this.props.showDoubleCalendar &&
        this.doubleCalendar &&
        this.doubleCalendar.getValue()) ||
      null
    );
  }

  renderInputs() {
    const { fieldTitle, disabled, placeholder, isLarge, required, readonly, rangeConnecterFormat } = this.props;

    const pickerCn = ClassNames("a-date-picker-header", "date-range", {
      large: isLarge,
      disabled
    });

    const triggerButton = (
        <span
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label="tooltip"
          className="Appkit4-icon icon-calendar-outline ap-field-icon-btn"
          onClick={this.toggleCalendar}
          onKeyDown={this.onTriggerKeydown}
        ></span>
      
    );

    const errorContent = (
      <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
        Please enter a valid date
      </div>
    );

    const _placeholder = placeholder || `${DATE_FORMAT.toLowerCase()} ${rangeConnecterFormat || 'to'} ${DATE_FORMAT.toLowerCase()}`
    
    console.log('inputValue--', this.state.inputValue);
    return (
      <div className={pickerCn}>
        <Input
          type="text"
          title={fieldTitle}
          required={required}
          readonly={readonly}
          errorNode={errorContent}
          error={this.state.inputError}
          value={this.state.inputValue}
          onChange={this.onValueChange}
          onBlur={this.onInputBlur}
          suffix={triggerButton}
          placeholder={_placeholder}
          disabled={disabled}
        />
      </div>
    );
  }

  clearValue() {
    if (this.props.showDoubleCalendar) {
      this.doubleCalendar.clearValue(() => this.forceUpdate());
    }
  }

  getRef() {
    return this.singleCalendar || this.doubleCalendar;
  }

  onKeydownWithLeftLeftPanel(e: any) {
    const { onKeyDownForMenuMode } = this.props;
    const _calendar = this.getRef();
    const { orders, keyboardControlArea } = _calendar.getTabOrderInfo();
    if (keyboardControlArea) {
      //treat as if inline
      if (checkTabForInline(false, e, orders, keyboardControlArea)) {
        _calendar.cleanTempValue();
        //let leftMenu handle this
        onKeyDownForMenuMode(e);
      } else {
        _calendar.onKeyDown(e);
      }
    } else {
      //left menu
      const result = onKeyDownForMenuMode(e);
      if (result === "switch_to_calendar") {
        _calendar.onKeyDown(e);
      }
    }
  }

  autoComplete = () => {
    const { selectRange, onChange, onValueChange } = this.props;
    if (selectRange) {

      let isValid = this.checkSingleValue();
      if (isValid) {
        this.setState({
          inputValue: this.getDateString(this.state.inputValue, this.state.inputValue, true)
        }, () => {
          if (onChange) {
            onChange([moment(this.state.inputValue, DATE_FORMAT).toDate(), moment(this.state.inputValue, DATE_FORMAT).toDate()]);
          }
          onValueChange &&
          onValueChange(true, this.getDateString(this.state.inputValue, this.state.inputValue, true));
        })
        this.setState({
          inputError: false
        })
        return;
      } else {
        onChange && onChange(null);
        this.setState({
          inputError: true
        });
      }

      // isValid = this.checkInputValue();
      // if (!isValid) {
      //   // clear panel value

      // }
      
      // this.setState({
      //   inputError: !isValid && !(this.state.inputValue === "")
      // })
    }
  }

  onKeyDown = (e: any) => {
    const { disabled, leftPanel, selectRange, onChange, onValueChange } = this.props;

    if (disabled) {
      return;
    }

    const isOpen = this.state.isOpen;
    const { isTab, isEnter, isEsc, isChar, isBackspace, isSpace } = getKeyTable(
      e
    );

    if (isEsc && isOpen) {
      // close datepicker && focus input


    }

    if (isTab && !isOpen) {
      // validate
      // this.autoComplete();
      return;
    }

    if (!this.props.editable || (!isChar && !isBackspace && !isSpace)) {
      e.preventDefault && e.preventDefault();
    }

    if ((isEnter && !isOpen && e.target.nodeName === 'SPAN') || (isEsc && isOpen)) {
      this.toggleCalendar();
    }

    const _calendar = this.getRef();

    if (isOpen) {
      if (leftPanel) {
        this.onKeydownWithLeftLeftPanel(e);
      } else {
        _calendar.onKeyDown(e);
      }
    }
  };

  renderCalendar() {
    const { isOpen } = this.state;

    const {
      calendarClassName,
      value,
      showDoubleCalendar,
      showOtherMonths,
      navigationLayoutMode,
      leftPanel,
      minDate,
      maxDate,
      isLarge,
      locale,
      menuChecked,
      enforceTwoValue,
      minDetail,
      maxDetail,
      formatMonth,
      navigationLabel,
      selectRange,
      disabledDates,
      disabledRanges,
      disabledDays,
      firstDayOfWeek,
    } = this.props;

    const cClassName = ClassNames(calendarClassName, {
      "a-lg-calendar": isLarge
    });

    if (showDoubleCalendar) {
      const dcn = ClassNames({
        open: isOpen,
        closed: !isOpen
      });

      const ccc = ClassNames(
        "a-date-range-picker-double-calendar",
        isOpen ? "open" : "closed",
        {
          "a-double-calendar-has-left-panel": !!leftPanel,
          "is-large": isLarge
        }
      );

      return (
        <Fit>
          <div className={ccc}>
            {leftPanel}
            <DoubleCalendar
              selectRange={selectRange}
              enforceTwoValue={enforceTwoValue}
              ref={ref => (this.doubleCalendar = ref)}
              className={dcn}
              locale={locale}
              showDoubleCalendar={showDoubleCalendar}
              showOtherMonths={showOtherMonths}
              navigationLayoutMode={navigationLayoutMode}
              onChange={this.onChange.bind(this)}
              value={value || null}
              showBeginAndEnd={menuChecked}
              showInPicker={isOpen}
              minDetail={minDetail}
              maxDetail={maxDetail}
              formatMonth={formatMonth}
              navigationLabel={navigationLabel}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              disabledRanges={disabledRanges}
              disabledDays={disabledDays}
              firstDayOfWeek={firstDayOfWeek}
            />
          </div>
        </Fit>
      );
    } else {
      const ccc = ClassNames(
        "a-date-range-picker-calendar",
        isOpen ? "open" : "closed",
        {
          "a-date-range-picker-calendar-has-left-panel": !!leftPanel,
          "is-large": isLarge
        }
      );

      return (
        <Fit>
          <div className={ccc}>
            {leftPanel}
            <Calendar
              enforceTwoValue={enforceTwoValue}
              showInPicker={isOpen}
              ref={ref => (this.singleCalendar = ref)}
              className={cClassName}
              onChange={this.onChange.bind(this)}
              locale={locale}
              menuChecked={menuChecked}
              showDoubleCalendar={showDoubleCalendar}
              showOtherMonths={showOtherMonths}
              navigationLayoutMode={navigationLayoutMode}
              minDate={minDate}
              maxDate={maxDate}
              selectRange={selectRange}
              value={value || null}
              minDetail={minDetail}
              maxDetail={maxDetail}
              formatMonth={formatMonth}
              navigationLabel={navigationLabel}
              showNavigationPrevNextBtn
              disabledDates={disabledDates}
              disabledRanges={disabledRanges}
              disabledDays={disabledDays}
              firstDayOfWeek={firstDayOfWeek}
            />
          </div>
        </Fit>
      );
    }
  }

  render() {
    const { className } = this.props;

    return (
      <div
        className={ClassNames("react-daterange-picker", className, {})}
        onKeyDown={this.onKeyDown.bind(this)}
        {...this.eventProps}
      >
        {this.renderInputs()}
        {this.renderCalendar()}
      </div>
    );
  }
}

export default ClickOutside(DateRangePicker);
