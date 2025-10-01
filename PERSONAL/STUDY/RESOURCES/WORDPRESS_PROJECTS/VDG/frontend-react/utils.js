import moment from 'moment';
import 'moment/locale/nl';
import resolvePath from 'object-resolve-path';

import strings from './data/strings.json';

import COLORS from './data/colours.json';
import ENV_COLORS from './src/configs/breakpoints.json';

/* * * * * * * *
 * ENVIRONMENT *
** * * * * * * */
export function getEnvironment () {
    if (window.location.href.includes('talnet.nl')) {
        return 'production';
    }

    if (window.location.href.includes('talneta.nl')) {
        return 'staging';
    }

    if (window.location.href.includes('localhost')) {
        return 'local';
    }

    return process.env.REACT_APP_FLEXX_ENV;
}

const ENABLE_STUDYROUTE_DEFAULT = !!parseInt(process.env.REACT_APP_FLEXX_ENABLE_STUDYROUTE, 10);
const ENABLE_STUDYROUTE_STAGING = !!parseInt(process.env.REACT_APP_FLEXX_ENABLE_STUDYROUTE_STAGING, 10);
const ENABLE_STUDYROUTE_LOCAL = !!parseInt(process.env.REACT_APP_FLEXX_ENABLE_STUDYROUTE_LOCAL, 10);
const ENVIRONMENT = getEnvironment();

export const ENABLE_STUDYROUTE = (ENVIRONMENT === 'staging' && ENABLE_STUDYROUTE_STAGING) ||
    (ENVIRONMENT === 'local' && ENABLE_STUDYROUTE_LOCAL) ||
        ENABLE_STUDYROUTE_DEFAULT;

/* * * * * * * * * * * * * * *
 * DATE STRINGS TRANSFORMERS *
** * * * * * * * * * * * * * */
export function dateToDateString (date = new Date()) {
    date = !moment.isMoment(date) ? moment(date) : date;
    return date.format('YYYY-MM-DD');
}

export function dateToRelativeDateString (date = new Date()) {
    date = !moment.isMoment(date) ? moment(date) : date;

    const today = moment();

    if (date.isSame(today, 'day')) {
        return date.fromNow();
    }

    const yesterday = moment().subtract(1, 'day');

    if (date.isSame(yesterday, 'day')) {
        return date.format('[gisteren om] HH:mm [uur]');
    }

    return date.format('D MMMM [om] HH:mm [uur]')
}

/* * * * * * * * * * * * * * * * * *
 * CSS VARIABLES ON DOCUMENT LEVEL *
** * * * * * * * * * * * * * * * * */
const root = document.documentElement;
export function setCssVariable (name, value) {
    root.style.setProperty(`--${name}`, value);
}

export function getCssVariable (name) {
    return getComputedStyle(root).getPropertyValue(`--${name}`);
}

/* * * * * * * * * * *
 * CAMALIZE STRINGS  *
** * * * * * * * * * */
export function camalize (str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/* * * * * * * * * * * * * * * * * * * *
 * GET COURSE NAME FROM COURSE OBJECT  *
** * * * * * * * * * * * * * * * * * * */
export function refineCourseName (course = {}) {
    const { index, subject = '', name = '' } = course;

    let courseName = name || subject;
    let courseIndex = index;
    let cleanName = name;

    const regex = /-*0*(\d+[A-Z]?)$/g; // regex to get index from courseName
    const matches = name.matchAll(regex);
    const indexMatch = [ ...matches ][0];

    // try to extract index and coursename from name field
    if (indexMatch !== undefined) {
        const strIndex = indexMatch.index;
        courseName = name.substring(0, strIndex);
        courseIndex = indexMatch[1];
        cleanName = `${courseName} ${courseIndex}`;
    }

    return {
        ...course,
        courseName,
        courseIndex,
        cleanName,
    };
}

/* * * * * * *
 * GET COPY  *
** * * * * * */
// get strings by key from data/strings.json
// including string replacements
export function getCopy (path, replacements = {}, source = strings) {
    path = path.replace(/\s+/g, '');

    let string = resolvePath(source, path) || '';

    const keys = Object.keys(replacements);
    keys.forEach((key) => {
        const re = new RegExp(`{${key}}`, 'g');
        const value = replacements[key];
        string = string.replace(re, value);
    });

    return string;
}

export function getAttendanceEduarteUrl (role, studentId, mode = 'view') {
    return getCopy(`eduarteAttendance.${role}.${mode}`, { studentId });
}

export function getCalendarEduarteUrl (studentId) {
    return getCopy(`eduarteCalendar.url`, { studentId });
}

/* * * * * * * * * * * * * * * * *
 * GET CORRECT ENVIRONMENT COLOR *
** * * * * * * * * * * * * * * * */
export function getColor (key, environment = 'STUDENT', fallback = '#000000') {
    if (COLORS[key]) {
        return COLORS[key];
    }

    const envColors = {
        ...ENV_COLORS._DEFAULT_,
        ...ENV_COLORS[environment]
    };

    const validKeys = Object.keys(envColors);

    if (!validKeys.includes(key)) {
        return fallback;
    }

    return COLORS[envColors[key]];
};

/**
 * A function to look at the dom and find the footer element and return it.
 */
export function hideFooterElement () {
   const footer =  document.querySelector('footer');

   if (footer) footer.style.display = 'none';
}

