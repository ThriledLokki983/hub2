import React, { useState, useCallback } from 'react';
import { KEY_VALUES } from '../utils';

interface FocusItemValueProps {
  items?: any[];
  labelKey?: string;
  valueKey?: string;
  disabledItemValues?: any[],
  callback?: (value: any, event: React.KeyboardEvent) => void;
}

interface EventsProps {
  down?: React.KeyboardEventHandler;
  up?: React.KeyboardEventHandler;
  enter?: React.KeyboardEventHandler;
  del?: React.KeyboardEventHandler;
  esc?: React.KeyboardEventHandler;
  right?: React.KeyboardEventHandler;
  left?: React.KeyboardEventHandler;
  highlight?: React.KeyboardEventHandler;
}

export function onMenuKeyDown(event: React.KeyboardEvent, events: EventsProps) {
  const { down, up, enter, del, esc, right, left, highlight } = events;

  const keyCode = event.keyCode;
  if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
      event.stopPropagation();
      highlight?.(event);
      return;
    }

  switch (event.key) {
    // down
    case KEY_VALUES.DOWN:
      down?.(event);
      event.preventDefault();
      break;
    // up
    case KEY_VALUES.UP:
      up?.(event);
      event.preventDefault();
      break;
    // enter
    case KEY_VALUES.ENTER:
    case KEY_VALUES.SPACE:
      enter?.(event);
      event.preventDefault();
      break;
    // delete
    case KEY_VALUES.BACKSPACE:
      del?.(event);
      break;
    // esc | tab
    case KEY_VALUES.ESC:
    case KEY_VALUES.TAB:
      esc?.(event);
      break;
    // left arrow
    case KEY_VALUES.LEFT:
      left?.(event);
      break;
    // right arrow
    case KEY_VALUES.RIGHT:
      right?.(event);
      break;
    default:
  }
}


export const useFocusItemValue = <T>(
  defaultFocusItemValue: T | undefined,
  visible: boolean,
  props: FocusItemValueProps
) => {
  const {
    items,
    labelKey = 'label',
    valueKey = 'value',
    disabledItemValues = [],
    callback,
  } = props;

  const [focusItemValue, setFocusItemValue] = useState({ keyboard: false, value: defaultFocusItemValue });

  const getFocusableMenuItems = useCallback((keyWord) => {
      if (!items || items.length === 0) {
          return [];
      }
     
      if (keyWord) {
        const newItems = items.filter(item => (
          !item.disabled &&
          !disabledItemValues?.includes(item[valueKey])) &&
          item[labelKey]?.toString()[0].toLowerCase() === keyWord.toLowerCase()
        );
       
        return newItems;
      }

      return items.filter(item => !item.disabled && !disabledItemValues?.includes(item[valueKey]));


  }, [items, disabledItemValues]);

  /**
   * Get the index of the focus item.
   */
  const findFocusItemIndex = useCallback(
    (callback, keyWord?: string, isUp?: boolean) => {
      let items = getFocusableMenuItems(keyWord);
      if (isUp && !visible) {
        items = items.reverse();
      }

      for (let i = 0; i < items.length; i += 1) {
        if (focusItemValue.value === items[i]?.[valueKey]) {
          callback(items, i);
          return;
        }
      }
      callback(items, -1);
    },
    [focusItemValue, getFocusableMenuItems, valueKey]
  );

  const focusHighlightItem = useCallback(
    (event: React.KeyboardEvent) => {
        
      findFocusItemIndex((items: any, index: number) => {
        const nextIndex = index + 2 > items.length ? 0 : index + 1;
        const focusItem = items[nextIndex];

        if (typeof focusItem !== 'undefined') {
          setFocusItemValue({ keyboard: true, value: focusItem[valueKey] });
          callback?.(focusItem[valueKey], event);
        }
      }, event.key);
    },
    [callback, findFocusItemIndex, valueKey]
  );

  const focusNextMenuItem = useCallback(
    (event: React.KeyboardEvent) => {
        
      findFocusItemIndex((items: any, index: number) => {
        const nextIndex = index + 2 > items.length ? 0 : index + 1;
        const focusItem = items[nextIndex];

        if (typeof focusItem !== 'undefined') {
          setFocusItemValue({ keyboard: true, value: focusItem[valueKey] });
          callback?.(focusItem[valueKey], event);
        }
      });
    },
    [callback, findFocusItemIndex, valueKey]
  );

  const focusPrevMenuItem = useCallback(
    (event: React.KeyboardEvent) => {
      findFocusItemIndex((items: any, index: number) => {
        const nextIndex = index === 0 ? items.length - 1 : index - 1;
        const focusItem = items[nextIndex];
        if (typeof focusItem !== 'undefined') {
          setFocusItemValue({keyboard: true, value: focusItem[valueKey]});
          callback?.(focusItem[valueKey], event);
        }
      });
    },
    [callback, findFocusItemIndex, valueKey]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      onMenuKeyDown(event, {
        down: focusNextMenuItem,
        up: focusPrevMenuItem,
        highlight: focusHighlightItem // query based on the first letter
      });
    },
    [focusNextMenuItem, focusPrevMenuItem]
  );

  return {
    focusItemValue,
    setFocusItemValue,
    onKeyDown: handleKeyDown,
    findFocusItemIndex
  };
};
