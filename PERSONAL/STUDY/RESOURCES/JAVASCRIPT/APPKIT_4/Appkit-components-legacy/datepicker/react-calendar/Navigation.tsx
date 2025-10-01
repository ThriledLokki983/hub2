import React, { PureComponent } from 'react';
import ClassNames from 'classnames';
import {
  getCenturyLabel,
  getBeginNext,
  getBeginPrevious,
  getYear,
} from './shared/dates';
import { formatMonthYear as defaultFormatMonthYear } from './shared/dateFormatter';
import {
  PREV_BUTTON,
  NEXT_BUTTON,
  MONTH_BUTTON,
  YEAR_BUTTON,
  YEAR_VIEW_YEAR_BUTTON
} from "../utils/NavUtils";
import moment from 'moment';

type NavigationPropsType = {
  activeStartDate?: any,
  drillUp: any,
  formatMonthYear?: Function,
  locale?: string,
  navigationLayoutMode?: string,
  navigationLabel?: Function,
  setActiveStartDate: any,
  view: any,
  views: any,
  prevButtonDisabled: boolean,
  nextButtonDisabled: boolean,
  keyboardControlArea?: string,
  onActiveDateChangeNoDir: any,
  siblingNode: any,
  disabled?: boolean,
  showNavigationPrevNextBtn?: boolean,
  middleDisabled: any,
  activeRange: any,
  maxDate: any,
  minDate: any,
  nextLabel: any,
  _isInDoubleCalendar: any,
  prevLabel: any
}
export default class Navigation extends PureComponent<NavigationPropsType> {
  buttonRefMap: any = new Map();

  static defaultProps = {
    navigationLayoutMode: "default"
  }

  onClickPrevious = () => {
    const { siblingNode, activeStartDate: date, view, setActiveStartDate, onActiveDateChangeNoDir, _isInDoubleCalendar } = this.props;
    if (_isInDoubleCalendar) {
      if (view === 'decade') {
        //Caution: date is the date of right panel, so the calculation of left panel will
        //need extra 12 year to consider.
        //the onActiveDateChangeNoDir will set the state 
        //activeStartDateLeft,activeStartDateRight in DoubleCalendar.jsx
        onActiveDateChangeNoDir && onActiveDateChangeNoDir(moment(date).subtract(24, 'year').toDate(), view, 'activeStartDateLeft');
        onActiveDateChangeNoDir && onActiveDateChangeNoDir(moment(date).subtract(12, 'year').toDate(), view, 'activeStartDateRight');
        return;
      }
      siblingNode.setActiveStartDate(getBeginPrevious(view, moment(date).subtract(1, 'month').toDate()))
    }
    setActiveStartDate(getBeginPrevious(view, date));
  }

  onClickNext = () => {
    const { siblingNode, activeStartDate: date, view, setActiveStartDate, onActiveDateChangeNoDir, _isInDoubleCalendar } = this.props;
    //date is the date of right panel 
    if (_isInDoubleCalendar) {
      if (view === 'decade') {
        onActiveDateChangeNoDir(moment(date).toDate(), view, 'activeStartDateLeft');
        onActiveDateChangeNoDir(moment(date).add(12, 'year').toDate(), view, 'activeStartDateRight');
        return;
      }
      siblingNode.setActiveStartDate(getBeginPrevious(view, moment(date).add(1, 'month').toDate()))
    }
    setActiveStartDate(getBeginNext(view, date));
  }

  get label() {
    let {
      activeStartDate: date, locale, view,
    } = this.props;
    if (!date) date = new Date();
    switch (view) {
      case 'century':
        return getCenturyLabel(date);
      case 'decade':
        return "Select a year";
      case 'year':
        return getYear(date);
      case 'month':
        return defaultFormatMonthYear(locale, date);
      default:
        throw new Error(`Invalid view: ${view}.`);
    }
  }

  render() {
    const { label } = this;
    let {
      activeStartDate: date,
      drillUp,
      navigationLabel,
      navigationLayoutMode,
      keyboardControlArea,
      view,
      disabled,
      showNavigationPrevNextBtn
    } = this.props;
    if (!date) date = new Date();
    const className = "r-c-nav-bar";
    //this.buttonRefMap.get(MONTH_BUTTON) && this.buttonRefMap.get(MONTH_BUTTON).focus();
    const prevCn = ClassNames("r-c-nav-prev-button Appkit4-icon icon-left-chevron-outline");
    setTimeout(() => {
      if (this.buttonRefMap.get(keyboardControlArea)) {
        this.buttonRefMap.get(keyboardControlArea).focus();
      }
    }, 0)

    const prevButton = (
      <div
        tabIndex={0}
        ref={(ref: any) => (this.buttonRefMap.set(PREV_BUTTON, ref))}
        className={prevCn}
        onClick={this.onClickPrevious}
      />);

    const nextCn = ClassNames("r-c-nav-next-button Appkit4-icon icon-right-chevron-outline");

    const nextButton = (
      <div
        tabIndex={0}
        ref={(ref: any) => (this.buttonRefMap.set(NEXT_BUTTON, ref))}
        className={nextCn}
        onClick={this.onClickNext}
      />
    );

    const wrapperCn = ClassNames("a-center-button-wrapper", navigationLayoutMode);
    const centerCn = ClassNames({
      "a-center-button": !(label instanceof Array),
      "a-center-button-group": (label instanceof Array)
    });

    const centerMonthCn = ClassNames('ap-center-button-month')
    const centerYearCn = ClassNames('ap-center-button-year')
    const target = 0;//0 :decadeView, 1:yearView, 2:monthView
    const centerButton =
      <div className={wrapperCn}>
        {(label instanceof Array) ? <div
          className={centerCn}
        >
          <div tabIndex={0} ref={(ref: any) => (this.buttonRefMap.set(MONTH_BUTTON, ref))} className={centerMonthCn} onClick={disabled ? undefined : drillUp}>{label[1]}</div>
          <div tabIndex={0} ref={(ref: any) => (this.buttonRefMap.set(YEAR_BUTTON, ref))} className={centerYearCn} onClick={disabled ? undefined : (event) => drillUp(event, target)}>{label[0]}</div>
        </div >
          :
          <div
            className={centerCn}
            tabIndex={0}
            onClick={disabled ? undefined : drillUp}
            ref={(ref: any) => (this.buttonRefMap.set(YEAR_VIEW_YEAR_BUTTON, ref))}
          >
            {navigationLabel ? navigationLabel({ date, view, label }) : label}
          </div>
        }
      </div>;

    return (
      <div
        className={className}
      >
        {centerButton}
        {showNavigationPrevNextBtn && <div className="ap-nav-button-wrapper">
          {prevButton}
          {nextButton}
        </div>}
      </div>);
  }
}

