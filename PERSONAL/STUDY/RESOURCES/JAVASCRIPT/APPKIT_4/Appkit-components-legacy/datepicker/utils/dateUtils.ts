import moment from "moment";
import { DATE_FORMAT } from './constants';
//Dates always start from Sunday.

function isObject(obj: any) {
  return typeof obj === "object";
}

export function getMoment(date: any) {
  return moment(date);
}

export function getCurrentMonth() {
  return moment().month();
}

export function getCurrentYear() {
  return moment().year();
}

export function getDay() {
  return moment().date();
}

export function isDate(val: any) {
  return val && typeof val.getMonth === "function";
}

export function getDefaultActiveStartDate(minDate: any, maxDate: any, value: any) {
  let result: any = getTodayObject();
  if (isDate(value)) {
    result = value;
  } else if (value && isDate(value[0])) {
    result = value[0];
  }

  result = startOf("month", result);
  result = moment(result).toDate();

  if (minDate && minDate.getTime() > result.getTime()) {
    result = minDate;
  }

  if (maxDate && maxDate.getTime() < result.getTime()) {
    result = maxDate;
  }
  return result;
}

export function getTodayObject() {
  return moment()
    .startOf("day")
    .toObject();
}

export function convertDateToObject(
  date: any,
  format: string = DATE_FORMAT
) {
  if (isObject(date)) {
    return moment(date).toObject();
  } else {
    return moment(date, format).toObject();
  }
}

export function formatDate(date: any, format: string = DATE_FORMAT) {
  return moment(date).format(format);
}

const getDecadeBegin = (d: any) => {
  const y = d.getFullYear ? d.getFullYear() : d.years;
  const ld = y % 10;
  if (ld === 0) {
    return y - 9;
  } else {
    return y - ld + 1;
  }
};

export function startOf(unit: any, date?: Object) {
  if (unit === "decade") {
    return new Date(getDecadeBegin(date), 0, 1);
  }

  return moment(date)
    .startOf(unit)
    .toObject();
}
export function endOf(unit: any, date?: Object) {
  return moment(date)
    .endOf(unit)
    .toObject();
}

export function isSame(
  originDate: any,
  compareDate: any,
  unit: any = "day"
) {
  return moment(originDate, DATE_FORMAT).isSame(moment(compareDate, DATE_FORMAT), unit);
}

export function manipulate(
  date: any,
  operation: string,
  unit: any,
  step: number = 1
) {
  let _unit = unit;
  if (_unit === "month") {
    _unit = "months";
  } else if (_unit === "year") {
    _unit = "years";
  }

  let _date = date;
  let _step = step;

  if (_unit === "decade") {
    _date = startOf("decade", _date);
    _unit = "years";

    if (_step === 1) {
      _step = _step * 10;
    }
  }

  if (!date._isAMomentObject) {
    _date = moment(_date);
  }
  if (operation === "add") {
    return _date.add(_step, _unit).toObject();
  } else if (operation === "subtract") {
    return _date.subtract(_step, _unit).toObject();
  } else {
    return getTodayObject();
  }
}

export function isBetween(
  compareDate: Object | string,
  start_date: Object | string,
  end_date: Object | string
) {
  return moment(compareDate).isBetween(moment(start_date), moment(end_date));
}

export function checkWithMinMax(view: any, date: any, minDate: any, maxDate: any) {
  if (view === "month") {
    if (minDate) {
      date = date.getTime() < minDate.getTime() ? minDate : date;
    }

    if (maxDate) {
      date = date.getTime() > maxDate.getTime() ? maxDate : date;
    }
  }

  return date;
}

export function isInSameDecade(date1: any, date2: any) {
  return getDecadeBegin(date1) === getDecadeBegin(date2);
}

export function isInSameViewPage(date1: any, date2: any, view: any) {
  return view === "decade"
    ? date1 && date2 && isInSameDecade(date1, date2)
    : date1 && date2 && isSame(date1, date2, view);
}

export function moveToNextDate(
  e: any,
  view: string,
  selectValue: any,
  keyboardNavDate: any,
  activeStartDate?: any,
  minDate?: any,
  maxDate?: any
) {
  const convertTable = new Map();
  convertTable.set('month', 'day');
  convertTable.set('year', 'month');
  convertTable.set('decade', 'year');

  const verticalTable = new Map();
  verticalTable.set('month', 7);
  verticalTable.set('year', 3);
  verticalTable.set('decade', 3);

  //handle 4 four direction
  const isDown = e.key === "ArrowDown";
  const isUp = e.key === "ArrowUp";
  const isLeft = e.key === "ArrowLeft";
  const operator = isLeft || isUp ? "subtract" : "add";
  let unit = isDown || isUp ? verticalTable.get(view) : 1;

  const bisInSameViewPage = isInSameViewPage(
    selectValue,
    activeStartDate,
    view
  );

  //need to reset
  if (!keyboardNavDate && !(bisInSameViewPage && selectValue)) {
    keyboardNavDate = activeStartDate;
    return {
      keyboardNavDate,
      activeStartDate
    };
  }

  keyboardNavDate = manipulate(
    keyboardNavDate || selectValue,
    operator,
    convertTable.get(view),
    unit
  );

  keyboardNavDate = startOf(convertTable.get(view), keyboardNavDate);
  keyboardNavDate = moment(keyboardNavDate).toDate();
  keyboardNavDate = checkWithMinMax(view, keyboardNavDate, minDate, maxDate);

  //special handle for decade
  let endDay;
  const isDecade = view === "decade";
  if (isDecade) {
    endDay = manipulate(activeStartDate, "add", "year", 9);
  } else {
    endDay = endOf(convertTable.get(view), activeStartDate);
  }
  endDay = moment(endDay).toDate();

  //adjust activeStartDate if needed
  if (keyboardNavDate.getTime() < activeStartDate.getTime()) {
    if (isDecade) {
      activeStartDate = manipulate(activeStartDate, "subtract", "year", 10);
    } else {
      activeStartDate = startOf(view, keyboardNavDate);
    }
    activeStartDate = moment(activeStartDate).toDate();
  } else if (keyboardNavDate.getTime() > endDay.getTime()) {
    if (isDecade) {
      activeStartDate = manipulate(activeStartDate, "add", "year", 10);
    } else {
      activeStartDate = startOf(view, keyboardNavDate);
    }
    activeStartDate = moment(activeStartDate).toDate();
  }

  return {
    keyboardNavDate,
    activeStartDate
  };
}

// e.g
// M T W T F S S
//     1 2 3 4 5
// 6 7 8 9 10 11 12
export function getDateMatrix(activeStartDate: any, view: any) {
  let result: any = [];
  if (view === "month") {
    const currentMonth = activeStartDate.getMonth();

    let tempD = activeStartDate;
    let row:Array<Date> = [];

    while (tempD.getMonth() === currentMonth) {
      row.push(tempD);
      if (tempD.getDay() === 0) {
        result.push(row);
        row = [];
      }

      //++1
      tempD = manipulate(tempD, "add", "day");

      tempD = moment(tempD).toDate();
    }

    if (row.length > 0) {
      result.push(row);
    }
  } else if (view === "year") {
    const currentYear = activeStartDate.getFullYear();
    let row:Array<Date> = [];
    for (let ii = 0; ii < 12; ii++) {
      let tempD:Date = new Date(currentYear, ii, 1);
      row.push(tempD);

      if ((ii + 1) % 3 === 0) {
        result.push(row);
        row = [];
      }
    }
    if (row.length > 0) {
      result.push(row);
    }
  } else if (view === "decade") {
    const currentYear = activeStartDate.getFullYear();
    let row:Array<Date> = [];
    for (let ii = 0; ii < 10; ii++) {
      let tempD:Date= new Date(currentYear + ii, 0, 1);
      row.push(tempD);

      if ((ii + 1) % 3 === 0) {
        result.push(row);
        row = [];
      }
    }
    if (row.length > 0) {
      result.push(row);
    }
  }

  //a function for result
  result.findIndex = (date: any) => {
    let index;
    result.forEach((row: any, ii: any) => {
      row.forEach((d: any, jj: any) => {
        if (isSame(d, date)) {
          index = [ii, jj];
        }
      });
    });
    return index;
  };
  return result;
}

export function formatTransfer(originFormat: string) {
  if (!originFormat) return "";
  let formatMap = new Map();
  formatMap.set('d', 'D');
  formatMap.set('m', 'M');
  formatMap.set('y', 'Y');
  let transfered = "";
  for (let i = 0; i < originFormat.length; i++) {
    if (originFormat[i] !== "t" && originFormat[i] !== "T") {
      transfered += formatMap.get(originFormat[i]) || originFormat[i];
    } else {
      if (originFormat[i] === "t" && originFormat[i + 1] === "t") {
        transfered += "a";
        i++;
      } else if (originFormat[i] === "T" && originFormat[i + 1] === "T") {
        transfered += "a";
        i++;
      } else if (originFormat[i] === "t" || originFormat[i] === "T") {
        transfered += "a";
      }
    }
  }
  return transfered;
}

export function isInRange(dateString: string, minDate?: Date, maxDate?: Date) {
  let inRange = true;
  let formatStr = DATE_FORMAT;
  let dateObject = moment(dateString, formatStr);
  if (minDate && maxDate) {
    inRange =
      dateObject.isSameOrBefore(moment(maxDate)) &&
      dateObject.isSameOrAfter(moment(minDate));
  } else if (minDate) {
    inRange = dateObject.isSameOrAfter(moment(minDate));
  } else if (maxDate) {
    inRange = dateObject.isSameOrBefore(moment(maxDate));
  }
  return inRange;
}

export function isValidFormatDate(dateString: string, minDate?: Date, maxDate?: Date, disabledDays?: any, disabledDates?: any, disabledRanges?: any) {
  if (!dateString) {
    return false;
  }
  let inRange = true;
  let dateObject = moment(dateString, DATE_FORMAT);
  if (minDate && maxDate) {
    inRange =
      dateObject.isSameOrBefore(moment(maxDate)) &&
      dateObject.isSameOrAfter(moment(minDate));
  } else if (minDate) {
    inRange = dateObject.isSameOrAfter(moment(minDate));
  } else if (maxDate) {
    inRange = dateObject.isSameOrBefore(moment(maxDate));
  }
  return moment(dateString, DATE_FORMAT, true).isValid() && inRange && !isDayExcluded(dateString, { disabledDates, disabledDays, disabledRanges })
}

export function isValidInput(
  dateString: string,
  rangeConnecterFormat?: string,
  selectedRange: boolean = false
) {
  if (selectedRange) {
    let [valueFrom, valueTo] = dateString.split(rangeConnecterFormat || 'to');
    valueFrom = valueFrom ? valueFrom.replace(/(\s*$)/g, "") : "";
    valueTo = valueTo ? valueTo.replace(/(^\s*)/g, "") : "";
    if (!moment(valueFrom, DATE_FORMAT, true).isValid() || !moment(valueTo, DATE_FORMAT, true).isValid()) {
      return null;
    } else {
      return {
        valid: true,
        value: [moment(valueFrom, DATE_FORMAT, true), moment(valueTo, DATE_FORMAT, true)]
      }
    }
  } else {
    if (moment(dateString, DATE_FORMAT).isValid()) {
      return {
        valid: true,
        value: moment(dateString, DATE_FORMAT)
      }
    } else {
      return null;
    }
  }
}

export function isValidFormatRangeDate(
  dateString: string,
  minDate?: Date,
  maxDate?: Date,
  disabledDays?: Array<number>,
  disabledDates?: Array<Date>,
  disabledRanges?: Array<[Date, Date]>,
  rangeConnecterFormat?: string,
  selectedRange: boolean = false
) {
  if (selectedRange) {
    let [valueFrom, valueTo] = dateString.split(rangeConnecterFormat || 'to');
    valueFrom = valueFrom ? valueFrom.replace(/(\s*$)/g, "") : "";
    valueTo = valueTo ? valueTo.replace(/(^\s*)/g, "") : "";
    if (!moment(valueFrom, DATE_FORMAT, true).isValid() || !moment(valueTo, DATE_FORMAT, true).isValid()) return false
    let temp = moment(valueFrom, DATE_FORMAT).format(DATE_FORMAT);
    let dateList = [temp];
    let count = 0;
    while (!moment(temp, DATE_FORMAT).isSame(moment(valueTo, DATE_FORMAT)) && count < 9999) {
      temp = moment(temp, DATE_FORMAT).add(1, 'day').format(DATE_FORMAT);
      dateList.push(temp);
      count++;
    }
    return !dateList.some((value) => {
      return !isInRange(value, minDate, maxDate) || isDayExcluded(value, { disabledDates, disabledDays, disabledRanges })
    })
  } else {
    let value = dateString;
    if (!moment(value, DATE_FORMAT, true).isValid()) return false;
    return isInRange(value, minDate, maxDate) && !isDayExcluded(value, { disabledDates, disabledDays, disabledRanges })
  }
}
export function isDayExcluded(day: any, { disabledDates, disabledDays, disabledRanges }: any = {}) {
  let isInDisabledDates = disabledDates ?
    disabledDates.some((excludeDate: any) => isSame(day, excludeDate)) : false;
  let isIndisabledRanges = false;
  if(disabledRanges) {
    for(let range of disabledRanges) {
      if(moment(day, DATE_FORMAT).isSameOrAfter(moment(range[0]),'day') && moment(day, DATE_FORMAT).isSameOrBefore(moment(range[1]),'day')) {
        isIndisabledRanges = true;
        break;
      }
    }
  }
  let isInDisabledDays = disabledDays ? disabledDays.indexOf(moment(day, DATE_FORMAT).weekday()) !== -1 : false;
  return isInDisabledDates || isInDisabledDays || isIndisabledRanges;
}

function addSlashToDateText(value: string): string {
  if (value.length === 2) {
    // if ((value.charAt(0) === '1' && value.charAt(1) > '2') || (value.charAt(0) === '0' && value.charAt(1) === '0')) {
    //   value = value.replace(/([\d])([\d])/, '$1');
    // } else {
    value = value.replace(/([\d])([\d])/, '$1$2/');
    // }
  } else if (value.length === 3) {
    // if (value.charAt(2) > '3') {
    //   value = value.replace(/([\d])([\d])([\d])/, '$1$2/');
    // } else {
    value = value.replace(/([\d])([\d])([\d])/, '$1$2/$3');
    // }
  } else if (value.length === 4) {
    // if ((value.charAt(2) === '0' && value.charAt(3) === '0') || (value.charAt(2) === '3' && value.charAt(3) > '1')) {
    //   value = value.replace(/([\d])([\d])([\d])([\d])/, '$1$2/$3');
    // } else {
    value = value.replace(/([\d])([\d])([\d])([\d])/, '$1$2/$3$4/');
    // }
  } else if (value.length > 8) {
    value = value.replace(/([\d])([\d])([\d])([\d])/, '$1$2/$3$4/').substring(0, 10);
  } else {
    value = value.replace(/([\d])([\d])([\d])([\d])/, '$1$2/$3$4/');
  }
  return value;
}

export function onDatepickerInputChange(event: any, isRangePicker?: boolean, dpRangeConnecterFormat: string = 'to') {
  let value: string = event.target.value;
  if (!isRangePicker) {
    value = value.replace(/[^\d]/g, '');
    if (event.nativeEvent.inputType === 'deleteContentBackward' && !event.target.value.endsWith('/') && event.target.value.length < 7) {
      value = value.substring(0, value.length - 1);
    }
    value = addSlashToDateText(value);
  } else {
    const connecterLength = dpRangeConnecterFormat.length;
    value = value.replace(/[^\d]/g, '');
    if (event.nativeEvent.inputType === 'deleteContentBackward') {
      if (!event.target.value.endsWith('/') && (event.target.value.length < 7 || event.target.value.length > connecterLength + 13 && event.target.value.length < connecterLength + 19)) {
        value = value.substring(0, value.length - 1);
      }
    }
    if (value.length < 9) {
      value = addSlashToDateText(value);
    } else {
      let valueArr = [value.substring(0, 8), value.substring(8)];
      value = `${addSlashToDateText(valueArr[0])} ${dpRangeConnecterFormat} ${addSlashToDateText(valueArr[1])}`;
    }
  }
  event.target.value = value;


  return value

}
