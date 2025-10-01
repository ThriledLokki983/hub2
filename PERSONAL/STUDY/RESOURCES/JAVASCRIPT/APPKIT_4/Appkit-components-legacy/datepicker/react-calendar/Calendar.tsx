import React, { Component } from "react";
import ClassNames from "classnames";
import Navigation from "./Navigation";
import DecadeView from "./DecadeView";
import YearView from "./YearView";
import MonthView from "./MonthView";
import {
  getBegin,
  getEnd,
  getValueRange,
  getEndPrevious,
  getBeginNext,
  getBeginPrevious
} from "./shared/dates";
import {
  callIfDefined,
  mergeFunctions,
  datesAreDifferent,
  getLimitedViews,
  getValueType,
  getValueFrom,
  getDetailValueFrom,
  getValueTo,
  isValueWithinRange,
  getStartAndEndDateOfView
} from "./shared/utils";
import {
  getNextTabItem,
  CALENDAR_PANEL,
  PREV_BUTTON,
  MONTH_BUTTON,
  YEAR_BUTTON,
  NEXT_BUTTON,
  checkTabForInline,
  getKeyTable,
  getBeginValueForKeyboardHover,
  YEAR_VIEW_YEAR_BUTTON,
} from "../utils/NavUtils";
import {
  moveToNextDate,
  isSame,
  getDefaultActiveStartDate
} from "../utils/dateUtils";
import moment from 'moment';
import { CALENDAR_POSITION } from '../utils/constants'
var _weekday: any = [];
_weekday[0] = "Su";
_weekday[1] = "Mo";
_weekday[2] = "Tu";
_weekday[3] = "We";
_weekday[4] = "Th";
_weekday[5] = "Fr";
_weekday[6] = "Sa";

function innerFormatShortWeekday(locale: string, date: any) {
  locale = locale && locale.toLowerCase();
  if (!locale || locale.includes("en")) {
    //english based on the design
    return _weekday[date.getDay()];
  } else if (locale === "ko" || locale === "ja") {
    //japan and korean
    return date.toLocaleString(locale, { weekday: "long" })[0];
  } else {
    //other locale
    let res = date.toLocaleString(locale, { weekday: "long" });
    res = res.length > 3 ? res.substr(0, 3) : res;
    return res;
  }
}

function arrRemove(arr: any, ele: any) {
  return arr.filter((e: any) => ele !== e);
}

type CalendarPropsType = {
  siblingNode?: any,
  activeStartDate?: any,
  calendarType?: any,
  className?: any,
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
  tileDisabled?: any,
  disabled?: boolean,
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
  menuChecked?: any,
  showDoubleCalendar?: any,
  showNavigationPrevNextBtn?: any,
  firstDayOfWeek?: number,
}
type CalendarStateType = {
  view: any,
  keyboardNavDate: any,
  activeStartDate?: any,
  keyboardControlArea: any,
  allowOutline: any,
  valueProps: any,
  hover: any,
  value: any,
  activeRange: any,

}

export default class Calendar extends Component<CalendarPropsType, CalendarStateType> {
  static defaultProps = {
    maxDetail: "month",
    minDetail: "decade",
    showNavigation: true,
    showOtherMonths: true,
    enforceTwoValue: false
  };
  prevButtonDisabled: any;
  nextButtonDisabled: any;
  lastHoverTime: any;
  constructor(props: CalendarPropsType) {
    super(props);
    this.state = {
      view: this.props.maxDetail,
      activeStartDate: getDefaultActiveStartDate(
        this.props.minDate,
        this.props.maxDate,
        this.props.value
      ),
      keyboardNavDate: null,
      keyboardControlArea: null,
      allowOutline: true,
      valueProps: null,
      hover: null,
      value: null,
      activeRange: null,
    };
  }

  resetActiveStartDate() {
    this.setState({
      activeStartDate: getDefaultActiveStartDate(
        this.props.minDate,
        this.props.maxDate,
        null
      )
    });
  }

  cleanTempValue() {
    this.setState({
      keyboardNavDate: null,
      keyboardControlArea: null,
      view: 'month',
      activeStartDate: getDefaultActiveStartDate(
        this.props.minDate,
        this.props.maxDate,
        this.props.value
      ),
    });
  }

  get drillDownAvailable() {
    const { maxDetail, minDetail } = this.props;
    const { view } = this.state;

    const views = getLimitedViews(minDetail, maxDetail);

    return views.indexOf(view) < views.length - 1;
  }

  get drillUpAvailable() {
    const { maxDetail, minDetail } = this.props;
    const { view } = this.state;

    const views = getLimitedViews(minDetail, maxDetail);
    const index = views.indexOf(view);

    return index > 0;
  }

  get valueType() {
    const { maxDetail } = this.props;
    return getValueType(maxDetail);
  }

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value: any) {
    const { minDate, maxDate, maxDetail } = this.props;

    return getDetailValueFrom(value, minDate, maxDate, maxDetail);
  }

  isViewAllowed(props = this.props, view = this.state.view) {
    const views = getLimitedViews(props.minDetail, props.maxDetail);
    return views.indexOf(view) !== -1;
  }

  getView(props = this.props) {
    const { view } = props;
    if (view && getLimitedViews(props.minDetail, props.maxDetail).indexOf(view) !== -1) {
      return view;
    }
    return getLimitedViews(props.minDetail, props.maxDetail).pop();
  }

  UNSAFE_componentWillReceiveProps(nextProps: CalendarPropsType) {
    const prevState = this.state;

    const nextState: any = {};

    const nextActiveStartDate = nextProps.activeStartDate;
    if (
      nextActiveStartDate &&
      datesAreDifferent(nextActiveStartDate, prevState.activeStartDate)
    ) {
      nextState.activeStartDate = nextActiveStartDate;
    }
    const allowedViewChanged =
      nextProps.minDetail !== this.props.minDetail ||
      nextProps.maxDetail !== this.props.maxDetail;
    if (allowedViewChanged && !this.isViewAllowed(nextProps)) {
      nextState.view = this.getView(nextProps);
    }

    /**
     * If the next value is different from the current one (with an exception of situation in
     * which values provided are limited by minDate and maxDate so that the dates are the same),
     * get a new one.
     */
    const values = [nextProps.value, prevState.valueProps];
    const valueFromList = values.map(value => getValueFrom(value))
    const valueToList = values.map(value => getValueTo(value))
    if (
      nextState.view || // Allowed view changed
      datesAreDifferent(
        valueFromList[0], valueFromList[1]
      ) ||
      datesAreDifferent(
        valueToList[0], valueToList[1]
      )
    ) {
      nextState.value = nextProps.value;
      nextState.valueProps = nextProps.value;
    }

    if (!nextProps.selectRange && prevState.hover) {
      nextState.hover = null;
    }

    if (nextProps.hasOwnProperty("keyboardNavDate")) {
      nextState.keyboardNavDate = nextProps.keyboardNavDate;
    }

    if (nextProps.hasOwnProperty("keyboardControlArea")) {
      nextState.keyboardControlArea = nextProps.keyboardControlArea;
    }

    //menuChecked property logic
    if (nextProps.menuChecked && nextState.value) {
      const _value = nextState.value[0] || nextState.value;
      const _view = nextState.view || this.state.view;
      const _activeStartDate =
        nextState.activeStartDate || this.state.activeStartDate;
      const end = getEnd(_view, _activeStartDate);

      if (!isValueWithinRange(_value, [_activeStartDate, end])) {
        nextState.activeStartDate = getBegin(_view, _value);
      }
    }

    this.setState(nextState);
  }

  //api: used by parent
  getTabOrderInfo() {
    return {
      orders: this.getTabOrders(),
      keyboardControlArea: this.state.keyboardControlArea
    };
  }

  getTabOrders(view?: string) {
    const { disabled, _isInDoubleCalendar, calendarPosition } = this.props;

    if (disabled) {
      return [];
    }
    let result: Array<string> = [];
    switch (view) {
      case "month":
        result = [MONTH_BUTTON, YEAR_BUTTON, PREV_BUTTON, NEXT_BUTTON, CALENDAR_PANEL];
        break;
      case "year":
        result = [YEAR_VIEW_YEAR_BUTTON, PREV_BUTTON, NEXT_BUTTON, CALENDAR_PANEL]
        break;
      case "decade":
        result = [PREV_BUTTON, NEXT_BUTTON, CALENDAR_PANEL]
        break;
    }

    if (_isInDoubleCalendar && calendarPosition === CALENDAR_POSITION.LEFT) {
      result = arrRemove(result, PREV_BUTTON);
      result = arrRemove(result, NEXT_BUTTON);
    }
    return result;
  }
  //set the first focused date when focus from navigation to date panel
  getFirstFocusDate(value: Date | Array<Date>) {
    let { activeStartDate, view } = this.state;
    let targetDate = new Date();
    if (value && value instanceof Array) {
      targetDate = value[0]
    } else if (value) {
      targetDate = value
    }
    let currentViewStart = activeStartDate;
    let currentViewEnd;
    switch (view) {
      case "month":
        currentViewEnd = moment(currentViewStart).endOf("month").toDate();
        break;
      case "year":
        currentViewEnd = moment(currentViewStart).add(12, 'month').toDate();
        break;
      case "decade":
        currentViewEnd = moment(currentViewStart).add(12, 'year').toDate();
        break;
      default:
        break;
    }
    if (moment(targetDate).isSameOrAfter(currentViewStart) && moment(targetDate).isSameOrBefore(currentViewEnd)) {
      return targetDate
    } else {
      return currentViewStart
    }
  }

  onKeyDown(e: any) {
    let {
      keyboardNavDate,
      view,
      activeStartDate,
      value,
      keyboardControlArea
    } = this.state;
    const {
      minDate,
      maxDate,
      disabled,
      _isInDoubleCalendar,
      showInPicker,
      maxDetail,
    } = this.props;

    const {
      isTab,
      isEnter,
      isDirection,
      isChar,
      isBackspace,
      isSpace,
      isEsc
    } = getKeyTable(e);
    const tabOrders = this.getTabOrders(view);
    if (!isEsc) e.stopPropagation();
    //When focused item is inside the nav area,
    //when press direction button, it will change to calendar date area. 
    const keyboardControlAreaIsNav = keyboardControlArea === MONTH_BUTTON || keyboardControlArea === YEAR_BUTTON || keyboardControlArea === PREV_BUTTON || keyboardControlArea === NEXT_BUTTON;

    if (disabled || (_isInDoubleCalendar && !isEnter)) {
      return;
    }


    if (checkTabForInline(showInPicker, e, tabOrders, keyboardControlArea)) {
      this.cleanTempValue();
      return;
    }
    if (!isChar && !isBackspace && !isSpace && !isTab) {
      e.preventDefault && e.preventDefault();
    }

    const beginValue = getBeginValueForKeyboardHover(
      value,
      activeStartDate,
      view
    );

    if (keyboardControlAreaIsNav && isDirection) {
      this.setState({
        keyboardControlArea: CALENDAR_PANEL,
        keyboardNavDate: this.getFirstFocusDate(value)
      })
      return;
    }
    if (isTab) {
      e.preventDefault();
      this.setState({
        keyboardControlArea: getNextTabItem(tabOrders, keyboardControlArea, e),
        keyboardNavDate: getNextTabItem(tabOrders, keyboardControlArea, e) === CALENDAR_PANEL ? this.getFirstFocusDate(value) : null
      });
    } else if (keyboardControlArea === CALENDAR_PANEL && isDirection) {
      const temp = moveToNextDate(
        e,
        view,
        beginValue,
        keyboardNavDate,
        activeStartDate,
        minDate,
        maxDate
      );
      this.setState({
        activeStartDate: temp.activeStartDate,
        keyboardNavDate: temp.keyboardNavDate,
        keyboardControlArea: CALENDAR_PANEL
      });
    } else if (isEnter) {
      if (keyboardNavDate && keyboardControlArea === CALENDAR_PANEL) {
        if (view === maxDetail) {
          this.onChange(keyboardNavDate);
        } else {
          this.onDrillDown(keyboardNavDate);
        }
      } else if (keyboardControlArea === PREV_BUTTON) {
        if (!this.prevButtonDisabled) {
          this.setActiveStartDate(getBeginPrevious(view, activeStartDate));
        }
      } else if (keyboardControlArea === NEXT_BUTTON) {
        if (!this.nextButtonDisabled) {
          this.setActiveStartDate(getBeginNext(view, activeStartDate));
        }
      } else if (keyboardControlArea === MONTH_BUTTON) {
        this.onDrillUp(activeStartDate, 1);
        //when press month button, it will focus 
        //on the month view's date panel. 
        //The first focus date is depend on value.
        this.setState({
          keyboardControlArea: CALENDAR_PANEL,
          keyboardNavDate: this.getFirstFocusDate(value)
        })
      } else if (keyboardControlArea === YEAR_BUTTON) {
        this.onDrillUp(activeStartDate, 0);
        //when press year button, it will focus 
        //on the year view's date panel. 
        //The first focus date is depend on value.
        this.setState({
          keyboardControlArea: CALENDAR_PANEL,
          keyboardNavDate: this.getFirstFocusDate(value)
        })
      }
    }
  }

  /**
   * Called when the user uses navigation buttons.
   */
  setActiveStartDate = (activeStartDate: Date) => {
    const { onActiveDateChange } = this.props;

    this.setState({ activeStartDate, keyboardNavDate: null }, () => {
      const { view } = this.state;

      callIfDefined(onActiveDateChange, {
        activeStartDate,
        view
      });
    });
  };

  onDrillDown = (activeStartDate: Date) => {
    const { siblingNode } = this.props;
    if (siblingNode) siblingNode.drillDown(activeStartDate);
    this.drillDown(activeStartDate);
  }

  drillDown = (activeStartDate: Date) => {
    if (!this.drillDownAvailable) {
      return;
    }
    const { maxDetail, minDetail, onDrillDown, value } = this.props;
    const views = getLimitedViews(minDetail, maxDetail);
    this.setState(
      prevState => {
        let nextView: string = views[views.indexOf(prevState.view) + 1];
        if (!nextView) {
          nextView = getLimitedViews(minDetail, maxDetail).pop() || "";
        }
        return {
          activeStartDate,
          view: nextView,

        };
      },
      () => {
        this.setState({
          keyboardNavDate: this.getFirstFocusDate(value),
          keyboardControlArea: CALENDAR_PANEL
        })
        const { view } = this.state;
        callIfDefined(onDrillDown, {
          activeStartDate,
          view
        });
      }
    );
  };

  onDrillUp = (event: any, target: any) => {
    const { siblingNode } = this.props;
    if (siblingNode) siblingNode.drillUp(event, target)
    this.drillUp(event, target);
  }

  drillUp = (event: any, target: any) => {
    if (!this.drillUpAvailable) {
      return;
    }
    const { maxDetail, minDetail, onDrillUp } = this.props;
    const views = getLimitedViews(minDetail, maxDetail);
    this.setState(
      prevState => {
        let nextView: any = target !== undefined ? views[target] : views[views.indexOf(prevState.view) - 1];
        if (!nextView) {
          nextView = getLimitedViews(minDetail, maxDetail).shift();
        }
        let activeStartDate = getBegin(nextView, prevState.activeStartDate)
        let nextFocusedDate: Date | null = null;
        let now = new Date();
        let value = prevState.value;
        let range = getStartAndEndDateOfView(nextView, activeStartDate);
        if (value && isValueWithinRange(value, range)) {
          nextFocusedDate = value;
        } else if (isValueWithinRange(now, range)) {
          nextFocusedDate = now;
        } else {
          nextFocusedDate = activeStartDate;
        }

        return {
          activeStartDate,
          view: nextView,
          keyboardNavDate: nextFocusedDate,
        };
      },
      () => {
        const { activeStartDate, view } = this.state;
        callIfDefined(onDrillUp, {
          activeStartDate,
          view
        });
      }
    );
  };

  onChange = (value: any) => {
    const {
      onChange,
      selectRange,
      _isInDoubleCalendar,
      enforceTwoValue
    } = this.props;

    if (_isInDoubleCalendar) {
      return;
    }
    let nextValue: any;
    let callback;
    if (selectRange) {
      const previousValue = this.state.value;
      // Range selection turned on
      // 0 or 2 - either way we're starting a new array
      if (!previousValue || [].concat(previousValue).length !== 1) {
        // First value
        nextValue = getBegin(this.valueType, value);
        callback = () => callIfDefined(onChange, nextValue);
      } else {
        // Second value
        if (enforceTwoValue && isSame(previousValue, value)) {
          return;
        }
        nextValue = getValueRange(this.valueType, previousValue, value);
        callback = () => callIfDefined(onChange, nextValue);
      }
    } else {
      // Range selection turned off
      nextValue = this.getProcessedValue(value);
      callback = () => callIfDefined(onChange, nextValue);
    }

    this.setState({ value: nextValue }, callback);

  };

  onMouseOver = (value: any) => {
    if (this.props._onHover) {
      this.props._onHover(value);
    } else {
      this.setState({
        hover: value,
      });
    }
  };

  onMouseOut = () => {
    if (!this.props.selectRange) {
      return;
    }
  };

  isHighlightPanel() {
    return (
      this.state.keyboardControlArea === CALENDAR_PANEL &&
      !this.state.keyboardNavDate
    );
  }

  renderContent() {
    let {
      calendarType,
      locale,
      maxDate,
      minDate,
      renderChildren,
      selectRange,
      tileClassName,
      tileContent,
      tileDisabled,
      disabled,
      _isInDoubleCalendar,
      disabledDates,
      disabledRanges,
      disabledDays,
    } = this.props;

    let { view, keyboardNavDate } = this.state;
    const { onMouseOver, valueType } = this;

    //two names for one property
    tileDisabled = tileDisabled || disabled;

    let activeStartDate, value, hover;

    if (_isInDoubleCalendar) {
      activeStartDate = this.props.activeStartDate;
      hover = this.props.hover;
    } else {
      activeStartDate = this.state.activeStartDate;
      hover = this.state.hover;
    }

    value = this.props.value || this.state.value;

    const commonProps = {
      activeStartDate: activeStartDate || new Date(),
      hover,
      locale,
      maxDate,
      minDate,
      onMouseOver: selectRange ? onMouseOver : null,
      tileClassName,
      tileContent: tileContent || renderChildren, // For backwards compatibility
      tileDisabled,
      value,
      valueType,
      keyboardNavDate,
      selectRange,
      disabledDates,
      disabledRanges,
      disabledDays,
    };

    const clickAction = this.drillDownAvailable
      ? this.onDrillDown
      : this.onChange;

    const keyboradHighlight = this.isHighlightPanel();
    switch (view) {
      case "decade": {
        const { onClickYear } = this.props;
        return (
          <DecadeView
            keyboradHighlight={keyboradHighlight}
            onClick={mergeFunctions(clickAction, onClickYear)}
            {...commonProps}
          />
        );
      }
      case "year": {
        const { onClickMonth } = this.props;
        return (
          <YearView
            keyboradHighlight={keyboradHighlight}
            formatMonth={this.props.formatMonth}
            onClick={mergeFunctions(clickAction, onClickMonth)}
            {...commonProps}
          />
        );
      }
      case "month": {
        const {
          formatShortWeekday,
          onClickDay,
          onClickWeekNumber,
          showFixedNumberOfWeeks,
          showOtherMonths,
          showWeekNumbers,
          firstDayOfWeek
        } = this.props;

        return (
          <MonthView
            keyboradHighlight={keyboradHighlight}
            calendarType={calendarType}
            formatShortWeekday={formatShortWeekday || innerFormatShortWeekday}
            onClick={mergeFunctions(clickAction, onClickDay)}
            onClickWeekNumber={onClickWeekNumber}
            showFixedNumberOfWeeks={showFixedNumberOfWeeks}
            showOtherMonths={showOtherMonths}
            showWeekNumbers={showWeekNumbers}
            firstDayOfWeek={firstDayOfWeek}
            {...commonProps}
          />
        );
      }
      default:
        throw new Error(`Invalid view: ${view}.`);
    }
  }

  renderNavigation() {
    const {
      formatMonthYear,
      locale,
      maxDate,
      maxDetail,
      minDate,
      minDetail,
      nextLabel,
      navigationLabel,
      prevLabel,
      navigationLayoutMode,
      _isInDoubleCalendar,
      showNavigation,
      disabled,
      showNavigationPrevNextBtn,
      siblingNode,
      onActiveDateChangeNoDir
    } = this.props;

    if (!showNavigation) {
      return null;
    }

    const { activeRange, view, keyboardControlArea } = this.state;

    let activeStartDate;
    if (_isInDoubleCalendar) {
      activeStartDate = this.props.activeStartDate;
    } else {
      activeStartDate = this.state.activeStartDate;
    }

    let prevButtonDisabled;
    let nextButtonDisabled;

    if (disabled) {
      prevButtonDisabled = true;
      nextButtonDisabled = true;
    } else {
      if (!_isInDoubleCalendar || view !== maxDetail) {
        prevButtonDisabled = false;
        nextButtonDisabled = false;
      }
      const previousActiveEndDate = getEndPrevious(view, activeStartDate || new Date());
      prevButtonDisabled = !!(minDate && minDate >= previousActiveEndDate);

      const nextActiveStartDate = getBeginNext(view, activeStartDate || new Date());
      nextButtonDisabled = !!(maxDate && maxDate <= nextActiveStartDate);
    }

    this.prevButtonDisabled = prevButtonDisabled;
    this.nextButtonDisabled = nextButtonDisabled;

    return (
      <Navigation
        activeRange={activeRange}
        activeStartDate={activeStartDate || new Date()}
        drillUp={this.onDrillUp}
        formatMonthYear={formatMonthYear}
        locale={locale}
        maxDate={maxDate}
        minDate={minDate}
        navigationLayoutMode={navigationLayoutMode}
        keyboardControlArea={keyboardControlArea}
        nextLabel={nextLabel}
        navigationLabel={navigationLabel}
        _isInDoubleCalendar={_isInDoubleCalendar}
        siblingNode={siblingNode}
        prevLabel={prevLabel}
        setActiveStartDate={this.setActiveStartDate}
        onActiveDateChangeNoDir={onActiveDateChangeNoDir}
        view={view}
        prevButtonDisabled={prevButtonDisabled}
        nextButtonDisabled={nextButtonDisabled}
        middleDisabled={!this.drillUpAvailable}
        disabled={disabled}
        views={getLimitedViews(minDetail, maxDetail)}
        showNavigationPrevNextBtn={showNavigationPrevNextBtn}
      />
    );
  }

  getDate() {
    return this.state.value;
  }

  isInlineFocusable() {
    const { tabIndex } = this.props;
    const { keyboardControlArea } = this.state;
    return tabIndex !== -1 && !keyboardControlArea;
  }

  onMouseDown = () => {
    if (!this.props.showInPicker) {
      this.setState({
        allowOutline: false
      });
    }
  };

  onBlur = () => {
    if (!this.props.showInPicker) {
      this.setState({
        allowOutline: true
      });
    }

    this.onMouseOut();
  };

  render() {
    const { className, selectRange } = this.props;
    const { value, keyboardControlArea } = this.state;
    const valueArray = [].concat(value);

    const cn = ClassNames("react-calendar", className, {
      "react-calendar--selectRange": selectRange && valueArray.length === 1,
      "a-date-inline-focusable": this.isInlineFocusable(),
      "a-calendar-no-outline": !this.state.allowOutline,
      "no-need-outline-highlight":
        keyboardControlArea || this.state.keyboardNavDate,
      "disable-bottom-radius": this.isHighlightPanel()
    });

    return (
      <div
        className={cn}
        tabIndex={-1}
        onMouseOut={this.onMouseOut}
        onBlur={this.onBlur}
        onMouseDown={this.onMouseDown}
        onKeyDown={this.onKeyDown.bind(this)}
        style={{ outline: "none" }}
      >
        {this.renderNavigation()}
        {this.renderContent()}
      </div>
    );
  }
}

