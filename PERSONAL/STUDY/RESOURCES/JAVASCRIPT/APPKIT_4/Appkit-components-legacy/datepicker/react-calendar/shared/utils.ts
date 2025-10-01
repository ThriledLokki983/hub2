import { getRange, getBegin } from "./dates";
import moment from "moment";
import { isSame } from "../../utils/dateUtils";
/**
 * Returns a function that, when called, calls all the functions
 * passed to it, applying its arguments to them.
 *
 * @param {Function[]} functions
 */
export const mergeFunctions =
  (...functions: any[]) =>
  (...args: any) =>
    functions.filter(Boolean).forEach((f) => f(...args));

/**
 * Calls a function, if it's defined, with specified arguments
 * @param {Function} fn
 * @param {Object} args
 */
export const callIfDefined = (fn: any, ...args: any) => {
  if (fn && typeof fn === "function") {
    fn(...args);
  }
};

export const isValueWithinRange = (value: any, range: any) =>
  value && range[0] <= value && range[1] >= value;

const doesRangeConludeRange = (greaterRange: any, smallerRange: any) =>
  greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1];

export const doRangesOverlap = (range1: any, range2: any) =>
  isValueWithinRange(range1[0], range2) ||
  isValueWithinRange(range1[1], range2);

/**
 * Returns a value no smaller than min and no larger than max.
 *
 * @param {*} value Value to return.
 * @param {*} min Minimum return value.
 * @param {*} max Maximum return value.
 */
export const between = (value: any, min: any, max: any) => {
  if (min && min > value) {
    return min;
  }
  if (max && max < value) {
    return max;
  }
  return value;
};

export const getTileClasses = ({
  selectRange,
  value,
  valueType,
  date,
  dateType,
  hover,
  keyboardNavDate,
  startDate,
  endDate,
}: any = {}) => {
  const className = "r-c-tile";
  const classes = [className];
  const titleDate = date;
  const selectValue = value;
  const now = new Date();

  if (dateType === "day") {
    let midDate = moment(startDate).add(15, "day");
    startDate = midDate.startOf("month").toDate();
    endDate = midDate.endOf("month").toDate();
  }
  //the range of current panel
  let currentPanelRange = [startDate, endDate];
  let todayIsInsideCurrentPanel = isValueWithinRange(now, currentPanelRange);
  classes.push("r-c-normal");
  if (!titleDate) {
    return classes;
  }

  if (!(titleDate instanceof Array) && !dateType) {
    throw new Error(
      "getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed."
    );
  }
  const tileRange =
    titleDate instanceof Array ? titleDate : getRange(dateType, titleDate);
  //handle set the first date when transfer focus from navigation
  const initFocusValue = value instanceof Array ? value[0] : value;
  //if not value selected,
  //focus today if today is in current panel,
  //else focus the first day of current panel
  /* if(!value) {
    if (isValueWithinRange(now, tileRange) && todayIsInsideCurrentPanel) {
      classes.push("r-c-tile-init-focus");
    }else {
      if(moment(startDate).isSame(moment(titleDate)) && !todayIsInsideCurrentPanel) {
        classes.push("r-c-tile-init-focus");
      }
    }
  } else {
    if(moment(initFocusValue).isSame(moment(titleDate))) {
      classes.push("r-c-tile-init-focus");
    }
  } */

  if (isValueWithinRange(now, tileRange)) {
    classes.push("r-c-tile-now");
  }

  if (isValueWithinRange(keyboardNavDate, tileRange)) {
    classes.push("r-c-tile-key-nav");
  }

  if (!selectValue) {
    return classes;
  }

  if (!(selectValue instanceof Array) && !valueType) {
    throw new Error(
      "getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed."
    );
  }

  //from value property
  //get range make day 00:00:00 - > 23:59:59
  const onlySelectOne = selectValue instanceof Date || selectValue.length === 1;
  let selectedRange =
    selectValue instanceof Array
      ? selectValue
      : getRange(valueType, selectValue);
  if (selectedRange.length === 1) {
    selectedRange = getRange(valueType, selectValue[0]);
  }

  // Double single manually input a disabled date
 
  if (!selectRange) {
    if (selectValue instanceof Array) {
      if (isSame(selectValue[0], titleDate)) {
        classes.push("r-c-tile-active");
      }
    }
  } else {
    if (isValueWithinRange(titleDate, selectValue)) {
      classes.push("r-c-tile-active");
    }
  }

  if (doesRangeConludeRange(selectedRange, tileRange)) {
    classes.push("r-c-tile-active");
    classes.push("r-c-tile-within");
  }

  if (selectRange && (hover || keyboardNavDate) && onlySelectOne) {
    //only work for rangle select
    //with one select value

    //?? priority
    let hoverRange = getRange(dateType, hover || keyboardNavDate);

    //zero equal problem in js
    //hover and select is the same date
    const hoverOnSelect =
      Number(hoverRange[0]) - Number(selectedRange[0]) === 0 &&
      Number(hoverRange[1]) - Number(selectedRange[1]) === 0;

    if (!hoverOnSelect) {
      hoverRange = hoverRange
        .concat(selectedRange)
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());
      hoverRange = [hoverRange[0], hoverRange[3]];
      if (isValueWithinRange(titleDate, hoverRange)) {
        classes.push("r-c-tile-selected-tile");
      }
      if (doesRangeConludeRange(hoverRange, tileRange)) {
        classes.push("r-c-tile-hover-middle");
        const isHoverStart = isValueWithinRange(hoverRange[0], tileRange);
        const isHoverEnd = isValueWithinRange(hoverRange[1], tileRange);

        isHoverStart && classes.push("r-c-tile-hoverStart");
        isHoverEnd && classes.push("r-c-tile-hoverEnd");
      }
    }
  }

  const isRangeStart = isValueWithinRange(selectedRange[0], tileRange);
  const isRangeEnd = isValueWithinRange(selectedRange[1], tileRange);

  if (isRangeStart && isRangeEnd) {
    //not follow by hover
    classes.push("r-c-tile-rangeBothEnds");
  } else if (isRangeStart) {
    classes.push("r-c-tile-rangeStart");
  } else if (isRangeEnd) {
    classes.push("r-c-tile-rangeEnd");
  }

  return classes;
};

export const datesAreDifferent = (date1: any, date2: any) =>
  (date1 && !date2) ||
  (!date1 && date2) ||
  (date1 && date2 && date1.getTime() !== date2.getTime());

export const ALL_VIEWS = ["decade", "year", "month"];
const allValueTypes = [...ALL_VIEWS.slice(1), "day"];

export const getLimitedViews = (minDetail: string, maxDetail: string) => {
  return ALL_VIEWS.slice(
    ALL_VIEWS.indexOf(minDetail),
    ALL_VIEWS.indexOf(maxDetail) + 1
  );
};

const getView = (view: string, minDetail: string, maxDetail: string) => {
  if (view && getLimitedViews(minDetail, maxDetail).includes(view)) {
    return view;
  }

  return getLimitedViews(minDetail, maxDetail).pop();
};

/**
 * Returns value type that can be returned with currently applied settings.
 */

export const getValueType = (maxDetail: string) =>
  allValueTypes[ALL_VIEWS.indexOf(maxDetail)];

export const getValueFrom = (value: any) => {
  if (!value || value.length === 0) {
    return null;
  }

  const rawValueFrom =
    value instanceof Array && value.length === 2 ? value[0] : value;

  if (!rawValueFrom) {
    return null;
  }

  const valueFromDate = new Date(rawValueFrom);

  if (isNaN(valueFromDate.getTime())) {
    return null;
  }

  return valueFromDate;
};

export const getDetailValueFrom = (
  value: Date,
  minDate: Date,
  maxDate: Date,
  maxDetail: string
) => {
  const valueFrom = getValueFrom(value);

  if (!valueFrom) {
    return null;
  }

  const detailValueFrom = getBegin(getValueType(maxDetail), valueFrom);

  return between(detailValueFrom, minDate, maxDate);
};

export const getValueTo = (value: any) => {
  if (!value || value.length === 0) {
    return null;
  }

  const rawValueTo =
    value instanceof Array && value.length === 2 ? value[1] : value;

  if (!rawValueTo) {
    return null;
  }

  const valueToDate = new Date(rawValueTo);

  if (isNaN(valueToDate.getTime())) {
    return null;
  }

  return valueToDate;
};

export const getStartAndEndDateOfView = (view: string, startDate: Date) => {
  let _startDate = startDate;
  let _endDate = null;
  if (view === "month") {
    let midDate = moment(_startDate).add(15, "day");
    _startDate = midDate.startOf("month").toDate();
    _endDate = midDate.endOf("month").toDate();
  } else if (view === "year") {
    _endDate = moment(_startDate).add(11, "month");
  } else if (view === "decade") {
    _endDate = moment(_startDate).add(11, "year");
  }
  return [_startDate, _endDate];
};
