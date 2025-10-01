import React, { PureComponent } from 'react';
import TileGroup from '../TileGroup';
import Year from './Year';
import moment from 'moment';
import { getFullDate } from '../shared/dates';

type YearsPropsType = {
  activeStartDate?: any,
  className?: any
}

export default class Years extends PureComponent<YearsPropsType> {
  get start() {
    const { activeStartDate } = this.props;
    return moment(activeStartDate).year() + 1;
  }

  get end() {
    return this.start + 11;
  }

  render() {
    return (
      <TileGroup
        {...this.props}
        containerClassName="react-calendar__decade-view__years"
        dateTransform={(year: any) => getFullDate(year, 0, 1)}
        dateType="year"
        end={this.end}
        start={this.start}
        tile={Year}
      />
    );
  }
}

