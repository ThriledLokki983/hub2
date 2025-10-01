import React from 'react';
import Tile from '../Tile';
import { getBeginOfYear, getEndOfYear } from '../shared/dates';

const className = 'r-c-single-year';

const Year = ({ classes, point, ...otherProps }: any) => (
  <Tile
    {...otherProps}
    classes={[...classes, className]}
    maxDateTransform={getEndOfYear}
    minDateTransform={getBeginOfYear}
    view="decade"
  >
    {point}
  </Tile>
);

export default Year;
