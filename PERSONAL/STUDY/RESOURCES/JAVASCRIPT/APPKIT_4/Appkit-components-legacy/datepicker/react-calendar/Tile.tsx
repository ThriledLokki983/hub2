import React, { PureComponent } from 'react';
import ClassNames from 'classnames';
type TilePropsType = {
  activeStartDate?: any,
  classes?: any,
  date?: any,
  locale?: string,
  maxDate?: any,
  minDate?: any,
  onClick?: Function,
  onMouseOver?: Function
  style?: any,
  tileClassName?: any,
  tileContent?: any,
  tileDisabled?: any,
  disabledDates?: any,
  children?: any,
  formatAbbr?: any,
  maxDateTransform?: any,
  minDateTransform?: any,
  view?: any,
  tabIndex?: number
}

export default class Tile extends PureComponent<TilePropsType> {
  tileRef: any;
  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const {
      date,
      tileClassName,
      tileContent,
      view,
    } = nextProps;

    const nextState: any = {};

    if (tileClassName !== prevState.tileClassNameProps) {
      nextState.tileClassName = typeof tileClassName === 'function' ? tileClassName({ date, view }) : tileClassName;
      nextState.tileClassNameProps = tileClassName;
    }

    if (tileContent !== prevState.tileContentProps) {
      nextState.tileContent = typeof tileContent === 'function' ? tileContent({ date, view }) : tileContent;
      nextState.tileContentProps = tileContent;
    }

    return nextState;
  }

  state: any = {};


  render() {
    const {
      activeStartDate,
      children,
      classes,
      date,
      formatAbbr,
      locale,
      maxDate,
      maxDateTransform,
      minDate,
      minDateTransform,
      onClick,
      onMouseOver,
      style,
      tileDisabled,
      view,
      tabIndex
    } = this.props;
    const { tileClassName, tileContent } = this.state;
    if (tabIndex === 0) {
      setTimeout(() => {
        this.tileRef && this.tileRef.focus();
      }, 0)
    }
    //disable only for month-day
    let disabled = false;
    if (view === "month") {
      disabled = (minDate && minDateTransform(minDate) > date)
        || (maxDate && maxDateTransform(maxDate) < date)
        || (tileDisabled === true)
        || (tileDisabled && tileDisabled({ activeStartDate, date, view }));
    }

    if (view === "year") {
      disabled =
        (minDate && minDateTransform(minDate) > date) ||
        (maxDate && maxDateTransform(maxDate) < date) ||
        tileDisabled === true ||
        (tileDisabled && tileDisabled({ activeStartDate, date, view }));
    }

    const content = formatAbbr ?
      (<abbr aria-label={formatAbbr(locale, date)}> {children} </abbr>) : children;

    return (
      <button
        className={ClassNames(classes, tileClassName, { 'r-c-single-day--excluded': disabled })}
        disabled={disabled}
        onClick={onClick && (() => onClick(date))}
        onMouseOver={onMouseOver && (() => onMouseOver(date))}
        onFocus={onMouseOver && (() => onMouseOver(date))}
        style={style}
        type="button"
        tabIndex={tabIndex}
        ref={(ref: any) => (this.tileRef = ref)}
      >
        {content}
        {tileContent}
      </button>
    );
  }
}
