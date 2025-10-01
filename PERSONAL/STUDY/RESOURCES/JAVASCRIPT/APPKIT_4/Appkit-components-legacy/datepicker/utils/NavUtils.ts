import { isInSameViewPage, startOf } from "./dateUtils";
import moment from "moment";

export function getKeyTable(e:any) {
  //mac support
  const isTab = e.key === "Tab";
  const isDown = e.key === "ArrowDown";
  const isUp = e.key === "ArrowUp";
  const isLeft = e.key === "ArrowLeft";
  const isRight = e.key === "ArrowRight";
  const isEnter = e.key === "Enter";
  const isDirection = isDown || isUp || isLeft || isRight;
  const isEsc = e.key === "Escape";
  const isShift = e.shiftKey;
  const isctrl = e.ctrlKey;
  const isBackspace = e.key === "Backspace";
  //from github mousetrap
  const isCmd = /Mac|iPod|iPhone|iPad/.test(navigator.platform) && e.metaKey;
  const isChar =
    (e.keyCode >= 65 && e.keyCode <= 90) ||
    (e.keyCode >= 48 && e.keyCode <= 57) ||
    (e.keyCode >= 96 && e.keyCode <= 107) ||
    (e.keyCode >= 109 && e.keyCode <= 111) ||
    (e.keyCode >= 186 && e.keyCode <= 191) ||
    (e.keyCode === 37 || e.keyCode === 39);
  const isSpace = e.keyCode === 32;

  return {
    isSpace,
    isBackspace,
    isChar,
    isTab,
    isDown,
    isUp,
    isLeft,
    isRight,
    isEnter,
    isDirection,
    isEsc,
    isShift,
    isctrl,
    isCmd
  };
}

export const TIME_PANEL = "time_panel";
export const CALENDAR_PANEL = "calendar_panel";
export const MONTH_BUTTON = "month_button";
export const YEAR_BUTTON = "year_button";
export const PREV_BUTTON = "prev_button";
export const NEXT_BUTTON = "next_button";
export const YEAR_VIEW_YEAR_BUTTON = "year_view_year_button";

export function getNextTabItem(tabOrders:any, current:any, e:any) {
  let index = tabOrders.indexOf(current);
  if (e.shiftKey) {
    index--;
  } else {
    index++;
  }

  //boundry checking
  index = index >= tabOrders.length ? 0 : index;
  index = index < 0 ? tabOrders.length - 1 : index;
  return tabOrders[index];
}

export const TIME_HOUR = "time_panel_hour";
export const TIME_MINUTE = "time_panel_minute";
export const TIME_AM_PM = "time_panel_am_pm";
export const TIME_TABS_ORDERS = [TIME_HOUR, TIME_MINUTE, TIME_AM_PM];

export const TIME_MODE_TOTAL = "TIME_MODE_TOTAL";
export const TIME_MODE_HOUR = "TIME_MODE_HOUR";
export const TIME_MODE_MINUTE = "TIME_MODE_MINUTE";

export function checkTabForInline(
  showInPicker:any,
  e:any,
  tabOrders:any,
  keyboardControlArea:any
) {
  const isTab = e.key === "Tab";
  const isShift = e.shiftKey;

  if (isTab && !showInPicker) {
    const tindex = tabOrders.indexOf(keyboardControlArea);
    const goToNextComponent = tindex === tabOrders.length - 1 && !isShift;
    const toToPrevComponent = tindex <= 0 && isShift;

    if (goToNextComponent || toToPrevComponent) {
      return true;
    }
  }
  return false;
}

export function getBeginValueForKeyboardHover(value:any, activeStartDate:any, view:any) {
  let beginValue;
  if (value instanceof Date && isInSameViewPage(activeStartDate, value, view)) {
    beginValue = value;
  } else if (value && value.length >= 1) {
    if (isInSameViewPage(activeStartDate, value[0], view)) {
      beginValue = value[0];
    } else if (isInSameViewPage(activeStartDate, value[1], view)) {
      beginValue = value[1];
    }
  }

  //truncate
  if (beginValue) {
    if (view === "year") {
      beginValue = startOf("month", beginValue);
    } else if (view === "decade") {
      beginValue = startOf("year", beginValue);
    }
    beginValue = moment(beginValue).toDate();
  }
  return beginValue;
}
