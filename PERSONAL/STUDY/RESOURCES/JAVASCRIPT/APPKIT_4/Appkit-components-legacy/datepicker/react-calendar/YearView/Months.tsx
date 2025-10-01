import React, { PureComponent } from 'react';
import TileGroup from '../TileGroup';
import Month from './Month';
import { getYear, getFullDate } from '../shared/dates';

type MonthsPropsType = {
  activeStartDate?: any,
}
export default class Months extends PureComponent<MonthsPropsType> {
  start = 0

  end = 11

  get year() {

    const { activeStartDate } = this.props;
    return getYear(activeStartDate);
  }

  render() {
    const { activeStartDate } = this.props;
    return (
      <TileGroup
        {...this.props}
        activeStartDate={activeStartDate}
        containerClassName="react-calendar__year-view__months"
        dateTransform={(monthIndex: any) => getFullDate(this.year, monthIndex, 1)}
        dateType="month"
        end={this.end}
        start={this.start}
        tile={Month}
      />
    );
  }
}

