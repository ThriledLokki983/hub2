import React, { useState, useImperativeHandle, useCallback } from 'react';
import { ItemDataType } from './MainSearch';
import { KEY_VALUES } from '../../../configs/config';

export function transformData(data: any[]) {
    if (!data) {
        return [];
    }
    return data.map((item) => {
        if (typeof item === 'string') {
            return {
                value: item,
                label: item,
            };
        }

        if (typeof item === 'object') {
            return item;
        }

        return {};
    });
}

export const shouldDisplay = (
    filterBy: ((value: string, item: ItemDataType) => boolean) | undefined,
    searchValue: any,
    value: any,
) => (item: any) => {
    if (typeof filterBy === 'function') {
        return filterBy(value, item);
    }

    if (value.length > 0) {
        return value === item.label;
    }

    if (!searchValue.trim()) {
        return false;
    }
    const keyword = (searchValue.trim() || '').toLocaleLowerCase();
    return `${item.label}`.toLocaleLowerCase().indexOf(keyword) >= 0;
};

function isFunction(target: any) {
    return typeof target === 'function';
}

interface FocusItemValueProps {
    items?: any[];
    valueKey?: string;
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
}

export function onMenuKeyDown(event: React.KeyboardEvent, events: EventsProps) {
    const {
        down,
        up,
        enter,
        del,
        esc,
        right,
        left,
    } = events;
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
        enter?.(event);
        event.preventDefault();
        break;
    // delete
    case KEY_VALUES.BACKSPACE:
        del?.(event);
        break;
    // esc | tab
    case KEY_VALUES.ESC:
        // case KEY_VALUES.TAB:
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
    case KEY_VALUES.SPACE:
        enter?.(event);
        // event.preventDefault();
        break;
    default:
        break;
    }
}

export const useFocusItemValue = <T>(
    defaultFocusItemValue: T | null | undefined,
    props: FocusItemValueProps,
) => {
    const { valueKey = 'value', items, callback } = props;
    const [focusItemValue, setFocusItemValue] = useState<T | null | undefined>(
        defaultFocusItemValue,
    );

    const getFocusableMenuItems = useCallback(() => {
        if (!items || items.length === 0) {
            return [];
        }

        return items.filter((item) => !item.disabled);
    }, [items]);

    /**
     * Get the index of the focus item.
     */
    const findFocusItemIndex = useCallback(
        (callback: any) => {
            const items = getFocusableMenuItems();

            for (let i = 0; i < items.length; i += 1) {
                if (focusItemValue === items[i]?.[valueKey]) {
                    callback(items, i);
                    return;
                }
            }
            callback(items, -1);
        },
        [focusItemValue, getFocusableMenuItems, valueKey],
    );

    const focusNextMenuItem = useCallback(
        (event: React.KeyboardEvent) => {
            findFocusItemIndex((items: any, index: number) => {
                const nextIndex = index + 2 > items.length ? 0 : index + 1;
                const focusItem = items[nextIndex];

                if (typeof focusItem !== 'undefined') {
                    setFocusItemValue(focusItem[valueKey]);
                    callback?.(focusItem[valueKey], event);
                }
            });
        },
        [callback, findFocusItemIndex, valueKey],
    );

    const focusPrevMenuItem = useCallback(
        (event: React.KeyboardEvent) => {
            findFocusItemIndex((items: any, index: number) => {
                const nextIndex = index === 0 ? items.length - 1 : index - 1;
                const focusItem = items[nextIndex];
                if (typeof focusItem !== 'undefined') {
                    setFocusItemValue(focusItem[valueKey]);
                    callback?.(focusItem[valueKey], event);
                }
            });
        },
        [callback, findFocusItemIndex, valueKey],
    );

    const handleKeyDown = useCallback(
        (event: any) => {
            onMenuKeyDown(event, {
                down: focusNextMenuItem,
                up: focusPrevMenuItem,
            });
        },
        [focusNextMenuItem, focusPrevMenuItem],
    );

    return {
        focusItemValue,
        setFocusItemValue,
        onKeyDown: handleKeyDown,
    };
};
