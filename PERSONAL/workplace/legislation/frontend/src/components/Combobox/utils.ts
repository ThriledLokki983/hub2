import { MENU_ACTIONS, KEYS } from "configs/constants";

/**
 * Return an array of exact option name matches from a comma-separated string
 */
export const findMatches = (options: string[], searchValue: string) => {
  const searchArray = searchValue.split(',');
  return searchArray.map((searchItem) => {
    const match = options.filter((option) => searchItem.trim().toLowerCase() === option.toLowerCase());
    return match.length ? match[0] : null;
  }).filter((option) => option !== null);
};

/**
 * Filter an array of options against an input string
 * Returns an array of options that begin with the filter string, case-independent
 */
export const filterOptions = (value: string, options: string[] = [], exclude: string = '') => {
  return options?.filter((option) => {
    const matches = option && option?.toLowerCase().indexOf(value.toLowerCase()) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
};

/**
 * return combobox action from key press
 */
export const getActionFromKey = (event: React.KeyboardEvent, menuOpen: boolean) => {
  const { key, altKey, ctrlKey, metaKey } = event;

  // handle opening the menu when closed
  if (!menuOpen && (key === KEYS.Down || key === KEYS.Enter || key === KEYS.Space)) {
    return MENU_ACTIONS.Open;
  }
  // handle keys when open
  if (key === KEYS.Down) {
    return MENU_ACTIONS.Next;
  }
  else if (key === KEYS.Up) {
    return MENU_ACTIONS.Previous;
  }
  else if (key === KEYS.Home) {
    return MENU_ACTIONS.First;
  }
  else if (key === KEYS.End) {
    return MENU_ACTIONS.Last;
  }
  else if (key === KEYS.Escape) {
    return MENU_ACTIONS.Close;
  }
  else if (key === KEYS.Enter) {
    return MENU_ACTIONS.CloseSelect;
  }
  else if (key === KEYS.Space) {
    return MENU_ACTIONS.Space;
  } else if (key === KEYS.Backspace || key === KEYS.Clear || (key.length === 1 && !altKey && !ctrlKey && !metaKey)) {
    return MENU_ACTIONS.Type;
  }
};

/**
 * Get index of option that matches a string
 * If the filter is multiple iterations of the same letter (e.g "aaa"),
 * Then return the nth match of the single letter
 */
export const getIndexByLetter = (options: string[] = [], filter: string) => {
  const firstMatch = filterOptions(filter, options)[0];
  const allSameLetter = (array: string[]) => array.every((item) => item === array[0]);
  if (firstMatch) {
    return options.indexOf(firstMatch);
  } else if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(filter[0], options);
    const matchedIndex = matches.indexOf(filter);
    return options.indexOf(matches[matchedIndex]);
  } else {
    return -1;
  }
};

/**
 * Get the updated option index
 */
export const getUpdatedIndex = (current: number, max: number, action: any) => {
  switch (action) {
    case MENU_ACTIONS.First:
      return 0;
    case MENU_ACTIONS.Last:
      return max;
    case MENU_ACTIONS.Next:
      return (current + 1) % (max + 1);
    case MENU_ACTIONS.Previous:
      return (current - 1 + max + 1) % (max + 1);
    default:
      return current;
  }
};

/**
 * Check if an element is currently scrollable
 */
export const isScrollable = (element: HTMLElement) => {
  if (!element) return false;
  return element.scrollHeight > element.clientHeight;
}

/**
 * Ensure given child element is within the parent's visible scroll area
 */
export const maintainScrollVisibility = (activeElement: HTMLElement, scrollParent: HTMLElement) => {
  if (!activeElement || !scrollParent) return;

  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = (offsetTop + offsetHeight) > (scrollTop + parentOffsetHeight);

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
};

/**
 * Editable combobox input
 */
export const comboBox = (element: HTMLElement, options: string[]) => {};
