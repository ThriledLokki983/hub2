import React from "react";
import ClickOutside from "react-click-outside";
import Fit from "./utils/Fit";
import ClassNames from "classnames";
import Calendar from "./react-calendar";
import { Input } from '../field';
import {
  getKeyTable
} from "./utils/NavUtils";
import {
  isValidFormatDate,
  onDatepickerInputChange
} from "./utils/dateUtils";
import { DATE_FORMAT } from "./utils/constants";
import moment from "moment";

type DatePickerPropsType = {
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
  style?: any,
  format: any,
  clearIcon: any,
  readonly?: boolean,
  disabledRanges?: Array<[Date, Date]>,
  disabledDays?: Array<number>,
  disabledDates?: Array<Date>,
  firstDayOfWeek?: number,
  autoClose?: boolean,
}

type DatePickerStateType = {
  inputValue: any,
  isOpen: boolean,
  isInInput: boolean,
  keyboardControlArea: any,
  inputError: any,
  inputHasNoOutline: boolean
}
class DatePicker extends React.Component<DatePickerPropsType, DatePickerStateType> {
  format: any;
  calendar: any;
  eventProps: any;
  inputs: any;
  constructor(props: DatePickerPropsType) {
    super(props);
    
    this.state = {
      isOpen: false,
      isInInput: true,
      keyboardControlArea: null,
      inputValue: this.props.value
        ? moment(this.props.value).format(DATE_FORMAT)
        : "",
      inputError: false,
      inputHasNoOutline: false
    };
  }

  // UNSAFE_componentWillReceiveProps(nextProps: any) {
  //   if (!this.props.editable && nextProps.value && this.state.inputValue !== nextProps.value ||
  //     this.props.editable && this.state.inputValue !== nextProps.value && isValidFormatDate(this.state.inputValue)) {
  //     this.setState({
  //       inputValue: nextProps.value
  //     }, () => {
  //       this.calendar.setActiveStartDate(nextProps.value);
  //     });
  //   }
  // }

  isValidDate = () => {
    const {
      minDate,
      maxDate,
      disabledDates,
      disabledDays,
      disabledRanges
    } = this.props;

    const isValid = isValidFormatDate(this.state.inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges);
    
    this.setState({
      inputError: !isValid && !(this.state.inputValue === "")
    })

    return isValid;
  }

  openCalendar = () => {
    // const isValid = this.isValidDate();
    this.setState({
      isOpen: true
    })
  };

  

  handleClickOutside() {
    // const {
    //   minDate,
    //   maxDate,
    //   disabledDates,
    //   disabledDays,
    //   disabledRanges,
    //   disabled,
    //   readonly
    // } = this.props;

    // const isValid = isValidFormatDate(this.state.inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges);
    // this.setState({
    //   inputError: !isValid && !(this.state.inputValue === "") && !disabled && !readonly,
    // })
    this.closeCalendar();
  }

  cleanTempValue() {
    this.calendar && this.calendar.cleanTempValue();
  }

  closeCalendar = () => {
    const {
      minDate,
      maxDate,
      disabledDates,
      disabledDays,
      disabledRanges
    } = this.props;
    let isValid = isValidFormatDate(this.state.inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges);
    if (this.state.isOpen) {
      this.cleanTempValue();
      this.setState({
        isOpen: false,
        keyboardControlArea: null,
        isInInput: true,
        inputError: !isValid && !(this.state.inputValue === ""),
      });
    }
  };

  toggleCalendar = () => {
    const {
      minDate,
      maxDate,
      disabledDates,
      disabledDays,
      disabledRanges,
      disabled,
      readonly
    } = this.props;
    if (disabled || readonly) return;

    this.cleanTempValue();
    let isValid = isValidFormatDate(this.state.inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges);
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
      keyboardControlArea: null,
      inputError: !isValid && !(this.state.inputValue === "")
    }));
  };

  onValueChange = (inputValue: any, e: any) => {
    onDatepickerInputChange(e, false);

    this.setState({
      isOpen: false,
      inputValue: e.target.value
    })

    const {
      onChange,
      minDate,
      maxDate,
      onValueChange,
      disabledDates,
      disabledDays,
      disabledRanges
    } = this.props;

    if (inputValue === "") {
      this.clear();
      this.setState({
        inputError: false
      })
      return;
    }

    

    // if (!isValid) {
    //   if (onValueChange) {
    //     onValueChange(false, inputValue)
    //   }
    // }

    if (onValueChange) {
      onValueChange(false, inputValue);
    }

    const isValid = isValidFormatDate(inputValue, minDate, maxDate, disabledDates, disabledDays, disabledRanges);

    if (isValid) {
      const formatValue = moment(inputValue, DATE_FORMAT).toDate();
      // this.calendar.setActiveStartDate(value);
      onChange && onChange(formatValue);
    }
  };

  onInputBlur = () => {
    const { onChange } = this.props;
    this.isValidDate();
    const formatValue = moment(this.state.inputValue || '', DATE_FORMAT, true);

    // _d: Sun Jun 25 2023 00:00:00 GMT+0800 (China Standard Time) {constructor: ƒ}
    // _f: "MM/DD/YYYY"
    // _i: "06/25/23"
    // _isAMomentObject: true
    // _isUTC: false
    // _isValid: true

    if (formatValue.isValid()) {
      onChange && onChange(formatValue.toDate());
    } else {
      onChange && onChange(null);
    }
  }

  onChange = (value: any) => {
    const { onChange, onValueChange, autoClose } = this.props;
    
    if (autoClose) this.closeCalendar();
    this.setState({
      inputValue: value || "",
      inputError: false
    });

    if (onChange) {
      onChange(value);
    }
    if (onValueChange) {
      onValueChange(true, moment(value).format(DATE_FORMAT));
    }
  };

  stopPropagation = (event: any) => event.stopPropagation();

  clear = () => this.onChange(null);

  renderInputs() {
    const {
      placeholder,
      disabled,
      value,
      style,
      isLarge,
      minDate,
      maxDate,
      fieldTitle,
      required,
      readonly,
      disabledDays,
      disabledDates,
      disabledRanges,
    } = this.props;
    const { isOpen } = this.state;
    const cn = ClassNames(`a-date-picker-header`, {
      open: isOpen,
      large: isLarge,
      disabled,
    });

    let valueString =
      isValidFormatDate(this.state.inputValue, minDate, maxDate, disabledDays, disabledDates, disabledRanges)
        ? (value && moment(value).format(DATE_FORMAT)) || ""
        : this.props.editable ? this.state.inputValue : '';

    const triggerButton = (
      <div>
        <span
          role="button"
          tabIndex={(disabled || readonly) ? -1 : 0}
          aria-label="tooltip" className={
            ClassNames("Appkit4-icon icon-calendar-outline ap-field-icon-btn", {
              "readonly": readonly
          })}
          onClick={this.toggleCalendar}>
        </span>
      </div>
    );

    const errorContent = (
      <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
        Please enter a valid date
      </div>
    );

    let _placeholder = placeholder || DATE_FORMAT.toLowerCase();

    return (
      <div style={style} className={cn}>
        <Input
          type="text"
          required={required}
          readonly={readonly}
          disabled={disabled}
          errorNode={errorContent}
          error={this.state.inputError}
          title={fieldTitle}
          suffix={triggerButton}
          value={valueString}
          onChange={this.onValueChange}
          onBlur={this.onInputBlur}
          ref={ref => (this.inputs = ref)}
          placeholder={_placeholder}
        />
      </div>
    );
  }

  onKeyDown = (e: any) => {
    if (this.props.disabled || this.props.readonly) {
      return;
    }

    const { isOpen } = this.state;

    const {
      isTab,
      isEnter,
      isEsc,
      isChar,
      isBackspace,
      isDown,
      isSpace
    } = getKeyTable(e);

    // if (isTab && !isOpen) {
    //   const isValid = this.isValidDate();
    //   this.setState({
    //     inputError: !isValid && !(this.state.inputValue === ""),
    //     inputHasNoOutline: false
    //   })
    //   return;
    // }

    if (this.props.editable && isDown && isOpen && this.state.isInInput) {
      this.setState({
        isInInput: false
      });
    }

    /* reserve key for manually enter date value */
    if (
      !this.props.editable ||
      (!isChar && !isBackspace && !isSpace && !isTab) ||
      !this.state.isInInput
    ) {
      e.preventDefault && e.preventDefault();
    }
    if (isEnter && !isOpen && e.target.nodeName === 'SPAN') {
      this.openCalendar();
    } else if (isEsc) {
      this.closeCalendar();
    } else if (isOpen) {
      this.calendar.onKeyDown(e);
      this.setState({
        inputHasNoOutline: true
      })
    }
  };

  renderCalendar() {
    const { isOpen } = this.state;
    const {
      calendarClassName,
      value,
      navigationLayoutMode,
      showOtherMonths,
      locale,
      maxDate,
      minDate,
      minDetail,
      maxDetail,
      disabledDates,
      formatMonth,
      navigationLabel,
      disabledRanges,
      disabledDays,
      firstDayOfWeek,
    } = this.props;

    const className = ClassNames("a-react-date-picker-calendar", {
      "react-date-picker--open": isOpen,
      "react-date-picker--closed": !isOpen
    });

    const calendarCN = ClassNames(calendarClassName, "no-border-no-boxshadow");

    const commonProps = {
      showInPicker: isOpen,
      ref: (ref: any) => (this.calendar = ref),
      className: calendarCN,
      onChange: this.onChange.bind(this),
      value: value || null,
      locale: locale,
      navigationLayoutMode: navigationLayoutMode,
      showOtherMonths: showOtherMonths,
      maxDate: maxDate,
      minDate: minDate,
      minDetail: minDetail,
      maxDetail: maxDetail,
      disabledDates,
      disabledRanges,
      disabledDays,
      formatMonth,
      navigationLabel,
      showNavigationPrevNextBtn: true,
      firstDayOfWeek,
    };

    return (
      <Fit>
        <div className={className} tabIndex={-1}>
          <Calendar {...commonProps} />
        </div>
      </Fit>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div
        className={ClassNames("react-date-picker", className, {})}
        onKeyDown={this.onKeyDown.bind(this)}
        {...this.eventProps}
      >
        {this.renderInputs()}
        {this.renderCalendar()}
      </div>
    );
  }
}

export default ClickOutside(DatePicker);
