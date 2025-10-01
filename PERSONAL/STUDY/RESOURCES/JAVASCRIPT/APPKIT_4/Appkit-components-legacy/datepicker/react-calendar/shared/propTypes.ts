import PropTypes from 'prop-types';

const calendarTypes = ['ISO 8601', 'US', 'Arabic', 'Hebrew'];
const allViews = ['century', 'decade', 'year', 'month'];

export const isCalendarType = PropTypes.oneOf(calendarTypes);

function getFrom(propName:any, obj:any, componentName:any){
  return `Invalid prop \`${propName}\` of type \`${typeof obj}\` supplied to \`${componentName}\`.`;
}

export const isMinDate = (props:any, propName:any, componentName:any) => {
  const { [propName]: minDate } = props;

  if (minDate) {
    if (!(minDate instanceof Date)) {
      return new Error(`${getFrom(propName, minDate, componentName)} expected instance of \`Date\`.`);
    }

    const { maxDate } = props;

    if (maxDate && minDate > maxDate) {
      return new Error(`${getFrom(propName, minDate, componentName)} minDate cannot be larger than maxDate.`);
    }
  }

  // Everything is fine
  return null;
};

export const isMaxDate = (props:any, propName:any, componentName:any) => {
  const { [propName]: maxDate } = props;

  if (maxDate) {
    if (!(maxDate instanceof Date)) {
      return new Error(`${getFrom(propName, maxDate, componentName)} expected instance of \`Date\`.`);
    }

    const { minDate } = props;

    if (minDate && maxDate < minDate) {
      return new Error(`${getFrom(propName, maxDate, componentName)} maxDate cannot be smaller than minDate.`);
    }
  }

  // Everything is fine
  return null;
};

export const isValue = PropTypes.oneOfType([
  PropTypes.instanceOf(Date),
  PropTypes.arrayOf(PropTypes.instanceOf(Date)),
]);

export const isViews = PropTypes.arrayOf(PropTypes.oneOf(allViews));

export const isClassName = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
]);

export const isView = (props:any, propName:any, componentName:any) => {
  const { [propName]: view } = props;
  const { views } = props;

  const allowedViews = views || allViews;

  if (allowedViews.indexOf(view) === -1) {
    return new Error(`${getFrom(propName, view, componentName)} expected one of [${['a', 'b', 'c', 'd', 'e'].map(a => `"${a}"`).join(', ')}].`);
  }

  // Everything is fine
  return null;
};

isView.isRequired = (props:any, propName:any, componentName:any) => {
  const { [propName]: view } = props;

  if (!view) {
    return new Error(`The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`${view}\`.`);
  }

  return isView(props, propName, componentName);
};

export const tileGroupProps = {
  activeStartDate: PropTypes.instanceOf(Date).isRequired,
  hover: PropTypes.instanceOf(Date),
  locale: PropTypes.string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  tileClassName: PropTypes.oneOfType([
    PropTypes.func,
    isClassName,
  ]),
  tileContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  value: isValue,
  valueType: PropTypes.string,
  formatMonth: PropTypes.func
};

export const tileProps = {
  activeStartDate: PropTypes.instanceOf(Date).isRequired,
  classes: PropTypes.arrayOf(PropTypes.string).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  tileClassName: PropTypes.oneOfType([
    PropTypes.func,
    isClassName,
  ]),
  tileContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  tileDisabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  disabledDates: PropTypes.array,
};
