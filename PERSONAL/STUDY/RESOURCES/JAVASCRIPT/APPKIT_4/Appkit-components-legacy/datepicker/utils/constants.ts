import moment from 'moment';
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const MONTHTABLE = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};

const WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DATETABLE_CONSTANT = {
  NUMS_OF_COLUMNS: 7,
  NUMS_OF_ROWS: 6
};

const DAYS_IN_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

const HOURS = [
  '12',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11'
];

const MINUTES = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55'
];

const RANGE_SCALES = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  LAST_7_DAYS: 'Last 7 days',
  LAST_30_DAYS: 'Last 30 days',
  THIS_MONTH: 'This month',
  LAST_MONTH: 'Last month',
  CUSTOM_RANGE: 'Custom range'
}

const DATE_FORMAT = "MM/DD/YYYY";

const CALENDAR_POSITION = {
  LEFT:0,
  RIGHT:1
}

const DEFAULT_RANGE_MENU = [{
  name: RANGE_SCALES.TODAY,
  dates: [new Date(), new Date()]
},
{
  name: RANGE_SCALES.YESTERDAY,
  dates: [moment().subtract(1, 'day').toDate(),moment().subtract(1, 'day').toDate()]
},
{
  name: RANGE_SCALES.LAST_7_DAYS,
  dates: [moment().subtract(7, 'day').toDate(),moment().toDate() ]
},
{
  name: RANGE_SCALES.LAST_30_DAYS,
  dates: [moment().subtract(30, 'day').toDate(),moment().toDate() ]
},
{
  name: RANGE_SCALES.THIS_MONTH,
  dates: [ moment().startOf('month').toDate(),moment().endOf('month').toDate()]
},
{
  name: RANGE_SCALES.LAST_MONTH,
  dates: [moment().subtract(1, 'month').startOf('month').toDate(),moment().subtract(1, 'month').endOf('month').toDate(),]
}
]

export {
  CALENDAR_POSITION,
  MONTHS,
  WEEKS,
  DATETABLE_CONSTANT,
  DAYS_IN_WEEK,
  MONTHTABLE,
  HOURS,
  RANGE_SCALES,
  MINUTES,
  DATE_FORMAT,
  DEFAULT_RANGE_MENU
};
