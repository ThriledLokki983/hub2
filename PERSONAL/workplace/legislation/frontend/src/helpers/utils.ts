/* eslint-disable space-infix-ops, no-bitwise, no-mixed-operators */
// noinspection JSUnusedGlobalSymbols

import React, { FormEvent } from 'react';
import DOMPurify from 'dompurify';
import { parseJson } from '@grrr/utils';
import { parseDate } from '@internationalized/date';

import { CssBreakPointsInterface } from 'configs/interfaces';
import { PATH_NOT_FOUND } from 'configs/paths';
import { matchPath } from 'react-router-dom';
import { Filter, FilterOption, Legislation, Requirement } from 'hooks/interfaces/legislation.interface';
import { SELECT_ALL_FILTER_KEY } from 'configs/legislation/legislation';

/**
 * Convert to integer.
 */
export const int = (value: string) => parseInt(value, 10);

/**
 * Arrow key identifiers.
 */
export const isLeftKey = (e: React.KeyboardEvent<HTMLButtonElement | MouseEvent>) =>
  (e.key && e.key === 'ArrowLeft');
export const isUpKey = (e: React.KeyboardEvent<HTMLButtonElement>) =>
  (e.key && e.key === 'ArrowUp');
export const isRightKey = (e: React.KeyboardEvent<HTMLButtonElement>) =>
  (e.key && e.key === 'ArrowRight');
export const isDownKey = (e: React.KeyboardEvent<HTMLButtonElement>) =>
  (e.key && e.key === 'ArrowDown');

export const isSpaceKey = (e: React.KeyboardEvent<HTMLButtonElement>) =>
  (e.key && e.key === ' ');
export const isEnterKey = (e: React.KeyboardEvent<HTMLButtonElement>) =>
  (e.key && e.key === 'Enter');
export const isEscapeKey = (e: React.KeyboardEvent<HTMLButtonElement>) =>
  (e.key && e.key === 'Escape');

/**
 * Sanitize HTML content.
 */
export const sanitize = (value: string) => DOMPurify.sanitize(value);

/**
 * New line to breaks (equal to `nl2br` in PHP).
 */
export const nl2br = (value: any) => {
  const sanitized = sanitize(value);
  return sanitized?.replace(/[\r\n]+/g, '<br/>');
};

/**
 * Highlight string matches in search queries.
 */
export const highlight = (content: any, query: any) => {
  if (!query) {
    return content;
  }
  const regex = new RegExp(query.split(' ').join('|'), 'ig');
  const sanitized = sanitize(content);
  return sanitized.replace(regex, '<mark>$&</mark>');
};

/**
 * Clamp numbers.
 */
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Check if number is even or odd.
 */
export const isEven = (value: number) => value % 2 === 0;
export const isOdd = (value: number) => Math.abs(value % 2) === 1;

/**
 * Basic sessionStorage and localStorage helpers.
 */
export const store = (key: string, value: string | boolean | object, { permanent = false } = {}) => {
  if (!key) {
    return;
  }
  const storage = permanent ? localStorage : sessionStorage;
  storage.setItem(key, JSON.stringify(value));
};
export const restore = (key: string, { permanent = false } = {}) => {
  const storage = permanent ? localStorage : sessionStorage;
  return parseJson(storage.getItem(key));
};
export const remove = (key: string, { permanent = false } = {}) => {
  const storage = permanent ? localStorage : sessionStorage;
  storage.removeItem(key);
};

/**
 * Scroll to top.
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    behavior: behavior,
  });
};

/**
 * Set input value, which is a bit different in React.
 * See: https://stackoverflow.com/a/46012210
 */
export const setReactInputValue = (input: HTMLInputElement, value: string) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  nativeInputValueSetter?.call(input, value);
};

/**
 * URL slash helpers.
 */
export const stripTrailingSlash = (string: string) => string.replace(/\/$/g, '');
export const stripDoubleSlashes = (string: string) => string.replace(/\/\/+/g, '/');


/**
 * Strip any trailing number
 */
export const stripTrailingNumbers = (string: string) => string?.replace(/ \d+$/, "");

/**
 * Prefers reduced motion.
 */
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Get CSS breakpoint values from CSS variables.
 */
export const getBreakpointValues = (sizes: CssBreakPointsInterface = []) => sizes.reduce(
  (acc: any, size: string) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--breakpoint-${size}`);
    return {
      ...acc,
      [size]: int(value),
    };
  },
  {}
);

/**
 * Check if a breakpoint matches the current width.
 * Note: `window.innerWidth` is full width, `clientWidth` excludes visible scrollbar.
 */
export const matchesBreakpoint = (size: number) =>
  (window.innerWidth || document.documentElement.clientWidth) >= size;

/**
 * Get array with matching breakpoint names.
 */
export const getMatchingBreakpoints = (sizes: number[]) => {
  return Object.entries(sizes)
    .filter(([name, size]) => matchesBreakpoint(size))
    .map(entry => entry.at(0));
};

/**
 * Compose initials from email.
 */
export const composeInitialsFromEmail = (email: string ) => {
  const parts = email?.split('@')[0].split('.') ?? '';
  return (parts?.[0]?.[0] ?? '') + (parts?.[parts.length - 1]?.[0] ?? '');
};

// Get a unique id from from closure
export const setupGetInstanceId = () => {
  let instanceId = 0;
  return function getInstanceId() {
    return ++instanceId;
  };
};

// Move an item from a different position to a new position
export const moveArrayItem = (array: any[], fromIndex: number, toIndex: number): any[] => {
  const newArray = [...array];
  const [item] = newArray.splice(fromIndex, 1); // Remove the item from the array
  newArray.splice(toIndex, 0, item); // Insert the item at the new index
  return newArray;
};

interface ReqInterface {
  title: string;
  label: string;
  identifier: string;
  data: Requirement[];
}
export const extractRequirements = (data: any, keysToExtract: string[]): ReqInterface[] => {
  const result: ReqInterface[] = [];

  keysToExtract.forEach((key: string, index: number) => {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
          result.push({
            title: key,
            identifier: `${key}_${index+1}`,
            label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            data: data[key]
          });
      }
  });

  return result.filter((d) => d.data.length);
};

/**
 * Match route.
 * @param route
 * @param pathname
 * @returns
 */
const matchRoute = (route: any, pathname: string) => {
  if (matchPath(pathname, route.path!)) {
    return true;
  }

  if (route.children) {
    return route.children.some((innerRoute: any) => pathname.endsWith(innerRoute.path!));
  }

  return false;
};

/**
 * Find route.
 * @param children
 * @param pathname
 * @param legislationId
 * @returns
 */
export const findRoute = (children: any[], pathname: string) => {
  return children?.find((route) => {
    if (pathname.includes('/legislation')) {
      return route.path === '/legislation';
    }

    if (pathname.includes('/projects')) {
      return route.path === '/projects';
    }
    return matchRoute(route, pathname) || route.path === PATH_NOT_FOUND;
  });
};


/**
 * Handle Form input changes.
 * @param form
 * @param event
 * @returns
 */
export const getFormValues = (form: HTMLFormElement, event: FormEvent) => {
  // We are always checking if the form exists first before passing it
  // to this function, so this check is not necessary
  if (!form) return;
  event?.preventDefault();

  const formData: { [key: string]: any } = Object.fromEntries(new FormData(form).entries());
  return formData;
};


/**
 * Map the topic roles and legislation topics
 * @param FilterData
 * @param identifiers
 * @returns
 */
export const updateData = (FilterData: any[], identifiers: string[]) => {
  return FilterData?.map((filter) => {
    if (identifiers?.includes(filter.name)) {
      return { ...filter, checked: true, is_approved: true };
    }
    return { ...filter, checked: false, is_approved: false };
  });
};

interface Topic {
  name: string;
  identifier: string;
}

/**
 * Get Identifiers
 * @param data
 * @returns
 */
export const getIdentifiers = (data: any) => {
  if (!data?.length) return [];
  const result =  data.filter(Boolean)?.map((item: any) => (item as unknown as Topic).name);
  return result;
};


/**
 * Get the filters
 * @param filters
 * @param label
 * @returns
 */
export const getFilters = (filters: Filter[],label: string) => {
  return filters
    .find((f) => f.label === label)
    ?.data
    ?.filter((r: FilterOption) => !r.identifier.includes(SELECT_ALL_FILTER_KEY)) || [];
};

/**
 * Search for legislation that matches the name_local or name_generic
 */
export const isMatchedSearched = (legislation: Legislation, queryString: string) => {
  return legislation.name_local.toLowerCase().includes(queryString.toLowerCase().trim())
    || legislation.name_generic.toLowerCase().includes(queryString.toLowerCase().trim())
    || legislation.abbreviation.toLowerCase().includes(queryString.toLowerCase().trim());
};


/**
 * Compose image URL (could be either a path, Base64 or a Blob).
 */
export const normalizeImageUrl = (value: string | Blob | File | null | undefined): string => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    // Check for URLs (absolute and relative)
    if (
      value.startsWith('http') || value.startsWith('/') ||
      value.startsWith('./') || value.startsWith('../')
    ) {
      return value;
    }

    // Check if it's a data URI
    const dataUriPattern = /^data:image\/[a-zA-Z]+;base64,/;
    if (dataUriPattern.test(value)) {
      return value;
    }

    // Check if it's a base64 string without data URI
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    if (base64Pattern.test(value)) {
      // You may need to determine the correct MIME type dynamically
      return `data:image/jpeg;base64,${value}`;
    }
  }

  if (value && typeof value === 'object' && (value instanceof Blob || (value as any) instanceof File)) {
    try {
      const url = window.URL || window.webkitURL;
      return url.createObjectURL(value);
    } catch (error) {
      console.error('Error creating object URL:', error);
      return '';
    }
  }

  // If value doesn't match any of the above, return an empty string or handle accordingly
  return '';
};


/**
 * Normalize the date
 */
export const normalizeDate = (date: string) => {
  return parseDate(date);
}
