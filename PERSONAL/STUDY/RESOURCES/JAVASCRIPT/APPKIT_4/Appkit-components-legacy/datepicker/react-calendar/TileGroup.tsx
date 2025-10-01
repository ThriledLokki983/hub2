import React from 'react';
import { getTileClasses } from './shared/utils';
import moment from 'moment';
import { DATE_FORMAT } from '../utils/constants'
type TileGroupPropsType = {
  containerClassName?: any,
  count?: any,
  dateTransform?: any,
  dateType?: any,
  end?: any,
  hover?: any,
  offset?: any,
  start?: any,
  step?: any,
  tile?: any,
  value?: any,
  valueType?: any,
  keyboardNavDate?: any,
  selectRange?: any,
  showOtherMonths?: any,
  currentMonthIndex?: any,
  onClick?: any,
  activeStartDate?: any
}
const TileGroup = ({
  containerClassName,
  count = 3,
  dateTransform,
  dateType,
  end,
  hover,
  offset,
  start,
  step = 1,
  tile: Tile,
  value,
  valueType,
  keyboardNavDate,
  selectRange,
  activeStartDate,
  ...tileProps
}: TileGroupPropsType) => {
  const tiles = [];
  for (let point = start; point <= end; point += step) {
    const date = dateTransform(point);
    const startDate = dateTransform(start);
    const endDate = dateTransform(end);
    const isFocusable = moment(date, DATE_FORMAT).isSame(moment(keyboardNavDate, DATE_FORMAT), dateType);
    tiles.push(
      <Tile
        classes={getTileClasses({
          selectRange, value, valueType, date, dateType, hover, keyboardNavDate, startDate, endDate
        })}
        value={value}
        date={date}
        point={point}
        key={point}
        tabIndex={isFocusable ? 0 : -1}
        {...tileProps}
      />,
    );
  }

  return (
    <div className={containerClassName}
    >
      {tiles}
    </div>
  );
};

export default TileGroup;
