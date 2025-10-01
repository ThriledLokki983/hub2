import React, { PureComponent } from 'react';
import moment from 'moment';
import Calendar from './react-calendar';
import ClassNames from 'classnames';
import { getTodayObject, manipulate, startOf, getDateMatrix, moveToNextDate, isSame } from './utils/dateUtils';
import { getNextTabItem, CALENDAR_PANEL, checkTabForInline, getKeyTable, getBeginValueForKeyboardHover } from './utils/NavUtils';
import { getFullDate, getValueRange, getBegin } from './react-calendar/shared/dates';
import { getValueType } from './react-calendar/shared/utils';
import { CALENDAR_POSITION } from './utils/constants';

type DoubleCalendarPropsType = {
  className?: string,
  disabled?: boolean,
  enforceTwoValue?: boolean,
  tabIndex?: number,
  showInPicker?: boolean,
  siblingNode?: any,
  activeStartDate?: any,
  calendarType?: any,
  formatMonth?: Function,
  formatMonthYear?: Function,
  formatShortWeekday?: Function,
  locale?: string,
  maxDate?: any,
  maxDetail?: any,
  minDate?: any,
  minDetail?: any,
  navigationLabel?: Function,
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
  _onHover?: Function,
  _isInDoubleCalendar?: boolean,
  calendarPosition?: number,
  keyboardNavDate?: any,
  keyboardControlArea?: string,
  disabledDates?: any,
  disabledRanges?: Array<[Date, Date]>,
  disabledDays?: Array<number>,
  showDoubleCalendar?: any,
  showBeginAndEnd?: any,
  readonly?: any,
  firstDayOfWeek?: number,

};
type DoubleCalendarState = {
  value: any;
  doubleHover: any,
  leftValue: any,    // as an array of length 0, 1, 2
  rightValue: any,    //
  activeStartDateLeft: any,    //
  activeStartDateRight: any,    //
  keyboardNavDateLeft: any,    //
  keyboardNavDateRight: any,    //
  keyboardControlArea: any,    //
  viewLeft: any,    //
  viewRight: any,    //
  allowOutline: any,    //
};
function sortTime(arr?: any, returnCopy?: any) {
  if (arr && arr.sort) {
    const result = returnCopy ? arr.slice() : arr;
    return result.sort((a: Date, b: Date) => a.getTime() - b.getTime());
  }
}

function hasValue(value: any) {
  return value && value.length > 0;
}

function toArr(value: any) {
  if (value instanceof Date) {
    return [value];
  }
  return value;
}

class DoubleCalendar extends PureComponent<DoubleCalendarPropsType, DoubleCalendarState> {

  static defaultProps = {}
  onChange: any;
  leftCalendar: any;
  rightCalendar: any;
  constructor(props: DoubleCalendarPropsType) {
    super(props);

    let initLeftValue = [];
    let defaultValue = toArr(this.props.value);
    defaultValue = sortTime(defaultValue, true);
    if (hasValue(defaultValue)) {
      //no need to set the right value
      //check getLeftRightValue()
      initLeftValue = defaultValue;
    }

    const { activeStartDateLeft, activeStartDateRight } = this.getInitActiveDate(defaultValue);

    this.state = {
      doubleHover: null,
      leftValue: initLeftValue,    // as an array of length 0, 1, 2
      rightValue: [],
      activeStartDateLeft,
      activeStartDateRight,
      keyboardNavDateLeft: null,
      keyboardNavDateRight: null,
      keyboardControlArea: null,
      viewLeft: this.props.maxDetail,
      viewRight: this.props.maxDetail,
      allowOutline: true,
      value: null,
    };

  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    let nextValue = toArr(nextProps.value);
    nextValue = sortTime(nextValue, true);

    const { maxDetail, selectRange } = this.props;

    // if (this.props.value !== nextValue) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextValue)) {
      if (!selectRange) {
        if (!hasValue(nextValue)) {
          this.setState({
            leftValue: [],    // as an array of length 0, 1, 2
            rightValue: []
          })
        } else {
          this.setState({
            leftValue: nextValue,    // as an array of length 0, 1, 2
            rightValue: nextValue
          })
        }
      } else {
        if (!hasValue(nextValue)) {
          this.setState({
            leftValue: [],    // as an array of length 0, 1, 2
            rightValue: []
          })
        } else {
          this.setState({
            leftValue: nextValue,    // as an array of length 0, 1, 2
            rightValue: []
          })
        }
      }

    }

    //showBeginAndEnd property logic
    if (nextProps.showBeginAndEnd) {
      //convert to 2 length, so easy handling
      if (nextValue && nextValue.length === 1) {
        nextValue = [nextValue[0], nextValue[0]]
      }

      if (nextValue && nextValue.length === 2) {
        const d1 = nextValue[0];
        const d2 = nextValue[1];
        let newActiveStartDateLeft;
        let newActiveStartDateRight = this.state.activeStartDateRight;

        //One View Enough to display
        if (isSame(d1, d2, maxDetail)) {
          newActiveStartDateLeft = getBegin(maxDetail, d1);
        } else {
          newActiveStartDateLeft = getBegin(maxDetail, d1);
          newActiveStartDateRight = getBegin(maxDetail, d2);
        }

        if (isSame(newActiveStartDateLeft, newActiveStartDateRight, maxDetail) || newActiveStartDateLeft.getTime() > newActiveStartDateRight.getTime()) {
          newActiveStartDateRight = startOf(maxDetail, manipulate(newActiveStartDateLeft, 'add', maxDetail));
          newActiveStartDateRight = moment(newActiveStartDateRight).toDate();
        }

        this.setState({
          viewLeft: maxDetail,
          viewRight: maxDetail,
          activeStartDateLeft: newActiveStartDateLeft,
          activeStartDateRight: newActiveStartDateRight
        })
      }
    }
  }

  getInitActiveDate(value?: any) {
    let activeStartDateLeft;
    let activeStartDateRight;
    const { maxDetail } = this.props;

    if (!value || (hasValue(value) && value.length === 1)) {
      //no value or [value]
      const anchorDay = (value && value[0]) || getTodayObject();
      activeStartDateLeft = startOf(maxDetail, anchorDay);
      activeStartDateRight = startOf(maxDetail, manipulate(anchorDay, 'add', maxDetail));
    } else if (hasValue(value) && value.length === 2) {
      activeStartDateLeft = startOf(maxDetail, value[0]);
      activeStartDateRight = startOf(maxDetail, value[1]);
    }
    if (moment(activeStartDateLeft).isSame(activeStartDateRight, 'day')) {
      activeStartDateRight = startOf(maxDetail, manipulate(activeStartDateRight, 'add', maxDetail));
    }

    activeStartDateLeft = moment(activeStartDateLeft).toDate();
    activeStartDateRight = moment(activeStartDateRight).toDate();
    return {
      activeStartDateLeft,
      activeStartDateRight
    }
  }

  clearValue(callback: any) {
    const {
      activeStartDateLeft,
      activeStartDateRight
    } = this.getInitActiveDate();
    this.setState({
      doubleHover: null,
      keyboardNavDateLeft: null,
      keyboardNavDateRight: null,
      leftValue: [],    // as an array of length 0, 1, 2
      rightValue: [],
      activeStartDateLeft,
      activeStartDateRight
    }, callback);
  }

  get valueType() {
    const { maxDetail } = this.props;
    return getValueType(maxDetail || "month");
  }

  callOnChange = (value: any) => {
    const { onChange } = this.props;
    let result;
    if (onChange) {
      if (value.length === 2) {
        result = getValueRange(this.valueType, value[0], value[1]);
        onChange(result);
      } else if (value.length === 1) {
        result = getBegin(this.valueType, value[0])
        onChange(result);
      } else {
        onChange(value);
      }
    }
  }

  stopPropagation = (event: any) => event.stopPropagation();

  clear = () => this.onChange(null);

  cleanTempValue() {
    this.setState({
      keyboardNavDateLeft: null,
      keyboardNavDateRight: null,
      keyboardControlArea: null,
      doubleHover: null,
    })
    this.leftCalendar.cleanTempValue();
    this.rightCalendar.cleanTempValue();
  }

  onBlur() {
    if (!this.props.showInPicker) {
      this.cleanTempValue()
      this.setState({
        allowOutline: true
      });
    }
  }

  onDoubleHover(date: any) {
    this.setState({
      doubleHover: date,
      keyboardNavDateLeft: null,
      keyboardNavDateRight: null
    })
  }

  onClickDayRight(date: any) {
    this.onClickDay(date, "rightValue");
  }

  onClickDayLeft(date: any) {
    this.onClickDay(date, "leftValue");
  }

  onClickDay(date: any, key: any) {
    const { enforceTwoValue } = this.props;
    const prevLeft = this.state.leftValue;
    const prevRight = this.state.rightValue;
    const currentValue = this.getValue();

    let nextLeft = prevLeft.slice();
    let nextRight = prevRight.slice();

    if (nextLeft.length === 2) {
      nextLeft = [];
    }

    if (nextRight.length === 2) {
      nextRight = [];
    }


    if (enforceTwoValue && currentValue.length === 1) {
      if (isSame(currentValue[0], date)) {
        return;
      }
    }

    if (nextLeft.length === 1 && nextRight.length === 1) {
      nextLeft = [];
      nextRight = [];
    }

    if (key === "leftValue") {
      nextLeft.push(date);
    } else {
      nextRight.push(date)
    }

    sortTime(nextRight);
    sortTime(nextLeft)

    this.setState({
      leftValue: nextLeft,
      rightValue: nextRight
    }, () => {
      this.callOnChange(this.getValue());
    })
  }

  onActiveDateChangeLeft(info: any) {
    this.onActiveDateChange(info.activeStartDate, info.view, "activeStartDateLeft")
  }

  onActiveDateChangeRight(info: any) {
    this.onActiveDateChange(info.activeStartDate, info.view, "activeStartDateRight")
  }

  onDrill(info: any) {
    this.setState({
      keyboardNavDateRight: null
    });
    if (info.view === 'month') {
      this.onActiveDateChange(info.activeStartDate, info.view, "activeStartDateLeft");
      this.onActiveDateChange(moment(info.activeStartDate).add(1, 'month').toDate(), info.view, "activeStartDateRight");
    } else if (info.view === 'year') {
      this.onActiveDateChange(info.activeStartDate, info.view, "activeStartDateLeft");
      this.onActiveDateChange(moment(info.activeStartDate).add(12, 'month').toDate(), info.view, "activeStartDateRight");
    } else if (info.view === 'decade') {
      this.onActiveDateChange(info.activeStartDate, info.view, "activeStartDateLeft");
      this.onActiveDateChange(moment(info.activeStartDate).add(12, 'year').toDate(), info.view, "activeStartDateRight");
    }
  }

  onActiveDateChange(activeStartDate: any, view: any, key: any) {
    const newObj: any = {};
    newObj[key] = activeStartDate;
    const viewKey = key === "activeStartDateRight" ? "viewRight" : "viewLeft";
    newObj[viewKey] = view;
    this.setState(newObj);
  }

  getValue() {
    const temp = this.state.leftValue.concat(this.state.rightValue);
    return sortTime(temp);
  }

  onDirectKeyDown(e: any, activeStartDateLeft: any, viewLeft: any, keyboardNavDateLeft: any, activeStartDateRight: any, viewRight: any, keyboardNavDateRight: any) {
    const isBothMaxDetailView = viewLeft === viewRight && viewLeft === this.props.maxDetail;

    const { isLeft, isRight, isctrl, isCmd } = getKeyTable(e);

    const matrixLeft = getDateMatrix(activeStartDateLeft, viewLeft);
    const matrixRight = getDateMatrix(activeStartDateRight, viewRight);

    if (keyboardNavDateLeft) {
      const tempIndex = matrixLeft.findIndex(keyboardNavDateLeft);
      const ii = tempIndex[0];
      const jj = tempIndex[1]
      if (isRight && jj === matrixLeft[ii].length - 1 && (isctrl || isCmd) && isBothMaxDetailView) {
        this.setState({
          keyboardNavDateLeft: null,
          keyboardNavDateRight: matrixRight[ii][0],
          keyboardControlArea: "right_calendar_panel"
        });
      } else {
        const { keyboardNavDate, activeStartDate } = moveToNextDate(e, viewLeft, null, keyboardNavDateLeft, activeStartDateLeft);
        if (activeStartDate.getTime() < activeStartDateRight.getTime() || !isBothMaxDetailView) {
          this.setState({ keyboardNavDateLeft: keyboardNavDate, activeStartDateLeft: activeStartDate });
        } else {
          this.setState({
            keyboardNavDateLeft: null,
            keyboardNavDateRight: matrixRight[0][0],
            keyboardControlArea: "right_calendar_panel"
          });
        }
      }
    } else if (keyboardNavDateRight) {
      const tempIndex = matrixRight.findIndex(keyboardNavDateRight);
      const ii = tempIndex[0];
      const jj = tempIndex[1]
      if (isLeft && jj === 0 && (isctrl || isCmd) && isBothMaxDetailView) {
        const row = matrixLeft[ii];

        this.setState({
          keyboardNavDateLeft: row[row.length - 1],
          keyboardNavDateRight: null,
          keyboardControlArea: "left_calendar_panel"
        });
      } else {
        const { keyboardNavDate, activeStartDate } = moveToNextDate(e, viewRight, null, keyboardNavDateRight, activeStartDateRight);
        if (activeStartDate.getTime() > activeStartDateLeft.getTime() || !isBothMaxDetailView) {
          this.setState({ keyboardNavDateRight: keyboardNavDate, activeStartDateRight: activeStartDate });
        } else {
          const lastRow = matrixLeft[matrixLeft.length - 1];
          this.setState({
            keyboardNavDateLeft: lastRow[lastRow.length - 1],
            keyboardNavDateRight: null,
            keyboardControlArea: "left_calendar_panel"
          });
        }
      }
    }
  }

  onEnter(e: any, keyboardControlArea: any, viewLeft: any, viewRight: any, keyboardNavDateLeft: any, keyboardNavDateRight: any) {
    const { maxDetail } = this.props;

    if (keyboardControlArea === "left_calendar_panel" && keyboardNavDateLeft && viewLeft === maxDetail) {
      this.onClickDay(keyboardNavDateLeft, "leftValue");
    } else if (keyboardControlArea === "right_calendar_panel" && keyboardNavDateRight && viewRight === maxDetail) {
      this.onClickDay(keyboardNavDateRight, "rightValue");
    } else if (keyboardControlArea.startsWith("right_")) {
      this.rightCalendar.onKeyDown(e);
    } else {
      this.leftCalendar.onKeyDown(e);
    }
  }

  getTabOrders() {
    let leftOrder = this.leftCalendar.getTabOrders();
    let rightOrder = this.rightCalendar.getTabOrders();

    //move right calendar to the last position
    const left = [CALENDAR_PANEL].concat(leftOrder).map(e => "left_" + e);
    const right = rightOrder.concat([CALENDAR_PANEL]).map((e: any) => "right_" + e);
    return left.concat(right);
  }

  //api: used by parent
  getTabOrderInfo() {
    return {
      orders: this.getTabOrders(),
      keyboardControlArea: this.state.keyboardControlArea
    }
  }

  onKeyDown(e: any) {
    if (this.props.disabled || this.state.doubleHover) {
      return;
    }

    const { showInPicker } = this.props;
    let { keyboardNavDateLeft, keyboardNavDateRight, keyboardControlArea, activeStartDateLeft, activeStartDateRight, viewLeft, viewRight } = this.state;

    const { isTab, isEnter, isDirection, isChar, isBackspace, isSpace } = getKeyTable(e);

    let tabOrders = this.getTabOrders();

    if (checkTabForInline(showInPicker, e, tabOrders, keyboardControlArea)) {
      this.cleanTempValue();
      return;
    }
    if (!isChar && !isBackspace && !isSpace) {
      e.preventDefault && e.preventDefault();
    }
    if (isTab) {
      this.setState({
        keyboardControlArea: getNextTabItem(tabOrders, keyboardControlArea, e),
        keyboardNavDateLeft: null,
        keyboardNavDateRight: null,
      });
    } else if (isDirection && !keyboardControlArea) {
      this.setState({
        keyboardControlArea: "left_calendar_panel",
        keyboardNavDateLeft: null,
        keyboardNavDateRight: null
      });
    } else if (isEnter && keyboardControlArea) {
      this.onEnter(e, keyboardControlArea, viewLeft, viewRight, keyboardNavDateLeft, keyboardNavDateRight);
    } else if (keyboardControlArea && keyboardControlArea.includes(CALENDAR_PANEL) && isDirection) {
      if (!keyboardNavDateLeft && !keyboardNavDateRight) {
        //init
        const { valueForLeft, valueForRight } = this.getLeftRightValue();

        if (keyboardControlArea === "left_calendar_panel") {
          this.setState({
            keyboardNavDateLeft: getBeginValueForKeyboardHover(valueForLeft, activeStartDateLeft, viewLeft) || activeStartDateLeft,
            keyboardNavDateRight: null
          });
        } else {
          this.setState({
            keyboardNavDateLeft: null,
            keyboardNavDateRight: getBeginValueForKeyboardHover(valueForRight, activeStartDateRight, viewRight) || activeStartDateRight
          });
        }
      } else {
        this.onDirectKeyDown(e, activeStartDateLeft, viewLeft, keyboardNavDateLeft, activeStartDateRight, viewRight, keyboardNavDateRight);
      }
    }
  }

  getLeftRightValue() {
    let { leftValue, rightValue } = this.state;
    let valueForLeft: any = null;
    let valueForRight: any = null;

    if (leftValue.length > 0 && rightValue.length === 0) {
      valueForLeft = leftValue;
      valueForLeft = valueForLeft.length === 1 ? valueForLeft[0] : valueForLeft;
      valueForRight = valueForLeft;
    } else if (leftValue.length === 0 && rightValue.length > 0) {
      valueForRight = rightValue;
      valueForRight = valueForRight.length === 1 ? valueForRight[0] : valueForRight;
      valueForLeft = valueForRight;
    } else if (leftValue.length === 1 && rightValue.length === 1) {
      valueForLeft = [leftValue[0], rightValue[0]];
      valueForRight = [leftValue[0], rightValue[0]];
    }

    sortTime(valueForLeft);
    sortTime(valueForRight);

    return {
      valueForLeft,
      valueForRight
    }
  }

  isInlineFocusable() {
    const { tabIndex } = this.props;
    const { keyboardControlArea } = this.state;
    return tabIndex !== -1 && !keyboardControlArea;
  }

  onMouseDown = () => {
    if (!this.props.showInPicker) {
      this.setState({
        allowOutline: false,
      });
    }
  };

  render() {
    const {
      className,
      showOtherMonths,
      navigationLayoutMode,
      disabled,
      locale,
      tabIndex,
      showInPicker,
      minDetail,
      maxDetail,
      formatMonth,
      navigationLabel,
      selectRange,
      minDate,
      maxDate,
      disabledDates,
      disabledRanges,
      disabledDays,
      firstDayOfWeek,
    } = this.props;

    let { activeStartDateLeft, activeStartDateRight, keyboardNavDateLeft, keyboardNavDateRight, keyboardControlArea, viewLeft, viewRight } = this.state;
    if (!activeStartDateLeft || !activeStartDateRight) {
      activeStartDateLeft = this.getInitActiveDate().activeStartDateLeft;
      activeStartDateRight = this.getInitActiveDate().activeStartDateRight;
    }
    const isSameView = viewLeft === viewRight;

    let minDateForRight;
    if (isSameView) {
      if (viewLeft === "month") {
        minDateForRight = startOf("month", manipulate(activeStartDateLeft, 'add', 'months'));
        minDateForRight = moment(minDateForRight).toDate();
      } else if (viewLeft === "year") {
        minDateForRight = getFullDate(activeStartDateLeft.getFullYear() + 1);
      } else if (viewLeft === "decade") {
        minDateForRight = getFullDate(activeStartDateLeft.getFullYear() + 10);
      }
    }

    let keyboardControlAreaRight = null;
    let keyboardControlAreaLeft = null;

    if (keyboardControlArea && keyboardControlArea.startsWith("right_")) {
      keyboardControlAreaRight = keyboardControlArea.replace("right_", "");

    } else if (keyboardControlArea && keyboardControlArea.startsWith("left_")) {
      keyboardControlAreaLeft = keyboardControlArea.replace("left_", "");
    }

    const { valueForLeft, valueForRight } = this.getLeftRightValue();

    let matrixLeft = [];
    let matrixRight = [];
    if (keyboardControlArea && keyboardControlArea.includes(CALENDAR_PANEL)) {
      matrixLeft = getDateMatrix(activeStartDateLeft, viewLeft);
      matrixRight = getDateMatrix(activeStartDateRight, viewRight);
    }

    const totalCn = ClassNames("a-double-calendar-container", className, {
      "a-date-inline-focusable": this.isInlineFocusable(),
      "a-calendar-no-outline": !this.state.allowOutline,
      "no-bottom-left-border-radius": keyboardControlArea === "left_calendar_panel" && matrixLeft.length >= matrixRight.length,
      "no-bottom-right-border-radius": keyboardControlArea === "right_calendar_panel" && matrixRight.length >= matrixLeft.length
    });

    if (isSameView) {
      const t = keyboardNavDateLeft || keyboardNavDateRight;
      keyboardNavDateLeft = t;
      keyboardNavDateRight = t;
    }

    const applyTabIndex: any = tabIndex || (disabled ? -1 : "0");

    const commonProps: any = {
      selectRange: selectRange,
      _isInDoubleCalendar: true,
      minDetail: minDetail,
      maxDetail: maxDetail,
      showOtherMonths: showOtherMonths,
      navigationLayoutMode: navigationLayoutMode,
      onChange: this.callOnChange,
      disabled: disabled,
      locale: locale,
      tabIndex: -1,
      showInPicker: showInPicker,
      hover: this.state.doubleHover,
      formatMonth,
      navigationLabel,
      firstDayOfWeek,
      disabledDates,
      disabledRanges,
      disabledDays,
      _onHover: this.onDoubleHover.bind(this)
    };

    const _TABLE: any = {
      "month": "onClickDay",
      "year": "onClickMonth",
      "decade": "onClickYear"
    };

    commonProps[_TABLE[maxDetail]] = this.onClickDayLeft.bind(this);
console.log('valueForLeft', valueForLeft)
console.log('valueForRight', valueForRight)
    return (
      <div
        className={totalCn}
        tabIndex={applyTabIndex}
        onKeyDown={this.onKeyDown.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onMouseDown={this.onMouseDown}
      >
        <Calendar
          ref={ref => this.leftCalendar = ref}
          value={valueForLeft}
          maxDate={maxDate}
          activeStartDate={activeStartDateLeft}
          keyboardNavDate={keyboardNavDateLeft}
          keyboardControlArea={keyboardControlAreaLeft}
          onActiveDateChange={this.onActiveDateChangeLeft.bind(this)}
          onDrillDown={this.onDrill.bind(this)}
          onDrillUp={this.onDrill.bind(this)}
          view={viewLeft}
          siblingNode={this.rightCalendar}
          calendarPosition={CALENDAR_POSITION.LEFT}
          className="ap-datepicker-left"
          minDate={minDate}
          {...commonProps}
        />
        <div className="a-double-calendar-divider" />
        <Calendar
          ref={ref => this.rightCalendar = ref}
          activeStartDate={activeStartDateRight}
          value={valueForRight}
          minDate={minDate}
          keyboardNavDate={keyboardNavDateRight}
          keyboardControlArea={keyboardControlAreaRight}
          onActiveDateChange={this.onActiveDateChangeRight.bind(this)}
          onActiveDateChangeNoDir={this.onActiveDateChange.bind(this)}
          onDrillDown={this.onDrill.bind(this)}
          onDrillUp={this.onDrill.bind(this)}
          view={viewRight}
          showNavigationPrevNextBtn={true}
          siblingNode={this.leftCalendar}
          calendarPosition={CALENDAR_POSITION.RIGHT}
          className="ap-datepicker-right"
          maxDate={maxDate}
          {...commonProps}
        />
      </div>
    );
  }
}

export default DoubleCalendar;
