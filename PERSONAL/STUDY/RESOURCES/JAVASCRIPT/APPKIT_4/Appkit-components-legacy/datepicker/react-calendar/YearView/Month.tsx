import React from 'react';

import Tile from '../Tile';

import {
  getBeginOfMonth,
  getEndOfMonth,
} from '../shared/dates';
import {
  formatMonth as defaultFormatMonth,
  formatMonthYear,
} from '../shared/dateFormatter';

const className = 'r-c-single-month';

const Month = ({
  classes,
  date,
  formatMonth = defaultFormatMonth,
  locale,
  ...otherProps
}: any) => (
  <Tile
    {...otherProps}
    classes={[...classes, className]}
    date={date}
    formatAbbr={formatMonthYear}
    locale={locale}
    maxDateTransform={getEndOfMonth}
    minDateTransform={getBeginOfMonth}
    view="year"
  >
    {formatMonth(locale, date)}
  </Tile>
);

export default Month;
