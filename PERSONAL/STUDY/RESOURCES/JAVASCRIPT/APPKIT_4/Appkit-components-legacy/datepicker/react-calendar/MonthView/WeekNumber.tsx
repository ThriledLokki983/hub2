import React, { PureComponent } from 'react';

type WeekNumberPropsType = {
  date: any,
  onClickWeekNumber?: Function,
  weekNumber: any,
}
class WeekNumber extends PureComponent<WeekNumberPropsType> {
  render() {
    const {
      date,
      onClickWeekNumber,
      weekNumber,
    } = this.props;

    if (onClickWeekNumber) {
      return (
        <button
          className="r-c-tile r-c-tile-week-number"
          onClick={() => onClickWeekNumber(weekNumber, date)}
          type="button"
          tabIndex={-1}
        >
          <span>
            {weekNumber}
          </span>
        </button>)
    } else {
      return (
        <div className="r-c-tile r-c-tile-week-number">
          <span>
            {weekNumber}
          </span>
        </div>)
    }
  }
}

export default WeekNumber;
